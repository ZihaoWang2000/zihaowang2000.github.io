/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '', // 如果用子路径部署则加
  trailingSlash: true,
};

module.exports = nextConfig;