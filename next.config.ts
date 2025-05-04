import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'm.media-amazon.com',
      'dynamic-media-cdn.tripadvisor.com',
      'media.istockphoto.com',
      'images.unsplash.com',
      'res.cloudinary.com'
    ],
  },
  // Disable any experimental CSS features
  experimental: {
    optimizeCss: false,
  },
  // Configure webpack to handle CSS properly
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
