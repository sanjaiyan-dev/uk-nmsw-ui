module.exports = {
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
};
