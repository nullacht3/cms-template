'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV_SECTIONS = [
  {
    title: 'Inhalte',
    items: [
      { href: '/admin', label: 'Artikel', icon: '📝', adminOnly: false },
      { href: '/admin/seiten', label: 'Seiten', icon: '📄', adminOnly: false },
      { href: '/admin/mediathek', label: 'Mediathek', icon: '🖼', adminOnly: false },
    ],
  },
  {
    title: 'Posteingang',
    items: [
      { href: '/admin/nachrichten', label: 'Kontaktanfragen', icon: '✉️', adminOnly: true },
      { href: '/admin/newsletter', label: 'Newsletter', icon: '📧', adminOnly: true },
    ],
  },
  {
    title: 'Einstellungen',
    items: [
      { href: '/admin/einstellungen/startseite', label: 'Startseite', icon: '🏠', adminOnly: true },
      { href: '/admin/einstellungen/kontakt', label: 'Kontaktseite', icon: '📍', adminOnly: true },
      { href: '/admin/einstellungen/header', label: 'Header & Menü', icon: '🔝', adminOnly: true },
      { href: '/admin/einstellungen/footer', label: 'Footer', icon: '🔻', adminOnly: true },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/admin/benutzer', label: 'Benutzer', icon: '👥', adminOnly: true },
      { href: '/admin/passwort-setzen', label: 'Passwort ändern', icon: '🔑', adminOnly: false },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(true) // Default true, wird beim Laden geprüft
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    if (isLogin) return
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || '')
        const role = user.user_metadata?.role
        // Kein Role = ursprünglicher Admin-Account
        setIsAdmin(!role || role === 'admin')
      }
    })
  }, [isLogin])

  async function logout() {
    await createClient().auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  if (isLogin) return <>{children}</>

  return (
    <div style={{ minHeight: '100vh', background: '#f2f5f8', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <header className="admin-topbar" style={{ background: '#0f1e2e', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0, zIndex: 200, position: 'sticky', top: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSidebarOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(232,228,222,0.7)', padding: 4, display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
            <span style={{ display: 'block', width: 20, height: 2, background: 'currentColor', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 20, height: 2, background: 'currentColor', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 20, height: 2, background: 'currentColor', borderRadius: 2 }} />
          </button>
          <span className="admin-topbar-title" style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 17, fontWeight: 500, color: '#e8e4de', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
            Der Ästhet · Admin
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {userEmail && (
            <span style={{ fontSize: 12, color: 'rgba(232,228,222,0.4)', whiteSpace: 'nowrap', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userEmail}
            </span>
          )}
          <a href="/" target="_blank" style={{ fontSize: 12, color: 'rgba(232,228,222,0.5)', textDecoration: 'none', whiteSpace: 'nowrap' }}>↗ Website</a>
          <button onClick={logout}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(232,228,222,0.7)', padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            Ausloggen
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99, top: 52 }} />
        )}

        {/* Sidebar */}
        <aside className="admin-sidebar" style={{
          width: 220, background: '#fff', borderRight: '1px solid #d8e0e8',
          padding: '24px 0', flexShrink: 0,
          position: sidebarOpen ? 'fixed' : undefined,
          top: sidebarOpen ? 52 : undefined,
          left: sidebarOpen ? 0 : undefined,
          bottom: sidebarOpen ? 0 : undefined,
          zIndex: sidebarOpen ? 100 : undefined,
          display: sidebarOpen ? 'block' : undefined,
        }}>
          {NAV_SECTIONS.map(section => {
            const visibleItems = section.items.filter(item => !item.adminOnly || isAdmin)
            if (visibleItems.length === 0) return null
            return (
              <div key={section.title} style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: '#8aa0b8', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 20px', marginBottom: 6 }}>
                  {section.title}
                </p>
                {visibleItems.map(item => {
                  const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
                  return (
                    <a key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 20px', fontSize: 13, color: active ? '#1a5a8a' : '#4a6278', background: active ? '#eef4fb' : 'transparent', borderLeft: active ? '3px solid #1a5a8a' : '3px solid transparent', textDecoration: 'none', fontWeight: active ? 500 : 400, transition: 'all 0.15s' }}>
                      <span style={{ fontSize: 14 }}>{item.icon}</span>
                      {item.label}
                    </a>
                  )
                })}
              </div>
            )
          })}

          {/* Rolle-Badge am unteren Ende der Sidebar */}
          <div style={{ padding: '0 20px', marginTop: 8 }}>
            <span style={{
              display: 'inline-block', fontSize: 10, fontWeight: 500, letterSpacing: '0.06em',
              padding: '3px 10px', borderRadius: 10,
              background: isAdmin ? 'rgba(26,90,138,0.1)' : 'rgba(26,138,80,0.1)',
              color: isAdmin ? '#1a5a8a' : '#1a8a50',
            }}>
              {isAdmin ? 'Admin' : 'Redakteur'}
            </span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main" style={{ flex: 1, padding: '36px 40px', overflowY: 'auto', minWidth: 0 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
        }
        @media (min-width: 769px) {
          .admin-sidebar { display: block !important; position: static !important; }
        }
      `}</style>
    </div>
  )
}
