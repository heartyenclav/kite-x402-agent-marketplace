import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { config } from './config.js';
import { apiRouter } from './routes/api.js';

const app = express();

app.use(
  cors({
    origin: '*',
    exposedHeaders: [
      'Payment-Required',
      'Payment-Response',
      'Retry-After',
      'X-Request-ID',
      'X-Response-Time',
    ],
  }),
);

app.use(express.json());

// X-Response-Time & X-Request-ID timing middleware
app.use((req, res, next) => {
  const start = performance.now();
  const requestId = req.header('X-Request-ID') || crypto.randomUUID();
  res.setHeader('X-Request-ID', requestId);
  res.on('finish', () => {
    const duration = performance.now() - start;
    res.setHeader('X-Response-Time', `${duration.toFixed(2)}ms`);
  });
  next();
});

// Mount API routes
app.use('/api', apiRouter);

// Kubernetes health & liveness probes
app.get('/healthz', (_req, res) => {
  res.json({
    status: 'healthy',
    network: config.kiteNetwork,
    chainId: config.kiteChainId,
    timestamp: Date.now(),
  });
});

app.get('/livez', (_req, res) => {
  res.json({ status: 'alive' });
});

const server = createServer(app);

server.listen(config.port, () => {
  console.log('================================================================');
  console.log('🪁 Kite AI x402 Agent Marketplace & Gateway Online');
  console.log(`📡 Server listening at: http://localhost:${config.port}`);
  console.log(`⛓️  Target Kite Chain:   ${config.kiteNetwork} (Chain ID: ${config.kiteChainId})`);
  console.log(`💳 x402 Micropayments:  ENABLED (pieUSD via ${config.facilitatorUrl})`);
  console.log('================================================================');
});

const shutdown = (signal: string) => {
  console.log(`\nReceived ${signal}, gracefully terminating server...`);
  server.close(() => {
    console.log('Server closed successfully.');
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 3000);
};

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
