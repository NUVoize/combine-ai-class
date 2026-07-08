/* ============================================================
   POST /api/submit  — emails the intake responses to the owner.
   Runs as a Vercel Node serverless function.

   Env vars (set in Vercel → Project → Settings → Environment Variables):
     RESEND_API_KEY   required to actually send   (get one free at resend.com)
     TO_EMAIL         where to send   (default: gerochkaka@gmail.com)
     FROM_EMAIL       verified sender (default: onboarding@resend.dev)

   If RESEND_API_KEY is missing, the endpoint still returns 200 with
   { emailed: false } so the front-end falls back to the mailto button.
   ============================================================ */

type Answer = { q: string; key: string; value: string }
type Section = { title: string; answers: Answer[] }
type Payload = { submittedAt?: string; name?: string; email?: string; sections?: Section[] }

const esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function toHtml(p: Payload): string {
  const blocks = (p.sections || [])
    .map((s) => {
      const rows = s.answers
        .map(
          (a) =>
            `<tr>
               <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#555;width:44%;vertical-align:top;font-size:13px">${esc(a.q)}</td>
               <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111;font-size:13px;white-space:pre-wrap"><b>${esc(a.value)}</b></td>
             </tr>`,
        )
        .join('')
      return `<h3 style="margin:26px 0 6px;font-family:sans-serif;color:#7c1aff">${esc(s.title)}</h3>
              <table style="width:100%;border-collapse:collapse;font-family:sans-serif">${rows}</table>`
    })
    .join('')
  return `<div style="max-width:680px;margin:0 auto;font-family:sans-serif;color:#111">
      <div style="background:linear-gradient(100deg,#7c1aff,#0a84ff);padding:22px 24px;border-radius:12px 12px 0 0">
        <div style="color:#fff;font-size:12px;letter-spacing:.18em;text-transform:uppercase;opacity:.85">COMBINE · Class Intake</div>
        <div style="color:#fff;font-size:22px;font-weight:700;margin-top:4px">New student: ${esc(p.name || 'unnamed')}</div>
        <div style="color:#fff;opacity:.9;font-size:13px;margin-top:2px">${esc(p.email || '')}</div>
      </div>
      <div style="border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;padding:6px 20px 24px">
        ${blocks}
        <p style="margin-top:24px;color:#999;font-size:11px">Submitted ${esc(p.submittedAt || '')}</p>
      </div>
    </div>`
}

function toText(p: Payload): string {
  const out: string[] = [`COMBINE — Class intake`, `Name: ${p.name || ''}`, `Email: ${p.email || ''}`, '']
  for (const s of p.sections || []) {
    out.push(`== ${s.title} ==`)
    for (const a of s.answers) out.push(`${a.q}\n  ${a.value}`, '')
  }
  return out.join('\n')
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  const payload: Payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}

  const key = process.env.RESEND_API_KEY
  const to = process.env.TO_EMAIL || 'gerochkaka@gmail.com'
  const from = process.env.FROM_EMAIL || 'COMBINE Intake <onboarding@resend.dev>'

  if (!key) {
    // No provider configured yet — acknowledge so the client shows the mailto fallback.
    res.status(200).json({ ok: true, emailed: false })
    return
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email || undefined,
        subject: `COMBINE intake — ${payload.name || 'new student'}`,
        html: toHtml(payload),
        text: toText(payload),
      }),
    })
    if (!r.ok) {
      const detail = await r.text().catch(() => '')
      res.status(200).json({ ok: false, emailed: false, error: detail.slice(0, 300) })
      return
    }
    res.status(200).json({ ok: true, emailed: true })
  } catch (e: any) {
    res.status(200).json({ ok: false, emailed: false, error: String(e?.message || e) })
  }
}
