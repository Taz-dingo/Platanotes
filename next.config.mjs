/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable memory optimizations
    optimizeCss: true,
    // Increase memory limit for API routes
    serverComponentsExternalPackages: ['gray-matter', 'unified'],
  },
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      nodeEnv: 'production',
    }
    return config
  },
}

export default nextConfig;
