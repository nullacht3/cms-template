// IndexNow benachrichtigt Bing, Yandex, Seznam usw. sofort über neue/geänderte URLs.
// Der Key ist absichtlich öffentlich: Er liegt als Datei unter /public/<key>.txt.
const INDEXNOW_KEY = 'fb15a316c0e54b04331a5c9640a26e43'
const HOST = 'deraesthet.de'

export async function submitToIndexNow(paths: string[]) {
  if (paths.length === 0) return
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList: paths.map((p) => `https://${HOST}${p}`),
    }),
  })
  return res.status
}
