'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'

const GA_ID = 'G-7P5Z05SGVL'
const CONSENT_KEY = 'da_consent_v1'
export const OPEN_CONSENT_EVENT = 'da:open-consent'

type Consent = 'granted' | 'denied'

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
}

function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch { return null }
}

// Google Analytics is only loaded after explicit consent (TTDSG § 25 / DSGVO)
function loadAnalytics() {
  if (window.gtag) return
  window.dataLayer = window.dataLayer || []
  // gtag.js expects the arguments object itself, not an array
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { window.dataLayer!.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)
}

function removeAnalyticsCookies() {
  const host = location.hostname
  document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => n.startsWith('_ga')).forEach((n) => {
    for (const domain of ['', `; domain=${host}`, `; domain=.${host.replace(/^www\./, '')}`]) {
      document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`
    }
  })
}

export function CookieConsent() {
  const { t } = useTheme()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isAdmin = pathname?.startsWith('/admin')

  useEffect(() => {
    if (isAdmin) return
    const consent = readConsent()
    if (consent === 'granted') loadAnalytics()
    // localStorage is only readable after mount, so the banner opens in an effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else if (consent === null) setOpen(true)

    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_CONSENT_EVENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
  }, [isAdmin])

  function decide(consent: Consent) {
    const previous = readConsent()
    try { localStorage.setItem(CONSENT_KEY, consent) } catch {}
    setOpen(false)
    if (consent === 'granted') loadAnalytics()
    else if (previous === 'granted') {
      // Withdrawal: stop GA from writing cookies again, drop them, reload so the script is gone
      ;(window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true
      window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
      removeAnalyticsCookies()
      location.reload()
    }
  }

  if (!open || isAdmin) return null

  const btn = { padding: '10px 20px', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", borderRadius: 0, flex: '1 1 0' }

  return (
    <div role="dialog" aria-label="Cookie-Einstellungen" style={{ position: 'fixed', left: 16, right: 16, bottom: 16, zIndex: 300, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{ pointerEvents: 'auto', background: t.surface, border: `1px solid ${t.border}`, padding: '20px 22px', maxWidth: 560, width: '100%', fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 8 }}>Datenschutz-Einstellungen</p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: t.textMuted, marginBottom: 16 }}>
          Mit Ihrer Einwilligung nutzen wir Google Analytics, um zu verstehen, welche Artikel gelesen werden. Dabei werden Cookies gesetzt und Nutzungsdaten an Google übermittelt. Sie können Ihre Entscheidung jederzeit über „Cookie-Einstellungen“ im Footer ändern. Mehr in der{' '}
          <Link href="/datenschutz" style={{ color: t.text, textDecoration: 'underline' }}>Datenschutzerklärung</Link>.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
          <button onClick={() => decide('denied')} style={{ ...btn, background: 'transparent', color: t.text, border: `1px solid ${t.text}` }}>Ablehnen</button>
          <button onClick={() => decide('granted')} style={{ ...btn, background: t.text, color: '#fff', border: `1px solid ${t.text}` }}>Akzeptieren</button>
        </div>
      </div>
    </div>
  )
}
