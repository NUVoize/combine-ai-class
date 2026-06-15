import pg from 'pg';
import { config } from './config';

// Railway Postgres requires SSL in production; relax cert check for its managed cert.
export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: config.isProd ? { rejectUnauthorized: false } : undefined,
});

// Idempotent table creation, run on boot so a fresh database is ready with no manual step.
export async function ensureSchema(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS entitlements (
      user_id    TEXT PRIMARY KEY,
      tier       TEXT NOT NULL CHECK (tier IN ('cloud','local','video')),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS usage (
      user_id TEXT NOT NULL,
      period  DATE NOT NULL,
      count   INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, period)
    );
  `);
}
