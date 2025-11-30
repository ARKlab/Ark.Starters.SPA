# Reproduction Package Summary

This package contains everything needed to report the "Illegal invocation" bug to the @reduxjs/toolkit maintainers.

## What Was Created

### 1. `cypress/e2e/reproduction-illegal-invocation.cy.ts` ⭐ **ACTUAL REPRODUCTION**
A standalone Cypress test that ACTUALLY reproduces the error in a browser environment:
- Visits the application
- Triggers API calls
- Calls `window.rtkq.resetCache()` which dispatches resetApiState actions
- **Result**: Test fails with "Illegal invocation" error

**To run:**
```bash
npx cypress run --spec cypress/e2e/reproduction-illegal-invocation.cy.ts
```

### 2. `test-reproduction.html` ⭐ **ACTUAL REPRODUCTION**
A standalone HTML file that can be opened in any browser to reproduce the error:
- Uses RTK from CDN
- Creates API slices with retry wrapper
- Dispatches resetApiState actions in a loop
- **Result**: Shows red error message if the issue occurs

**To run:**
Open the file in Chrome, Firefox, Safari, or Edge.

### 3. `reproduction.js` ⚠️ **PATTERN DEMO ONLY**
A Node.js script that demonstrates the CODE PATTERN but does NOT reproduce the error:
- Shows the exact code structure that causes the issue
- Runs successfully in Node.js (AbortController is more lenient)
- Includes comprehensive comments explaining the pattern
- **Result**: Completes successfully (no error in Node.js)

**To run:**
```bash
node reproduction.js
```

**Important**: This is for understanding the code pattern only. To see the actual error, use the Cypress test or HTML file.

### 4. `REPRODUCTION_README.md`
Comprehensive documentation including:
- Clear explanation that Node.js script doesn't reproduce the error
- Multiple methods to see the actual error (Cypress, browser HTML)
- Error details and stack traces from real test runs
- Affected versions (working: 2.9.1, broken: 2.9.2+)
- Code patterns that trigger the issue
- Application context with file references
- Possible causes and workarounds
- Environment details

### 5. `ISSUE_TEMPLATE.md`
Ready-to-use template for opening a GitHub issue at https://github.com/reduxjs/redux-toolkit/issues
- Formatted with proper sections
- Includes all necessary context
- References the reproduction files
- Suggests questions for the maintainers

## How to Use

### ⭐ Recommended: Use the Cypress Reproduction

**This is the easiest way to see the actual error:**

1. Clone the repository:
   ```bash
   git clone https://github.com/ARKlab/Ark.Starters.SPA
   cd Ark.Starters.SPA
   npm install
   ```

2. Run the standalone reproduction test:
   ```bash
   npx cypress run --spec cypress/e2e/reproduction-illegal-invocation.cy.ts
   ```

3. Or run all tests to see it fail in `configTable.e2e.ts`:
   ```bash
   npm run test
   ```

### Alternative: Browser HTML File

If you can't run Cypress, open `test-reproduction.html` in a web browser:
- The page will load RTK from CDN
- It will attempt to dispatch resetApiState actions
- If the error occurs, you'll see a red error message
- If it works, you'll see a green success message

### For Issue Report: Reference the Repository

When opening an issue with the RTK team:
### For Issue Report: Reference the Repository

1. Copy the content of `ISSUE_TEMPLATE.md`
2. Go to https://github.com/reduxjs/redux-toolkit/issues/new
3. Paste the content
4. Add a link to this repository: `https://github.com/ARKlab/Ark.Starters.SPA`
5. Mention the Cypress test: `cypress/e2e/reproduction-illegal-invocation.cy.ts`

### Don't Use the Node.js Script Alone

The `reproduction.js` file is useful for understanding the code pattern, but it does NOT reproduce the actual error. Always use it together with the Cypress test or HTML file when reporting the issue.

## Verification

### ✅ Confirmed Error in Cypress Tests
```bash
npm run test
```

The error occurs in `cypress/support/e2e.ts` afterEach hook when calling:
```javascript
window.rtkq.resetCache()
```

Which dispatches the actions from `src/app/configureStore.ts`:
```javascript
export const resetApiActions = [
  jsonPlaceholderApi.util.resetApiState(),
  configTableApiSlice.util.resetApiState(),
  // ...
];
```

## Key Files in Your Application

The reproduction is based on these actual files in your codebase:
- `src/lib/rtk/arkBaseQuery.ts` - Custom retry wrapper
- `src/lib/rtk/appFetchBaseQuery.ts` - Uses arkRetry
- `src/app/configureStore.ts` - resetApiActions array (lines 60-67)
- `src/initGlobals.tsx` - window.rtkq.resetCache() (lines 12-17)
- `cypress/support/e2e.ts` - afterEach hook (lines 10-11)

## Next Steps

1. Review the reproduction files
2. Test the reproduction if needed
3. Use `ISSUE_TEMPLATE.md` to open an issue with the RTK team
4. Reference your repository if they need more context

## Notes

- The issue only manifests in browser environments due to stricter AbortController implementation
- Working version: @reduxjs/toolkit@2.9.1
- Broken versions: @reduxjs/toolkit@2.9.2 and later (including 2.10.1)
- The pattern has worked flawlessly before the 2.9.2 release

Good luck with the bug report! 🚀
