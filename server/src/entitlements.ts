import { pool } from './db';
import { TIER_CAPS, type Tier } from './config';

export interface MeterResult {
  allowed: boolean;
  tier: Tier;
  used: number; // requests used today (after this one, when allowed)
  cap: number; // -1 = unlimited
}

// Current tier for a user, from the entitlements table. No row = not entitled.
export async function getTier(userId: string): Promise<Tier> {
  const { rows } = await pool.query('SELECT tier FROM entitlements WHERE user_id = $1', [userId]);
  return (rows[0]?.tier as Tier) ?? 'none';
}

function today(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD, UTC day
}

// Atomically reserve one request against today's cap. Unlimited tiers skip the counter.
// The single statement increments only when under cap, so concurrent calls cannot overshoot.
export async function consumeUsage(userId: string, tier: Tier): Promise<MeterResult> {
  const cap = TIER_CAPS[tier];

  if (tier === 'none') return { allowed: false, tier, used: 0, cap: 0 };
  if (cap === -1) return { allowed: true, tier, used: 0, cap: -1 };

  const period = today();
  const { rows } = await pool.query(
    `INSERT INTO usage (user_id, period, count) VALUES ($1, $2, 1)
     ON CONFLICT (user_id, period)
     DO UPDATE SET count = usage.count + 1
     WHERE usage.count < $3
     RETURNING count`,
    [userId, period, cap],
  );

  if (rows.length > 0) {
    return { allowed: true, tier, used: rows[0].count, cap };
  }

  // Update was blocked by the cap; report current count for the message.
  const cur = await pool.query('SELECT count FROM usage WHERE user_id = $1 AND period = $2', [userId, period]);
  return { allowed: false, tier, used: cur.rows[0]?.count ?? cap, cap };
}

// Give a reserved slot back when generation fails, so a failed call does not cost a credit.
export async function refundUsage(userId: string, tier: Tier): Promise<void> {
  if (tier === 'none' || TIER_CAPS[tier] === -1) return;
  const period = today();
  await pool.query(
    'UPDATE usage SET count = GREATEST(count - 1, 0) WHERE user_id = $1 AND period = $2',
    [userId, period],
  );
}
