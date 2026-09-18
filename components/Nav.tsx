'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Logo } from './Logo'
import { SearchOverlay } from './SearchOverlay'
import { useTheme } from '@/context/ThemeContext'
import { getHeaderSettings, HEADER_DEFAULTS } from '@/lib/siteSettings'
import type { NavItem, HeaderSettings } from '@/lib/siteSettings'

const SETTINGS_CACHE_KEY = 'da_header_v1'

function NavInner() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === '/'

  // Seed from localStorage so logo is correct on first render → no flash
  const [settings, setSettings] = useState<HeaderSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(SETTINGS_CACHE_KEY)
        if (cached) {
          const parsed = JSON.parse(cached)
          return { ...HEADER_DEFAULTS, ...parsed, nav_items: HEADER_DEFAULTS.nav_items }
        }
      } catch {}
    }
    return HEADER_DEFAULTS
  })

  useEffect(() => {
    getHeaderSettings().then(s => {
      setSettings(s)
      try { localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(s)) } catch {}
    })
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    setScrolled(window.scrollY > 60)
    return () => window.removeEventListener('scroll', fn)
  }, [pathname])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname, searchParams])

  const transparent = isHome && !scrolled && !menuOpen

  function navTo(href: string) {
    setMenuOpen(false)
    router.push(href)
  }

  const logoEl = settings.logo_url
    ? <img src={settings.logo_url} alt={settings.site_name} style={{ height: 36, objectFit: 'contain', display: 'block' }} />
    : <Logo t={transparent ? { ...t, text: '#f4f0ea' } : t} />

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: transparent ? 'transparent' : t.navBg, backdropFilter: transparent ? 'none' : 'blur(12px)', borderBottom: `1px solid ${transparent ? 'transparent' : t.border}`, transition: 'background 0.3s ease, border-color 0.3s ease' }}>
        <div className="nav-inner" style={{ maxWidth: 1140, margin: '0 auto', padding: '0 28px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <div onClick={() => navTo('/')} style={{ cursor: 'pointer', flexShrink: 0 }}>
            {logoEl}
          </div>

          {/* Desktop nav items */}
          <div className="nav-desktop" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {settings.nav_items.map((item: NavItem) => {
              const [base, qs] = item.href.split('?')
              const itemCat = qs ? new URLSearchParams(qs).get('cat') : null
              const currentCat = searchParams.get('cat')
              const isActive = itemCat
                ? pathname === base && currentCat === itemCat
                : pathname === item.href
              return (
                <button key={item.href} onClick={() => navTo(item.href)}
                  style={{ background: 'transparent', border: 'none', padding: '6px 12px 5px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', color: transparent ? 'rgba(255,255,255,0.85)' : isActive ? t.text : t.textLight, borderBottom: isActive && !transparent ? `2px solid ${t.text}` : '2px solid transparent', transition: 'color 0.15s', whiteSpace: 'nowrap' }}>
                  {item.label}
                </button>
              )
            })}
            <button onClick={() => setSearchOpen(true)}
              style={{ background: 'transparent', border: `1px solid ${transparent ? 'rgba(255,255,255,0.35)' : t.border}`, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: transparent ? 'rgba(255,255,255,0.8)' : t.textMuted, transition: 'all 0.15s', marginLeft: 8 }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M11 11 L15 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Mobile right side: search + hamburger */}
          <div className="nav-mobile" style={{ display: 'none', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setSearchOpen(true)}
              style={{ background: 'transparent', border: `1px solid ${transparent ? 'rgba(255,255,255,0.35)' : t.border}`, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: transparent ? 'rgba(255,255,255,0.8)' : t.textMuted }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M11 11 L15 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
            <button onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'transparent', border: `1px solid ${transparent ? 'rgba(255,255,255,0.35)' : t.border}`, width: 34, height: 34, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, color: transparent ? 'rgba(255,255,255,0.8)' : t.textMuted }}>
              {menuOpen ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2 L14 14 M14 2 L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ) : (
                <>
                  <span style={{ display: 'block', width: 16, height: 1.5, background: 'currentColor' }} />
                  <span style={{ display: 'block', width: 16, height: 1.5, background: 'currentColor' }} />
                  <span style={{ display: 'block', width: 10, height: 1.5, background: 'currentColor', alignSelf: 'flex-start', marginLeft: 3 }} />
                </>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 56, left: 0, right: 0, zIndex: 99, background: t.surface, borderBottom: `1px solid ${t.border}`, padding: '8px 0 16px' }}>
          {settings.nav_items.map((item: NavItem) => {
            const [base, qs] = item.href.split('?')
            const itemCat = qs ? new URLSearchParams(qs).get('cat') : null
            const currentCat = searchParams.get('cat')
            const isActive = itemCat
              ? pathname === base && currentCat === itemCat
              : pathname === item.href
            return (
              <button key={item.href} onClick={() => navTo(item.href)}
                style={{ display: 'block', width: '100%', textAlign: 'left', background: isActive ? t.accentLight : 'transparent', border: 'none', padding: '14px 24px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: isActive ? 600 : 400, letterSpacing: '0.04em', color: isActive ? t.text : t.textMuted, borderLeft: isActive ? `3px solid ${t.text}` : '3px solid transparent' }}>
                {item.label}
              </button>
            )
          })}
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}

export function Nav() {
  return (
    <Suspense fallback={null}>
      <NavInner />
    </Suspense>
  )
}
