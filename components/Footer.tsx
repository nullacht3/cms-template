'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Logo } from './Logo'
import { useTheme } from '@/context/ThemeContext'
import { getFooterSettings, getHeaderSettings } from '@/lib/siteSettings'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { OPEN_CONSENT_EVENT } from './CookieConsent'
import type { FooterSettings, HeaderSettings } from '@/lib/siteSettings'

export function Footer() {
  const { t } = useTheme()
  const initial = useSiteSettings()
  const [settings, setSettings] = useState<FooterSettings>(initial.footer)
  const [header, setHeader] = useState<HeaderSettings>(initial.header)

  useEffect(() => {
    getFooterSettings().then(setSettings)
    getHeaderSettings().then(setHeader)
  }, [])

  return (
    <footer style={{ borderTop: `1px solid ${t.separator}` }}>
      <div style={{ padding: '28px 28px 24px', maxWidth: 1140, margin: '0 auto' }}>
        {settings.tagline && (
          <p style={{ fontSize: 12, color: t.textLight, marginBottom: 20, textAlign: 'center' }}>{settings.tagline}</p>
        )}
        <div className="footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            {header.logo_url
              ? <img src={header.logo_url} alt={header.site_name} style={{ height: 28, objectFit: 'contain', filter: 'brightness(0)' }} />
              : <Logo t={t} size="small" />
            }
          </Link>
          <p style={{ fontSize: 12, color: t.textLight }}>{settings.copyright}</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {settings.legal_links.map(({ label, href }) => (
              <Link key={href} href={href}
                style={{ fontSize: 12, color: t.textMuted, textDecoration: 'none', transition: 'color 0.15s' }}>
                {label}
              </Link>
            ))}
            <button onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
              style={{ fontSize: 12, color: t.textMuted, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cookie-Einstellungen
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
