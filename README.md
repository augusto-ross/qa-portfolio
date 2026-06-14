# qa-portfolio

[![E2E Tests](https://github.com/<YOUR_USERNAME>/qa-portfolio/actions/workflows/e2e.yml/badge.svg)](https://github.com/<YOUR_USERNAME>/qa-portfolio/actions/workflows/e2e.yml)
[![API Tests](https://github.com/<YOUR_USERNAME>/qa-portfolio/actions/workflows/api.yml/badge.svg)](https://github.com/<YOUR_USERNAME>/qa-portfolio/actions/workflows/api.yml)
[![Performance](https://github.com/<YOUR_USERNAME>/qa-portfolio/actions/workflows/performance.yml/badge.svg)](https://github.com/<YOUR_USERNAME>/qa-portfolio/actions/workflows/performance.yml)
[![Coverage](docs/badges/coverage.svg)](https://github.com/<YOUR_USERNAME>/qa-portfolio/actions/workflows/api.yml)

> A public SDET portfolio demonstrating end-to-end automation, API testing, performance testing, and CI/CD pipeline ownership.

---

## Scope & Objectives

This portfolio tests two publicly available applications across three quality dimensions:

| App | Layer | Objective |
|-----|-------|-----------|
| [SauceDemo](https://www.saucedemo.com/) | E2E | Validate critical user journeys: login, browse, cart, checkout |
| [Restful Booker](https://restful-booker.herokuapp.com/) | API | Validate all CRUD operations, auth, filtering, and contract compliance |
| [Restful Booker](https://restful-booker.herokuapp.com/) | Performance | Enforce SLO: p95 < 500ms, error rate < 1% under baseline and stress load |

---

## Risk Analysis

| Area | Risk Level | Rationale |
|------|-----------|-----------|
| Login flow | High | Authentication is the entry gate to all features; failure blocks all users |
| Checkout | High | Revenue-critical path; bugs here have direct business impact |
| Cart persistence | Medium | Loss of cart state damages user trust but is recoverable |
| Product sorting | Low | Cosmetic; incorrect sorting is noticeable but non-blocking |
| API auth | High | All mutating operations require a valid token; broken auth = broken API |
| API schema contracts | Medium | Schema drift breaks integrations silently |

High-risk areas received the most test coverage and are included in the blocking CI gate.

---

## Test Pyramid

```
         /\
        /E2E\        ← 16 tests  — slow, costly, cover critical user journeys
       /------\
      /  API   \     ← 14 tests  — fast, cover all resource operations + edge cases
     /----------\
    / Performance\   ← 3 scripts — enforce SLO thresholds, run in CI on every push
   /--------------\
```

E2E tests are kept intentionally lean — they validate outcomes, not implementation details. The API layer handles the bulk of coverage because it's faster and more stable.

---

## Coverage Map

| Business Requirement | Test | Layer |
|----------------------|------|-------|
| Users can log in with valid credentials | `login.spec.ts` — standard_user can log in | E2E |
| Locked accounts cannot log in | `login.spec.ts` — locked_out_user sees error | E2E |
| Users can browse and sort products | `inventory.spec.ts` — sorting A-Z, Z-A | E2E |
| Users can add products to cart | `inventory.spec.ts`, `cart.spec.ts` | E2E |
| Cart persists across navigation | `cart.spec.ts` — cart persists | E2E |
| Users can complete a purchase | `checkout.spec.ts` — full purchase flow | E2E |
| Checkout validates required fields | `checkout.spec.ts` — missing name/postal | E2E |
| API authentication issues tokens | `test_auth.py` | API |
| All booking CRUD operations work | `test_bookings_crud.py` | API |
| Bookings can be filtered | `test_bookings_filter.py` | API |
| Unauthorized mutations are rejected | `test_bookings_negative.py` | API |
| p95 response time < 500ms | `baseline.js`, `stress.js` thresholds | Performance |
| Error rate < 1% under load | `baseline.js`, `stress.js` thresholds | Performance |

---

## Known Limitations

- **SauceDemo is a demo app** — it resets state between sessions, so tests cannot rely on pre-existing data.
- **Restful Booker is a shared public API** — test data created by other users may appear in list endpoints. Tests are written to be resilient to this (never assert exact list length for unfiltered queries).
- **No mobile testing** — Playwright is configured for desktop Chrome only. Mobile viewports are out of scope for this portfolio.
- **No accessibility testing** — axe-core integration is a natural next step but not included here.

---

## Running Locally

### E2E
```bash
cd e2e && npm install && npx playwright install chromium
npm test
```
[Full E2E docs](e2e/README.md)

### API
```bash
cd api && python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]" && pytest
```
[Full API docs](api/README.md)

### Performance
```bash
k6 run performance/scripts/baseline.js
```
[Full performance docs](performance/README.md)

---

## CI/CD

Every push to `main` triggers three independent workflows:
- **E2E** — runs Playwright, publishes HTML report to GitHub Pages
- **API** — runs Pytest with coverage, auto-commits updated coverage badge
- **Performance** — runs k6 baseline + stress; **fails the build if thresholds are breached**
