/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rns-metadata.fly.dev',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'nft.seekers.xyz',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'porkjet.b-cdn.net',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'theshillverse.com',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'salmon-cheerful-porcupine-365.mypinata.cloud',
        pathname: '**',
        port: '',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    CHAIN_ID: process.env.CHAIN_ID,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/block/:slug*',
        destination: '/blocks/:slug*',
        permanent: true,
      },
      {
        source: '/extrinsic/:slug*',
        destination: '/extrinsics/:slug*',
        permanent: true,
      },
      {
        source: '/address/:slug*',
        destination: '/addresses/:slug*',
        permanent: true,
      },
      {
        source: '/resources',
        destination: '/ecosystem',
        permanent: true,
      },
    ];
  },
};
