/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Esto es vital para que GitHub Pages encuentre tus archivos
  basePath: '/TimeoutBCN', 
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
