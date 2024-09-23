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
