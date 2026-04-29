/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем индикатор в углу
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
  // Разрешаем загрузку картинок с внешних ресурсов
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      {
        protocol: 'https',
        hostname: '**.imgur.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;