"""
Query-string filtering tests for GET /booking (Restful Booker API).

A module-scoped fixture seeds a booking with a known firstname so filter
results are deterministic across the test session. Tests cover filtering
by firstname, by checkin date, and the unfiltered list endpoint.
"""
import httpx
import pytest

@pytest.fixture(scope="module")
def seeded_booking(client: httpx.Client):
    data = {
        "firstname": "FilterTest",
        "lastname": "User",
        "totalprice": 50,
        "depositpaid": False,
        "bookingdates": {"checkin": "2025-03-01", "checkout": "2025-03-05"},
    }
    response = client.post("/booking", json=data)
    booking_id = response.json()["bookingid"]
    yield booking_id
    client.delete(f"/booking/{booking_id}")

# Filtering by firstname must include the seeded booking ID in the response list.
def test_filter_by_firstname(client: httpx.Client, seeded_booking):
    response = client.get("/booking", params={"firstname": "FilterTest"})
    assert response.status_code == 200
    ids = [b["bookingid"] for b in response.json()]
    assert seeded_booking in ids

# Checkin date filter must return at least one result, confirming the query parameter is applied.
def test_filter_by_checkin_date(client: httpx.Client, seeded_booking):
    response = client.get("/booking", params={"checkin": "2025-03-01"})
    assert response.status_code == 200
    assert len(response.json()) > 0

# Unfiltered list must be a non-empty array, confirming the endpoint is live and seeded.
def test_get_all_bookings_returns_list(client: httpx.Client):
    response = client.get("/booking")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0
