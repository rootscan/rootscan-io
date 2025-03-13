/* eslint-disable no-console */
let buffer;

self.oninstall = function (event) {
  event.waitUntil(self.skipWaiting());
  buffer = [];
};

self.onactivate = function (event) {
  event.waitUntil(self.clients.claim());
};

const handleBuffer = () => {
  const messages = buffer.splice(0, buffer.length);
  if (messages.length) {
    fetch('/api/log', { method: 'POST', body: JSON.stringify(messages) }).catch(console.warn);
  }
};

setInterval(handleBuffer, 5000);

self.addEventListener('message', function (event) {
  const { data } = event;
  if (!buffer) {
    buffer = [];
  }
  if (data.type === 'log') {
    buffer.push([data.level, data.location, ...data.args]);
  }
});
