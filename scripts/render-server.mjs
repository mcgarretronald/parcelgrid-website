/**
 * Render web service: static SPA (dist/) + Netlify-style /api handlers.
 * PORT is provided by Render.
 */
import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import agents from '../api/agents.js';
import bookingAgentOrders from '../api/booking-agent-orders.js';
import calculateFee from '../api/calculate-fee.js';
import contact from '../api/contact.js';
import customParcels from '../api/custom-parcels.js';
import dropoffPoints from '../api/dropoff-points.js';
import locationSearches from '../api/location-searches.js';
import courierFee from '../api/payments/courier-fee.js';
import paymentStatus from '../api/payments/status.js';
import pickupPoints from '../api/pickup-points.js';
import track from '../api/track.js';
import webChatMessage from '../api/web-chat/message.js';
import webChatSession from '../api/web-chat/session.js';
import weightBands from '../api/weight-bands.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, '../dist');
const port = Number(process.env.PORT) || 10000;

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

const mount = (route, handler) => {
  app.all(route, (req, res, next) => {
    Promise.resolve(handler(req, res)).catch(next);
  });
};

mount('/api/agents', agents);
mount('/api/booking-agent-orders', bookingAgentOrders);
mount('/api/calculate-fee', calculateFee);
mount('/api/contact', contact);
mount('/api/custom-parcels', customParcels);
mount('/api/dropoff-points', dropoffPoints);
mount('/api/location-searches', locationSearches);
mount('/api/payments/courier-fee', courierFee);
mount('/api/payments/status', paymentStatus);
mount('/api/pickup-points', pickupPoints);
mount('/api/track', track);
mount('/api/track/*', track);
mount('/api/web-chat/message', webChatMessage);
mount('/api/web-chat/session', webChatSession);
mount('/api/weight-bands', weightBands);

app.use(
  express.static(dist, {
    index: false,
    maxAge: '1y',
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  }),
);

const redirects = [
  ['/prepaid-cod', '/services/pay-on-delivery-courier-kenya'],
  ['/instant-settlements', '/services/pay-on-delivery-courier-kenya'],
  ['/notifications', '/services/pay-on-delivery-courier-kenya'],
  ['/pickup-agent', '/opportunities?role=pickup'],
  ['/booking-agent', '/opportunities?role=booking'],
  ['/apply-pickup-agent', '/opportunities?role=pickup'],
  ['/apply-booking-agent', '/opportunities?role=booking'],
  ['/track-parcel', '/track'],
];
for (const [from, to] of redirects) {
  app.get(from, (_req, res) => res.redirect(301, to));
}

app.get('*', (req, res) => {
  const clean = req.path.replace(/\/+$/, '') || '/';
  const candidates =
    clean === '/'
      ? [path.join(dist, 'index.html')]
      : [
          path.join(dist, clean, 'index.html'),
          path.join(dist, `${clean}.html`),
          path.join(dist, 'index.html'),
        ];

  for (const file of candidates) {
    if (existsSync(file)) {
      res.setHeader('Cache-Control', 'no-cache');
      return res.sendFile(file);
    }
  }

  const notFound = path.join(dist, '404.html');
  if (existsSync(notFound)) {
    return res.status(404).sendFile(notFound);
  }
  return res.status(404).send('Not found');
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'SERVER_ERROR' });
});

app.listen(port, () => {
  console.log(`ParcelGrid website listening on :${port}`);
});
