import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const LEVELS = [
  { dir: '00-foundations', label: 'Level 0', name: 'Foundations', tag: 'Free' },
  { dir: '10-cloud-path', label: 'Level 1', name: 'Cloud Path', tag: '' },
  { dir: '20-local-path', label: 'Level 2', name: 'Local Path', tag: '' },
  { dir: '30-video', label: 'Level 3', name: 'Video', tag: '' },
]

type Lesson = {
  id: string
  dir: string
  order: number
  numLabel: string
  title: string
  body: string
}

const raw = import.meta.glob('./lessons/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function buildLessons(): Lesson[] {
  const out: Lesson[] = []
  for (const path in raw) {
    const body = raw[path]
    const parts = path.split('/')
    const file = parts[parts.length - 1]
    const dir = parts[parts.length - 2]
    const m = file.match(/(\d+)\.(\d+)/)
    let order = 0
    let numLabel = 'Intro'
    if (m) {
      const major = parseInt(m[1], 10)
      const minor = parseInt(m[2], 10)
      order = major * 100 + minor
      numLabel = `${major}.${minor}`
    }
    const head = body.split('\n').find((l) => l.startsWith('# ')) || ''
    let title = head.replace(/^#\s+/, '').trim()
    title = title.replace(/^Lesson\s+[\d.]+[:,]\s*/i, '')
    out.push({ id: path, dir, order, numLabel, title, body })
  }
  return out
}

export default function Classes() {
  const lessons = useMemo(buildLessons, [])
  const byLevel = useMemo(() => {
    const map: Record<string, Lesson[]> = {}
    for (const lv of LEVELS) {
      map[lv.dir] = lessons
        .filter((l) => l.dir === lv.dir)
        .sort((a, b) => a.order - b.order)
    }
    return map
  }, [lessons])

  const first = byLevel[LEVELS[0].dir][0]
  const [activeId, setActiveId] = useState(first?.id)
  const active = lessons.find((l) => l.id === activeId) || first
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [activeId])

  return (
    <div className="cb-classes">
      <header className="cb-cls-top">
        <a href="#" className="cb-cls-home">&larr; COMBINE</a>
        <div className="cb-cls-tag">Curriculum &middot; open preview</div>
      </header>
      <div className="cb-cls-body">
        <aside className="cb-cls-side">
          {LEVELS.map((lv) => (
            <div className="cb-cls-group" key={lv.dir}>
              <div className="cb-cls-glabel">
                <span>{lv.label} &middot; {lv.name}</span>
                {lv.tag && <span className="cb-cls-free">{lv.tag}</span>}
              </div>
              <ul>
                {byLevel[lv.dir].map((l) => (
                  <li
                    key={l.id}
                    className={l.id === active?.id ? 'cb-cls-on' : ''}
                    onClick={() => setActiveId(l.id)}
                  >
                    <span className="cb-cls-num">{l.numLabel}</span>
                    <span className="cb-cls-tt">{l.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>
        <div className="cb-cls-main" ref={mainRef}>
          {active && (
            <article className="cb-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{active.body}</ReactMarkdown>
            </article>
          )}
        </div>
      </div>
    </div>
  )
}
