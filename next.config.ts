import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
 /* config options here */
 typedRoutes: true,
 experimental: {
  globalNotFound: true,
 },
};

export default nextConfig;
