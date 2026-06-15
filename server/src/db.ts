import pg from 'pg';
import { config } from './config';

// Railway Postgres requires SSL in production; relax cert check for its managed cert.
export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: config.isProd ? { rejectUnauthorized: false } : undefined,
});
