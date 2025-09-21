import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.performance = {
      maxAssetSize: 200 * 1024 * 1024, // 200 MB
    };
    return config;
  },

};

export default nextConfig;
