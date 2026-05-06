'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Logo } from './Logo'
import { useTheme } from '@/context/ThemeContext'
import { getFooterSettings, FOOTER_DEFAULTS } from '@/lib/siteSettings'
import type { FooterSettings } from '@/lib/siteSettings'

export function Footer() {
  const { t } = useTheme()
  const [settings, setSettings] = useState<FooterSettings>(FOOTER_DEFAULTS)

  useEffect(() => { getFooterSettings().then(setSettings) }, [])

  return (
    <footer style={{ borderTop: `1px solid ${t.separator}` }}>
      <div style={{ padding: '28px 28px 24px', maxWidth: 1140, margin: '0 auto' }}>
        {settings.tagline && (
          <p style={{ fontSize: 12, color: t.textLight, marginBottom: 20, textAlign: 'center' }}>{settings.tagline}</p>
        )}
        <div className="footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo t={t} size="small" />
          </Link>
          <p style={{ fontSize: 12, color: t.textLight }}>{settings.copyright}</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {settings.legal_links.map(({ label, href }) => (
              <Link key={href} href={href}
                style={{ fontSize: 12, color: t.textMuted, textDecoration: 'none', transition: 'color 0.15s' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
