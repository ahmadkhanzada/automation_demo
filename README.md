# Automation Demo

A full-stack React + Node.js application demonstrating authentication, CRUD operations, and comprehensive testing with Jest and Playwright.

## Prerequisites

- **Node.js 20+** (required)
- **npm** (comes with Node.js)

## Quick Start

### 1. Install Dependencies
```bash
git clone <repository-url>
cd automation-demo
npm install
```

### 2. Start Development Servers
```bash
npm run dev
```
This starts both backend (port 3001) and frontend (port 5173) concurrently.

### 3. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

### 4. Run Tests
```bash
# Backend API tests (Jest + Supertest)
npm run test:api

# Frontend E2E tests (Playwright) - excluding visual snapshots
npm run test:ui

# All UI tests including visual snapshots  
npm run test:ui:all

# Visual snapshot tests only
npm run test:ui:visual

# All tests (API + UI, excluding visual snapshots)
npm test
```

## Login Credentials

```
Email: user@example.com
Password: Password123
```

## API Routes

### Authentication
- `POST /login` - Authenticate user
  - Body: `{ "email": "user@example.com", "password": "Password123" }`
  - Success: `200 { "token": "test-token-123" }`
  - Error: `401 { "error": "Invalid credentials" }`

### Items (Protected - Requires `Authorization: Bearer test-token-123`)
- `GET /items` - Get all items
- `POST /items` - Create item
  - Body: `{ "title": "Required", "description": "Optional" }`
- `PUT /items/:id` - Update item
  - Body: `{ "title": "Updated Title", "description": "Updated Description" }`
- `DELETE /items/:id` - Delete item

### Error Responses
- `400` - Validation errors (missing title)
- `401` - Unauthorized (missing/invalid token)
- `404` - Item not found

## Project Structure

```
automation-demo/
├── package.json          # Root workspace config
├── backend/
│   ├── src/
│   │   ├── server.js      # Express server
│   │   ├── app.js         # App configuration
│   │   ├── auth.js        # Authentication routes
│   │   └── items.js       # CRUD routes
│   └── tests/             # Jest + Supertest tests
└── frontend/
    ├── src/
    │   ├── pages/         # React components
    │   ├── api/           # API client
    │   └── routes.jsx     # React Router setup
    └── e2e/               # Playwright tests
```

## Features

### Backend
- RESTful API with Express.js
- JWT-style token authentication
- In-memory data storage
- Comprehensive error handling
- 100% test coverage

### Frontend
- React 18 with functional components
- React Router for navigation
- Protected routes with authentication
- Responsive CRUD interface
- Real-time form validation

## Troubleshooting

### Port Conflicts
```bash
# Check what's running on ports
netstat -ano | findstr ":3001"
netstat -ano | findstr ":5173"

# Kill processes if needed
taskkill /PID <process-id> /F
```

### Clear Authentication Token
```bash
# In browser console
localStorage.removeItem('auth_token')

# Or navigate to /login and it will clear automatically
```

### Reset Application State
```bash
# Stop servers
Ctrl+C

# Restart development servers
npm run dev
```

### Test Issues
```bash
# Install Playwright browsers (first time only)
cd frontend
npx playwright install

# Generate visual snapshot baselines (first time only)
npm --workspace frontend run test:e2e:update-snapshots

# Run tests with debugging
npm --workspace frontend run test:e2e:headed
```

### Common Issues

1. **Tests fail with "Element not found"**: Ensure dev servers are running
2. **Login doesn't work**: Check browser console for network errors
3. **Items don't appear**: Verify backend is running on port 3001
4. **Playwright hangs**: Try `npx playwright install chromium`

## Development Commands

```bash
# Root level
npm run dev              # Start both servers
npm test                 # Run all tests
npm run test:api         # Backend tests only
npm run test:ui          # Frontend E2E tests only

# Backend specific
npm --workspace backend run dev        # Start backend only
npm --workspace backend run coverage   # Coverage report

# Frontend specific  
npm --workspace frontend run dev       # Start frontend only
npm --workspace frontend run build     # Production build
```

## Test Coverage

- **Backend**: 28 Jest tests, 100% code coverage
- **Frontend**: 16 Playwright E2E tests (13 functional + 3 visual regression)
- **Total**: ~30 second test suite execution time
