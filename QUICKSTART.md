# Quick Start Guide - Reproducing the Error

## ⚠️ IMPORTANT UPDATE

The original `reproduction.js` Node.js script **does NOT reproduce the error** because Node.js's `AbortController` implementation is more lenient than browser implementations.

## How to Actually See the Error

### Method 1: Standalone Cypress Test (Recommended)

This is a minimal test that reproduces the exact issue:

```bash
# Make sure dependencies are installed
npm install

# Build the app for testing
npm run e2e:ci

# In a separate terminal, run the standalone reproduction test
npx cypress run --spec cypress/e2e/reproduction-illegal-invocation.cy.ts
```

**Expected Result**: Test fails with:
```
TypeError: Illegal invocation
  at Promise.S [as abort] (rtk.js:1:26029)
```

### Method 2: Run Full Test Suite

The error occurs in the existing test suite:

```bash
npm run test
```

**Expected Result**: `configTable.e2e.ts` test fails in the `afterEach` hook with the same error.

### Method 3: Browser HTML File

1. Build the app: `npm run build`
2. Open `test-reproduction.html` in a web browser (Chrome, Firefox, etc.)
3. Check the browser console for errors

**Expected Result**: 
- Either a red error message on the page
- Or an error in the browser console

## What About reproduction.js?

The `reproduction.js` file is useful for:
- Understanding the code pattern that causes the issue
- Sharing the code structure with the RTK team
- Documentation purposes

But it **will NOT** show the error when run with Node.js because Node's AbortController doesn't enforce strict `this` binding like browsers do.

## Summary

| Method | Shows Error? | How to Run |
|--------|--------------|------------|
| `reproduction.js` (Node.js) | ❌ NO | `node reproduction.js` |
| Cypress standalone test | ✅ YES | `npx cypress run --spec cypress/e2e/reproduction-illegal-invocation.cy.ts` |
| Full Cypress test suite | ✅ YES | `npm run test` |
| Browser HTML file | ✅ MAYBE | Open `test-reproduction.html` in browser |

## For Reporting to RTK Team

When opening an issue with @reduxjs/toolkit:

1. Reference this repository: `https://github.com/ARKlab/Ark.Starters.SPA`
2. Point to the Cypress test: `cypress/e2e/reproduction-illegal-invocation.cy.ts`
3. Provide the steps above to run the reproduction
4. Include the error stack trace from the Cypress output

The Cypress test is a true, runnable reproduction that demonstrates the issue.
