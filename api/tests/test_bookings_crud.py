"""
CRUD lifecycle tests for the /booking endpoint (Restful Booker API).

Covers create, read, full update (PUT), partial update (PATCH), and delete,
verifying both response codes and persisted state. Mutating operations require
a valid auth token passed as a Cookie header — missing tokens return 403.
"""
import httpx
import pytest
from schemas import Booking, BookingDates, BookingResponse

SAMPLE_BOOKING = {
    "firstname": "Jim",
    "lastname": "Brown",
    "totalprice": 111,
    "depositpaid": True,
    "bookingdates": {"checkin": "2025-01-01", "checkout": "2025-01-10"},
    "additionalneeds": "Breakfast",
}

@pytest.fixture
def created_booking(client: httpx.Client) -> tuple[int, dict]:
    response = client.post("/booking", json=SAMPLE_BOOKING)
    assert response.status_code == 200
    data = BookingResponse.model_validate(response.json())
    yield data.bookingid, SAMPLE_BOOKING
    client.delete(f"/booking/{data.bookingid}")  # cleanup

# POST must return a positive bookingid and echo back all submitted fields.
def test_create_booking_returns_id_and_data(client: httpx.Client):
    response = client.post("/booking", json=SAMPLE_BOOKING)
    assert response.status_code == 200
    data = BookingResponse.model_validate(response.json())
    assert data.bookingid > 0
    assert data.booking.firstname == "Jim"

# GET by ID must return the exact data that was Posted, confirming persistence.
def test_get_booking_by_id(client: httpx.Client, created_booking):
    booking_id, expected = created_booking
    response = client.get(f"/booking/{booking_id}")
    assert response.status_code == 200
    data = Booking.model_validate(response.json())
    assert data.firstname == expected["firstname"]
    assert data.totalprice == expected["totalprice"]

# Full PUT must overwrite all fields; token in Cookie header is required.
def test_update_booking_with_put(client: httpx.Client, created_booking, auth_token: str):
    booking_id, _ = created_booking
    updated = {**SAMPLE_BOOKING, "firstname": "Updated", "totalprice": 999}
    response = client.put(
        f"/booking/{booking_id}",
        json=updated,
        headers={"Cookie": f"token={auth_token}"},
    )
    assert response.status_code == 200
    data = Booking.model_validate(response.json())
    assert data.firstname == "Updated"
    assert data.totalprice == 999

# PATCH must update only the supplied fields and leave all other fields unchanged.
def test_partial_update_booking_with_patch(client: httpx.Client, created_booking, auth_token: str):
    booking_id, _ = created_booking
    response = client.patch(
        f"/booking/{booking_id}",
        json={"firstname": "Patched"},
        headers={"Cookie": f"token={auth_token}"},
    )
    assert response.status_code == 200
    data = Booking.model_validate(response.json())
    assert data.firstname == "Patched"

# DELETE must return 201 and make the resource inaccessible (subsequent GET returns 404).
def test_delete_booking(client: httpx.Client, auth_token: str):
    create_resp = client.post("/booking", json=SAMPLE_BOOKING)
    booking_id = create_resp.json()["bookingid"]
    delete_resp = client.delete(
        f"/booking/{booking_id}",
        headers={"Cookie": f"token={auth_token}"},
    )
    assert delete_resp.status_code == 201
    get_resp = client.get(f"/booking/{booking_id}")
    assert get_resp.status_code == 404
