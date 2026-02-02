import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
 /* config options here */
 typedRoutes: true,
 compiler: {
  removeConsole: process.env.NODE_ENV === 'production',
 },
 experimental: {
  globalNotFound: true,
 },
};

export default nextConfig;
