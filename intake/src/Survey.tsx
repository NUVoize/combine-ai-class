import { useMemo, useState } from 'react'
import {
  SECTIONS, SCALE_LABELS, SCALE_LABELS_LOC, SELECT_PLACEHOLDER, UI,
  type Field, type Section, type Lang, type Loc,
} from './survey-config'

type Answers = Record<string, unknown>

const OWNER_EMAIL = 'gerochkaka@gmail.com'

const detectLang = (): Lang =>
  typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en'

export function Survey() {
  const [lang, setLang] = useState<Lang>(detectLang)
  const [step, setStep] = useState(-1) // -1 = intro, 0..n-1 = sections, n = done
  const [answers, setAnswers] = useState<Answers>({})
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [emailed, setEmailed] = useState<boolean | null>(null)

  const t = (l: Loc | undefined) => (l ? l[lang] : '')

  const total = SECTIONS.length
  const inSurvey = step >= 0 && step < total
  const section = inSurvey ? SECTIONS[step] : null

  const set = (key: string, value: unknown) => {
    setAnswers((a) => ({ ...a, [key]: value }))
    if (error) setError('')
  }

  const validate = (sec: Section): string => {
    for (const f of sec.fields) {
      if (!('required' in f) || !f.required) continue
      const v = answers[f.key]
      if (f.type === 'multi') {
        if (!Array.isArray(v) || v.length === 0) return `${t(UI.errAnswer)} “${t(f.q)}”`
      } else if (f.type === 'email') {
        if (!v || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(v))) return t(UI.errEmail)
      } else if (v === undefined || v === null || String(v).trim() === '' || v === SELECT_PLACEHOLDER) {
        return `${t(UI.errAnswer)} “${t(f.q)}”`
      }
    }
    return ''
  }

  const next = () => {
    if (section) {
      const err = validate(section)
      if (err) { setError(err); return }
    }
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep((s) => s + 1)
  }
  const back = () => { setError(''); window.scrollTo({ top: 0 }); setStep((s) => s - 1) }

  const submit = async () => {
    if (section) {
      const err = validate(section)
      if (err) { setError(err); return }
    }
    setSending(true)
    setError('')
    // Email is built in canonical English (q.en + English option values).
    const payload = {
      submittedAt: new Date().toISOString(),
      language: lang,
      sections: SECTIONS.map((s) => ({
        title: s.title.en,
        answers: s.fields.map((f) => ({ q: f.q.en, key: f.key, value: formatValue(f, answers[f.key]) })),
      })),
      name: answers['name'] ?? '',
      email: answers['email'] ?? '',
    }
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      setEmailed(res.ok && data?.emailed === true)
    } catch {
      setEmailed(false)
    } finally {
      setSending(false)
      window.scrollTo({ top: 0 })
      setStep(total)
    }
  }

  const mailtoHref = useMemo(() => buildMailto(answers), [answers])
  const pct = step < 0 ? 0 : step >= total ? 100 : Math.round((step / total) * 100)

  return (
    <>
      <div className="cb-bgbase" />
      <div className="iq-shell">
        <div className="iq-topbar">
          <img src="/combine-wordmark.png" alt="COMBINE" />
          <div className="iq-top-right">
            <div className="iq-lang" role="group" aria-label="Language">
              <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
              <button className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>RU</button>
            </div>
            <span className="iq-tag">{t(UI.tag)}</span>
          </div>
        </div>

        {inSurvey && (
          <div className="iq-progress">
            <div className="iq-bar"><span style={{ width: `${Math.max(pct, 4)}%` }} /></div>
            <div className="iq-steps">
              <span>{t(UI.step)} <b>{step + 1}</b> / {total}</span>
              <span>{pct}{t(UI.complete)}</span>
            </div>
          </div>
        )}

        {step === -1 && <Intro t={t} onStart={() => setStep(0)} />}

        {section && (
          <div className="iq-card" key={section.id}>
            <div className="iq-sec-eyebrow">{t(section.eyebrow)}</div>
            <h2>{t(section.title)}</h2>
            {section.sub && <p className="iq-sec-sub">{t(section.sub)}</p>}

            {section.fields.map((f) => (
              <FieldView key={f.key} field={f} lang={lang} value={answers[f.key]} onChange={(v) => set(f.key, v)} />
            ))}

            {error && <div className="iq-err">{error}</div>}

            <div className="iq-nav">
              {step > 0 ? <button className="iq-btn" onClick={back}>{t(UI.back)}</button> : <span />}
              <span className="iq-spacer" />
              {step < total - 1 ? (
                <button className="iq-btn iq-btn-primary" onClick={next}>{t(UI.continue)}</button>
              ) : (
                <button className="iq-btn iq-btn-primary" onClick={submit} disabled={sending}>
                  {sending ? t(UI.sending) : t(UI.submit)}
                </button>
              )}
            </div>
          </div>
        )}

        {step === total && <Done t={t} emailed={emailed} mailtoHref={mailtoHref} />}

        <div className="iq-footer">{t(UI.footer)}</div>
      </div>
    </>
  )
}

/* ---------------- intro ---------------- */
function Intro({ t, onStart }: { t: (l: Loc | undefined) => string; onStart: () => void }) {
  return (
    <div className="iq-card iq-hero">
      <div className="iq-eyebrow">{t(UI.introEyebrow)}</div>
      <h1>{t(UI.h1pre)}<br /><span className="cb-grad">{t(UI.h1grad)}</span> {t(UI.h1post)}</h1>
      <p>{t(UI.introP1)}</p>
      <p>{t(UI.introP2)}</p>
      <div className="iq-meta">
        <span>{t(UI.meta1)}</span>
        <span>{t(UI.meta2)}</span>
        <span>{t(UI.meta3)}</span>
      </div>
      <div className="iq-nav">
        <span className="iq-spacer" />
        <button className="iq-btn iq-btn-primary" onClick={onStart}>{t(UI.start)}</button>
      </div>
    </div>
  )
}

/* ---------------- done ---------------- */
function Done({ t, emailed, mailtoHref }: { t: (l: Loc | undefined) => string; emailed: boolean | null; mailtoHref: string }) {
  return (
    <div className="iq-card iq-done">
      <div className="iq-check">✓</div>
      <h2>{t(UI.doneTitle)}</h2>
      <p>{emailed ? t(UI.doneEmailed) : t(UI.doneFallback)}</p>
      <div className="iq-nav">
        {emailed ? (
          <a className="iq-btn iq-btn-primary" href="mailto:">{t(UI.close)}</a>
        ) : (
          <a className="iq-btn iq-btn-primary" href={mailtoHref}>{t(UI.sendEmail)}</a>
        )}
      </div>
    </div>
  )
}

/* ---------------- field renderer ---------------- */
function FieldView({ field, lang, value, onChange }: { field: Field; lang: Lang; value: unknown; onChange: (v: unknown) => void }) {
  const req = 'required' in field && field.required
  return (
    <div className="iq-field">
      <label className="iq-q">{field.q[lang]}{req && <span className="iq-req">*</span>}</label>
      {field.hint && <span className="iq-hint">{field.hint[lang]}</span>}

      {(field.type === 'text' || field.type === 'email') && (
        <input
          className="iq-input"
          type={field.type === 'email' ? 'email' : 'text'}
          value={(value as string) ?? ''}
          placeholder={field.placeholder?.[lang]}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          className="iq-textarea"
          value={(value as string) ?? ''}
          placeholder={field.placeholder?.[lang]}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'select' && (
        <select
          className="iq-select"
          value={(value as string) ?? field.options[0].en}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options.map((op) => <option key={op.en} value={op.en}>{op[lang]}</option>)}
        </select>
      )}

      {field.type === 'radio' && (
        <div className="iq-choices iq-col">
          {field.options.map((op) => (
            <button key={op.en} type="button" className={`iq-chip ${value === op.en ? 'on' : ''}`} onClick={() => onChange(op.en)}>
              <span className="iq-box iq-dot">{value === op.en ? '●' : ''}</span>{op[lang]}
            </button>
          ))}
        </div>
      )}

      {field.type === 'multi' && (
        <div className="iq-choices">
          {field.options.map((op) => {
            const arr = Array.isArray(value) ? (value as string[]) : []
            const on = arr.includes(op.en)
            return (
              <button key={op.en} type="button" className={`iq-chip ${on ? 'on' : ''}`} onClick={() => onChange(on ? arr.filter((x) => x !== op.en) : [...arr, op.en])}>
                <span className="iq-box">{on ? '✓' : ''}</span>{op[lang]}
              </button>
            )
          })}
        </div>
      )}

      {field.type === 'scale' && (
        <ScaleRow value={value as number | undefined} lang={lang} low={field.low[lang]} high={field.high[lang]} onChange={onChange} />
      )}

      {field.type === 'matrix' && (
        <div className="iq-matrix">
          {field.rows.map((row) => {
            const obj = (value as Record<string, number>) ?? {}
            return (
              <div className="iq-matrix-row" key={row.en}>
                <div className="iq-mlabel">{row[lang]}</div>
                <ScaleRow value={obj[row.en]} lang={lang} low={field.low[lang]} high={field.high[lang]} onChange={(v) => onChange({ ...obj, [row.en]: v as number })} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ScaleRow({ value, lang, low, high, onChange }: { value: number | undefined; lang: Lang; low: string; high: string; onChange: (v: unknown) => void }) {
  return (
    <div className="iq-scale">
      <div className="iq-scale-row">
        {[0, 1, 2, 3, 4].map((n) => (
          <button key={n} type="button" className={`iq-scale-btn ${value === n ? 'on' : ''}`} title={SCALE_LABELS_LOC[lang][n]} onClick={() => onChange(n)}>
            {n}
          </button>
        ))}
      </div>
      <div className="iq-scale-ends"><span>{low}</span><span>{high}</span></div>
    </div>
  )
}

/* ---------------- helpers (email = canonical English) ---------------- */
function formatValue(field: Field, value: unknown): string {
  if (value === undefined || value === null || value === '' || value === SELECT_PLACEHOLDER) return '—'
  if (field.type === 'scale') return `${value} / 4 (${SCALE_LABELS[value as number] ?? ''})`
  if (field.type === 'multi') return Array.isArray(value) && value.length ? (value as string[]).join(', ') : '—'
  if (field.type === 'matrix') {
    const obj = value as Record<string, number>
    const parts = Object.entries(obj).map(([k, v]) => `  • ${k}: ${v}/4`)
    return parts.length ? '\n' + parts.join('\n') : '—'
  }
  return String(value)
}

function buildMailto(answers: Answers): string {
  const lines: string[] = ['COMBINE — Class intake responses', '']
  for (const s of SECTIONS) {
    lines.push(`== ${s.title.en} ==`)
    for (const f of s.fields) lines.push(`${f.q.en}\n${formatValue(f, answers[f.key])}`, '')
  }
  const name = (answers['name'] as string) || 'new student'
  const subject = `COMBINE intake — ${name}`
  return `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
}
