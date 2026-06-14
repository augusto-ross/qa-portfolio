import httpx
from schemas import AuthResponse

def test_valid_credentials_return_token(client: httpx.Client):
    response = client.post("/auth", json={"username": "admin", "password": "password123"})
    assert response.status_code == 200
    body = AuthResponse.model_validate(response.json())
    assert len(body.token) > 0

def test_invalid_credentials_return_bad_credentials(client: httpx.Client):
    response = client.post("/auth", json={"username": "admin", "password": "wrong"})
    assert response.status_code == 200
    # Restful Booker returns 200 with "Bad credentials" on auth failure
    assert response.json().get("reason") == "Bad credentials"
