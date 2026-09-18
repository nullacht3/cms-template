import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Nur Admins dürfen diese Pfade besuchen
const ADMIN_ONLY_PATHS = [
  '/admin/einstellungen',
  '/admin/benutzer',
  '/admin/nachrichten',
  '/admin/newsletter',
]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isPasswordPage = request.nextUrl.pathname === '/admin/passwort-setzen'
  const isCallback = request.nextUrl.pathname === '/auth/callback'

  // Callback und Passwort-setzen sind immer erreichbar
  if (isCallback || isPasswordPage) return response

  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Passwort-setzen-Seite ist für eingeloggte Nutzer immer erlaubt
  if (isPasswordPage) return response

  // Rollen-Check: Redakteure nur auf Artikel & Seiten
  if (user) {
    const role = user.user_metadata?.role
    const isRedakteur = role === 'redakteur'
    const path = request.nextUrl.pathname
    if (isRedakteur && ADMIN_ONLY_PATHS.some(p => path.startsWith(p))) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/auth/callback'],
}
