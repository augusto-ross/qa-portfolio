# API Tests — Pytest + httpx + Pydantic

Tests the Restful Booker REST API (https://restful-booker.herokuapp.com/).

## Setup
```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
```

## Run
```bash
pytest                                        # all tests
pytest tests/test_bookings_crud.py -v        # one file
pytest --cov=schemas --cov-report=html       # with coverage
```

## Design Decisions

**httpx over requests** — async-capable and more modern API. Even though these tests are synchronous, using httpx signals awareness of the ecosystem.

**Pydantic schema-first assertions** — every response is passed through a Pydantic model before assertions. This catches schema drift (missing/renamed fields) before business logic assertions run.

**Session-scoped auth fixture** — the auth token is fetched once per test session and shared. This avoids hammering the auth endpoint and mirrors how real clients work.

## Fixture Graph
```
base_url (session)
    └── client (session)
            └── auth_token (session)
                    └── individual test fixtures
```
