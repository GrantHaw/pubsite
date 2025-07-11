/** @type {import('next').NextConfig} */
const nextConfig = {
  // produce a standalone server bundle
  output: 'standalone',
  // disable Next.js built-in image optimization (in serverless mode)
  images: {
    unoptimized: true
  }
};

export default nextConfig;
