/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['blglkqttwesxmtbczvxd.supabase.co'], // Supabase storage domain
    formats: ['image/avif', 'image/webp'],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Optimize production builds
  swcMinify: true,
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  // Configure redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ]
  },
  // Configure performance monitoring
  experimental: {
    instrumentationHook: true,
    optimizeCss: true,
  },
} 