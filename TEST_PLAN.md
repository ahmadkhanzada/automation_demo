# Test Plan - Automation Demo

## Scope & Objectives

This test plan covers comprehensive testing of the automation-demo monorepo application, ensuring all authentication, item management, and UI flows work correctly.

**Primary Objectives:**
- Validate API endpoint functionality and error handling
- Ensure UI components behave correctly across user flows
- Verify authentication and authorization mechanisms
- Confirm data persistence and CRUD operations

## In-Scope Coverage

### API Endpoints
- `POST /login` - Authentication with valid/invalid credentials
- `GET /items` - Retrieve items (with/without authorization)
- `POST /items` - Create items (validation, authorization)
- `PUT /items/:id` - Update items (validation, authorization, not found cases)
- `DELETE /items/:id` - Delete items (authorization, not found cases)

### UI Flows
- Login with valid/invalid credentials
- Protected route access and redirection
- Item creation with title/description validation
- Inline item editing with save/cancel functionality
- Item deletion and list updates
- Empty state display
- Logout functionality

## Tools & Rationale

### Backend Testing: Jest + Supertest
- **Jest**: Industry-standard JavaScript testing framework with excellent async support
- **Supertest**: Enables direct HTTP endpoint testing without server startup
- **c8**: Provides comprehensive code coverage reporting with LCOV output

### Frontend Testing: Playwright
- **Playwright**: Modern E2E testing with reliable selectors and cross-browser support
- **data-testid**: Stable element identification independent of styling changes
- **Chromium**: Fast, reliable browser automation for CI/CD pipelines

## Test Environments

- **Development**: Local development with hot reload (`npm run dev`)
- **Testing**: Isolated test environment with in-memory storage reset between tests
- **API Base URL**: `http://localhost:3001`
- **Frontend URL**: `http://localhost:5173`

## Data Strategy

### Backend
- **In-memory storage**: Simple array with auto-incrementing IDs starting at 1
- **Test isolation**: Store reset via `/reset` endpoint before each test
- **Seed data**: No initial items (empty state testing)

### Frontend
- **localStorage management**: Token storage/clearing between tests
- **State isolation**: Browser storage cleared in `beforeEach` hooks
- **Test data**: Deterministic test inputs for reliable assertions

## Pass/Fail Criteria

### API Tests
- ✅ **Pass**: All HTTP status codes, response payloads, and error messages match specifications exactly
- ✅ **Pass**: 100% code coverage across all backend modules
- ❌ **Fail**: Any status code deviation, missing/incorrect error messages, or coverage < 100%

### UI Tests
- ✅ **Pass**: All user flows complete successfully with expected DOM updates
- ✅ **Pass**: Proper error handling and user feedback display
- ✅ **Pass**: Authentication state management (login/logout/redirect)
- ❌ **Fail**: Element not found, incorrect navigation, or state inconsistencies

## Assumptions & Limitations

### Assumptions
- Node.js 20+ runtime environment
- Single-user application (no concurrent user testing)
- English-only UI content
- Modern browser compatibility (Chromium-based)

### Limitations
- In-memory storage (data lost on server restart)
- No database persistence testing
- No performance or load testing
- No mobile responsive testing
- No accessibility testing beyond basic functionality

## How to Run Tests

### Prerequisites
```bash
cd automation-demo
npm install
```

### Backend API Tests
```bash
# Run tests with coverage
npm run test:api

# Run with detailed coverage report
npm --workspace backend run coverage
```

### Frontend E2E Tests
```bash
# Ensure dev servers are running
npm run dev

# Run E2E tests (headless)
npm run test:ui

# Run E2E tests (headed for debugging)
npm --workspace frontend run test:e2e:headed
```

### All Tests
```bash
# Run complete test suite
npm test
```

### Expected Results
- **Backend**: 28 tests passing, 100% coverage
- **Frontend**: 16 tests passing (13 functional + 3 visual), all user flows validated
- **Total Runtime**: < 30 seconds for complete test suite

### Visual Snapshot Testing
```bash
# Generate baseline screenshots (first time only)
npm --workspace frontend run test:e2e:update-snapshots

# Run visual regression tests
npm --workspace frontend run test:e2e
```

**Note**: Visual snapshot tests will fail on first run until baseline images are generated.
