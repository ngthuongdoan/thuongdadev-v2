---
title: "Free Games Notifier: CI/CD-Driven Game Deal Automation"
description: "A side project that turns free-game discovery into an automated
  notification pipeline: scheduled GitHub Actions, SMTP delivery, GitHub Pages
  registration, repository_dispatch, and PR-based subscriber updates."
category: side
status: live
role: Node.js automation engineer, GitHub Actions workflow designer, CI/CD and
  registration-flow architect
period: "2026"
thumbnail: /uploads/thumbnails/free-games-notifier-hud-card.webp
image: /uploads/free-games-notifier-hud-card.webp
links:
  - label: GitHub
    url: https://github.com/ngthuongdoan/free-games-notifier
  - label: Case study
    url: https://thuongda.dev/blog/vi/free-games-notifier-ci-cd-side-project/
stack:
  - Node.js
  - GitHub Actions
  - GitHub Pages
  - Render
  - EJS
  - Nodemailer
  - repository_dispatch
  - Node test runner
metrics:
  - Scheduled notifier runs daily through GitHub Actions and can also be
    triggered manually
  - Dev and production notification paths are separated through
    workflow_dispatch inputs and mailing-list overrides
  - Subscriber registration is routed through repository_dispatch and converted
    into reviewable pull requests
highlights:
  - Uses GitHub Actions as the operational runtime, not just a build checker
  - Keeps SMTP credentials in GitHub Secrets while subscriber lists remain
    reviewable repository data
  - Includes GitHub Pages registration UI, Render-ready registration service, PR
    automation, retry handling, failure alerts, and focused tests
order: 3
---
## Why this is a side project

Free Games Notifier started from a small practical itch: I wanted a way to avoid missing free games and useful Steam discounts. Instead of leaving it as a local script, I treated it like a small production automation system.

The result is a side project that fetches free games from Epic Games Store, checks free and discounted games from Steam, renders email notifications, and sends them to subscriber lists. The visible product is simple. The engineering value is in how the whole thing runs without me opening a terminal every day.

## CI/CD as the core feature

The main workflow runs on a daily GitHub Actions schedule and supports manual `workflow_dispatch`. Manual runs can choose between production and development behavior, so I can test the notifier without spamming real subscribers.

That split matters. It shows the same discipline I would use in larger systems: one automation pipeline, clear environment selection, secrets separated from code, and operational behavior controlled through configuration instead of temporary edits.

## Registration flow

The project also includes a GitHub Pages registration UI. Because GitHub Pages cannot directly write to the repository, the registration flow uses a second hop:

- the static form submits email and Steam price cap data;
- a registration endpoint triggers `repository_dispatch`;
- GitHub Actions validates the payload;
- a script updates `src/data/email-lists.json`;
- the workflow opens a pull request for review.

That means subscriber changes are not silently written into the default branch. They become reviewable diffs with history, branch isolation, and a clear audit trail.

## What it demonstrates

This project is intentionally small, but it demonstrates practical CI/CD fluency:

- scheduled jobs with GitHub Actions;
- manual workflow inputs for dev/prod routing;
- GitHub Secrets for SMTP credentials;
- `repository_dispatch` for external event ingestion;
- automated pull request creation for data changes;
- GitHub Pages redeploy workflow;
- focused tests for subscriber normalization, price caps, email rendering, and registration upserts.

It is a good example of how I build side projects: solve a real personal problem, then use the project to practice the engineering habits that matter in real systems.
