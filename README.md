# Mission Pool MVP

Mission Pool is a mission-based social network. Pools are shared environments around missions, not project-management boards, job listings, or a single team owned by the steward.

## Routes

- `/` homepage matching the approved visual direction
- `/pools` public pool discovery with search, filters, and sorting
- `/pool/[slug]` pool workspace with posts, comments, members, updates, outcomes, and steward controls
- `/create` protected-style pool creation
- `/profile` editable account profile
- `/profile/[username]` public member profile
- `/messages` simple one-to-one messaging
- `/login` and `/signup` Supabase email/password auth when env vars are configured

## Supabase setup

Create a Supabase project, then copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Run `supabase/schema.sql` in the Supabase SQL editor. The schema includes primary keys, foreign keys, indexes, timestamps, row-level security, and authorization policies for profile ownership, private pool visibility, pool membership posting, steward/moderator actions, outcomes, and conversations.

## Local demo mode

Without Supabase env vars, the app runs against seeded local browser storage so product flows can be tested immediately. That fallback is for MVP exploration only; production should connect the UI actions to Supabase tables using the included schema and RLS policies.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Intentionally deferred

- AI avatar generation
- Advanced recommendation or automatic skill matching
- Voice, video, group calls, and real-time chat presence
- Full private-pool approval workflow beyond request-access scaffolding
- Member-created project management tools, kanban, jobs, applications, and time tracking
