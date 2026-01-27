import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  // Get all blog posts
  const blogPosts = await getCollection('articles');
  
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: 'about', priority: '0.9', changefreq: 'monthly' },
    { url: 'contact', priority: '0.8', changefreq: 'monthly' },
    { url: 'projects', priority: '0.9', changefreq: 'weekly' },
    { url: 'blog', priority: '0.9', changefreq: 'daily' },
  ];

  // Add blog posts to sitemap
  const blogPages = blogPosts.map(post => ({
    url: `blog/${post.slug}`,
    priority: '0.7',
    changefreq: 'monthly'
  }));

  const allPages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${site}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
