const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended/all'],
};

process.env = Object.assign(process.env, {
  DEBUG: process.env.DEBUG || 'rootscan:*',
  __JEST__: process.env.__JEST__ || true,
});
