import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push({
      '@magenta/music/es6/ddsp/add_reverb': 'commonjs @magenta/music/es6/ddsp/add_reverb'
    });
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  }
};

export default nextConfig;
