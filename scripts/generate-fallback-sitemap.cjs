const fs = require("node:fs");
const path = require("node:path");

const baseUrl = "https://thuongda.dev";
const distClientDir = path.join(process.cwd(), "dist", "client");
const articlesDir = path.join(process.cwd(), "src", "content", "articles");

const routes = new Set(["/", "/blog", "/blog/vi", "/projects"]);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) return [fullPath];
    return [];
  });
}

for (const file of walk(articlesDir)) {
  const content = fs.readFileSync(file, "utf8");
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/);
  const slugMatch = frontmatter?.[1]?.match(/(?:^|\n)slug:\s*["']?([^\n"']+)["']?/);
  if (slugMatch?.[1]) {
    routes.add(`/blog/vi/${slugMatch[1].trim()}`);
  }
}

const now = new Date().toISOString();
const urls = [...routes]
  .sort()
  .map((route) => {
    const loc = `${baseUrl}${route === "/" ? "" : route}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`;
  })
  .join("\n");

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `${urls}\n` +
  `</urlset>\n`;

fs.mkdirSync(distClientDir, { recursive: true });
fs.writeFileSync(path.join(distClientDir, "sitemap.xml"), xml, "utf8");

console.log(`Generated fallback sitemap with ${routes.size} URLs.`);
