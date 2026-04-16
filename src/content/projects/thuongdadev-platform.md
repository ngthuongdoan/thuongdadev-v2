---
title: "thuongdadev-v2: Portfolio Platform and Editorial Workflow"
description: "A production-minded personal portfolio built to present work with stronger technical context: Astro SSR, structured content, metadata strategy, and a GitHub-backed CMS workflow."
category: opensource
status: live
role: "Product design, frontend architecture, content modeling, and deployment setup"
period: "2026"
thumbnail: /uploads/thumbnails/fluid-propulsion.jpg
image: /uploads/fluid-propulsion.jpg
links:
  - label: Live site
    url: https://thuongda.dev
  - label: GitHub
    url: https://github.com/ngthuongdoan/thuongdadev-v2
stack:
  - Astro SSR
  - React
  - TypeScript
  - Tailwind CSS
  - Decap CMS
  - Docker
metrics:
  - Structured content model for both articles and project case studies
  - SEO foundation includes canonical URLs, Open Graph data, Twitter cards, and JSON-LD
  - GitHub OAuth flow keeps the content publishing surface behind an approved-user gate
highlights:
  - Reframed the site from a visual template into a sharper senior-engineering portfolio
  - Built content-driven project pages that can show stack, delivery role, and proof points
  - Kept the site easy to extend through markdown collections and a simple publishing workflow
order: 1
---
## Problem

The original site already looked polished, but the content still read like a starter template. That gap matters more than visual styling when the goal is to be evaluated as a senior software developer.

## What I changed

I treated the portfolio itself as a product artifact. The goal was not just to make pages look better, but to improve how work is presented:

- clearer positioning on the homepage
- richer project data instead of image-only cards
- more deliberate SEO and structured metadata
- a workflow that allows projects and writing to evolve without touching layout code every time

## Technical decisions

Astro SSR keeps the site fast and content-first while still letting me bring React in where interactivity is useful. Decap CMS adds a lightweight editorial workflow without turning the site into a heavyweight custom backend.

Docker support matters here because it keeps local setup and deployment closer together. Even for a portfolio, reproducible environments reduce drift and make the project easier to maintain.

## Why it matters

This project is intentionally public proof of how I think about engineering quality: structure, clarity, maintainability, and presentation all working together.
