import { useEffect, useState } from 'react'
import TubesBackground from './components/neon-flow'
import Classes from './Classes'

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // scramble rotor
    const rotor = document.getElementById('cb-rotor')
    const phrases = ['every scene.', 'every frame.', 'every time.', 'with zero drift.']
    let raf = 0
    if (rotor && !reduce) {
      const chars = '!<>-_\\/[]{}=+*^?#'
      let queue: { from: string; to: string; start: number; end: number; char?: string }[] = []
      let frame = 0
      let resolve: () => void = () => {}
      const update = () => {
        let out = ''
        let done = 0
        for (let i = 0; i < queue.length; i++) {
          const q = queue[i]
          if (frame >= q.end) { done++; out += q.to }
          else if (frame >= q.start) {
            if (!q.char || Math.random() < 0.28) q.char = chars[Math.floor(Math.random() * chars.length)]
            out += `<span style="-webkit-text-fill-color:#a07cff;color:#a07cff;opacity:.75">${q.char}</span>`
          } else out += q.from
        }
        rotor.innerHTML = out
        if (done === queue.length) resolve()
        else { raf = requestAnimationFrame(update); frame++ }
      }
      const setText = (text: string) => new Promise<void>((res) => {
        resolve = res
        const old = rotor.textContent || ''
        const len = Math.max(old.length, text.length)
        queue = []
        for (let i = 0; i < len; i++) {
          const start = Math.floor(Math.random() * 40)
          const end = start + Math.floor(Math.random() * 40)
          queue.push({ from: old[i] || '', to: text[i] || '', start, end })
        }
        cancelAnimationFrame(raf); frame = 0; update()
      })
      let pi = 0
      const next = () => { setText(phrases[pi]).then(() => setTimeout(next, 2000)); pi = (pi + 1) % phrases.length }
      next()
    }

    // scroll reveal
    const els = Array.from(document.querySelectorAll('.cb-reveal'))
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
      }, { threshold: 0.12 })
      els.forEach((el) => obs.observe(el))
      return () => { obs.disconnect(); cancelAnimationFrame(raf) }
    } else {
      els.forEach((el) => el.classList.add('in'))
    }
    return () => cancelAnimationFrame(raf)
  }, [])

  if (hash === '#classes') return <Classes />

  return (
    <>
      <div className="cb-bgbase" />

      <nav className="cb-nav">
        <div className="cb-wrap">
          <a href="#top"><img src="/combine-wordmark.png" alt="COMBINE" /></a>
          <div className="cb-links">
            <a href="#problem">The problem</a>
            <a href="#levels">Levels</a>
            <a href="#approach">Approach</a>
            <a href="#classes">Classes</a>
            <a href="#start" className="cb-btn cb-btn-primary">Start free</a>
          </div>
        </div>
      </nav>

      <header className="cb-hero" id="top">
        <TubesBackground enableClickInteraction={false} className="min-h-screen">
          <div className="cb-hero-scrim" />
          <div className="cb-hero-inner">
            <div className="cb-wrap">
              <div className="cb-eyebrow cb-reveal">AI Education &nbsp;//&nbsp; Visuals &nbsp;//&nbsp; Growth</div>
              <h1 className="cb-reveal" style={{ marginTop: 20 }}>
                Make the same<br />character,<br /><span className="cb-grad" id="cb-rotor">every scene.</span>
              </h1>
              <p className="cb-sub cb-reveal">COMBINE is the no-gimmick course on AI character creation. Why consistency is hard, then every real way to beat it, from accessible online tools to training your own models.</p>
              <div className="cb-cta cb-reveal">
                <a href="#start" className="cb-btn cb-btn-primary">Start with the free foundations</a>
                <a href="#levels" className="cb-btn cb-btn-ghost">See the four levels</a>
              </div>
            </div>
          </div>
          <div className="cb-marquee cb-reveal">
            <div className="cb-track">
              <span>No magic button</span><i>/</i><span>Real workflows</span><i>/</i><span>~1,000 LoRAs tested</span><i>/</i><span>Zero drift</span><i>/</i><span>We show the failures</span><i>/</i><span>No magic button</span><i>/</i><span>Real workflows</span><i>/</i><span>~1,000 LoRAs tested</span><i>/</i><span>Zero drift</span><i>/</i><span>We show the failures</span><i>/</i>
            </div>
          </div>
        </TubesBackground>
      </header>

      <section className="cb-sec" id="problem">
        <div className="cb-wrap">
          <div className="cb-eyebrow cb-reveal">Why this is hard</div>
          <h2 className="cb-reveal">Character drift isn't your fault. It's how the models work.</h2>
          <p className="cb-lead cb-reveal">An image model has no memory, and it builds every picture from scratch. Your words can't carry a whole face, so it fills the gaps differently each time and hands you a new person. Beating that is a skill, and it's the skill this course teaches.</p>
          <div className="cb-ba">
            <div className="cb-card cb-bad cb-reveal">
              <div className="cb-tag">Prompt only</div>
              <div className="cb-cap">The face wanders every render.</div>
              <div className="cb-grid"><img src="/demo/drift-1.jpg" alt="Prompt-only attempt, drifted face 1" /><img src="/demo/drift-2.jpg" alt="Prompt-only attempt, drifted face 2" /><img src="/demo/drift-3.jpg" alt="Prompt-only attempt, drifted face 3" /><img src="/demo/drift-4.jpg" alt="Prompt-only attempt, drifted face 4" /></div>
            </div>
            <div className="cb-card cb-good cb-reveal">
              <div className="cb-tag">The COMBINE workflow</div>
              <div className="cb-cap">One identity, any scene.</div>
              <div className="cb-grid"><img src="/demo/locked-1.jpg" alt="Same character, studio" /><img src="/demo/locked-2.jpg" alt="Same character, evening outdoors" /><img src="/demo/locked-3.jpg" alt="Same character, mirror" /><img src="/demo/locked-4.jpg" alt="Same character, beach" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="cb-sec" id="levels">
        <div className="cb-wrap">
          <div className="cb-eyebrow cb-reveal">Four levels, stacked</div>
          <h2 className="cb-reveal">Buy a level, get a complete skill. Nothing half-locked.</h2>
          <p className="cb-lead cb-reveal">Each level is a finished, usable outcome on its own. Higher levels include everything beneath them, and advanced material never leaks into the simpler tiers.</p>
          <div className="cb-levels">
            <div className="cb-lvl cb-reveal">
              <div className="cb-num">00</div><h3>Foundations</h3><div className="cb-price cb-free">Free</div>
              <p>The mental model that makes everything after it click.</p>
              <ul className="cb-incl">
                <li>5 short lessons on why consistency is hard</li>
                <li>No software, no hardware, no account</li>
                <li>Yours to keep</li>
              </ul>
            </div>
            <div className="cb-lvl cb-reveal">
              <div className="cb-ribbon">Start here</div><div className="cb-num">01</div><h3>Cloud Path</h3><div className="cb-price">Price TBD</div>
              <p>The accessible road, sold honestly with its limits up front.</p>
              <div className="cb-incl-stack">Everything in Foundations, plus</div>
              <ul className="cb-incl">
                <li>Cloud tools: <b>text-to-image</b> and <b>image-to-image</b></li>
                <li>A prompting workflow to hold a character against drift</li>
                <li>A starter <b>training dataset</b> to build from</li>
                <li><b>Prompt helper app</b> in the platform (basic)</li>
                <li>Lesson notes and saved workflows</li>
              </ul>
            </div>
            <div className="cb-lvl cb-reveal">
              <div className="cb-num">02</div><h3>Local Path</h3><div className="cb-price">Price TBD</div>
              <p>Full control, on your own machine.</p>
              <div className="cb-incl-stack">Everything in Cloud, plus</div>
              <ul className="cb-incl">
                <li>Local models, hardware and <b>RunPods</b> guidance</li>
                <li>Build real datasets and <b>train your own LoRAs</b></li>
                <li><b>Exclusive COMBINE LoRAs</b></li>
                <li>Advanced control: img2img and stacking</li>
              </ul>
            </div>
            <div className="cb-lvl cb-reveal cb-lvl-top">
              <div className="cb-num">03</div><h3>Video</h3><div className="cb-price">Coming soon</div>
              <p>The same character, now in motion.</p>
              <div className="cb-incl-stack">Everything below, plus</div>
              <ul className="cb-incl">
                <li>Consistency <b>frame to frame</b></li>
                <li><b>Scene prep and shot-by-shot breakdown</b>, from a 10-year cinema background</li>
                <li><b>Unlimited</b> prompt helper and <b>one-on-one</b> support</li>
                <li>The <b>COMBINE scene builder</b> <span className="cb-flag">flagship</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cb-sec" id="approach">
        <div className="cb-wrap cb-honest">
          <div className="cb-eyebrow cb-reveal">No magic button</div>
          <div className="cb-big cb-reveal">If you want one secret prompt that does it all, this isn't for you. If you want to actually understand it, it is.</div>
          <div className="cb-proof">
            <div className="cb-chip cb-reveal"><b>2 years</b> of testing</div>
            <div className="cb-chip cb-reveal">close to <b>1,000 LoRAs</b></div>
            <div className="cb-chip cb-reveal">we show the <b>failures</b></div>
            <div className="cb-chip cb-reveal"><b>one-on-one</b> in the top tier</div>
          </div>
        </div>
      </section>

      <section className="cb-sec" id="start">
        <div className="cb-wrap cb-final">
          <div className="cb-eyebrow cb-reveal">Start where it's free</div>
          <h2 className="cb-reveal">Foundations costs nothing and changes how you see every tool after it.</h2>
          <p className="cb-lead cb-reveal" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Five short lessons on why the same character is so hard to get twice. Once it clicks, every technique in the course makes sense.</p>
          <a href="#classes" className="cb-btn cb-btn-primary cb-reveal">Start the free foundations</a>
        </div>
      </section>

      <footer className="cb-footer">
        <div className="cb-wrap">
          <img src="/combine-wordmark.png" alt="COMBINE" />
          <div className="cb-fine">COMBINE &middot; AI Education, Visuals, Growth &middot; Preview</div>
        </div>
      </footer>
    </>
  )
}
