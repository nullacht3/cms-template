import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const body = await req.json()
  const { alt, caption, source } = body

  const { data, error } = await supabase
    .from('media')
    .update({ alt, caption, source })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Storage-Datei holen um den Pfad zu löschen
  const { data: media } = await supabase.from('media').select('storage_path').eq('id', id).single()
  if (media?.storage_path) {
    await supabase.storage.from('images').remove([media.storage_path])
  }

  const { error } = await supabase.from('media').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
