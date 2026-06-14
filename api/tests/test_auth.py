"""
Authentication endpoint tests for POST /auth (Restful Booker API).

Verifies token issuance for valid credentials and correct error signalling for
invalid ones. Note: the API always returns HTTP 200 on auth — failures are
indicated by a "reason" field in the response body, not by a 4xx status code.
"""
import httpx
from schemas import AuthResponse

# Valid credentials must return a non-empty token that satisfies the AuthResponse schema.
def test_valid_credentials_return_token(client: httpx.Client):
    response = client.post("/auth", json={"username": "admin", "password": "password123"})
    assert response.status_code == 200
    body = AuthResponse.model_validate(response.json())
    assert len(body.token) > 0

# Wrong password must surface "Bad credentials" in the body — status stays 200 per API design.
def test_invalid_credentials_return_bad_credentials(client: httpx.Client):
    response = client.post("/auth", json={"username": "admin", "password": "wrong"})
    assert response.status_code == 200
    # Restful Booker returns 200 with "Bad credentials" on auth failure
    assert response.json().get("reason") == "Bad credentials"
