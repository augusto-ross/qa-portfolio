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

def test_filter_by_firstname(client: httpx.Client, seeded_booking):
    response = client.get("/booking", params={"firstname": "FilterTest"})
    assert response.status_code == 200
    ids = [b["bookingid"] for b in response.json()]
    assert seeded_booking in ids

def test_filter_by_checkin_date(client: httpx.Client, seeded_booking):
    response = client.get("/booking", params={"checkin": "2025-03-01"})
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_get_all_bookings_returns_list(client: httpx.Client):
    response = client.get("/booking")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0
