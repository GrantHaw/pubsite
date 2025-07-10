/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true }   // avoid Image-API in serverless Linux plan
};

export default nextConfig;
