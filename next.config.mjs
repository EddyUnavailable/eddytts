/** @type {import('next').NextConfig} */
const nextConfig = {};

export default {
  experimental: {
    serverActions: true,
  },
  env: {
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  },
};
