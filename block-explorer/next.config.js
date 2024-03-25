/** @type {import('next').NextConfig} */


module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/block/:slug*",
        destination: "/blocks/:slug*",
        permanent: true,
      },
      {
        source: "/extrinsic/:slug*",
        destination: "/extrinsics/:slug*",
        permanent: true,
      },
      {
        source: "/address/:slug*",
        destination: "/addresses/:slug*",
        permanent: true,
      },
    ]
  },
}
