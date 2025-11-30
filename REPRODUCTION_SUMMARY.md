# Reproduction Package Summary

This package contains everything needed to report the "Illegal invocation" bug to the @reduxjs/toolkit maintainers.

## What Was Created

### 1. `reproduction.js`
A standalone Node.js script that demonstrates the code pattern causing the issue:
- Uses the retry wrapper with custom baseQuery (similar to your application)
- Creates resetApiState actions in an array at module level
- Dispatches them in a loop (the pattern that fails in browsers)
- Includes comprehensive comments explaining each step

**To run:**
```bash
node reproduction.js
```

**Note:** The script may not show the error in Node.js because Node's AbortController implementation is more lenient. The actual error occurs in browser environments (Cypress, Chrome, Firefox).

### 2. `REPRODUCTION_README.md`
Comprehensive documentation including:
- Issue summary and error details
- Affected versions (working: 2.9.1, broken: 2.9.2+)
- Code patterns that trigger the issue
- Application context with file references
- Possible causes and workarounds
- Environment details

### 3. `ISSUE_TEMPLATE.md`
Ready-to-use template for opening a GitHub issue at https://github.com/reduxjs/redux-toolkit/issues
- Formatted with proper sections
- Includes all necessary context
- References the reproduction files
- Suggests questions for the maintainers

## How to Use

### Option A: Quick Issue Report
1. Copy the content of `ISSUE_TEMPLATE.md`
2. Go to https://github.com/reduxjs/redux-toolkit/issues/new
3. Paste the content and submit

### Option B: Provide Reproduction Package
1. Create a new GitHub repository or gist
2. Add `reproduction.js` and `REPRODUCTION_README.md`
3. Reference it in your issue report

### Option C: Attach to Your Issue
1. Attach `reproduction.js` to your issue as a file
2. Copy key sections from `REPRODUCTION_README.md` into the issue description

## Verification

The error is confirmed in your Cypress tests:
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
