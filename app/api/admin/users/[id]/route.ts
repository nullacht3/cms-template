import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

async function checkAdmin() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, currentId: null }
  const role = user.user_metadata?.role
  return { ok: !role || role === 'admin', currentId: user.id }
}

// Rolle ändern
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { ok } = await checkAdmin()
  if (!ok) return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })

  const { id } = await params
  const { role } = await req.json()
  if (!['admin', 'redakteur'].includes(role)) {
    return NextResponse.json({ error: 'Ungültige Rolle' }, { status: 400 })
  }

  const { error } = await adminClient().auth.admin.updateUserById(id, {
    user_metadata: { role },
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// Nutzer löschen
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { ok, currentId } = await checkAdmin()
  if (!ok) return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })

  const { id } = await params
  if (id === currentId) {
    return NextResponse.json({ error: 'Du kannst dich nicht selbst löschen.' }, { status: 400 })
  }

  const { error } = await adminClient().auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
