# E2E Testing Guide

## Overview

This document provides comprehensive guidance on E2E testing, including best practices and workflows for both CI and development environments.

## Testing Approaches

### Production Build Testing (CI/Recommended)

**Command:** `npm test`

Production build provides optimal performance for E2E testing.

**How it works:**

1. Builds application with `vite build --mode e2e` (includes coverage)
2. Outputs to `cypress/dist` directory
3. Serves via `vite preview` on port 3000
4. Runs connectionStrings server on port 4000
5. Executes Cypress tests

### Development Server Testing

**Command:** `npm run e2e:start`

Interactive mode for test development with Cypress UI.

## Running Specific Tests During Development

For AI agents and automated testing:

```bash
# Start dev server in background
npm start &

# Wait for server
npx wait-on --timeout 60000 http-get://localhost:3000 http-get://localhost:4000

# Run specific test
npx cypress run --spec cypress/e2e/appInput.e2e.ts
```

## Why Production Build for CI?

Production builds are faster for E2E testing because:

- Pre-bundled (fewer network requests)
- Optimized and minified
- Quick, predictable page loads

Total time is similar to dev server, but more reliable.

## Best Practices

**CI/CD:** Always use `npm test`
**Development:** Use `npm run e2e:start` for interactive testing
**AI Agents:** Start dev server, use wait-on, run specific specs
