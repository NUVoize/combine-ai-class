# COMBINE prompt-helper server

The key-holding backend. The browser never sees your Anthropic key, your LM Studio
endpoint, or your prompt recipes. The SPA calls this service; this service runs the
engine and returns prompts.

## What it does

- `GET /healthz` - liveness check.
- `GET /api/prompt-helper/models` - the model list for the UI dropdowns (no recipe text).
- `POST /api/prompt-helper/generate` - authenticates, checks the caller's tier, meters
  usage, routes SFW to Anthropic and NSFW to LM Studio, runs the staged pipeline, returns
  `{ prompts, usage }`.

Request body for generate:
```json
{
  "modelId": "wan22",
  "mode": "txt2vid",
  "content": "sfw",
  "inputs": { "scene": "...", "style": "...", "protagonistAction": "...",
              "cameraAngle": "...", "cameraMovement": "...", "lighting": "...", "cameraDevice": "..." },
  "images": []
}
```

## Deploy on Railway

1. Create a Railway project, add a Postgres database (gives you `DATABASE_URL`).
2. Apply the schema once: `psql "$DATABASE_URL" -f schema.sql`.
3. Add a service from this folder. Start command is `npm start` (runs via tsx, no build step).
4. Set the service variables below.
5. Point the SPA at the service URL.

## Environment variables

Required:
- `DATABASE_URL` - from the Railway Postgres plugin.
- `ANTHROPIC_API_KEY` - your key, used for SFW.

Recommended / situational:
- `ANTHROPIC_MODEL` - defaults to claude-sonnet-4-6.
- `ALLOWED_ORIGIN` - your Vercel SPA URL (set this in production instead of the default `*`).
- `LMSTUDIO_BASE_URL` and `LMSTUDIO_MODEL` - your reachable LM Studio instance for NSFW.
  Railway does not run the model itself; host LM Studio on a GPU box (e.g. RunPod) reachable
  over HTTPS and put its URL here. `LMSTUDIO_API_KEY` is optional.
- `CAP_CLOUD`, `CAP_LOCAL`, `CAP_VIDEO` - daily request caps per tier. `-1` is unlimited.
  Defaults: cloud 30, local 30, video -1.
- `NODE_ENV=production` - enables Postgres SSL and disables the dev auth shortcut.

## The two seams you will wire later

- Auth (`src/auth.ts`): `getUserId` turns a request into a user id. Replace `verifyToken`
  with your real check (Supabase JWT, your own token, etc.). In non-production you can pass
  `x-user-id` to test the whole pipeline before auth exists.
- Entitlements: a purchase has to write a row into the `entitlements` table mapping a user
  to a tier (`cloud`, `local`, or `video`). Wire that to your payment flow when ready.

## Local test before auth exists

With Postgres reachable and the schema applied:
```
# mark yourself as a video (unlimited) user
psql "$DATABASE_URL" -c "INSERT INTO entitlements(user_id,tier) VALUES('me','video') ON CONFLICT (user_id) DO UPDATE SET tier='video';"

npm install && npm run dev
curl -s localhost:8080/api/prompt-helper/generate \
  -H 'content-type: application/json' -H 'x-user-id: me' \
  -d '{"modelId":"wan22","mode":"txt2vid","content":"sfw","inputs":{"scene":"a dancer in a warehouse","style":"cinematic","protagonistAction":"spinning","cameraAngle":"wide","cameraMovement":"orbit","lighting":"golden hour","cameraDevice":"ARRI Alexa"}}'
```
