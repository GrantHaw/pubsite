// cache the site photos in the browser for a day. next defaults public/ files to max-age=0,
// which makes every page load re-ask the server about every image
module.exports = {
  async headers() {
    const day = [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }]
    return [
      { source: '/y2k/:path*', headers: day },
      { source: '/projects/:path*', headers: day },
      { source: '/portraits/:path*', headers: day },
    ]
  },
}
