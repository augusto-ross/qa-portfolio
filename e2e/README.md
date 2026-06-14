# E2E Tests — Playwright + TypeScript

Tests the SauceDemo e-commerce app (https://www.saucedemo.com/) across critical user journeys.

## Setup
```bash
npm install
npx playwright install chromium
```

## Run
```bash
npm test              # headless
npm run test:headed   # watch the browser
npm run test:report   # open last HTML report
```

## Design: Page Object Model

Each page has a corresponding class in `page-objects/`. Tests import page objects and never use raw selectors directly. This keeps tests readable and localizes selector changes to one place.

```
page-objects/
├── login.page.ts       ← goto(), loginAs(), getErrorMessage()
├── inventory.page.ts   ← sortBy(), addToCartByIndex(), goToCart()
├── cart.page.ts        ← getItemNames(), removeByIndex(), checkout()
└── checkout.page.ts    ← fillInfo(), continue(), finish(), getConfirmationHeader()
```

## Fixtures

`fixtures/auth.fixture.ts` extends Playwright's base `test` with:
- `loginPage` — LoginPage instance
- `inventoryPage` — InventoryPage instance
- `loggedInPage` — InventoryPage instance, pre-authenticated as `standard_user`

Use `loggedInPage` in any test that doesn't need to test the login flow itself.
