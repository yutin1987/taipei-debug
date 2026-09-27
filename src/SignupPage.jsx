import { useState } from 'react'
import { SIGNUP_ENDPOINT, issues, terms } from './data.js'
import { districts } from './districts.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const initialForm = { nickname: '', email: '', county: '', district: '', issues: [] }

function validate(form) {
  const errors = {}
  if (!form.nickname.trim()) errors.nickname = '請輸入暱稱'
  if (!EMAIL_RE.test(form.email.trim())) errors.email = '請輸入有效的 E-mail'
  if (!form.county) errors.county = '請選擇縣市'
  else if (!form.district) errors.district = '請選擇地區'
  if (form.issues.length === 0) errors.issues = '請至少選擇一個議題'
  return errors
}

function Steps({ current }) {
  return (
    <ol className="form-steps">
      {['同意條款', '填寫資料'].map((label, i) => (
        <li key={label} className={i === current ? 'is-active' : i < current ? 'is-done' : ''}>
          <span>{i + 1}</span>{label}
        </li>
      ))}
    </ol>
  )
}

function TermsStep({ onAgree }) {
  const [checked, setChecked] = useState(false)
  return (
    <>
      <Steps current={0} />
      <h1 className="section__title">參加同意書</h1>
      <p className="section__sub">報名前，請詳閱以下條款。</p>
      <ol className="terms">
        {terms.map((t) => (
          <li key={t.title} className={t.highlight ? 'term term--highlight' : 'term'}>
            <h2 className="term__title">{t.title}</h2>
            <p>{t.body}</p>
            {t.link && (
              <a className="term__link" href={t.link.href} target="_blank" rel="noopener noreferrer">{t.link.label} ↗</a>
            )}
          </li>
        ))}
      </ol>
      <label className="consent">
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        <span>我已詳閱並同意以上條款，並保證所提交之作品不侵害他人著作權及智慧財產權。</span>
      </label>
      <button type="button" className="btn btn--big form__submit" disabled={!checked} onClick={onAgree}>
        同意並繼續 →
      </button>
    </>
  )
}

export default function SignupPage() {
  const [agreed, setAgreed] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done | error

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const toggleIssue = (title) =>
    set('issues', form.issues.includes(title) ? form.issues.filter((t) => t !== title) : [...form.issues, title])

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return

    if (!SIGNUP_ENDPOINT) {
      setStatus('error')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(SIGNUP_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: form.nickname.trim(),
          email: form.email.trim(),
          county: form.county,
          district: form.district,
          issues: form.issues,
        }),
      })
      if (!res.ok) throw new Error(res.statusText)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <section className="form-page">
        <div className="container form-card form-card--done">
          <p className="kicker">SIGN UP</p>
          <h1 className="section__title">報名成功！</h1>
          <p className="section__sub">{form.nickname}，我們 10/23 線上見。行前資訊會寄到 {form.email}。</p>
          <a href="#top" className="btn">回到活動首頁</a>
        </div>
      </section>
    )
  }

  if (!agreed) {
    return (
      <section className="form-page">
        <div className="container form-card">
          <TermsStep onAgree={() => { setAgreed(true); window.scrollTo({ top: 0, behavior: 'instant' }) }} />
        </div>
      </section>
    )
  }

  return (
    <section className="form-page">
      <div className="container form-card">
        <Steps current={1} />
        <h1 className="section__title">立即報名</h1>
        <p className="section__sub">不用組隊，一個人就能參加。</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span className="field__label">暱稱</span>
            <input
              type="text" value={form.nickname} maxLength={30} autoComplete="nickname"
              onChange={(e) => set('nickname', e.target.value)}
              aria-invalid={!!errors.nickname}
            />
            {errors.nickname && <span className="field__error">{errors.nickname}</span>}
          </label>

          <label className="field">
            <span className="field__label">E-mail</span>
            <input
              type="email" value={form.email} autoComplete="email" inputMode="email"
              onChange={(e) => set('email', e.target.value)}
              aria-invalid={!!errors.email}
            />
            {errors.email && <span className="field__error">{errors.email}</span>}
          </label>

          <fieldset className="field">
            <legend className="field__label">戶籍地</legend>
            <div className="field__row">
              <select
                value={form.county} aria-label="縣市" aria-invalid={!!errors.county}
                onChange={(e) => { set('county', e.target.value); set('district', '') }}
              >
                <option value="">選擇縣市</option>
                {Object.keys(districts).map((c) => <option key={c}>{c}</option>)}
              </select>
              <select
                value={form.district} aria-label="地區" aria-invalid={!!errors.district}
                disabled={!form.county}
                onChange={(e) => set('district', e.target.value)}
              >
                <option value="">選擇地區</option>
                {(districts[form.county] ?? []).map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            {(errors.county || errors.district) && <span className="field__error">{errors.county || errors.district}</span>}
          </fieldset>

          <fieldset className="field">
            <legend className="field__label">關注的議題 <small>（可複選）</small></legend>
            <div className="chips">
              {issues.map((it) => (
                <label key={it.no} className="chip">
                  <input
                    type="checkbox" checked={form.issues.includes(it.title)}
                    onChange={() => toggleIssue(it.title)}
                  />
                  <span>{it.title}</span>
                </label>
              ))}
            </div>
            {errors.issues && <span className="field__error">{errors.issues}</span>}
          </fieldset>


          <div className="form__actions">
            <button type="button" className="btn btn--outline" onClick={() => setAgreed(false)}>← 回到條款</button>
            <button type="submit" className="btn btn--big form__submit" disabled={status === 'sending'}>
              {status === 'sending' ? '送出中…' : '送出報名'}
            </button>
          </div>
          {status === 'error' && (
            <p className="form__alert" role="alert">
              {SIGNUP_ENDPOINT ? '送出失敗，請稍後再試。' : '報名系統尚未開放，請稍後再試。'}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
