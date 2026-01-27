# E2E Test Performance Migration

## Overview

This document describes the migration of e2e tests from using a built version of the application to using the development server, which significantly improves test performance and developer experience.

## Problem Statement

Previously, `npm run test` (e2e tests) worked as follows:
1. Built the application with mode=e2e and coverage=true (~1m 46s)
2. Output to `cypress/dist` directory
3. Hosted the built version using `vite preview` on port 3000
4. Ran Cypress tests

This approach had several drawbacks:
- **Long build times**: ~1m 46s build step before tests could run
- **Port conflicts**: Used the same ports as `npm start`, preventing concurrent execution
- **Build artifacts**: Created `cypress/dist` directory that could be accidentally committed
- **Slower iteration**: Every test run required a full build

## Solution

Migrate to using the Vite development server instead of building and previewing:

### Key Changes

#### 1. Port Separation
- **Development (`npm start`)**:
  - App: `localhost:3000`
  - ConnectionStrings: `localhost:4000`

- **E2E Tests (`npm run test`)**:
  - App: `localhost:3001`
  - ConnectionStrings: `localhost:4001`

This allows running both development and tests concurrently without port conflicts.

#### 2. Removed Build Step
- Eliminated `pree2e:ci:app` script that built the app to `cypress/dist`
- Changed `e2e:ci:app` to use `vite --mode e2e` instead of `vite preview`

#### 3. Configuration Updates

**package.json scripts:**
```json
{
  "e2e:ci:connectionStrings": "cross-env VITE_MODE=e2e PORT=4001 node -- public/connectionStrings.cjs",
  "e2e:ci:app": "cross-env NODE_ENV=development CYPRESS_COVERAGE=true BROWSER=none PORT=3001 CONNECTIONSTRINGS_PORT=4001 vite --mode e2e",
  "pree2e:ci:run": "wait-on --log --timeout 360000 http-get://localhost:4001 http-get://localhost:3001",
  "e2e:ci:run": "cross-env NODE_ENV=development npm run cypress:run"
}
```

**cypress.config.ts:**
```typescript
baseUrl: "http://localhost:3001"
```

**vite.config.ts:**
```typescript
server: {
  proxy: {
    "/connectionStrings.cjs": `http://localhost:${process.env.CONNECTIONSTRINGS_PORT || "4000"}`,
  },
}
```

**.gitignore:**
```
cypress/dist
```

## Performance Comparison

### Before (Build + Preview)
```
Total time: ~2m+ per test run
├─ Build step: ~1m 46s
│  ├─ TypeScript compilation
│  ├─ Vite bundle creation
│  ├─ Code instrumentation for coverage
│  └─ Asset optimization
└─ Test execution: ~variable
```

### After (Dev Server)
```
Total time: ~1m faster
├─ Dev server start: ~10-15s
│  ├─ No bundling required
│  ├─ On-demand compilation
│  └─ Faster instrumentation
└─ Test execution: ~same (actual test time unchanged)
```

**Expected improvement: ~1m 30s faster per test run**

## How to Measure Performance

To measure the performance improvement in your environment:

### 1. Measure Old Performance (if reverting to old setup)

```bash
# Revert to old configuration temporarily
git stash
git checkout <old-commit>

# Install dependencies
npm install

# Measure time
time npm run test
```

### 2. Measure New Performance

```bash
# Return to new configuration
git checkout <new-commit>
git stash pop

# Install dependencies
npm install

# Measure time
time npm run test
```

### 3. Compare Results

Note the following metrics:
- **Total execution time**: From start to finish
- **Time to first test**: How long until Cypress starts executing tests
- **Build time**: Old version only (look for "vite build" in output)
- **Server startup time**: New version (look for "Local: http://localhost:3001")

Example output format:
```
OLD (Build + Preview):
- Build time: 1m 46s
- Server startup: 5s
- Test execution: 30s
- Total: 2m 21s

NEW (Dev Server):
- Server startup: 12s
- Test execution: 30s
- Total: 42s

Improvement: 1m 39s faster (69% reduction)
```

## Benefits

### 1. **Faster Test Execution**
- Eliminates lengthy build step
- Dev server starts in seconds vs minutes

### 2. **Concurrent Development**
- Run tests while development server is running
- Different ports prevent conflicts

### 3. **Better Developer Experience**
- Faster feedback loop
- Better source maps for debugging
- Hot module replacement available (if needed)

### 4. **Cleaner Repository**
- No `cypress/dist` build artifacts
- Reduced risk of committing generated files

### 5. **Maintained Coverage**
- Istanbul instrumentation still works via `CYPRESS_COVERAGE=true`
- Coverage reports remain accurate
- No loss of functionality

## Verification Steps

After migration, verify:

1. **Tests Pass**:
   ```bash
   npm run test
   ```

2. **Coverage Works**:
   - Check for `.nyc_output` directory after tests
   - Verify coverage reports are generated
   - Coverage percentage should be similar to before

3. **Concurrent Execution**:
   ```bash
   # Terminal 1
   npm start

   # Terminal 2 (should work without conflicts)
   npm run test
   ```

4. **Interactive Testing Still Works**:
   ```bash
   npm run e2e:start
   ```

## Troubleshooting

### Port Already in Use

If you see "Port 3001 is already in use":
- Check if another `npm run test` is running
- Use `lsof -i :3001` to find the process
- Kill the process or wait for it to complete

### Coverage Not Generated

Ensure:
- `CYPRESS_COVERAGE=true` is set in `e2e:ci:app` script
- `vite-plugin-istanbul` is installed
- Mode is set to `e2e` (triggers instrumentation in vite.config.ts)

### Tests Timing Out

If tests timeout waiting for server:
- Increase timeout in `pree2e:ci:run` (default: 360000ms = 6 minutes)
- Check server logs for errors
- Ensure ports 3001 and 4001 are accessible

## Rollback Instructions

If issues arise, you can rollback by:

1. **Revert the changes**:
   ```bash
   git revert <commit-hash>
   ```

2. **Or manually restore old configuration**:
   - Change ports back to 3000/4000
   - Add back `pree2e:ci:app` build step
   - Change `e2e:ci:app` to use `vite preview`
   - Remove `cypress/dist` from .gitignore (if desired)

## Future Considerations

### Potential Further Improvements

1. **Parallel Test Execution**: Run multiple Cypress instances
2. **Test Sharding**: Split tests across multiple machines in CI
3. **Smart Test Selection**: Only run tests affected by changes
4. **Headless by Default**: Reduce resource usage in CI

### Monitoring

Track these metrics over time:
- Average test execution time
- Build vs dev server startup comparison
- Coverage percentage consistency
- Test failure rates (ensure parity with old approach)

## References

- [Vite Dev Server Documentation](https://vitejs.dev/guide/cli.html#dev-server)
- [Cypress Code Coverage](https://docs.cypress.io/guides/tooling/code-coverage)
- [Istanbul Instrumentation](https://istanbul.js.org/)
- [Vite Istanbul Plugin](https://github.com/ifaxity/vite-plugin-istanbul)
