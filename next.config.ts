import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img2.baidu.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'grateful-parrot-418.eu-west-1.convex.cloud',
        port: ''
      }
    ]
  },
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true, // 跳过ts类型检查，打包继续执行
  }
};

export default nextConfig;
