export default {
  transform: {},
  testEnvironment: "jsdom", // or "jest-environment-jsdom"
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testMatch: ["**/*.test.mjs"],
};
