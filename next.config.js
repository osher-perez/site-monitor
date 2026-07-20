/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api-backend/:path*',
        destination: 'https://site-monitor-backend.onrender.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;