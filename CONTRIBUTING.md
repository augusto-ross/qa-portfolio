# Contributing

This is a personal portfolio project. The structure below explains how each layer is organized.

## Directory Structure

| Directory | Language | Tool | Tests |
|-----------|----------|------|-------|
| `e2e/` | TypeScript | Playwright | SauceDemo user journeys |
| `api/` | Python | Pytest + httpx | Restful Booker REST API |
| `performance/` | JavaScript | k6 | Restful Booker load scenarios |

## Adding a Test

- **E2E:** Add a new `.spec.ts` in `e2e/tests/`. If targeting a new page, create a page object in `e2e/page-objects/` first.
- **API:** Add a new `test_*.py` in `api/tests/`. Add a Pydantic schema in `api/schemas/` if the endpoint response is new.
- **Performance:** Add a new `.js` script in `performance/scripts/` following the existing pattern.

## Commit Convention

```
feat(e2e): add checkout visual regression test
test(api): add negative test for missing booking fields
ci: update k6 threshold for stress test
```
