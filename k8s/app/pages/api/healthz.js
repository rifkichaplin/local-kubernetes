// pages/api/healthz.js
import { Client } from 'pg';
import Redis from 'ioredis';

export default async function handler(req, res) {
  try {
    const { DATABASE_URL, REDIS_URL } = process.env;

    // Test PostgreSQL
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();
    const r = await pg.query('SELECT 1 as ok');
    await pg.end();

    // Test Redis
    const redis = new Redis(REDIS_URL);
    await redis.set('healthz', Date.now().toString(), 'EX', 5);
    const pong = await redis.ping();
    await redis.quit();

    console.log('Health check successful');

    // ✅ Send successful response
    res.status(200).json({ ok: true, db: r.rows[0].ok, redis: pong });
  } catch (e) {
    // 🧩 Always send a 500 response if something fails
    console.error('Health check failed:', e);

    res.status(500).json({ ok: false, error: e.message });
  }
}
