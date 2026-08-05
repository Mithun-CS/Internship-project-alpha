# Pulse Infrastructure Monitor

A real-time infrastructure monitoring dashboard that streams live sensor metrics over WebSockets and protects the UI behind Supabase Auth. Built to demonstrate production patterns for low-latency data visualization, secure session handling, and end-to-end full-stack TypeScript.

## Key Technical Features & Achievements

- **Realtime Postgres → UI pipeline:** Client chart subscribes to Supabase Realtime (`postgres_changes` on `INSERT` for `public.sensors`) and appends each new row into a rolling window of the latest 20 points—no polling loop required for chart updates.
- **Auth-gated Server Components:** The dashboard is a Next.js App Router Server Component that validates the session with `supabase.auth.getUser()`, redirects unauthenticated users to `/login`, and signs out via a Server Action that clears the cookie-backed session.
- **SSR-safe chart hydration:** Recharts is client-only and guarded with a `mounted` flag so SVG/layout code never runs during server render, avoiding classic hydration mismatches.
- **Built-in pulse simulator:** An invisible client `Simulator` inserts randomized CPU readings into `sensors` every 5 seconds, providing continuous realtime traffic for local demos and load-path testing.

## System Architecture & Tech Stack

| Layer / Component | Technology | Role in the App |
| --- | --- | --- |
| UI Framework | Next.js 16 (App Router) + React 19 | Server/Client component split, routing, Server Actions |
| Language | TypeScript | End-to-end type safety across app, components, and middleware |
| Styling | Tailwind CSS 4 | Dark, high-density ops UI and responsive layout |
| Auth & Middleware | Supabase Auth + `@supabase/ssr` + Next.js Middleware | Cookie session refresh, login, logout, route protection |
| Database | Supabase PostgreSQL (`sensors` table) | Persistent metric history (`name`, `value`, `created_at`) |
| Realtime | Supabase Realtime (WebSockets) | Push new inserts to the browser chart instantly |
| Visualization | Recharts | Responsive area chart with monotone interpolation |
| UX Feedback | Sonner | Toast notifications for unfinished nav modules |
| Hosting Target | Vercel-ready Next.js build | Static + dynamic route deployment pipeline |

```text
[Browser / Dashboard]
        |
        | 1) Email/password login (Supabase Auth)
        v
[Next.js App Router]
  - middleware.ts ........ refreshes auth cookies
  - app/page.tsx ......... Server Component auth gate
  - SensorChart.tsx ...... fetch history + Realtime subscribe
  - Simulator.tsx ........ periodic INSERT into sensors
        |
        | REST + WebSocket
        v
[Supabase]
  Auth JWT  +  PostgreSQL (public.sensors)  +  Realtime broadcast
        |
        | INSERT event
        v
[SensorChart] updates Recharts area series (last 20 points)
```

## Monorepo / File Structure

```text
pulse-infrastructure-monitor/
├── app/
│   ├── login/
│   │   └── page.tsx          # Client login (signInWithPassword)
│   ├── page.tsx              # Protected dashboard (Server Component)
│   ├── layout.tsx            # Root layout + Sonner toaster
│   └── globals.css           # Global Tailwind styles
├── components/
│   ├── SensorChart.tsx       # Realtime Recharts stream
│   ├── Simulator.tsx         # Background metric injector
│   └── SidebarNav.tsx        # Sidebar + toast stubs
├── lib/
│   └── supabase.ts           # Shared Supabase client helper
├── middleware.ts             # Supabase session refresh middleware
├── public/                   # Static assets
├── package.json
├── next.config.ts
└── tsconfig.json
```

## Getting Started & Local Setup

### Prerequisites
- Node.js 18+ (recommended: current LTS)
- A Supabase project with:
  - Auth enabled (email/password)
  - A `public.sensors` table (at minimum: `name`, `value`, `created_at`)
  - Realtime enabled for `public.sensors`

### 1. Clone the repository
```bash
git clone https://github.com/Mithun-CS/pulse-infrastructure-monitor.git
cd pulse-infrastructure-monitor
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated users are redirected to `/login`. After signing in, the dashboard loads, the simulator begins inserting CPU pulses, and the latency chart updates in realtime.

### Useful scripts
```bash
npm run build   # Production build
npm run start   # Run production server
npm run lint    # ESLint
```
