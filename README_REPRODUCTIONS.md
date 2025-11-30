# Reproduction Package for @reduxjs/toolkit Issue

## 📋 Quick Reference

| File/Method | Reproduces Error? | Environment | Command |
|-------------|-------------------|-------------|---------|
| `reproduction.js` | ❌ NO | Node.js | `node reproduction.js` |
| `cypress/e2e/reproduction-illegal-invocation.cy.ts` | ✅ YES | Cypress/Browser | `npx cypress run --spec cypress/e2e/reproduction-illegal-invocation.cy.ts` |
| `test-reproduction.html` | ✅ YES | Browser | Open in Chrome/Firefox/Safari |
| Existing test suite | ✅ YES | Cypress/Browser | `npm run test` |

## 🎯 Recommended: Use the Cypress Test

**This is the easiest and most reliable way to reproduce the error:**

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Build the app for e2e testing
npm run e2e:ci

# 3. Run the standalone reproduction test
npx cypress run --spec cypress/e2e/reproduction-illegal-invocation.cy.ts
```

**Expected output:**
```
  RTK resetApiState Illegal Invocation Reproduction
    1) reproduces the illegal invocation error when dispatching resetApiState in a loop

  0 passing
  1 failing

  1) RTK resetApiState Illegal Invocation Reproduction
       reproduces the illegal invocation error when dispatching resetApiState in a loop:
     TypeError: Illegal invocation
       at Promise.S [as abort] (rtk.js:1:26029)
       at P (rtk.js:1:57456)
       ...
```

## 📁 File Descriptions

### Working Reproductions (Show Actual Error)

1. **`cypress/e2e/reproduction-illegal-invocation.cy.ts`** ⭐ RECOMMENDED
   - Minimal Cypress test
   - Visits the app, triggers API calls, then calls `window.rtkq.resetCache()`
   - Fails with the exact error

2. **`test-reproduction.html`**
   - Standalone HTML file
   - Loads RTK from CDN
   - Can be opened in any browser
   - Shows error message if issue is present

### Documentation Files

3. **`reproduction.js`**
   - Node.js script showing the code pattern
   - ⚠️ Does NOT reproduce the error (Node.js AbortController is lenient)
   - Useful for understanding the code structure

4. **`QUICKSTART.md`**
   - Quick guide to reproducing the error
   - Start here if you're new to this reproduction

5. **`REPRODUCTION_README.md`**
   - Comprehensive documentation
   - Error details, affected versions, workarounds
   - Code patterns and application context

6. **`ISSUE_TEMPLATE.md`**
   - Template for reporting to RTK team
   - Copy-paste ready for GitHub issue

7. **`REPRODUCTION_SUMMARY.md`**
   - Overview of all files
   - How to use each file
   - What to include when reporting

8. **`CHANGES_SUMMARY.md`**
   - Summary of changes made to address feedback
   - Documents why Node.js script doesn't work

## 🐛 The Issue

- **What**: `TypeError: Illegal invocation` when calling `AbortController.abort()`
- **When**: Dispatching `resetApiState()` actions in a loop
- **Where**: Browser environments (Cypress, Chrome, Firefox, etc.)
- **Why**: The `abort` method loses its `this` context in the retry cleanup logic
- **Versions**: Working in 2.9.1, broken in 2.9.2+

## 🔍 Why Node.js Script Doesn't Work

Node.js's native `AbortController` implementation doesn't enforce strict `this` binding when methods are called. Browsers do enforce this, which is why the error only appears there.

## 📝 For Reporting to RTK

When opening an issue at https://github.com/reduxjs/redux-toolkit/issues:

1. Use `ISSUE_TEMPLATE.md` as your issue body
2. Reference this repository: `https://github.com/ARKlab/Ark.Starters.SPA`
3. Point to the Cypress test: `cypress/e2e/reproduction-illegal-invocation.cy.ts`
4. Include the command: `npx cypress run --spec cypress/e2e/reproduction-illegal-invocation.cy.ts`

## ✅ Verification Checklist

- [x] Cypress test reproduces the error
- [x] Error confirmed in existing test suite (`npm run test`)
- [x] Documentation clearly states Node.js limitation
- [x] Multiple reproduction methods provided
- [x] Clear instructions for each method

## 📞 Need Help?

Refer to:
- `QUICKSTART.md` - Quick start guide
- `REPRODUCTION_README.md` - Detailed documentation
- `CHANGES_SUMMARY.md` - What changed and why
