import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [],
  },
  // Keep AI SDK as an external package so it's not bundled at build time
  // This prevents Turbopack from evaluating it during static page collection
  serverExternalPackages: ['@anthropic-ai/sdk'],
}

export default nextConfig
