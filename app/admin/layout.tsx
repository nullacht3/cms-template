'use client'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV_SECTIONS = [
  {
    title: 'Inhalte',
    items: [
      { href: '/admin', label: 'Artikel', icon: '📝' },
      { href: '/admin/seiten', label: 'Seiten', icon: '📄' },
    ],
  },
  {
    title: 'Einstellungen',
    items: [
      { href: '/admin/einstellungen/header', label: 'Header & Menü', icon: '🔝' },
      { href: '/admin/einstellungen/footer', label: 'Footer', icon: '🔻' },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'

  async function logout() {
    await createClient().auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  if (isLogin) return <>{children}</>

  return (
    <div style={{ minHeight: '100vh', background: '#f2f5f8', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <header style={{ background: '#0f1e2e', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, zIndex: 10 }}>
        <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 17, fontWeight: 500, color: '#e8e4de', letterSpacing: '0.02em' }}>
          Der Ästhet · Admin
        </span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/" target="_blank" style={{ fontSize: 12, color: 'rgba(232,228,222,0.5)', textDecoration: 'none' }}>
            ↗ Website
          </a>
          <button onClick={logout}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(232,228,222,0.7)', padding: '5px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            Ausloggen
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: '#fff', borderRight: '1px solid #d8e0e8', padding: '24px 0', flexShrink: 0 }}>
          {NAV_SECTIONS.map(section => (
            <div key={section.title} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#8aa0b8', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 20px', marginBottom: 6 }}>
                {section.title}
              </p>
              {section.items.map(item => {
                const active = item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)
                return (
                  <a key={item.href} href={item.href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 20px', fontSize: 13,
                      color: active ? '#1a5a8a' : '#4a6278',
                      background: active ? '#eef4fb' : 'transparent',
                      borderLeft: active ? '3px solid #1a5a8a' : '3px solid transparent',
                      textDecoration: 'none', fontWeight: active ? 500 : 400,
                      transition: 'all 0.15s',
                    }}>
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    {item.label}
                  </a>
                )
              })}
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
