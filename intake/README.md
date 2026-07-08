# COMBINE — Class Intake

A standalone client questionnaire for the COMBINE AI course. It matches the marketing
site's look (dark neon, violet→blue, Space Grotesk) but shares **no login, API, or data**
with the main app — it's deliberately separate.

New students fill in 7 short sections; the responses are emailed straight to you.

**Bilingual (EN / RU).** A language toggle sits in the top bar and the form defaults to the
visitor's browser language. Whatever language the student picks, the email you receive is
always written in **canonical English** — so every submission reads the same to you. To add
another language, extend the `Loc = { en, ru }` objects in `survey-config.ts` with a new key.

## Run locally

```bash
cd apps/AI-class/intake
npm install
npm run dev
```

Open the printed URL. (The email API only runs on Vercel, so locally the "Submit" button
falls back to the **mailto** button on the thank-you screen — that always works.)

## Deploy (Vercel)

1. Import `apps/AI-class/intake` as its own Vercel project (root directory = `intake`).
2. Add one environment variable to actually send email:
   - `RESEND_API_KEY` — free key from [resend.com](https://resend.com) (100 emails/day free).
   - optional: `TO_EMAIL` (defaults to `gerochkaka@gmail.com`), `FROM_EMAIL`.
3. Deploy. Submissions now arrive as a formatted email, `reply_to` set to the student.

**No key yet?** It still works — on submit, the student gets a "Send my answers by email"
button that opens their mail app pre-filled to you. Nothing is lost.

> To send from your own domain (instead of `onboarding@resend.dev`), verify the domain in
> Resend and set `FROM_EMAIL` to an address on it — improves deliverability.

## Editing the questions

Everything lives in [`src/survey-config.ts`](src/survey-config.ts) — a plain data array.
Add/remove fields or whole sections; the renderer and the email formatter pick them up
automatically. Field types: `text`, `email`, `textarea`, `select`, `radio`, `multi`,
`scale` (0–4), `matrix` (several 0–4 rows).

## Structure

```
intake/
  api/submit.ts        Vercel serverless — formats + emails responses (Resend)
  src/survey-config.ts THE questions (edit here)
  src/Survey.tsx        wizard engine, validation, submit + mailto fallback
  src/index.css         COMBINE design system + form styles
```
