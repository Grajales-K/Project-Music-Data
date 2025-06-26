
jest.unstable_mockModule("./data.mjs", () => ({
  getListenEvents: jest.fn(),
  getSong: jest.fn(),
}));

jest.unstable_mockModule("./script.mjs", () => ({
  updateTable: jest.fn(),
}));

const data = await import("./data.mjs");
const script = await import("./script.mjs");
import { processUserData } from "./common.mjs";

describe("processUserData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should process and call updateTable", () => {
    // test implementation...
  });
});
