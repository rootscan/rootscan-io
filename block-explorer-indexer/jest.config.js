module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/libs/$1',
  },
};

process.env = Object.assign(process.env, {
  DEBUG: process.env.DEBUG || 'rootscan:*',
  __JEST__: process.env.__JEST__ || true,
});
