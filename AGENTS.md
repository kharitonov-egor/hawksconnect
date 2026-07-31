# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

**HawksConnect** is a web app that gathers every campus event and club meetup
into one place for students at Hillsborough Community College (Tampa, FL).
Students browse events by campus and by upcoming/past, and open an event for
more detail. The landing page also collects waitlist email sign-ups.

## Tech stack

| Concern        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Framework      | Next.js 16 (App Router), React 19                  |
| Language       | TypeScript (strict)                                |
| Styling        | Tailwind CSS v4 + shadcn/ui (new-york style)       |
| Icons          | lucide-react                                       |
| Backend / DB   | Supabase (Postgres + Auth)                         |
| Analytics      | PostHog (client via `instrumentation-client.ts`, server via `app/lib/posthog-server.ts`) |
| Dates          | moment                                             |

## Project layout

```
app/
  page.tsx              Landing page (NavBar + Main + Footer)
  main.tsx              Hero + waitlist email capture
  layout.tsx            Root layout, Montserrat font, metadata
  NavBar.tsx            Sticky top nav (Events, FAQ)
  Footer.tsx            Footer
  CTAButton.tsx         Landing call-to-action
  events/
    page.tsx            Events list — campus + upcoming/past filters, queries Supabase
    event.tsx           Single event card in the list
    eventStuff.tsx      Shared event metadata (time, location, club, insta)
    campusChoice.tsx    Multi-select campus combobox (shadcn Popover + Command)
    UpcomingPastChoice.tsx  Upcoming vs. past toggle
    [id]/page.tsx       Event detail page (looked up by instaShortURL)
  faq/
    page.tsx            FAQ page
    faqData.ts          FAQ content
  login/page.tsx        Email/password login (Supabase Auth)
  signup/page.tsx       Sign-up
  lib/
    supabase.ts         Browser Supabase client
    posthog-server.ts   Server-side PostHog client (singleton)
  globals.css           Tailwind + theme tokens
components/ui/          shadcn primitives (button, input, dialog, popover, command)
lib/utils.ts            cn() class-merge helper
instrumentation-client.ts  PostHog browser init
next.config.ts         PostHog /ingest rewrites + remote image hosts
```

## Data model (Supabase)

- **`events_test`** — events. Key columns: `id`, `name`, `description`,
  `originalDescription`, `startTime`, `endTime`, `campus`, `location`, `club`,
  `attending`, `flyerURL` / `imageURL`, `instaShortURL` (used as the detail-page slug).
- **`wailtlistEmails`** — waitlist sign-ups (`emal` column). Note the existing
  spelling in the schema; match it exactly when querying.
- **Auth** — Supabase email/password. Users log in with their Hawkmail
  (`@hccfl.edu`) address.

Campus values are stored as snake/short keys (e.g. `dale_mabry`, `plant_city`,
`ybor`, `hawkslanding`) and mapped to display names in the components. These
keys are **not fully consistent** across files (`plant_city` vs `plantcity`,
`south_shore` vs `southshore`) — check the specific file before relying on a value.

## Environment variables

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
APIFY_KEY=
OPENROUTER_API_KEY=
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

`SUPABASE_SECRET_KEY` is server-only (used by `app/lib/supabase-admin.ts` to
write flyers into the `flyers` storage bucket) — never import it client-side.

## Running & scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint

> Agents: **do not run** `dev` or `build`. Describe what to run and what to
> check instead; the developer runs these in their own terminal.

## Conventions

- **App Router.** Interactive pages/components use `"use client"`. Data is
  fetched client-side directly through the Supabase browser client.
- **Styling** is Tailwind utility classes. Brand colors are hardcoded hex:
  `#001E60` / `#06357A` (navy) and `#B99C5F` (gold accent).
- **shadcn/ui** for primitives. Add new ones via the shadcn CLI; aliases are
  `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`.
- **TypeScript:** no `any`. Some existing code uses `any` (e.g. `useState<any>`)
  and stray `console.log`s — clean these up when you touch that code rather than
  adding more.
- **Analytics:** track meaningful actions with `posthog.capture("event_name", {...})`
  following the existing snake_case event names (`event_searched`,
  `event_detail_viewed`, `waitlist_email_submitted`, `user_logged_in`, …).
- **Comments:** keep to a minimum; prefer clear names over explanation.

## Gotchas

- The events table is named `events_test`.
- The waitlist column is misspelled `emal` in `wailtlistEmails`.
- Event detail pages are keyed by `instaShortURL`, not `id`.
- Campus key strings differ between files — verify before reusing.
