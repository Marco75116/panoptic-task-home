# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## This is NOT the Next.js you know

This project uses **Next.js 16.2.4** with **React 19.2.4**. APIs, conventions, and file structure may differ from your training data — there are breaking changes. Before writing or modifying Next.js / React code, read the relevant guide in `node_modules/next/dist/docs/` and heed any deprecation notices.

## Runtime: always Bun

This repo uses **Bun as its runtime**. The `dev`, `build`, and `start` scripts run Next.js through `bun --bun` (forcing Bun instead of Node). Always use `bun` to run scripts and install packages — do not use `npm`, `pnpm`, or `yarn`, and do not strip the `--bun` flag from existing scripts.

## Commands

- `bun run dev` — start the local dev server (Bun runtime)
- `bun run build` — production build (Bun runtime)
- `bun start` — run the built app (Bun runtime)
- `bun run lint` — ESLint (flat config, extends `eslint-config-next/core-web-vitals` + `/typescript`)
- `bun install` — install dependencies

No test runner is configured.

## Architecture

- **App Router** project (`app/` directory). `app/layout.tsx` is the root layout (sets up Geist fonts and `globals.css`); `app/page.tsx` is the index route. Add new routes as folders under `app/`.
- **Tailwind CSS v4** is wired via `@tailwindcss/postcss` (see `postcss.config.mjs`). There is no `tailwind.config.*` — v4 is configuration-light and styles are imported through `app/globals.css`.
- **TypeScript** uses the `@/*` path alias mapped to the repo root (see `tsconfig.json`), so imports like `@/app/...` resolve from the project root.
- **Static assets** live in `public/` and are served from `/`.
- `.context/` is gitignored and used to share files with other agents in the Conductor workspace.
