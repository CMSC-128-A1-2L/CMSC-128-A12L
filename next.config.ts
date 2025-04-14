import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  /* this is typically not recommended, uncomment this if we want to build for deployment (this checks for unused imports, vars, etc.) */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

export default nextConfig;
