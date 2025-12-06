# End-to-End Tests

This directory contains end-to-end tests for the application using Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
npx playwright test e2e/settings.spec.ts
```

## Authentication

Before running authenticated tests, you need to set up test credentials:

1. Create a `.env.local` file (or set environment variables):
```
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=your-test-password
```

2. Run the auth setup:
```bash
npx playwright test e2e/auth.setup.ts
```

This will create an authenticated session that other tests can use.

## Test Structure

- `settings.spec.ts` - Basic settings page tests (no auth required)
- `settings-auth.spec.ts` - Authenticated settings tests
- `settings-complete.spec.ts` - Comprehensive settings tests with full functionality coverage
- `auth.setup.ts` - Authentication setup for tests

## Test Coverage

### Settings Complete Tests (`settings-complete.spec.ts`)

Comprehensive E2E tests covering:

1. **Profile Settings**
   - Loading and displaying profile data with bio
   - Updating profile name and persistence
   - Updating bio and persistence in metadata

2. **Notification Settings**
   - Loading preferences from metadata
   - Updating preferences and persistence
   - Save button visibility based on changes

3. **Team Settings**
   - Invite member modal with role selection
   - Email validation
   - Role selection functionality

4. **Billing Settings**
   - Plan upgrade modal
   - Displaying available plans
   - Empty states for payment methods and billing history

5. **Organization Settings**
   - Updating organization name and slug

6. **Error Handling**
   - Loading states
   - Error messages
   - Network timeouts

7. **Accessibility**
   - Keyboard navigation
   - ARIA labels
   - Loading indicators

8. **Data Persistence**
   - Persistence across tab switches

## Writing New Tests

1. Create a new test file in the `e2e/` directory
2. Import test utilities from `@playwright/test`
3. Use `test.use({ storageState: 'playwright/.auth/user.json' })` for authenticated tests
4. Follow the existing test patterns for consistency

## CI/CD

Tests can be run in CI/CD pipelines. Make sure to:
- Set up test user credentials as environment variables
- Run `npx playwright install --with-deps` to install browsers
- Configure `PLAYWRIGHT_TEST_BASE_URL` if using a different base URL

