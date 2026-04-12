# Nikola Tesla Portfolio
Nikola Tesla Portfolio is an Astro template built with of course Astro 5.7, React 19 and TailwindCSS 4

![Nikola Tesla Astro Portfolio](/public/social-image.jpg "Nikola Tesla Portfolio")

## Getting Started
Clone Repository
```sh
git clone https://github.com/iann-mathaiya/nikola-tesla.git
```

Install Dependencies
```sh
pnpm install
```

Docker
```sh
cp .env.example .env
docker compose up --build
```

The Compose setup runs Astro in development mode with a bind-mounted workspace, so changes under `src/`, `public/`, and other repo files should hot reload inside the container. On Docker Desktop for Windows, file watching can be unreliable without polling, so the Compose file enables polling for you.

Development
```sh
pnpm run dev
```

Build
```sh
pnpm run build
```

Preview
```sh
pnpm run preview
```

Run Production Build In Docker
```sh
docker build -t thuongdadev .
docker run --rm -p 8080:8080 --env-file .env thuongdadev
```

The container runs the Astro Node standalone server on port `8080`. Set `GH_CLIENT_ID`, `GH_CLIENT_SECRET`, `GH_ALLOWED_USERS`, and `ORIGIN` in `.env` if you need the `/admin` OAuth flow.

## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
│   └── social-image.svg
├── src/
│   ├── actions/
│   │   └── # Astro server actions
│   ├── assets/
│   │   └── # Images that are transformed, optimized and bundled by Astro 
│   ├── components/
│   │   └── # Astro and React components
│   ├── layouts/
│   │   └── RootLayout.astro
│   └── pages/
│   │   └── blog/
│   │   │   └── index.astro
│   │   │   └── [...slug].astro
│   │   └── about.astro
│   │   └── contact.astro
│   │   └── index.astro
│   │   └── projects.astro
│   └── styles/
│   │   └── global.css
└── .gitignore
└── astro.config.mjs
└── package.json
└── tsconfig.json
```

## Deployment
The site is configured for deployment on Vercel, but with slight modifications it can be deployed to any hosting service.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## ⛔️ Changes
The template also uses [React Paper Shaders](https://github.com/paper-design/shaders). 
The Paper Team will be publishing [breaking changes](https://github.com/paper-design/shaders?tab=readme-ov-file#getting-started) to the Shaders library under 0.0.x versioning so check back to get updates when they release Paper Shaders v1.
