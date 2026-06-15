import 'dotenv/config'; // loads server/.env for local dev; harmless on Railway (real env wins)

// Central config, read once from environment. Railway injects these as service variables.
// Nothing secret is hardcoded; the browser never sees any of this.

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}
function opt(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export type Tier = 'none' | 'cloud' | 'local' | 'video';

// Per-tier request cap. -1 means unlimited. Period is daily (see entitlements.ts).
// Adjust the numbers freely; they are policy, not structure.
export const TIER_CAPS: Record<Tier, number> = {
  none: 0, // not entitled
  cloud: Number(opt('CAP_CLOUD', '30')), // Level 01 basic
  local: Number(opt('CAP_LOCAL', '30')), // Level 02 includes the basic helper
  video: Number(opt('CAP_VIDEO', '-1')), // Level 03 unlimited
};

export const config = {
  port: Number(opt('PORT', '8080')),
  allowedOrigin: opt('ALLOWED_ORIGIN', '*'), // set to your Vercel URL in production
  isProd: process.env.NODE_ENV === 'production',

  databaseUrl: req('DATABASE_URL'), // Railway Postgres connection string

  // SFW path: Anthropic, your key.
  anthropic: {
    apiKey: opt('ANTHROPIC_API_KEY', ''), // checked at call time, so the service boots without it
    model: opt('ANTHROPIC_MODEL', 'claude-sonnet-4-6'),
  },

  // NSFW path: your LM Studio instance, reachable over HTTPS (e.g. a RunPod box), not localhost.
  lmStudio: {
    baseUrl: opt('LMSTUDIO_BASE_URL', ''),
    model: opt('LMSTUDIO_MODEL', ''),
    apiKey: process.env.LMSTUDIO_API_KEY, // optional
  },
};

export function assertNsfwConfigured() {
  if (!config.lmStudio.baseUrl || !config.lmStudio.model) {
    throw new Error('NSFW requested but LMSTUDIO_BASE_URL / LMSTUDIO_MODEL are not set.');
  }
}

export function assertSfwConfigured() {
  if (!config.anthropic.apiKey) {
    throw new Error('SFW requested but ANTHROPIC_API_KEY is not set.');
  }
}
