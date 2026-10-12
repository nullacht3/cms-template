import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { submitToIndexNow } from '@/lib/indexNow'

// Wird vom ArticleEditor nach jedem Speichern aufgerufen:
// Sitemap + Startseite sofort neu erzeugen und veröffentlichte Artikel per IndexNow melden.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const { slug } = await req.json()
  if (!slug || typeof slug !== 'string') return NextResponse.json({ error: 'Slug fehlt' }, { status: 400 })

  revalidatePath('/sitemap.xml')
  revalidatePath('/')
  revalidatePath(`/${slug}`)

  const { data } = await supabase.from('articles').select('published').eq('slug', slug).single()
  let indexNow: number | undefined
  if (data?.published) {
    // Nicht-kritisch: Fehler bei IndexNow sollen das Speichern nicht scheitern lassen
    indexNow = await submitToIndexNow([`/${slug}`, '/']).catch(() => undefined)
  }
  return NextResponse.json({ ok: true, indexNow })
}
