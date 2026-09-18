import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Keine Datei' }, { status: 400 })

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Dateityp nicht erlaubt' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const slug = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
  const path = `media/${Date.now()}-${slug}.${ext}`

  const bytes = await file.arrayBuffer()
  const { data: upload, error: uploadError } = await supabase.storage
    .from('images')
    .upload(path, bytes, { contentType: file.type, upsert: false })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: urlData } = supabase.storage.from('images').getPublicUrl(upload.path)

  const { data: media, error: dbError } = await supabase.from('media').insert({
    filename: file.name,
    storage_path: upload.path,
    url: urlData.publicUrl,
    mime_type: file.type,
    size: file.size,
  }).select().single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(media)
}
