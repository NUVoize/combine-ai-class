-- Run once against your Railway Postgres (psql "$DATABASE_URL" -f schema.sql).

-- Who is entitled to what. A purchase webhook (Stripe or whatever you use) sets the tier.
-- tier is one of: cloud, local, video. Absence of a row means not entitled.
CREATE TABLE IF NOT EXISTS entitlements (
  user_id     TEXT PRIMARY KEY,
  tier        TEXT NOT NULL CHECK (tier IN ('cloud', 'local', 'video')),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Daily usage counter, one row per user per day. The generate route increments this
-- atomically and refuses capped tiers once the day's count reaches the cap.
CREATE TABLE IF NOT EXISTS usage (
  user_id  TEXT NOT NULL,
  period   DATE NOT NULL,
  count    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, period)
);
