/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,

  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    // Remove unoptimized: true to enable optimization
  },

  // Enable experimental features for better performance
  experimental: {
    // Enable optimizePackageImports for better tree shaking
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },

  // Build optimizations
  typescript: {
    // Remove ignoreBuildErrors for better type safety
    // ignoreBuildErrors: true,
  },

  // Bundle analyzer (uncomment to analyze bundle size)
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   if (!dev && !isServer) {
  //     config.plugins.push(
  //       new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
  //         analyzerMode: 'static',
  //         openAnalyzer: false,
  //       })
  //     )
  //   }
  //   return config
  // },
}

export default nextConfig
