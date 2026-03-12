/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from any domain (for venue photos later)
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

module.exports = nextConfig;
