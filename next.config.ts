import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
 /* config options here */
 typedRoutes: true,
 allowedDevOrigins: ['192.168.80.217', '127.0.0.1'],
 compiler: {
  removeConsole: process.env.NODE_ENV === 'production',
 },
 experimental: {
  globalNotFound: true,
 },
};

export default nextConfig;
