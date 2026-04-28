import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  // Collect all non‑draft blog posts
  const blogPosts = await getCollection('articles', ({ data }) => !data.isDraft);

  // Define static pages with realistic last modified dates (build time)
  const nowIso = new Date().toISOString();
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly', lastmod: nowIso },
    { url: 'about', priority: '0.9', changefreq: 'monthly', lastmod: nowIso },
    { url: 'contact', priority: '0.8', changefreq: 'monthly', lastmod: nowIso },
    { url: 'projects', priority: '0.9', changefreq: 'weekly', lastmod: nowIso },
    { url: 'blog/vi', priority: '0.9', changefreq: 'daily', lastmod: nowIso },
  ];

  // Map blog posts to sitemap entries.  Use updatedDate if present, otherwise pubDate.
  const blogPages = blogPosts.map((post) => {
    const lastmod = post.data.updatedDate ?? post.data.pubDate;
    return {
      url: `blog/vi/${post.data.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod,
    };
  });

  const allPages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map((page) => {
    const iso = new Date(page.lastmod).toISOString();
    return `  <url>
    <loc>${site}/${page.url}</loc>
    <lastmod>${iso}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};