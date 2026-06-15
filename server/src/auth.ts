import type { Request } from 'express';
import { config } from './config';

// Identity is deliberately a thin seam so your real login (Supabase JWT, Stripe customer,
// your own token, whatever) plugs in here without touching the engine or routes.
//
// getUserId returns a stable user id or null if the caller is not authenticated.

export function getUserId(req: Request): string | null {
  const auth = req.header('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;

  if (token) {
    return verifyToken(token);
  }

  // Dev convenience only: outside production, allow an explicit user id header so you can
  // test the full pipeline before real auth exists. Never trusted in production.
  if (!config.isProd) {
    return req.header('x-user-id') ?? null;
  }

  return null;
}

// TODO replace with real verification once you choose the login mechanism.
// For a Supabase JWT: verify the signature with the project JWT secret and return `sub`.
// For your own token: verify and map to a user id. Until then, production rejects tokens.
function verifyToken(_token: string): string | null {
  if (config.isProd) {
    throw new Error('Token verification not configured. Wire verifyToken() to your auth.');
  }
  // Non-prod: treat the token as the user id directly, for local testing.
  return _token || null;
}
