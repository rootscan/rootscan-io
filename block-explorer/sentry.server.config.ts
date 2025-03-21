// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1,
  enabled: !!process.env.ENVIRONMENT && ['prod', 'dev'].includes(process.env.ENVIRONMENT),
  debug: true,
});
