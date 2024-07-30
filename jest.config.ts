import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  projects: await getJestProjectsAsync(),
  setupFilesAfterEnv: ['jest-extended/all'],
});

process.env = Object.assign(process.env, {
  DEBUG: process.env.DEBUG || 'rootscan:*',
  __JEST__: process.env.__JEST__ || true,
});
