import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://swiftconverterhub.com';

  // 1. Core Platform Pages
  const routes = [
    '',
    '/about',
    '/image',
    '/audio',
    '/video',
    '/file',
    '/data',
    '/character',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8, // Home page gets highest weight
  }));

  // 2. High-Traffic Image Studio Landing Routes
  const popularImageRoutes = [
    '/image/jpg-to-png',
    '/image/png-to-jpg',
    '/image/jpg-to-webp',
    '/image/png-to-webp',
    '/image/jpg-to-ico',
    '/image/heic-to-jpg',
    '/image/svg-to-png',
    '/image/webp-to-jpg',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...popularImageRoutes];
}
