# ABTalks Redesign

A premium, mobile-first redesign of ABTalks — a platform that runs a 60-day coding challenge for students. Built for the ABTalks Hackathon with React, Tailwind CSS, Framer Motion, and a real Express backend.

**Live demo:** [abtalks-redesign-sigma.vercel.app](https://abtalks-redesign-sigma.vercel.app)

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-Node_22-339933?style=flat-square&logo=express&logoColor=white" />
</p>
<p align="center">
  <img alt="Mobile-first" src="https://img.shields.io/badge/design-mobile--first%20390px-6366f1?style=flat-square" />
  <img alt="Theme" src="https://img.shields.io/badge/theme-dark%20default-111827?style=flat-square" />
  <img alt="Deployed on Vercel" src="https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-4f46e5?style=flat-square" />
</p>

---

## Screenshots

All three required routes, captured at the 390px mobile viewport.

| Landing (`/`) | Dashboard (`/dashboard`) | Challenge Day (`/day/12`) |
|---|---|---|
| ![Landing page](docs/screenshots/landing.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Challenge day](docs/screenshots/day-12.png) |

<details>
<summary>How to (re)capture these</summary>

1. Run the app locally (see [Getting Started](#getting-started)) or open the [live demo](https://abtalks-redesign-sigma.vercel.app).
2. Open Chrome DevTools → toggle device toolbar → set viewport to **390 × 844** (iPhone 12/13/14 preset is close enough).
3. Log in as `student-far` (or any seed student — see [Seed Students](#seed-students)) so the Dashboard and Day 12 routes aren't stuck on the login screen.
4. Capture each route:
   - `/` — landing page, scrolled to top
   - `/dashboard`
   - `/day/12`
5. Save as PNG into `docs/screenshots/` using the exact filenames above (`landing.png`, `dashboard.png`, `day-12.png`) so the table renders without edits.

</details>

---

## Table of Contents

- [What This Is](#what-this-is)
- [Screenshots](#screenshots)
- [Core Screens](#core-screens)
- [Features](#features)
- [Edge Cases Handled](#edge-cases-handled)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Backend API Reference](#backend-api-reference)
- [Seed Students](#seed-students)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)

---

## What This Is

ABTalks runs a 60-day coding challenge for college students. Every day, a student picks a track, builds something, and proves it with a **GitHub commit** and a **LinkedIn post** — that proof of work is what keeps their streak alive and makes them visible to recruiters.

This redesign focuses on three required, mobile-first (390px) screens:

| Route | Purpose |
|---|---|
| `/` | Landing page — introduces ABTalks to a student who's never heard of it |
| `/dashboard` | Student's home screen — streak, today's task, progress, XP, achievements |
| `/day/:day` | A single challenge day — read the task, submit proof of work |

Two additional screens (`/recruiter`, `/admin`) were built as bonus scope beyond the core brief.

---

## Core Screens

### 1. Landing (`/`)
Hero section, "how it works" walkthrough, track preview (Fullstack Web / AI & Machine Learning / Systems & Cloud / Mobile & Cross-Platform), trust signals, and a clear call to action — designed to build enough confidence for a first-time visitor to commit to 60 days.

### 2. Dashboard (`/dashboard`)
The student's home base after logging in:
- Current streak, XP, level, and days completed
- Today's challenge with a direct link to start it
- Circular progress ring + XP bar with animated fills
- GitHub-style build heatmap
- Recruiter visibility meter
- AI Momentum Coach insight card
- Journey timeline and achievements

### 3. Challenge Day (`/day/:day`)
- Full task description, learning objectives, and build checklist
- Step-by-step "how to complete this" walkthrough
- Submission form (GitHub repo URL, GitHub commit URL, LinkedIn post URL)
- Animated success state with XP breakdown, AI coach summary, and any daily reward unlocked

---

## Features

- **XP & Level System** — Explorer → Builder → Creator → Architect → Legend, driven by real XP thresholds calculated server-side
- **Streak tracking** — including streak-freeze tokens to recover a missed day
- **Achievements & badges** — unlocked based on real submission history
- **Build Heatmap** — GitHub-contribution-style grid of the last 60 days
- **AI Momentum Coach** — post-submission summary (percentile, completion probability, next-day difficulty, suggested coding time) generated from templated pools + the student's real stats — no external AI call, by design
- **Daily Reward Box** — weighted-random reward (XP bonus, streak freeze, theme unlock, badge) on each submission
- **Recruiter Visibility Score** — computed from commit activity, LinkedIn posts, completion rate, and streak
- **Theme switcher** — Dark / Cyber / Glass / Neon / Minimal, applied via CSS variables
- **Leaderboard & Community Spotlight**

---

## Edge Cases Handled

- **First-day / no streak yet** — brand-new student sees an "ignite your streak" state instead of empty stat blocks
- **Missed a day** — supportive "you missed yesterday, restart today" messaging instead of a harsh streak-reset; a streak-freeze token can recover it
- **Empty profile** — guided setup prompts (avatar, track, bio) instead of blank fields

---

## Tech Stack

**Frontend**
- React 19 + Vite 8
- Tailwind CSS v4
- React Router v7
- Framer Motion (animation)
- Zustand (client state)
- Recharts (charts)

**Backend**
- Node 22 + Express
- TypeScript
- In-memory data store seeded from static JSON (no database — mocked by design)

---

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── server.ts          # Express app + all route handlers
│   │   ├── services/          # Business logic (ABTalksService, in-memory store)
│   │   ├── utils/formulas.ts  # XP, streak, level, recruiter-score calculations
│   │   ├── types/             # Shared TypeScript types
│   │   └── data/*.json        # Seed data: students, challenges, achievements, rewards
│   ├── tests/
│   └── package.json
├── src/                        # Frontend (Vite root)
│   ├── pages/                  # Landing, Login, Dashboard, DayChallenge, Recruiter, Admin
│   ├── components/              # Nav, ProtectedRoute, ThemeInitializer, etc.
│   ├── services/
│   │   ├── api.ts               # Typed fetch client against the backend
│   │   └── apiAdapter.ts        # Maps backend responses into frontend view models
│   ├── data/mock.ts             # Fallback/legacy mock data
│   └── store/index.ts           # Zustand store (auth, theme)
├── public/
├── index.html
├── vite.config.ts
└── package.json                 # Frontend root package.json (Vite build lives here)
```

> The frontend `package.json` lives at the **repo root** — `src/`, `index.html`, and `vite.config.ts` are not nested inside a `frontend/` folder. Keep this in mind when configuring any deploy platform's Root Directory (see [Deployment](#deployment)).

---

## Getting Started

### Prerequisites
- Node.js 22 (pinned in `.mise.toml`)
- npm (or pnpm — both lockfiles are present)

### 1. Install and run the backend

```bash
cd backend
npm install
npm run dev
```

This starts the API on **http://localhost:3001** (`tsx watch`, hot-reloads on save).

### 2. Install and run the frontend

In a separate terminal, from the repo root:

```bash
npm install
npm run dev
```

This starts Vite on **http://localhost:8443** (or whatever `PORT` is set to).

> Both must be running at the same time for the app to work end-to-end — the frontend calls the backend directly over HTTP, there's no proxy layer.

### 3. Open the app
Visit the frontend URL, pick a student on the login screen, and explore.

---

## Environment Variables

The frontend currently points at the backend via a **hardcoded** constant:

```ts
// src/services/api.ts
export const API_BASE_URL = "http://localhost:3001/api";
```

There's no `.env` / `VITE_API_URL` wiring yet — if you deploy the backend somewhere other than `localhost:3001`, update this constant (or introduce an env var) before deploying the frontend, or every API call will fail in production.

---

## Backend API Reference

Base URL: `http://localhost:3001/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/student/:id` | Full student profile, streak state, recruiter score, leaderboard rank |
| GET | `/challenges?studentId=` | All 60 challenge days, with lock state relative to the student |
| GET | `/challenges/:day?studentId=` | Single challenge day |
| POST | `/challenges/:day/submit` | Submit proof of work — returns XP earned, level change, achievements, reward, AI coach insight |
| GET | `/student/:id/heatmap` | 60-day submission heatmap |
| GET | `/student/:id/achievements` | Achievement catalog with unlock status |
| GET | `/leaderboard?sortBy=xp\|streak\|completion\|achievements` | Ranked student list |
| GET | `/community/spotlight` | Top 5 students by XP |
| GET | `/student/:id/ai-coach` | AI Momentum Coach insight |
| POST | `/student/:id/profile` | Update avatar / bio / track / theme |
| POST | `/student/:id/recover-streak` | Spend a streak-freeze token to recover a missed day |
| POST | `/admin/reset` | Reset all in-memory data back to the seed |
| POST | `/admin/system-date` | Override the server's "current date" — useful for deterministically testing streak/missed-day states without waiting a real day |

All responses are wrapped as `{ success: true, data }` or `{ success: false, error: { code, message } }`.

---

## Seed Students

The backend ships with 6 pre-seeded students, each covering a different state on purpose:

| ID | Name | Notes |
|---|---|---|
| `student-fresh` | Jordan Lee | Day 0, empty profile — first-time state |
| `student-far` | Alex Mercer | 42 days in, 14-day streak, on track |
| `student-missed` | Taylor Vance | Missed a day — streak recovery available |
| `student-sarah` | Sarah Chen | 58-day streak, near graduation |
| `student-dev` | Devon Miller | 32 days in, 28-day streak |
| `student-maya` | Maya Patel | 24 days in, 20-day streak |

There's no real authentication — the login screen just lets you pick one of these to view.

---

## Deployment

- **Frontend** is deployed on Vercel: [abtalks-redesign-sigma.vercel.app](https://abtalks-redesign-sigma.vercel.app)
- Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
- **Root Directory matters:** the frontend's `package.json` lives at the repo root, not inside a `frontend/` subfolder. If your Vercel project's Root Directory setting is anything other than blank/`.`, the build will fail immediately before installing dependencies.
- **Backend** needs to run as a persistent Node process (`node dist/server.js` after `npm run build`) — it's a plain Express app using `app.listen()`, not a set of serverless functions, so it is **not** deployable to Vercel as-is. Use a platform that runs long-lived processes (Render, Railway, Fly.io, etc.), and update `API_BASE_URL` in the frontend to point at wherever it ends up.

---

## Known Limitations

- No real authentication, real user accounts, or production database — by design, per the challenge brief (mocked data is sufficient).
- `API_BASE_URL` is hardcoded rather than environment-driven — see [Environment Variables](#environment-variables).
- The Recruiter and Admin panels are bonus scope beyond the required three routes and are not covered by the same edge-case guarantees as the student-facing flow.
