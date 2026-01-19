import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Think Marketplace',
    short_name: 'Think',
    description: 'Discover apps, tools, and agents built on the Think protocol. A curated showcase of AI you own.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D0D0D',
    theme_color: '#58bed7',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['technology', 'productivity', 'ai'],
    lang: 'en',
    dir: 'ltr',
  }
}
