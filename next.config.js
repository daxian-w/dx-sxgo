/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  staticPageGenerationTimeout: 120,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 425, 768, 1024, 1280, 1536],
    imageSizes: [200, 300, 400, 600, 800, 1000],
    unoptimized: false,
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },

  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  output: 'standalone',
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
