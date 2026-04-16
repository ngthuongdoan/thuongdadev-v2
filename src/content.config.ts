import { glob } from "astro/loaders";
import { z, reference, defineCollection } from "astro:content";

const articles = defineCollection({
    loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "./src/content/articles" }),
    schema: ({ image }) => z.object({
        cover: image(),
        coverAlt: z.string(),
        title: z.string(),
        slug: z.string(),
        snippet: z.string(),
        category: z.string(),
        pubDate: z.coerce.date(),
        readingDuration: z.number(),
        originalLink: z.string().url(),
        isDraft: z.boolean().default(false),
        updatedDate: z.coerce.date().optional(),
        author: z.string().default('Retro Rocket Team'),
        relatedArticles: z.array(reference('articles')).optional(),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "./src/content/projects" }),
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        category: z.enum(['main', 'side', 'opensource']),
        status: z.enum(['live', 'case-study', 'in-progress']).default('live'),
        role: z.string(),
        period: z.string(),
        image: z.string().startsWith("/uploads/"),
        links: z.array(z.object({
            label: z.string(),
            url: z.string().url(),
        })).default([]),
        stack: z.array(z.string()).default([]),
        metrics: z.array(z.string()).default([]),
        highlights: z.array(z.string()).default([]),
        order: z.number().optional(),
        thumbnail: z.string().startsWith("/uploads/thumbnails/"),
    }),
});

export const collections = { articles, projects };
