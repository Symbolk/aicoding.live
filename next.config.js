/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cursor.sh',
      },
      {
        protocol: 'https',
        hostname: 'www.appengine.ai',
      },
      {
        protocol: 'https',
        hostname: '10web.io',
      },
      {
        protocol: 'https',
        hostname: 'www.motiff.cn',
      },
      {
        protocol: 'https',
        hostname: 'www.klingai.com',
      },
      {
        protocol: 'https',
        hostname: 'v0.dev',
      },
    ],
  },
}

module.exports = nextConfig 