import * as Sentry from '@sentry/nextjs';

console.log('1111 instrumentation SENTRY_DSN', process.env.SENTRY_DSN);

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
