Modify the EXISTING ABTalks redesign project. Do NOT rebuild the project from scratch and do NOT remove, rewrite, or change any existing functionality, visual components, animations, routes, data, or design unless specifically required for this change.

I want to add a realistic MOCK authentication/entry experience because the current dashboard immediately displays a specific student such as "Hey Arjun" without showing how the user entered the platform.

IMPORTANT:
The original hackathon problem statement explicitly says:
- Authentication is out of scope.
- Real user accounts are not required.
- Production database is not required.
- Mocked data is sufficient.

Therefore, DO NOT implement real authentication, passwords, JWT, backend authentication, OAuth, database authentication, or any production auth system.

Instead, create a polished FRONTEND-ONLY MOCK LOGIN EXPERIENCE using the existing project's mock data/state.

ROLES

There should be three separate roles:

1. STUDENT
The primary user of ABTalks.

Student should be able to:
- Enter/select a mock student profile.
- Access the student dashboard.
- See their name, streak, XP, challenge progress, achievements, leaderboard position, etc.
- Continue to the daily challenge.
- Submit GitHub repository/commit and LinkedIn proof.

2. RECRUITER
Recruiter is NOT the same as Admin.

Recruiter is a hiring-focused role whose purpose is to discover and evaluate students.

For the recruiter mock experience, show a polished recruiter dashboard containing:
- Student/candidate discovery
- Search/filter students
- Candidate profiles
- Skills
- Challenge completion percentage
- GitHub activity
- LinkedIn activity
- Streak
- Achievements
- Recruiter visibility score
- Project/portfolio information

Use realistic mocked student data.

3. ADMIN
Admin is a platform-management role and should remain separate from Recruiter.

The Admin mock experience can contain:
- Challenge management
- Student overview
- Submission monitoring
- Platform statistics
- Challenge completion analytics
- Leaderboard management
- Basic content/platform controls

Use mocked data only.

LOGIN / ENTRY EXPERIENCE

Add a new frontend route:

/login

The login page should feel like a premium startup/SaaS authentication screen.

Do NOT make it look like a generic form.

Design requirements:
- Mobile-first at 390px.
- Premium dark startup aesthetic consistent with the existing ABTalks design.
- Reuse the existing color palette, typography, spacing, components, animations, and design language.
- Do not introduce an unrelated visual style.
- Use Framer Motion for subtle entrance animations.
- Include a beautiful background treatment/gradient/glow consistent with the existing application.
- Use polished cards, inputs, buttons, icons, and micro-interactions.

LOGIN FLOW

The user should first select their role:

"Continue as"

[ Student ]

[ Recruiter ]

[ Admin ]

Each role should have:
- Appropriate icon
- Short description
- Hover/tap animation
- Clear visual selected state

After selecting a role, show a simple mock login form.

For Student:
- Student name/profile selector or email-style input
- Example mock student profiles such as Arjun, Priya, Rahul, etc.
- Continue button

For Recruiter:
- Mock recruiter email/name
- Continue button

For Admin:
- Mock admin email/name
- Continue button

There should be NO real password verification.

After clicking Continue:
- Store the selected mock role/profile in the existing frontend state/store.
- Redirect the user to the appropriate experience.

STUDENT:
 /dashboard

RECRUITER:
 /recruiter

ADMIN:
 /admin

Do not break the existing required hackathon routes:

/
 /dashboard
 /day/12

Keep all existing routes and functionality working.

LANDING PAGE

Add a primary CTA such as:

"Start Your 60-Day Journey"

This should take the user to:

/login

You may also include a smaller "Sign in" button in the navbar that opens /login.

DASHBOARD PERSONALIZATION

Remove the hardcoded feeling where the dashboard always starts with a fixed student such as "Hey Arjun."

Instead, dynamically display the currently selected MOCK student profile.

For example:

"Hey Arjun 👋"

or

"Hey Priya 👋"

depending on the profile selected during the mock login.

All existing dashboard information should continue working exactly as before.

Do not remove any existing dashboard features such as:
- Streak
- XP
- Progress
- Achievements
- Heatmap
- Recruiter Visibility
- Leaderboard
- Momentum Coach
- Daily task
- Existing animations
- Existing cards

Only make the displayed student/profile dynamic.

PERSISTENCE

Since this is a frontend-only hackathon project, use the existing state management system if available.

If necessary, use Zustand and/or localStorage so that:
- Selected role persists during the session.
- Selected student profile persists during navigation.
- Refreshing the page does not immediately reset the mock login state.

This is NOT real authentication.

PROTECTED-ROUTE BEHAVIOR

Create a lightweight frontend-only route guard.

If a user tries to open:

/dashboard

/recruiter

/admin

without selecting a mock role/profile, redirect them to:

/login

Again, this is only a UI/state mechanism, NOT security.

LOGOUT

Add a "Log out" option in the appropriate navigation/profile menu.

When clicked:
- Clear the mock role/profile state.
- Return the user to /login.

RECRUITER VS ADMIN

Keep the experiences clearly different.

Recruiter = discovers/evaluates students and their work.

Admin = manages/operates the ABTalks platform.

Do NOT combine their dashboards.

IMPORTANT DESIGN RULE

Do NOT redesign the existing project.

This is an incremental modification to the existing ABTalks redesign.

Preserve:
- Existing visual identity
- Existing color palette unless necessary
- Existing components
- Existing animations
- Existing responsive behavior
- Existing data
- Existing routes
- Existing challenge experience
- Existing dashboard
- Existing landing page

Only add the login/role-selection flow and connect it to the existing experiences.

The final user journey should be:

Landing Page
   ↓
/login
   ↓
Choose Role
   ↓
Student / Recruiter / Admin
   ↓
Mock Profile Selection
   ↓
Role-specific Dashboard

For Student:

/login
   ↓
/dashboard
   ↓
/day/12

For Recruiter:

/login
   ↓
/recruiter

For Admin:

/login
   ↓
/admin

Make the entire flow feel like a cohesive premium SaaS product rather than three unrelated dashboards.