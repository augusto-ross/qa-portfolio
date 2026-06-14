import pytest
import httpx

BASE_URL = "https://restful-booker.herokuapp.com"

@pytest.fixture(scope="session")
def base_url() -> str:
    return BASE_URL

@pytest.fixture(scope="session")
def client() -> httpx.Client:
    with httpx.Client(base_url=BASE_URL, timeout=10.0) as c:
        yield c

@pytest.fixture(scope="session")
def auth_token(client: httpx.Client) -> str:
    response = client.post("/auth", json={"username": "admin", "password": "password123"})
    assert response.status_code == 200
    return response.json()["token"]
