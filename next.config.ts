import path from 'node:path'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  // Enable gzip compression for faster document delivery
  // Reduces initial HTML document size significantly (typically 70-80% reduction)
  compress: true,
  sassOptions: {
    includePaths: [path.resolve(import.meta.dirname, './src/core/styles')]
  },
  experimental: {
    inlineCss: process.env.NODE_ENV === 'production'
  },
  images: {
    // Cache optimized images for 1 year (Mux images are immutable by playback ID)
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.datocms-assets.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'image.mux.com'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/tracks/texas-motor-speedway',
        destination: '/tracks/g2-motorsports-park',
        permanent: true
      },
      { source: '/print-vouchers', destination: '/gift', permanent: true },
      {
        source: '/supercar-track-xperience',
        destination: '/driving-xperiences',
        permanent: true
      },
      {
        source: '/22813',
        destination:
          '/blog/the-porsche-gt3-rs-is-the-undisputed-king-of-the-racetrack',
        permanent: true
      },
      {
        source: '/25217',
        destination: '/blog/best-scenic-drives-near-phoenix',
        permanent: true
      },
      {
        source: '/racetrack-glossary',
        destination: '/blog/racetrack-glossary',
        permanent: true
      },
      {
        source: '/open-road-supercar-driving-tours',
        destination: '/open-road',
        permanent: true
      },
      {
        source: '/25853',
        destination: '/blog/the-legend-of-the-dodge-viper',
        permanent: true
      },
      { source: '/media/xxtv-video-image', destination: '/', permanent: true },
      {
        source: '/xx2018-tour-brochure',
        destination: '/events',
        permanent: true
      },
      { source: '/903', destination: '/events', permanent: true },
      {
        source:
          '/welcome-to-xtreme-xperience/xx18-holiday-early-bird-web-slider',
        destination: '/coupons',
        permanent: true
      },
      { source: '/2773', destination: '/events', permanent: true },
      {
        source: '/corvette-z06',
        destination: '/supercars/corvette-c8-z06',
        permanent: true
      },
      {
        source: '/tracks/pittsburgh-intl-race-complex',
        destination: '/events',
        permanent: true
      },
      {
        source: '/exotic-driving-experience-new-orleans',
        destination: '/tracks/nola-motorsports-park',
        permanent: true
      },
      {
        source: '/31714',
        destination:
          '/blog/lamborghini-temerario-first-drive-impressions-and-how-you-can-tame-the-bull-next',
        permanent: true
      },
      {
        source: '/17359/xx18-6th-anniversary-post-1200x630-2',
        destination: '/coupons',
        permanent: true
      },
      {
        source: '/porsche-911-gt3-rs',
        destination: '/supercars/porsche-911-gt3-992',
        permanent: true
      },
      { source: '/supercars-rent', destination: '/events', permanent: true },
      {
        source: '/24137',
        destination: '/blog/best-scenic-drives-near-atlanta',
        permanent: true
      },
      {
        source: '/18493',
        destination: '/tracks/suika-circuit',
        permanent: true
      },
      {
        source: '/17772/xx18-holiday-early-bird-lockup-2',
        destination: '/coupons',
        permanent: true
      },
      {
        source: '/open-road-half-day-tour',
        destination: '/open-road',
        permanent: true
      },
      { source: '/thank-contacting-us', destination: '/', permanent: true },
      {
        source: '/tracks/carolina-motorsports-park',
        destination: '/events',
        permanent: true
      },
      {
        source: '/email-signup-form',
        destination: '/coupons',
        permanent: true
      },
      {
        source: '/17750/xx18-holiday-sale-lockup',
        destination: '/coupons',
        permanent: true
      },
      {
        source: '/7907',
        destination: '/blog/9-facts-about-enzo-ferrari-you-never-knew',
        permanent: true
      },
      {
        source: '/22766',
        destination: '/blog/top-5-best-gifts-for-a-car-enthusiast',
        permanent: true
      },
      {
        source: '/tracks/monticello-motor-club',
        destination: '/events',
        permanent: true
      },
      {
        source: '/termsandconditions',
        destination: '/policies',
        permanent: true
      },
      { source: '/customer-reviews', destination: '/reviews', permanent: true },
      {
        source: '/6963',
        destination: '/blog/what-s-the-catch',
        permanent: true
      },
      {
        source: '/26113',
        destination: '/blog/vintage-car-driving-experience-why-not',
        permanent: true
      },
      {
        source: '/18068',
        destination: '/tracks/firebird-motorsports-park',
        permanent: true
      },
      {
        source: '/11124',
        destination: '/blog/top-5-best-gifts-for-a-car-enthusiast',
        permanent: true
      },
      {
        source: '/9886',
        destination: '/tracks/nola-motorsports-park',
        permanent: true
      },
      {
        source: '/9264',
        destination: '/supercars/lamborghini-huracan-lp610-4',
        permanent: true
      },
      { source: '/8977', destination: '/events', permanent: true },
      {
        source: '/travel/georgia/tail-of-the-dragon',
        destination: '/open-road',
        permanent: true
      },
      { source: '/18403', destination: '/events', permanent: true },
      {
        source: '/welcome-to-xtreme-xperience/xx18-black-friday-lockup',
        destination: '/coupons',
        permanent: true
      },
      {
        source: '/12127',
        destination: '/tracks/national-corvette-museum-motorsports-park',
        permanent: true
      },
      {
        source: '/thank-you-subscribing-nola',
        destination: '/events',
        permanent: true
      },
      {
        source: '/26681',
        destination: '/blog/washington-s-best-driving-roads',
        permanent: true
      },
      { source: '/4446', destination: '/events', permanent: true },
      {
        source:
          '/tracks/charlotte-motor-speedway/xxd-we-video-covers-learn-the-track-cms',
        destination: '/tracks/charlotte-motor-speedway',
        permanent: true
      },
      {
        source: '/30142',
        destination: '/blog/introducing-the-2025-chevy-corvette-zr1',
        permanent: true
      },
      {
        source: '/27898',
        destination:
          '/blog/preparing-for-your-first-xtreme-xperience-track-day',
        permanent: true
      },
      {
        source: '/5011',
        destination: '/tracks/autobahn-country-club',
        permanent: true
      },
      {
        source: '/9647',
        destination: '/tracks/old-bridge-township-raceway-park',
        permanent: true
      },
      { source: '/coupons/1-4', destination: '/coupons', permanent: true },
      {
        source: '/5265/xx18-gtr-specs-1080x1080-2',
        destination: '/supercars/nissan-gt-r',
        permanent: true
      },
      {
        source: '/collections/media',
        destination: '/add-ons',
        permanent: true
      },
      { source: '/5265', destination: '/supercars', permanent: true },
      {
        source: '/23681',
        destination: '/blog/nissan-gt-r-godzilla-is-still-king-of-the-monsters',
        permanent: true
      },
      { source: '/media', destination: '/add-ons', permanent: true },
      {
        source: '/31427',
        destination: '/blog/best-fathers-day-gift-idea-for-2026',
        permanent: true
      },
      {
        source: '/ferrari-296-gtb',
        destination: '/supercars/ferrari-296-gtb',
        permanent: true
      },
      {
        source: '/23616',
        destination: '/blog/why-do-i-love-driving-fast',
        permanent: true
      },
      { source: '/3418', destination: '/supercars', permanent: true },
      {
        source: '/22972',
        destination: '/blog/how-fast-can-i-go-on-a-racetrack',
        permanent: true
      },
      {
        source: '/tracks/firebird-motorsports-park/homestead-miami-google-map',
        destination: '/events',
        permanent: true
      }
    ]
  },
  async headers() {
    if (process.env.NODE_ENV !== 'production') {
      return []
    }
    return [
      {
        // Static assets generated by Next.js build (JS, CSS, fonts)
        // These have content hashes in filenames, so can be cached immutably
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Next.js optimized images
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Public folder assets (images, fonts, etc.)
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Font files
        source: '/:path*.woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/:path*.woff',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/:path*.ttf',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Image files in public folder
        source: '/:path*.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/:path*.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/:path*.jpeg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/:path*.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/:path*.avif',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/:path*.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
