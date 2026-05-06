'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { SearchOverlay } from './SearchOverlay'
import { useTheme } from '@/context/ThemeContext'
import { getHeaderSettings, HEADER_DEFAULTS } from '@/lib/siteSettings'
import type { NavItem, HeaderSettings } from '@/lib/siteSettings'

const THEME_DOTS: { key: string; color: string; label: string }[] = [
  { key: 'beige', color: '#b8c8d8', label: 'Klassisch' },
  { key: 'blau',  color: '#5590b8', label: 'Blau'     },
  { key: 'rosa',  color: '#d07090', label: 'Rosa'      },
  { key: 'nacht', color: '#1e2530', label: 'Nacht'     },
]

function ThemeSwitcher({ transparent }: { transparent: boolean }) {
  const { t, variant, setVariant } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} title="Design wechseln"
        style={{ background: open && !transparent ? t.accentLight : 'transparent', border: `1px solid ${transparent ? 'rgba(255,255,255,0.3)' : open ? t.accent : t.border}`, width: 36, height: 36, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: transparent ? 'rgba(255,255,255,0.8)' : open ? t.accent : t.textMuted, transition: 'all 0.15s' }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle cx="5" cy="5" r="2.5" fill="currentColor" opacity="0.9"/>
          <circle cx="11" cy="5" r="2.5" fill="currentColor" opacity="0.6"/>
          <circle cx="5" cy="11" r="2.5" fill="currentColor" opacity="0.4"/>
          <circle cx="11" cy="11" r="2.5" fill="currentColor" opacity="0.2"/>
        </svg>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 44, right: 0, background: t.surface, borderRadius: 12, boxShadow: t.shadowHover, border: `1px solid ${t.border}`, padding: '14px 16px', minWidth: 160, zIndex: 200 }}>
          <p style={{ fontSize: 10, color: t.textLight, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>Design</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {THEME_DOTS.map(({ key, color, label }) => (
              <button key={key} onClick={() => { setVariant(key); setOpen(false) }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: variant === key ? t.accentLight : 'transparent', border: 'none', borderRadius: 7, padding: '7px 10px', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: color, flexShrink: 0, outline: variant === key ? `2px solid ${t.accent}` : '2px solid transparent', outlineOffset: 2 }} />
                <span style={{ fontSize: 13, color: variant === key ? t.accent : t.textMuted, fontFamily: "'DM Sans', sans-serif", fontWeight: variant === key ? 500 : 400 }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Nav() {
  const [searchOpen, setSearchOpen] = useState(false)
  const { t } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === '/'
  const [settings, setSettings] = useState<HeaderSettings>(HEADER_DEFAULTS)

  useEffect(() => { getHeaderSettings().then(setSettings) }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    setScrolled(window.scrollY > 60)
    return () => window.removeEventListener('scroll', fn)
  }, [pathname])

  const transparent = isHome && !scrolled

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: transparent ? 'transparent' : t.navBg, backdropFilter: transparent ? 'none' : 'blur(12px)', borderBottom: `1px solid ${transparent ? 'transparent' : t.border}`, transition: 'background 0.3s ease, border-color 0.3s ease' }}>
        <div className="nav-inner" style={{ maxWidth: 1140, margin: '0 auto', padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
            {settings.logo_url
              ? <img src={settings.logo_url} alt={settings.site_name} style={{ height: 36, objectFit: 'contain' }} />
              : <Logo t={transparent ? { ...t, text: '#f4f0ea' } : t} />
            }
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {settings.nav_items.map((item: NavItem) => (
              <button key={item.href} onClick={() => router.push(item.href)}
                style={{ background: pathname === item.href && !transparent ? t.accentLight : 'transparent', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400, letterSpacing: '0.03em', color: transparent ? 'rgba(255,255,255,0.8)' : pathname === item.href ? t.accent : t.textMuted, transition: 'all 0.15s' }}>
                {item.label}
              </button>
            ))}
            <ThemeSwitcher transparent={transparent} />
            <button onClick={() => setSearchOpen(true)}
              style={{ background: searchOpen ? t.accentLight : 'transparent', border: `1px solid ${transparent ? 'rgba(255,255,255,0.3)' : searchOpen ? t.accent : t.border}`, width: 36, height: 36, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: transparent ? 'rgba(255,255,255,0.8)' : searchOpen ? t.accent : t.textMuted, transition: 'all 0.15s' }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M11 11 L15 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}
