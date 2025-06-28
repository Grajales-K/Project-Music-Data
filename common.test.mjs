// common.test.mjs
// This file contains unit tests for the `processUserData` function from `common.mjs`
// using the Jest testing framework. Unit tests are crucial for verifying that individual
// functions or units of code work correctly in isolation, ensuring the logic is sound.

// Imports core Jest functions.
// `jest`: The Jest global object, used here for mocking.
// `describe`: Used to group related test cases into a test suite.
// `test` (or `it`): Defines an individual test case.
// `expect`: Used to create assertions about values.
// `beforeEach`: A hook that runs before each test in a `describe` block.
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// === Mocking External Modules ===
// Since `processUserData` depends on `getListenEvents` and `getSong` (from `data.mjs`),
// and it calls `updateTable` (from `script.mjs`), we need to "mock" these dependencies.
// Mocking allows us to:
// 1. Prevent actual network calls or file system operations that real `data.mjs` functions might make.
// 2. Control the return values of these functions, allowing us to set up specific test scenarios.
// 3. Spy on how these functions are called (e.g., check what `updateTable` received).

// `jest.unstable_mockModule` is used here for ESM modules. It intercepts imports.
// It returns a factory function that defines the mocked module's exports.

// Mocks the entire `data.mjs` module.
jest.unstable_mockModule('./data.mjs', () => ({
  // `jest.fn()` creates a mock function. This allows us to control its behavior
  // (e.g., define what it returns) and inspect how it was called.
  getListenEvents: jest.fn(),
  getSong: jest.fn(),
}));

// Mocks the `script.mjs` module, specifically the `updateTable` function.
jest.unstable_mockModule('./script.mjs', () => ({
  updateTable: jest.fn(),
}));

// === Dynamic Imports After Mocks ===
// In Jest with ESM, you must import the actual modules *after* setting up mocks
// using `jest.unstable_mockModule`. `await import()` is used for this.
const { getListenEvents, getSong } = await import('./data.mjs');
const { updateTable } = await import('./script.mjs');
const { processUserData } = await import('./common.mjs'); // The function being tested.

// === Test Suite for processUserData() ===
// Groups tests related to the `processUserData` function.
describe("processUserData()", () => {
  // `beforeEach` hook: This function runs before *every* `test` within this `describe` block.
  // Its purpose is to reset the state of our mock functions before each test.
  // `jest.clearAllMocks()` clears any previous calls, mock return values, or mock implementations,
  // ensuring each test starts with a clean slate and is independent.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // === Test Case: Detects songs played every day ===
  test("Detects songs played every day", () => {
    // --- Test Data Setup ---
    // Define mock listening events. This simulates what `getListenEvents` would return.
    // Here, 'song-1' is played on three consecutive days, while 'song-2' is only played on one.
    const events = [
      { song_id: "1", timestamp: "2025-06-20T10:00:00Z" }, // Day 1 for song-1
      { song_id: "1", timestamp: "2025-06-21T11:00:00Z" }, // Day 2 for song-1
      { song_id: "1", timestamp: "2025-06-22T12:00:00Z" }, // Day 3 for song-1
      { song_id: "2", timestamp: "2025-06-20T13:00:00Z" }, // Day 1 for song-2
    ];

    // Configure the mocked `getListenEvents` function to return our `events` data.
    getListenEvents.mockReturnValue(events);

    // Define mock song details. This simulates what `getSong` would return for specific IDs.
    const songs = {
      1: { artist: "A", title: "One", genre: "Pop", duration_seconds: 100 },
      2: { artist: "B", title: "Two", genre: "Jazz", duration_seconds: 200 },
    };
    // Configure the mocked `getSong` function. `mockImplementation` allows us to define
    // a custom function that will be called when `getSong` is invoked, mapping `song_id` to its details.
    getSong.mockImplementation(id => songs[id]);

    // --- Execution ---
    // Call the function being tested (`processUserData`) with a dummy user ID.
    // This function will internally call the mocked `getListenEvents`, `getSong`,
    // and `updateTable` functions.
    processUserData("user123");

    // --- Assertion ---
    // `updateTable.mock.calls` is an array that stores information about every time
    // the mocked `updateTable` function was called. Each element in this array is
    // an array of arguments passed to that call.
    // `updateTable.mock.calls[0][0]` gets the arguments of the *first* call, and then
    // specifically the *first* argument (which is the `results` array passed to `updateTable`).
    const results = updateTable.mock.calls[0][0];

    // Find the specific result object related to "Every day songs" from the `results` array.
    const everyday = results.find(r => r.question === "Every day songs");

    // Assertions:
    // `expect(everyday).toBeDefined()`: Checks that a result for "Every day songs" was actually generated.
    expect(everyday).toBeDefined();
    // `expect(everyday.answer).toBe("A - One")`: Verifies that the answer for "Every day songs"
    // correctly identifies "A - One" (which was played on all 3 unique days).
    expect(everyday.answer).toBe("A - One");
  });
});
