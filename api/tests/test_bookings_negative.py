"""
Negative-path and authorization tests for the /booking endpoint (Restful Booker API).

Validates that missing required fields are rejected, non-existent resources return
404, and unauthenticated mutation attempts (PUT, DELETE) are blocked with 403 —
confirming write-protection is enforced at the API level.
"""
import httpx
import pytest

# Missing firstname or lastname must be rejected; API returns 500 for schema violations.
@pytest.mark.parametrize("payload,missing_field", [
    ({"lastname": "X", "totalprice": 1, "depositpaid": True, "bookingdates": {"checkin": "2025-01-01", "checkout": "2025-01-02"}}, "firstname"),
    ({"firstname": "X", "totalprice": 1, "depositpaid": True, "bookingdates": {"checkin": "2025-01-01", "checkout": "2025-01-02"}}, "lastname"),
])
def test_create_booking_missing_required_field_fails(client: httpx.Client, payload: dict, missing_field: str):
    response = client.post("/booking", json=payload)
    assert response.status_code == 500

# Requesting a booking ID that doesn't exist must return 404, not an empty object.
def test_get_nonexistent_booking_returns_404(client: httpx.Client):
    response = client.get("/booking/9999999")
    assert response.status_code == 404

# PUT without a Cookie token must be blocked with 403, enforcing write-protection.
def test_update_without_auth_returns_403(client: httpx.Client):
    create_resp = client.post("/booking", json={
        "firstname": "Temp", "lastname": "User", "totalprice": 1,
        "depositpaid": False, "bookingdates": {"checkin": "2025-01-01", "checkout": "2025-01-02"},
    })
    booking_id = create_resp.json()["bookingid"]
    response = client.put(f"/booking/{booking_id}", json={
        "firstname": "Hacker", "lastname": "User", "totalprice": 0,
        "depositpaid": False, "bookingdates": {"checkin": "2025-01-01", "checkout": "2025-01-02"},
    })
    assert response.status_code == 403

# DELETE without a Cookie token must be blocked with 403, preventing unauthorized data removal.
def test_delete_without_auth_returns_403(client: httpx.Client):
    create_resp = client.post("/booking", json={
        "firstname": "Temp", "lastname": "User", "totalprice": 1,
        "depositpaid": False, "bookingdates": {"checkin": "2025-01-01", "checkout": "2025-01-02"},
    })
    booking_id = create_resp.json()["bookingid"]
    response = client.delete(f"/booking/{booking_id}")
    assert response.status_code == 403
