# thuongdadev‑v2

**AI‑Augmented Engineering Case Study**

This repository is an ongoing case study into how an AI‑first workflow can transform modern software engineering.  
Jasper Doan uses a suite of AI agents—Codex, Devin, Copilot and bespoke prompt chains—to design, build and ship
production‑grade systems.  By treating AI agents as execution layers and pairing them with human‑in‑the‑loop quality
control, the portfolio shows how an engineer can move from typing every line of code to orchestrating autonomous
delivery and focusing on architecture, validation and strategic decisions.

## What this repo is for

* Showcase projects and articles with clear context, architecture diagrams and delivery signals.  
* Publish engineering notes and curated readings through a lightweight Decap CMS workflow.  
* Keep SEO metadata, structured data, content and deployment scripts in a single place.  
* Treat the portfolio itself as a product artifact that evolves through AI‑powered tooling rather than a static
  landing page.

## Badges

<!-- These badges will show the status of the CI and deployment workflows on the master branch. -->
![Quality CI](https://img.shields.io/github/actions/workflow/status/ngthuongdoan/thuongdadev-v2/ci.yml?branch=master)
![Deploy](https://img.shields.io/github/actions/workflow/status/ngthuongdoan/thuongdadev-v2/deploy.yml?branch=master)
![License](https://img.shields.io/github/license/ngthuongdoan/thuongdadev-v2)

## Stack

* **Astro 6 + React 18 + Tailwind CSS 4 + TypeScript 5** – modern, component‑driven UI with server‑side rendering.  
* **AI tooling:** Codex, Devin, Copilot and custom prompt orchestration for multi‑agent workflows.  
* **Decap CMS with GitHub OAuth** – a Git‑backed editorial workflow for articles and project case studies.  
* **Docker multi‑stage builds** – deterministic builds for both local development and production runtime.  
* **GitHub Actions** – separate workflows for quality checks (`ci.yml`) and production deployment (`deploy.yml`).

## Architecture Notes

* `src/pages` – public routes for home, about, projects, blog and contact.  
* `src/content` – markdown‑driven articles and projects; these are the primary data source for the site.  
* `src/layouts/RootLayout.astro` – centralises SEO metadata, JSON‑LD schemas and social sharing tags.  
* `public/admin` – Decap CMS configuration and admin shell.  
* `src/pages/api/oauth/*` – handles the GitHub OAuth flow for the CMS; access is restricted to whitelisted users and
  scopes are kept minimal (`public_repo,read:user`).  
* `.github/workflows/ci.yml` – runs type‑checking and tests on every push; fails fast on dependency drift.  
* `.github/workflows/deploy.yml` – builds the site, validates the sitemap and deploys to a VPS on pushes to `master`.

## Local Development

Clone the repository and install dependencies:

```sh
git clone git@github.com:ngthuongdoan/thuongdadev-v2.git
cd thuongdadev-v2
pnpm install
```

Start the development server:

```sh
pnpm run dev
```

Create a production build:

```sh
pnpm run build
```

Preview the production build locally:

```sh
pnpm run preview
```

## Docker

To run in a containerised environment, copy the example environment variables and spin up the stack:

```sh
cp .env.example .env
docker compose up --build
```

The compose file runs Astro in development mode with a bind‑mounted workspace, so changes under `src/`, `public/` and
other repo files hot‑reload inside the container.  For production, build and run the standalone image:

```sh
docker build -t thuongdadev .
docker run --rm -p 8080:8080 --env-file .env thuongdadev
```

The Node server listens on port `8080` by default.

## CMS and Environment Variables

If you want to use `/admin` for the CMS, set the following values in `.env` (see `.env.example`):

* `GH_CLIENT_ID` – your GitHub OAuth client ID.  
* `GH_CLIENT_SECRET` – your GitHub OAuth client secret.  
* `GH_ALLOWED_USERS` – a comma‑separated list of GitHub usernames allowed to access the CMS.  
* `ORIGIN` – the base URL of your deployment (e.g. `https://thuongda.dev`).

The OAuth flow requests only the minimal scopes required (`public_repo,read:user`) and rejects users not listed in
`GH_ALLOWED_USERS`.  See `src/pages/api/oauth/auth.ts` and `src/pages/api/oauth/callback.ts` for details.

## Deployment

The site is configured for Astro’s Node adapter.  `.github/workflows/deploy.yml` builds the project, checks for a
sitemap and then uploads artefacts to a VPS via SSH.  The deployment uses Node 22 in both CI and runtime to avoid
environment mismatch.  See the workflow file for details on the deployment steps and environment variables.

## License

This project is licensed under the MIT License.  See [LICENSE](LICENSE) for details.