# ABTalks Redesign — Figma Make AI Usage Log

> This document records the Figma Make prompts provided for the ABTalks Redesign hackathon project.
>
> The prompt text below is preserved from the content supplied for this log.

---

## Prompt 01 — Initial ABTalks Frontend + Feature Implementation

### Exact Prompt

> You are building the frontend for "ABTalks Redesign" — a mobile-first (390px) redesign of a 60-day coding challenge platform for Indian college students. Students pick a track, build something daily, and prove it via a GitHub commit + LinkedIn post to maintain a streak.
>
> === REQUIRED ROUTES (official submission — keep this exact order) ===
>
> 1. "/" — Landing page for a student who has never heard of ABTalks. Must build trust, clarity, and motivation to commit to 60 days. Sections: Hero with gradient headline + CTA, "How it works" (3 steps), social proof / trust strip, track selection preview, final CTA.
> 2. "/dashboard" — Home screen after login. Must show: current streak, today's task, progress through the 60 days, overall completion %, standing/achievements, and XP/level.
> 3. "/day/12" — Single challenge day view. Student must be able to: read the day's task, understand what to build, and submit proof of work (GitHub link + LinkedIn link) with a submission confirmation state.
>
> === BONUS ROUTES (out-of-scope per the brief, but included as extra value) ===
>
> 4. "/recruiter" — Recruiter-facing view of students.
> 5. "/admin" — Internal admin/ops view for the team running the challenge.
>
> Note: authentication and a production database are explicitly NOT required by the brief — everything must work on mocked data only, no real login flow.
>
> === DESIGN SYSTEM (applies to every route) ===
>
> - Colors: background #050816, cards #111827, primary #6366F1, secondary #06B6D4, success #22C55E, warning #F59E0B, danger #EF4444.
> - Fonts: Space Grotesk (headings) + Inter (body).
> - Mobile-first at 390px for routes 1–3; routes 4–5 can be desktop-first but must stay responsive.
> - Heavy use of micro-interactions: hover states, button glow, scroll-reveal, card hover lift, animated progress fills.
>
> === ANIMATION REQUIREMENTS ===
>
> - Landing: hero reveal, floating gradient blobs, gradient text, scroll-triggered reveals, button glow, subtle parallax.
> - Dashboard: CountUp numbers, circular progress rings, XP bar fill animation, confetti burst on day completion, card hover lift.
> - Day page: step-by-step reveal, upload/submit animation, success animation, progress fill, floating submit CTA on mobile.
> - Recruiter/Admin: chart entrance animations, drawer/modal slide-ins, toast confirmations for actions.
>
> === CORE STUDENT-FACING FEATURES (build all 10) ===
>
> 1. AI Momentum Coach — after submission, instead of a plain "Success" message, show a fake AI-style summary card: consistency score %, "ahead of X% of students," completion probability, next day's difficulty, suggested coding time. Values randomized/derived from mock JSON — no real AI call.
> 2. Build Heatmap — GitHub-style contribution grid for the 60 days, color-coded green/orange/red by completion status.
> 3. XP System — completing a day grants XP with a bonus breakdown (consistency bonus, night-owl bonus, perfect-submission bonus) and a level label (Explorer → Builder → Creator → Architect → Legend).
> 4. Daily Loot Box — after each completed day, an animated reveal unlocking a random reward (badge, quote, avatar, or theme) from mock data.
> 5. Recruiter Visibility Meter — a progress meter framed as "recruiter visibility %" instead of a raw post count, with a "X more posts to reach Top Visibility" nudge.
> 6. Smart Reminder — a card showing a mock "usual submission time" vs "best time to continue tonight," generated from mock data.
> 7. Journey Timeline — animated timeline showing progress stages (Start → Builder → 50% → Almost There → Graduation).
> 8. Personal Dashboard Theme — a theme switcher (Dark / Cyber / Glass / Neon / Minimal) that restyles the dashboard via CSS variables/Tailwind theme tokens.
> 9. Daily Motivation Card — a card with a day-specific motivational stat/quote, rotating from mock data.
> 10. Future Self (signature feature) — an emotional animated "60 days later" preview: checklist of GitHub commits, LinkedIn presence, portfolio, interview-readiness — revealed with scroll/step animation.
>
> === REQUIRED EDGE CASES (student-facing) ===
>
> - First day / no streak yet → "ignite your streak" empty state instead of 0s.
> - Missed day → supportive "you missed yesterday, restart today" state instead of a harsh "streak lost."
> - Empty profile → guided setup state (avatar, track, bio) instead of blank fields.
>
> === BONUS FEATURE: Recruiter Dashboard ("/recruiter") ===
>
> - Searchable, filterable grid of mock student cards (avatar, name, track, streak, XP level, recruiter visibility %). Filters: track, minimum streak, minimum visibility %, "active this week."
> - Clicking a student opens a profile drawer with build heatmap, recent submissions (GitHub + LinkedIn links), achievements, journey timeline.
> - Talent Radar — highlights "Hidden Gems": high-consistency students with low visibility ("This student has a 45-day streak but hasn't been noticed yet").
> - Verified Consistency Score — trust badge per student, computed from mock submission history.
> - Proof-of-Work Feed — scrolling activity feed of latest mock submissions across all students.
> - Shortlist — client-side (Zustand) save/shortlist button per student, with a shortlist panel.
> - Compare Mode — select 2–3 students, view side-by-side (streak, XP, visibility, track).
> - Auto-generated one-line pitch per student, mock "AI-style" summary pulled/randomized from data fields.
> - Edge cases: no students match filters → empty state with "clear filters" CTA; incomplete profiles render gracefully with fallback avatar/track.
>
> === BONUS FEATURE: Admin Panel ("/admin") ===
>
> - Overview stats bar: total active students, average streak, overall completion rate, submissions today.
> - Students table: streak, completion %, last active, status (on-track / at-risk / inactive), sortable/filterable.
> - Challenge Day management: view/edit the 60-day task list (title, description, difficulty) — mock in-memory edits.
> - Content Health Dashboard — chart of completion rate per day across the 60 days (spot where students drop off).
> - At-Risk Radar — flags students who've missed 2+ days recently, with a mock one-click "send nudge" action (toast only, no real email).
> - Flagged Submissions Queue — mock moderation queue (suspicious/placeholder proof) with Approve/Reject actions updating local state.
> - Gamification Tuning Panel — sliders/inputs to adjust XP bonus values (consistency, night-owl, perfect-submission) used elsewhere in the app, state lives in the Zustand store.
> - Broadcast Composer — draft an announcement (title + message); on submit, show a success toast with a mock "sent to X students" count.
> - Track Performance Analytics — bar/donut chart comparing completion rate and average XP across tracks.
> - Edge cases: empty flagged queue → "All caught up" state; no at-risk students → "Everyone's on track" state.
>
> === DATA RULE ===
> Every screen (student, recruiter, admin) must read from the SAME mock data layer (see the accompanying backend/data prompt) — no separate one-off datasets per screen. Use realistic Indian-college-student-relevant copy, no lorem ipsum.
>
> Deliverable: production-quality component structure, fully responsive, animated, wired to Zustand state and the mock data accessor functions — not hardcoded per component.

---

## Prompt 02 — ZIP Generation, White Screen Fix & Theme Implementation

### Exact Prompt

> generate zip file of the entire thing, why the screen is white ?, just implement the mock-auth-flow.md, theme which u have mentioned dark, cyber, glass,neon, minimal, kindly implememnt tjose as well

---

## Source / Scope

- **Tool:** Figma Make
- **Project:** ABTalks Redesign
- **Primary purpose:** Frontend generation, UI/UX implementation, animations, mocked-data experience, theme system, and iterative project refinement.
- **Prompts extracted from:** Content supplied for the Figma AI usage log.
