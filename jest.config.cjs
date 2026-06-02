module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFiles: ["<rootDir>/src/tests/setupCrypto.cjs"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass|module\\.css)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg|webp)$": "<rootDir>/src/tests/__mocks__/fileMock.cjs",
  },
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  testMatch: ["**/tests/**/*.test.[jt]s?(x)"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  transformIgnorePatterns: ["node_modules/(?!(react-router-dom)/)"],
  testPathIgnorePatterns: ["/node_modules/"],
};
