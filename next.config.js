/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'userpic.codeforces.org',
      },
      {
        protocol: 'https',
        hostname: 'codeforces.org',
      },
      {
        protocol: 'https',
        hostname: 'st.codeforces.com',
      },
    ],
  },
}

module.exports = nextConfig