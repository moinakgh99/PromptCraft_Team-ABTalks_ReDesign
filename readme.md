# ABTalks Redesign

> A premium, mobile-first redesign of **ABTalks**, a 60-day coding challenge platform for college students. Built for the **ABTalks Hackathon** with React, Tailwind CSS, Framer Motion, Zustand, and an Express REST API.

**Live Demo:** https://abtalks-redesign-sigma.vercel.app

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Tailwind%20CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-Node_22-339933?style=flat-square&logo=express&logoColor=white" />
</p>

<p align="center">
  <img alt="Mobile-first" src="https://img.shields.io/badge/design-mobile--first%20390px-6366f1?style=flat-square" />
  <img alt="Theme" src="https://img.shields.io/badge/theme-dark%20default-111827?style=flat-square" />
  <img alt="Vercel" src="https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-4f46e5?style=flat-square" />
</p>

---

## Overview

ABTalks is designed around a simple commitment:

> **Build something every day for 60 days — and prove it.**

Students choose a track, complete a daily coding challenge, and submit proof of work through a GitHub commit and LinkedIn post. The resulting consistency and portfolio of work help students build momentum and improve recruiter visibility.

This redesign focuses on a polished, mobile-first experience at a **390px viewport**, while also providing bonus recruiter and admin experiences.

---

## Screenshots

The ABTalks redesign is built mobile-first around a 390px viewport, with focused experiences for students, recruiters, and administrators.

### 🏠 Landing Page

The landing experience introduces the 60-day challenge, explains how it works, highlights available tracks, and guides students toward starting their journey.

![Landing](docs/screenshots/landing1.png)
![Landing](docs/screenshots/landing2.png)
![Landing](docs/screenshots/landing3.png)
![Landing](docs/screenshots/landing4.png)

### 📊 Student Dashboard

![ABTalks Student Dashboard](docs/screenshots/dashboard1.png)
![ABTalks Student Dashboard](docs/screenshots/dashboard2.png)

### 🚀 Challenge Day

![ABTalks Challenge Day](docs/screenshots/challenge1.png)
![ABTalks Challenge Day](docs/screenshots/challenge2.png)

---

## Beyond the Core Requirements

In addition to the required student-facing experience, we also implemented several out-of-scope features to extend the platform beyond the core hackathon brief.

### Bonus Experiences

- **Recruiter Dashboard** — discover and filter students, review consistency, recruiter visibility, achievements, and proof-of-work activity.
- **Admin Dashboard** — monitor challenge performance, students, submissions, at-risk users, content health, and gamification settings.
- **XP & Level System** — progression from Explorer → Builder → Creator → Architect → Legend.
- **Build Heatmap** — GitHub-style visualization of 60-day challenge progress.
- **AI Momentum Coach** — personalized progress insights based on mock student activity.
- **Daily Loot & Rewards** — randomized badges, themes, quotes, and other rewards.
- **Personal Dashboard Themes** — Dark, Cyber, Glass, Neon, and Minimal.
- **Leaderboard & Community Spotlight** — competitive and community-driven discovery features.

These features were implemented as additional product depth beyond the three required student routes and are available to explore in the live application.

---

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page introducing ABTalks to a first-time student |
| `/dashboard` | Student home: streak, today's task, progress, XP, achievements |
| `/day/:day` | Individual challenge with task details and proof-of-work submission |
| `/recruiter` | Recruiter-facing student discovery dashboard *(bonus)* |
| `/admin` | Internal challenge-management dashboard *(bonus)* |

---

## Core Experience

### Landing — `/`

- Hero with gradient headline and CTA
- Three-step "How It Works" section
- Trust and social-proof signals
- Coding-track preview
- Final CTA

### Dashboard — `/dashboard`

- Current streak, XP, level, and days completed
- Today's challenge with direct navigation
- Animated progress ring and XP bar
- GitHub-style 60-day build heatmap
- Recruiter Visibility Score
- AI Momentum Coach insight
- Journey timeline
- Achievements and badges

### Challenge Day — `/day/:day`

- Full task description and learning objectives
- Build checklist and step-by-step guidance
- GitHub repository URL
- GitHub commit URL
- LinkedIn post URL
- Animated submission confirmation
- XP breakdown
- AI Momentum Coach summary
- Daily reward reveal

---

## Key Features

- **XP & Level System** — Explorer → Builder → Creator → Architect → Legend
- **Streak Tracking** — active streaks, missed-day recovery, and streak-freeze tokens
- **Achievements & Badges** — unlocked from submission history
- **Build Heatmap** — GitHub-style 60-day contribution grid
- **AI Momentum Coach** — percentile, completion probability, next-day difficulty, and suggested coding time
- **Daily Reward Box** — XP bonuses, streak freezes, theme unlocks, and badges
- **Recruiter Visibility Score** — based on commit activity, LinkedIn activity, completion rate, and streak
- **Theme Switcher** — Dark, Cyber, Glass, Neon, and Minimal
- **Leaderboard & Community Spotlight**

The AI Momentum Coach uses templated/derived data and student statistics; **no external AI API is required**.

---

## Edge Cases

| State | Experience |
|---|---|
| First day / no streak | "Ignite your streak" state instead of empty statistics |
| Missed day | Supportive recovery messaging instead of a harsh reset |
| Empty profile | Guided setup for avatar, track, and bio |

---

## Tech Stack

### Frontend

- React 19
- Vite 8
- TypeScript
- Tailwind CSS v4
- React Router v7
- Framer Motion
- Zustand
- Recharts

### Backend

- Node.js 22
- Express
- TypeScript
- In-memory data store
- Static JSON seed data
- REST API

No production database is required by the challenge brief; the backend uses seeded in-memory data by design.

---

## Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── services/
│   │   ├── utils/
│   │   │   └── formulas.ts
│   │   ├── types/
│   │   └── data/
│   │       └── *.json
│   ├── tests/
│   └── package.json
│
├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   │   ├── api.ts
│   │   └── apiAdapter.ts
│   ├── data/
│   │   └── mock.ts
│   └── store/
│       └── index.ts
│
├── public/
├── docs/
│   └── screenshots/
├── index.html
├── vite.config.ts
└── package.json
```

> **Important:** The frontend is rooted at the repository root. There is no separate `frontend/` directory.

---

## Getting Started

### Prerequisites

- Node.js 22
- npm or pnpm

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

API:

```text
http://localhost:3001
```

### 2. Start the Frontend

Open a second terminal from the repository root:

```bash
npm install
npm run dev
```

Frontend:

```text
http://localhost:8443
```

### 3. Explore

Open the frontend and select one of the seeded students on the login screen.

> Both frontend and backend must be running for the complete end-to-end experience.

---

## API Configuration

The frontend currently uses:

```ts
// src/services/api.ts
export const API_BASE_URL = "http://localhost:3001/api";
```

There is currently no `VITE_API_URL` environment-variable wiring.

If the backend is deployed elsewhere, update the API base URL before deploying the frontend.

---

## Backend API

**Base URL:** `http://localhost:3001/api`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/student/:id` | Student profile, streak, recruiter score, rank |
| GET | `/challenges?studentId=` | All 60 challenges with lock state |
| GET | `/challenges/:day?studentId=` | Single challenge |
| POST | `/challenges/:day/submit` | Submit proof and receive XP/reward results |
| GET | `/student/:id/heatmap` | 60-day submission heatmap |
| GET | `/student/:id/achievements` | Achievement catalog and status |
| GET | `/leaderboard?sortBy=xp\|streak\|completion\|achievements` | Ranked students |
| GET | `/community/spotlight` | Top five students by XP |
| GET | `/student/:id/ai-coach` | AI Momentum Coach insight |
| POST | `/student/:id/profile` | Update avatar, bio, track, and theme |
| POST | `/student/:id/recover-streak` | Spend a streak-freeze token |
| POST | `/admin/reset` | Reset in-memory data |
| POST | `/admin/system-date` | Override server date for deterministic testing |

API responses use:

```json
{
  "success": true,
  "data": {}
}
```

or:

```json
{
  "success": false,
  "error": {
    "code": "...",
    "message": "..."
  }
}
```

---

## Seed Students

| ID | Name | State |
|---|---|---|
| `student-fresh` | Jordan Lee | Day 0, empty profile |
| `student-far` | Alex Mercer | 42 days completed, 14-day streak |
| `student-missed` | Taylor Vance | Missed a day; recovery available |
| `student-sarah` | Sarah Chen | 58-day streak; near graduation |
| `student-dev` | Devon Miller | 32 days completed, 28-day streak |
| `student-maya` | Maya Patel | 24 days completed, 20-day streak |

### Authentication

There is **no real authentication or user-account system**. The login screen simply lets users select a seeded student so the different product states can be explored without a production auth system.

---

## Deployment

### Frontend

**Live Demo:** https://abtalks-redesign-sigma.vercel.app

Recommended Vercel configuration:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: .
```

The frontend package lives at the repository root, so the Vercel Root Directory should remain blank or `.`.

### Backend

The Express backend uses a persistent `app.listen()` process and is **not deployable to Vercel as-is**.

For production, deploy the backend on a platform supporting long-running Node.js processes, such as Render, Railway, or Fly.io, then update the frontend API base URL.

---

## Known Limitations

- No real authentication or user accounts — intentionally omitted according to the challenge brief.
- No production database — seeded in-memory data is used.
- `API_BASE_URL` is currently hardcoded to `localhost:3001`.
- The backend requires a separate persistent Node.js deployment for production use.
- Recruiter and Admin are bonus routes beyond the three required student-facing routes.
- Recruiter and Admin do not have the same edge-case coverage as the core student flow.

---

## Hackathon Scope

### Required

- Landing page
- Student dashboard
- Daily challenge page
- GitHub + LinkedIn proof-of-work submission
- Mobile-first 390px experience
- Responsive UI
- Seeded/mock challenge data

### Bonus

- Recruiter dashboard
- Admin panel
- XP and level system
- Build heatmap
- Recruiter visibility score
- AI Momentum Coach
- Daily rewards
- Theme system
- Leaderboard
- Community spotlight

---

