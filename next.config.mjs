/** @type {import('next').NextConfig} */
const nextConfig = {
  // keep static–export build so Azure doesn’t need a Node server
  output: 'export',

  // turn off the Image Optimization API (required for export mode)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
