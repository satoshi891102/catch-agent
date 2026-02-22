# Vigil — AI Relationship Investigator

**Live:** https://catch-agent.vercel.app  
**Demo:** https://catch-agent.vercel.app/demo  
**Quiz:** https://catch-agent.vercel.app/quiz

## What is Vigil?

Vigil is an AI-powered relationship investigator that helps people who suspect their partner might be cheating. It guides users through a structured investigation — methodically, legally, and privately.

Think of it as having a calm, experienced private investigator available 24/7 at a fraction of the cost.

## Features

### For Users
- **AI Investigation Chat** — Guided conversations with Vigil, powered by Claude (Sonnet for critical moments, Haiku for speed)
- **Case File System** — Automatic case tracking with suspicion levels (unknown→confirmed) and 5-phase progression
- **5 Investigation Modules** — Digital behavior, schedule patterns, financial red flags, communication, emotional/physical changes
- **Evidence Log** — Track and categorize evidence with significance levels, pattern detection, and auto-extraction from conversations
- **Confrontation Toolkit** — Scripts, legal prep, safety planning, denial handling, emotional preparation
- **Assessment Report** — Shareable investigation summary with suspicion level, evidence breakdown, and recommendations
- **Quick Assessment Quiz** — 7-question intake funnel for lead generation
- **Crisis Detection** — Inline safety banners for suicide, domestic violence, and harm threats with regional hotlines (US/SA/UK)
- **Free Tier** — 10 messages free, no credit card required
- **Complete Privacy** — Anonymous accounts, no real name needed, all demo data stored locally

### Technical
- **Hybrid AI Model Selection** — Sonnet for first 3 messages (retention-critical), crisis language, and analysis; Haiku for everything else
- **Smart Evidence Extraction** — Compound signal detection (requires 8+ words with action+subject patterns, not single keywords)
- **Phase Progression** — 5-phase framework (Assessment → Gathering → Analysis → Prep → Aftermath)
- **Suspicion Calculator** — Algorithm considers evidence count, types, severity, and cross-category correlation
- **Case Context Injection** — Every AI response informed by full case file, evidence history, and message count
- **Rate Limiting** — 30 messages/hour per IP with graceful error handling
- **Contextual Suggestions** — Tappable prompt chips for new users to reduce blank-page drop-off
- **Error Boundaries** — Custom error and 404 pages
- **SEO** — JSON-LD structured data, OG tags, custom SVG favicon

## Pages (14 routes)

| Route | Description |
|-------|-------------|
| `/` | Landing page — conversion copy, chat preview, pricing, FAQ |
| `/demo` | Dashboard — case status, evidence summary, module progress |
| `/demo/chat` | AI chat — real Claude integration with typing indicators |
| `/demo/evidence` | Evidence log — add/delete, categories, pattern alerts |
| `/demo/toolkit` | Confrontation toolkit — 8 sections (paid/free gated) |
| `/demo/toolkit/emotional` | Emotional preparation — 4 sections, 15 guidance cards |
| `/demo/toolkit/crisis` | Crisis resources — hotlines, therapy, support groups |
| `/demo/report` | Assessment report — shareable, screenshot-friendly |
| `/quiz` | Quick assessment — 7-question lead gen funnel |
| `/pricing` | Pricing page — 3 plans with Stripe checkout |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/login` | Login (Supabase auth) |
| `/signup` | Signup (Supabase auth) |

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 with custom Vigil design tokens
- **AI:** Anthropic Claude API (Haiku 4.5 + Sonnet 4.6)
- **Auth:** Supabase (when configured) / localStorage (demo mode)
- **Payments:** Stripe (weekly $9.99, monthly $29.99, confrontation pack $49.99)
- **Deployment:** Vercel
- **Database:** Supabase PostgreSQL (schema ready in `supabase/schema.sql`)

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 10 messages, initial assessment |
| Weekly | $9.99/week | Unlimited chat, all modules, evidence tracking |
| Monthly | $29.99/month | Everything + confrontation toolkit, legal prep |
| Confrontation | $49.99 one-time | Complete scripts, recording laws, lifetime access |

## Business Model

- **Cost:** ~$2/user/month (blended Haiku/Sonnet, Sonnet only for first 3 msgs + crisis)
- **Margin:** 93-96% gross margin
- **TAM Signals:** 90K monthly searches for "catch cheating partner", 45B+ TikTok views on #cheating
- **Distribution:** TikTok primary (relationship content goes viral), SEO secondary
- **Viral Loop:** Shareable assessment reports + quiz results

## Running Locally

```bash
git clone https://github.com/satoshi891102/catch-agent.git
cd catch-agent
npm install
cp .env.example .env.local  # Add your API keys
npm run dev
```

### Environment Variables

```
ANTHROPIC_API_KEY=           # Required for AI chat
NEXT_PUBLIC_SUPABASE_URL=    # Optional (demo mode works without)
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=           # Optional (for payments)
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_WEEKLY_PRICE_ID=
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=
NEXT_PUBLIC_STRIPE_CONFRONTATION_PRICE_ID=
```

## Architecture

```
app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout (fonts, meta, JSON-LD)
├── icon.svg                    # Favicon (eye icon)
├── error.tsx                   # Global error boundary
├── not-found.tsx               # Custom 404
├── quiz/page.tsx               # Quick assessment quiz
├── pricing/page.tsx            # Pricing + Stripe checkout
├── privacy/page.tsx            # Privacy policy
├── terms/page.tsx              # Terms of service
├── demo/                       # Demo mode (localStorage, no auth)
│   ├── layout.tsx              # Sidebar + bottom nav with active states
│   ├── page.tsx                # Dashboard
│   ├── error.tsx               # Demo error boundary
│   ├── chat/page.tsx           # AI chat with suggestions + crisis detection
│   ├── evidence/page.tsx       # Evidence log with patterns
│   ├── report/page.tsx         # Shareable assessment report
│   └── toolkit/
│       ├── page.tsx            # Toolkit hub (8 sections)
│       ├── emotional/page.tsx  # Emotional preparation guide
│       └── crisis/page.tsx     # Crisis resources + hotlines
├── (protected)/                # Auth-required routes (Supabase)
│   ├── dashboard/
│   ├── chat/
│   └── evidence/
└── api/
    ├── demo-chat/route.ts      # AI endpoint with rate limiting
    ├── chat/route.ts           # Auth AI endpoint
    ├── stripe/                 # Checkout + webhook handlers
    ├── evidence/               # Evidence CRUD
    └── conversation/           # Conversation management

lib/
├── system-prompt.ts            # Vigil personality + investigation framework (~800 tokens core)
├── demo-store.ts               # localStorage persistence (demo mode)
├── supabase-store.ts           # Supabase persistence (drop-in replacement)
├── types.ts                    # TypeScript interfaces + pricing constants
├── anthropic.ts                # Claude API client
├── stripe.ts                   # Stripe client + plan config
└── supabase/
    ├── client.ts               # Browser client
    ├── server.ts               # Server client + admin
    └── middleware.ts            # Auth middleware

supabase/
└── schema.sql                  # Full DB schema (6 tables, RLS, triggers)

content/
└── tiktok-scripts-batch1.md    # 8 TikTok content scripts + posting schedule
```

## Database Schema (Supabase)

6 tables with Row Level Security:
- `profiles` — User profiles + subscription status
- `case_files` — Investigation case files with phase/suspicion tracking
- `evidence_items` — Categorized evidence with significance levels
- `conversations` — Chat sessions linked to case files
- `messages` — Individual messages with model tracking
- `subscriptions` — Stripe subscription records

Ready to bootstrap: paste `supabase/schema.sql` into Supabase SQL Editor.

## Launch Checklist

See `LAUNCH-CHECKLIST.md` for step-by-step instructions to go live with Supabase, Stripe, and TikTok.

## License

Proprietary. All rights reserved.
