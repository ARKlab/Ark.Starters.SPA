import "@testing-library/jest-dom/vitest";

import "cross-fetch/polyfill";

import { cleanup } from "@testing-library/react";
import { expect, afterEach, beforeAll, afterAll, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();

  // store.dispatch(api.util.resetApiState());
  cleanup();
});

/*
//https://dev.to/jbudny/mocking-rtk-query-api-with-mock-service-worker-for-testing-react-native-apps-o3m 


// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())

*/
