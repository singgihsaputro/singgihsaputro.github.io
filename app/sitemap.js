export const dynamic = 'force-static'

export default function sitemap() {
  // Date only. The page does not change often enough for a timestamp to mean
  // anything, and it keeps lastmod to the plain W3C form crawlers like best.
  return [
    {
      url: 'https://singgihsaputro.github.io/',
      lastModified: new Date().toISOString().slice(0, 10),
    },
  ]
}
