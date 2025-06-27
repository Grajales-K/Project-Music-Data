import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock the entire data module
jest.unstable_mockModule('./data.mjs', () => ({
  getListenEvents: jest.fn(),
  getSong: jest.fn(),
}));

// Mock the script module that exports updateTable
jest.unstable_mockModule('./script.mjs', () => ({
  updateTable: jest.fn(),
}));

// Now import after mocks
const { getListenEvents, getSong } = await import('./data.mjs');
const { updateTable } = await import('./script.mjs');
const { processUserData } = await import('./common.mjs');

describe("processUserData()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Detects songs played every day", () => {
    const events = [
      { song_id: "1", timestamp: "2025-06-20T10:00:00Z" },
      { song_id: "1", timestamp: "2025-06-21T11:00:00Z" },
      { song_id: "1", timestamp: "2025-06-22T12:00:00Z" },
      { song_id: "2", timestamp: "2025-06-20T13:00:00Z" },
    ];

    getListenEvents.mockReturnValue(events);

    const songs = {
      1: { artist: "A", title: "One", genre: "Pop", duration_seconds: 100 },
      2: { artist: "B", title: "Two", genre: "Jazz", duration_seconds: 200 },
    };
    getSong.mockImplementation(id => songs[id]);

    processUserData("user123");

    const results = updateTable.mock.calls[0][0];

    const everyday = results.find(r => r.question === "Every day songs");

    expect(everyday).toBeDefined();
    expect(everyday.answer).toBe("A - One");
  });
});
