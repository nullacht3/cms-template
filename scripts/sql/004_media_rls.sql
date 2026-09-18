-- Migration 004: RLS-Policies für media-Tabelle
-- Bisher fehlten explizite Policies in den Migrations.
-- Verhalten: öffentlich lesbar (Bilder werden in Artikeln eingebunden),
--            schreiben/ändern/löschen nur für authentifizierte Nutzer.

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS media_public_read ON public.media;
DROP POLICY IF EXISTS media_admin       ON public.media;

CREATE POLICY media_public_read ON public.media
  FOR SELECT USING (true);

CREATE POLICY media_admin ON public.media
  FOR ALL USING (auth.uid() IS NOT NULL);
