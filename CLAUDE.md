# qa-portfolio — CLAUDE.md

## Project Overview
Public SDET portfolio demonstrating E2E automation, API testing, performance testing, and CI/CD.
- **E2E:** Playwright + TypeScript, testing SauceDemo (https://www.saucedemo.com/)
- **API:** Pytest + httpx + Pydantic, testing Restful Booker (https://restful-booker.herokuapp.com/)
- **Performance:** k6, load testing Restful Booker
- **CI/CD:** GitHub Actions with enforced quality gates

## Prerequisites
- Node.js 20+
- Python 3.11+
- k6 (https://k6.io/docs/get-started/installation/)

## Running Tests Locally

### E2E (Playwright)
```bash
cd e2e
npm install
npx playwright install chromium
npm test                        # headless
npm run test:headed             # headed (watch the browser)
npm run test:report             # open last HTML report
```

### API (Pytest)
```bash
cd api
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
pytest                          # all tests
pytest --cov=. --cov-report=html  # with coverage
```

### Performance (k6)
```bash
cd performance
k6 run scripts/baseline.js
k6 run scripts/stress.js
k6 run scripts/spike.js
```

## Test Naming Conventions
- **E2E:** `<feature>.spec.ts` — describe block = feature, test = user action + expected outcome
- **API:** `test_<resource>_<action>.py` — test function = `test_<what>_<condition>`
- **Performance:** `<scenario>.js` — one scenario per file

## Page Object Model (E2E)
Each page in SauceDemo has a corresponding class in `e2e/page-objects/`. Tests import page objects and never use raw selectors. Page objects expose named methods for user actions (e.g., `loginPage.loginAs(user)`).

## Pytest Fixture Pattern (API)
- `conftest.py` at `api/` root provides `base_url`, `auth_token`, and `client` fixtures
- All tests receive these via dependency injection — no manual setup in test bodies
- Schema validation: every response is passed through the matching Pydantic model

## k6 Thresholds
Thresholds are defined in each script's `options.thresholds`. CI fails if breached:
- `http_req_duration p(95) < 500` (95th percentile under 500ms)
- `http_req_failed rate < 0.01` (error rate under 1%)

## CI/CD
- `.github/workflows/e2e.yml` — Playwright, publishes HTML report to GitHub Pages
- `.github/workflows/api.yml` — Pytest + coverage badge committed to repo
- `.github/workflows/performance.yml` — k6 with threshold enforcement
- README badges link to workflow status and coverage badge SVG

## Active Skills
- `frontend-testing-best-practices` — invoked when writing/reviewing E2E tests
- `agent-ops-cicd-github` — invoked when writing GitHub Actions workflows
- `playwright-mcp-server` — MCP tool for live browser interaction during development
