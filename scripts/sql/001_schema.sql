-- ============================================================
-- CMS Template – Datenbankschema
-- Ausführen in: Supabase SQL Editor
-- ============================================================

-- ARTICLES
CREATE TABLE IF NOT EXISTS public.articles (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title         text NOT NULL,
  slug          text UNIQUE NOT NULL,
  excerpt       text,
  content       text,
  cover_image   text,
  category      text,
  tags          text[],
  read_time     text DEFAULT '5 Min.',
  is_featured   boolean DEFAULT false,
  published     boolean DEFAULT false,
  published_at  timestamptz,
  updated_at    timestamptz DEFAULT now(),
  seo_title     text,
  meta_description text
);

-- PAGES (statische Seiten)
CREATE TABLE IF NOT EXISTS public.pages (
  slug          text PRIMARY KEY,
  title         text NOT NULL,
  content       text,
  seo_title     text,
  meta_description text,
  updated_at    timestamptz DEFAULT now()
);

-- SITE SETTINGS (Header, Footer, etc.)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key           text PRIMARY KEY,
  value         jsonb NOT NULL,
  updated_at    timestamptz DEFAULT now()
);

-- NEWSLETTER
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email         text UNIQUE NOT NULL,
  created_at    timestamptz DEFAULT now()
);

-- KONTAKT
CREATE TABLE IF NOT EXISTS public.kontakt_nachrichten (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text,
  email         text,
  betreff       text,
  nachricht     text,
  gelesen       boolean DEFAULT false,
  created_at    timestamptz DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kontakt_nachrichten ENABLE ROW LEVEL SECURITY;

-- Articles: öffentlich lesen, eingeloggt alles
DROP POLICY IF EXISTS articles_public_read ON public.articles;
DROP POLICY IF EXISTS articles_admin ON public.articles;
CREATE POLICY articles_public_read ON public.articles FOR SELECT USING (published = true);
CREATE POLICY articles_admin ON public.articles FOR ALL USING (auth.uid() IS NOT NULL);

-- Pages: öffentlich lesen, eingeloggt alles
DROP POLICY IF EXISTS pages_read ON public.pages;
DROP POLICY IF EXISTS pages_admin ON public.pages;
CREATE POLICY pages_read ON public.pages FOR SELECT USING (true);
CREATE POLICY pages_admin ON public.pages FOR ALL USING (auth.uid() IS NOT NULL);

-- Settings: öffentlich lesen, eingeloggt alles
DROP POLICY IF EXISTS settings_read ON public.site_settings;
DROP POLICY IF EXISTS settings_admin ON public.site_settings;
CREATE POLICY settings_read ON public.site_settings FOR SELECT USING (true);
CREATE POLICY settings_admin ON public.site_settings FOR ALL USING (auth.uid() IS NOT NULL);

-- Newsletter: nur eingeloggt lesen, jeder eintragen
DROP POLICY IF EXISTS newsletter_insert ON public.newsletter_subscribers;
DROP POLICY IF EXISTS newsletter_admin ON public.newsletter_subscribers;
CREATE POLICY newsletter_insert ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY newsletter_admin ON public.newsletter_subscribers FOR SELECT USING (auth.uid() IS NOT NULL);

-- Kontakt: jeder schreiben, nur eingeloggt lesen + löschen
DROP POLICY IF EXISTS kontakt_insert ON public.kontakt_nachrichten;
DROP POLICY IF EXISTS kontakt_admin ON public.kontakt_nachrichten;
DROP POLICY IF EXISTS kontakt_delete ON public.kontakt_nachrichten;
CREATE POLICY kontakt_insert ON public.kontakt_nachrichten FOR INSERT WITH CHECK (true);
CREATE POLICY kontakt_admin ON public.kontakt_nachrichten FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY kontakt_update ON public.kontakt_nachrichten FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY kontakt_delete ON public.kontakt_nachrichten FOR DELETE USING (auth.uid() IS NOT NULL);

-- Newsletter: eingeloggt auch löschen
DROP POLICY IF EXISTS newsletter_delete ON public.newsletter_subscribers;
CREATE POLICY newsletter_delete ON public.newsletter_subscribers FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================================
-- STORAGE – Bilder-Bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS images_public_read ON storage.objects;
DROP POLICY IF EXISTS images_admin_upload ON storage.objects;
DROP POLICY IF EXISTS images_admin_delete ON storage.objects;

CREATE POLICY images_public_read ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY images_admin_upload ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.uid() IS NOT NULL);
CREATE POLICY images_admin_delete ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.uid() IS NOT NULL);
