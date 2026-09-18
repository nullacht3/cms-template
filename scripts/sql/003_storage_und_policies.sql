-- ============================================================
-- Storage Bucket + fehlende Policies
-- Einmalig im Supabase SQL Editor ausführen
-- ============================================================

-- Kontakt: update + delete
DROP POLICY IF EXISTS kontakt_update ON public.kontakt_nachrichten;
DROP POLICY IF EXISTS kontakt_delete ON public.kontakt_nachrichten;
CREATE POLICY kontakt_update ON public.kontakt_nachrichten FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY kontakt_delete ON public.kontakt_nachrichten FOR DELETE USING (auth.uid() IS NOT NULL);

-- Newsletter: delete
DROP POLICY IF EXISTS newsletter_delete ON public.newsletter_subscribers;
CREATE POLICY newsletter_delete ON public.newsletter_subscribers FOR DELETE USING (auth.uid() IS NOT NULL);

-- Storage Bucket für Bilder
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS images_public_read ON storage.objects;
DROP POLICY IF EXISTS images_admin_upload ON storage.objects;
DROP POLICY IF EXISTS images_admin_delete ON storage.objects;
CREATE POLICY images_public_read ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY images_admin_upload ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.uid() IS NOT NULL);
CREATE POLICY images_admin_delete ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.uid() IS NOT NULL);
