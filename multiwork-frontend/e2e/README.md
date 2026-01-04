# E2E Tests

End-to-end tests for Multiwork application using Playwright.

## Setup

1. Install dependencies:
```bash
npm install --save-dev @playwright/test
npx playwright install
```

2. Make sure the frontend and backend are running:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8080`

## Running Tests

Run all E2E tests:
```bash
npx playwright test
```

Run tests in headed mode (see browser):
```bash
npx playwright test --headed
```

Run specific test file:
```bash
npx playwright test auth-flow
```

Run tests in specific browser:
```bash
npx playwright test --project=chromium
```

## Test Structure

- `auth-flow.spec.js` - Authentication flow tests (registration, login, logout)
- `project-flow.spec.js` - Project-related flow tests
- `navigation-flow.spec.js` - Navigation and routing tests

## Configuration

Configuration is in `playwright.config.js`. You can customize:
- Base URL
- Browser settings
- Timeouts
- Retries

## Environment Variables

- `FRONTEND_URL` - Frontend URL (default: http://localhost:3000)
- `CI` - Set to true in CI environment for different retry/worker settings
