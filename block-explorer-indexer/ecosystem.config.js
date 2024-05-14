module.exports = {
  apps: [
    // { name: 'API', script: './build/libs/api/index.js' },
    // { name: 'Scheduler', script: './build/libs/scheduler/index.js' },
    // { name: 'Dev Scheduler', script: './build/index.js' },
    {
      name: 'Worker',
      script: './build/libs/worker/index.js',
      instances: 50,
      combine_logs: true,
    },
  ],
};
