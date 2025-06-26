// jest.config.js
export default {
  testEnvironment: "jsdom", // ✅ Correct value
  transform: {},
  moduleFileExtensions: ["js", "mjs", "json", "node"],
  testMatch: ["**/?(*.)+(spec|test).@(js|mjs)"],
};
