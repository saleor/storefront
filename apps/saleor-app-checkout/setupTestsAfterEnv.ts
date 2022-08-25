import "next";
import { server } from "./mocks/server";
import { consoleTypes } from "./test-utils";

// Establish API mocking before all tests.
beforeAll(() =>
  server.listen({
    // if not handled by msw, it will be by Polly.js
    onUnhandledRequest: "bypass",
  })
);

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clear mocked console.xyz() calls when used `disableConsole` from test-utils
afterEach(() => {
  consoleTypes.forEach((type) => {
    // @ts-expect-error
    console[type]?.mockClear?.();
  });
});

// Clean up after the tests are finished.
afterAll(() => server.close());
