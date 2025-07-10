/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {                // disable Next’s image optimiser (not available in export mode)
    unoptimized: true
  }
};
export default nextConfig;
