import { useEffect, useRef, useState } from 'react'
import { SIGNUP_URL, LISTEN_URL, VOTE_DATE, comingSoonProjects, issues, steps, rules, agenda } from './data.js'
import SignupPage from './SignupPage.jsx'

function Nav() {
  return (
    <header className="nav">
      <a href="#top" className="nav__logo">
        <span className="slash" aria-hidden="true">///</span> 市政 Debug
      </a>
      <nav className="nav__links">
        <a href="#projects">專案</a>
        <a href="#issues">議題</a>
        <a href="#how">參加辦法</a>
        <a href="#agenda">流程</a>
        <a href={SIGNUP_URL} className="btn btn--small">立即報名</a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__lines" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => <span key={i} style={{ '--i': i }} />)}
      </div>
      <div className="container hero__inner">
        <p className="hero__eyebrow">TAIPEI CIVIC DEBUG HACKATHON 2026</p>
        <h1 className="hero__title">
          <span className="hero__num">100</span>
          <span className="hero__unit">天</span>
          <span className="hero__claim">實現承諾</span>
        </h1>
        <p className="hero__lead">
          台北卡住了？一起來 Debug。<br />
          把市民的抱怨變成 issue，把 issue 變成 100 天內能上線的修正。
        </p>
        <div className="hero__cta">
          <a href={SIGNUP_URL} className="btn btn--light">立即報名</a>
          <a href="#issues" className="btn btn--ghost">看十大議題 ↓</a>
        </div>
        <pre className="hero__code" aria-hidden="true">
{`$ git commit -m "fix: 讓台北順起來"
✔ 100 days to deploy`}
        </pre>
      </div>
    </section>
  )
}

function ComingSoon() {
  return (
    <section className="section" id="projects">
      <div className="container">
        <p className="kicker">01 / PROJECTS</p>
        <h2 className="section__title">三個黑客松專案</h2>
        <p className="section__sub">
          專案題目將由市民票選決定，<strong>{VOTE_DATE}</strong> 公布結果。
        </p>
        <div className="projects">
          {comingSoonProjects.map((p) => (
            <article key={p.id} className="project">
              <span className="project__tag">{p.tag}</span>
              <span className="project__letter" aria-hidden="true">{p.id}</span>
              <h3 className="project__title">Coming Soon</h3>
              <p className="project__note">等待 {VOTE_DATE} 票選結果</p>
              <span className="project__status"><i />投票進行中</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Issues() {
  return (
    <section className="section section--tint" id="issues">
      <div className="container">
        <p className="kicker">02 / ISSUES</p>
        <h2 className="section__title">十大市政政策議題</h2>
        <p className="section__sub">市民最常回報的台北 bug，挑一個來修。</p>
        <ol className="issues">
          {issues.map((it) => (
            <li key={it.no} className="issue">
              <span className="issue__no">{it.no}</span>
              <div>
                <h3 className="issue__title">
                  {it.title}
                  <span className="issue__area">{it.area}</span>
                </h3>
                <p className="issue__desc">{it.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="source">
          <a href={LISTEN_URL} className="btn btn--outline btn--small" target="_blank" rel="noopener noreferrer">
            資料來自『市長你給我聽好』 ↗
          </a>
        </div>
      </div>
    </section>
  )
}

function HowTo() {
  return (
    <section className="section" id="how">
      <div className="container">
        <p className="kicker">03 / HOW TO JOIN</p>
        <h2 className="section__title">參加辦法</h2>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step__no">
                STEP {i + 1}
                {s.date && <span className="step__date">{s.date}</span>}
              </span>
              <h3 className="step__title">{s.title}</h3>
              <p>{s.desc}</p>
              {s.place && <span className="step__place">{s.place}</span>}
            </li>
          ))}
        </ol>
        <ul className="rules">
          {rules.map((r) => <li key={r}>{r}</li>)}
        </ul>
      </div>
    </section>
  )
}

function Agenda() {
  return (
    <section className="section section--tint" id="agenda">
      <div className="container">
        <p className="kicker">04 / AGENDA</p>
        <h2 className="section__title">當天活動流程</h2>
        <p className="section__sub">16:30 起 YouTube Live 對外直播 Demo 與座談。</p>
        <div className="agenda">
          {agenda.map((d) => (
            <article key={d.day} className="day">
              <header className="day__head">
                <span className="day__label">{d.day}</span>
                <h3 className="day__date">{d.date}</h3>
                <span className="step__place">{d.place}</span>
              </header>
              <ol className="timeline">
                {d.items.map((it) => (
                  <li key={it.time + it.title} className={it.live ? 'slot slot--live' : 'slot'}>
                    <time className="slot__time">{it.time}</time>
                    <div>
                      <h4 className="slot__title">
                        {it.title}
                        {it.live && <span className="live-badge">LIVE</span>}
                      </h4>
                      {it.desc && <p className="slot__desc">{it.desc}</p>}
                      {it.sub && (
                        <ul className="slot__sub">
                          {it.sub.map((x) => (
                            <li key={x.time}><time>{x.time}</time>{x.title}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Signup() {
  return (
    <section className="signup" id="signup">
      <div className="hero__lines" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => <span key={i} style={{ '--i': i }} />)}
      </div>
      <div className="container signup__inner">
        <h2 className="signup__title">台北，順起來。</h2>
        <p>名額有限，不用組隊，一個人就能報名。</p>
        <a href={SIGNUP_URL} className="btn btn--light btn--big">立即報名 →</a>
      </div>
    </section>
  )
}

// #/signup 顯示報名頁，其他 hash 視為首頁錨點
function useHash() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const hash = useHash()
  const isSignup = hash === SIGNUP_URL

  // 切換頁面後直接跳到錨點或頁首；同頁錨點交給瀏覽器平滑捲動
  const wasSignup = useRef(isSignup)
  useEffect(() => {
    if (wasSignup.current === isSignup) return
    wasSignup.current = isSignup
    const target = !isSignup && hash.length > 1 && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView({ behavior: 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [hash, isSignup])

  return (
    <>
      <Nav />
      <main>
        {isSignup ? (
          <SignupPage />
        ) : (
          <>
            <Hero />
            <ComingSoon />
            <Issues />
            <HowTo />
            <Agenda />
            <Signup />
          </>
        )}
      </main>
      <footer className="footer">
        <div className="container">© 2026 市政 Debug 黑客松 · Future, soon.</div>
      </footer>
    </>
  )
}
