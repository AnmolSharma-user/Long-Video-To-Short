import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icons/icon.svg',
        permanent: true,
      },
      {
        source: '/favicon-:size.png',
        destination: '/icons/icon.svg',
        permanent: true,
      },
      {
        source: '/apple-touch-icon.png',
        destination: '/icons/apple-touch-icon.svg',
        permanent: true,
      },
      {
        source: '/apple-touch-icon-:size.png',
        destination: '/icons/apple-touch-icon.svg',
        permanent: true,
      },
    ];
  },
  images: {
    domains: [
      'localhost',
      'firebasestorage.googleapis.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '2mb'
    },
    serverComponentsExternalPackages: ['sharp', 'ffmpeg-static'],
  },
  webpack(config) {
    // SVG Support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;