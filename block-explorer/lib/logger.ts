const getLocation = () => {
  if (typeof window === 'undefined') return 'server';
  return window.location.pathname;
};

const sendToServiceWorker = (level: string, ...args: unknown[]) => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({
        type: 'log',
        level,
        location: getLocation(),
        args,
      });
    });
  }
};

export const logger = {
  error: (message: string, ...args: unknown[]) => {
    console.error(message, ...args);
    if (typeof window !== 'undefined') {
      sendToServiceWorker('error', message, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(message, ...args);
    if (typeof window !== 'undefined') {
      sendToServiceWorker('warn', message, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    console.info(message, ...args);
    if (typeof window !== 'undefined') {
      sendToServiceWorker('info', message, ...args);
    }
  },
  debug: (message: string, ...args: unknown[]) => {
    console.debug(message, ...args);
    if (typeof window !== 'undefined') {
      sendToServiceWorker('debug', message, ...args);
    }
  },
  log: (message: string, ...args: unknown[]) => {
    console.log(message, ...args);
  }
}; 