# AGENTS.md

Simple guide for AI agents working in this repository.

## Priorities

1. Follow user instructions first.
2. Use `DESIGN.md` if present for product direction.
3. Preserve the "Singularity Horizon" cinematic space-portfolio direction unless the user asks to change it.
4. Prefer simple, reviewable changes.

## Project Context

- This is an Astro + React + Tailwind + TypeScript site.
- The UI may be redesigned completely, so do not preserve old visual patterns unless the user asks.
- The intended product is a high-fidelity portfolio for Jasper Doan with a cinematic deep-space / orbital HUD identity.
- Main routes live in `src/pages`.
- Shared layout lives in `src/layouts`.
- Reusable UI lives in `src/components`.
- Content lives in `src/content`.

## UI Design Mindset

- Design toward "Singularity Horizon": a professional, cinematic, technically impressive portfolio with strong Interstellar-inspired atmosphere.
- Favor immersive spaceship-HUD interactions over generic portfolio layouts.
- Default visual language: deep-space surfaces, purple/amethyst glow accents, glassmorphism, nebula or starfield depth, and precise technical framing.
- Prefer bold, intentional compositions with strong scale, negative space, and layered lighting instead of flat or conventional SaaS UI patterns.
- Typography should generally center on `Sora` for interface and marketing copy. Terminal-like blog or log interfaces may introduce monospace text where appropriate.
- The homepage should feel like "Mission Control": high-impact hero, cockpit-style navigation, technical competency readouts, timeline storytelling, and project access points.
- Project/archive surfaces should feel like mission dossiers or technical schematics, not simple blog cards.
- Blog/log surfaces can lean into terminal or command-line metaphors, but still belong to the same polished cinematic system.
- Motion should feel purposeful and atmospheric. Prefer parallax, scroll-driven reveals, HUD feedback, and celestial ambience over decorative animation noise.
- Every major UI decision should reinforce professional seniority, immersion, and continuity across pages.

## Working Rules

- Feel free to replace existing UI patterns during redesign work.
- Keep code clean, readable, and easy to extend.
- Avoid changing unrelated content or infrastructure unless needed for the task.
- Keep SEO, accessibility, and routing intact unless the user asks to change them.
- Keep the experience responsive; desktop should feel cinematic without making mobile feel cramped or stripped down.
- Use glass panels, glow, blur, and layered backgrounds carefully so the interface stays legible and performant.
- When choosing between novelty and clarity, keep the atmosphere but do not sacrifice usability or content comprehension.
- Prefer reusable design primitives and shared tokens over one-off styling.

## Visual Guardrails

- Primary accent color should align with the amethyst direction around `#8B5CF6`.
- Backgrounds and surfaces should stay in deep-space navy/black families rather than light themes unless the user requests otherwise.
- Top-level navigation should favor a fixed glassmorphic HUD approach over traditional sidebars when redesigning global chrome.
- Imagery and effects should suggest celestial scale: black holes, accretion-disk energy, starfields, supernova haze, orbital grids, or instrument-panel overlays.
- Avoid fake technical jargon, meaningless dashboard widgets, or decorative sci-fi elements that do not support actual portfolio content.

## Content Notes

- Project and article markdown must stay compatible with `src/content.config.ts`.
- Do not invent fake project facts, links, or metrics.
- Keep portfolio copy grounded in real experience even when the surrounding presentation is cinematic.

## Decap CMS Blog Integration

- This repo already uses Decap CMS for blog and project content. Treat the blog as a CMS-backed surface, not a hardcoded marketing page.
- Blog articles are sourced from `src/content/articles` and must remain compatible with the `articles` collection schema in `src/content.config.ts`.
- When redesigning blog index or article pages, preserve support for these article fields: `title`, `slug`, `snippet`, `category`, `pubDate`, `readingDuration`, `author`, `cover`, `coverAlt`, `originalLink`, `isDraft`, `updatedDate`, and optional `relatedArticles`.
- Do not rename, remove, or reinterpret article frontmatter fields unless the Decap config and Astro content schema are updated together.
- Keep `/admin` and `public/admin/config.yml` in mind when changing blog UX. If the blog information architecture changes, verify the Decap collection config and preview path still make sense.
- Uploaded CMS media lives under `public/uploads` and should stay directly renderable from `/uploads/...`.
- Blog pages should continue to handle draft content safely. Public blog listings and sitemap behavior must not expose posts marked `isDraft: true`.
- Preserve stable article URLs based on `slug`. Avoid route changes that would break existing CMS entries or preview behavior without adding redirects.
- If you create a terminal-style "System Logs" blog UI, keep the presentation layer cinematic but ensure article content remains readable in long-form, code blocks remain legible, and standard markdown content still renders correctly.
- Treat `originalLink` as meaningful editorial metadata for curated readings; do not hide or discard it in article templates if the design can surface it usefully.
- Before changing blog content modeling, also inspect `public/admin/cms.js`, `public/admin/preview.css`, and the blog routes under `src/pages/blog` so the authoring preview and live site stay aligned.

## Commands

- `pnpm dev`
- `pnpm check`
- `pnpm build`

## Done Criteria

For substantial changes, run:

1. `pnpm check`
2. `pnpm build`

If a command cannot run, say so clearly in the handoff.
