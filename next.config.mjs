/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 's0.wp.com' },
    ],
  },
};

export default nextConfig;
