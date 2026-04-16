# thuongdadev-v2

Jasper Doan is an AI Engineer. This portfolio represents an AI-augmented approach to modern software engineering: autonomous implementation, structured system design, and high-velocity delivery with human-in-the-loop quality control.

## What this repo is for

- Present AI-augmented engineering work with clearer project context, architecture, and delivery signals
- Publish articles and project entries through a lightweight editorial workflow
- Keep SEO, structured metadata, and deployment concerns inside the same codebase
- Treat the portfolio itself as a product artifact, not just a static landing page

## Stack

- Astro 6
- React 18
- TypeScript 5
- Tailwind CSS 4
- Decap CMS with GitHub OAuth
- Docker multi-stage builds

## Architecture Notes

- `src/pages` contains the public routes for home, about, projects, contact, and blog
- `src/content` stores markdown-driven article and project entries
- `src/layouts/RootLayout.astro` centralizes metadata, structured data, and social sharing tags
- `public/admin` contains the Decap CMS configuration and admin shell
- `src/pages/api/oauth/*` handles the GitHub OAuth flow for the CMS

## Local Development

Clone the repository:

```sh
git clone git@github.com:ngthuongdoan/thuongdadev-v2.git
cd thuongdadev-v2
```

Install dependencies:

```sh
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

Start the containerized development workflow:

```sh
cp .env.example .env
docker compose up --build
```

The compose setup runs Astro in development mode with a bind-mounted workspace, so edits under `src/`, `public/`, and other repo files hot reload inside the container. Polling is enabled for Docker Desktop environments where file watching is less reliable.

Build and run the production image:

```sh
docker build -t thuongdadev .
docker run --rm -p 8080:8080 --env-file .env thuongdadev
```

The standalone Node server listens on port `8080`.

## CMS and Environment Variables

If you want to use `/admin`, set the following values in `.env`:

- `GH_CLIENT_ID`
- `GH_CLIENT_SECRET`
- `GH_ALLOWED_USERS`
- `ORIGIN`

The CMS is configured for a GitHub editorial workflow, so access should stay limited to approved GitHub users.

## Project Structure

```text
/
├── public/
│   ├── admin/
│   ├── uploads/
│   └── favicon.svg
├── src/
│   ├── actions/
│   ├── components/
│   ├── content/
│   │   ├── articles/
│   │   └── projects/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
├── Dockerfile
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## Deployment

The site is configured for Astro's Node adapter, so it can be deployed anywhere that supports a Node server. The current setup is friendly to Vercel, Dockerized environments, or custom Node hosting.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
