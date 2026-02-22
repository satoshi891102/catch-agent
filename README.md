# Vigil — AI Relationship Investigator

**Live:** https://catch-agent.vercel.app  
**Demo:** https://catch-agent.vercel.app/demo

## What is Vigil?

Vigil is an AI-powered relationship investigator that helps people who suspect their partner might be cheating. It guides users through a structured investigation — methodically, legally, and privately.

Think of it as having a calm, experienced private investigator available 24/7 at a fraction of the cost.

## Features

### For Users
- **AI Investigation Chat** — Guided conversations with Vigil, an AI investigator powered by Claude
- **Case File System** — Automatic case tracking with suspicion levels and phase progression
- **5 Investigation Modules** — Digital behavior, schedule patterns, financial red flags, communication, emotional/physical changes
- **Evidence Log** — Track and categorize evidence with significance levels and pattern detection
- **Confrontation Toolkit** — Scripts, legal prep, safety planning, denial handling
- **Free Tier** — 10 messages free, no credit card required
- **Complete Privacy** — Anonymous accounts, no real name needed

### Technical
- **Hybrid AI** — Claude Haiku for fast responses, Claude Sonnet for deep analysis
- **Smart Evidence Extraction** — Auto-detects evidence from conversation keywords
- **Phase Progression** — 5-phase investigation framework (Assessment → Gathering → Analysis → Prep → Aftermath)
- **Suspicion Calculator** — Algorithm considers evidence count, types, and severity
- **Case Context Injection** — Every AI response is informed by the full case file and evidence history

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **AI:** Anthropic Claude API (Haiku + Sonnet)
- **Auth:** Supabase (when configured) / localStorage (demo mode)
- **Payments:** Stripe (weekly $9.99, monthly $29.99, confrontation pack $49.99)
- **Deployment:** Vercel

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 10 messages, initial assessment |
| Weekly | $9.99/week | Unlimited chat, all modules, evidence tracking |
| Monthly | $29.99/month | Everything + confrontation toolkit, legal prep |
| Confrontation | $49.99 one-time | Complete scripts, recording laws, lifetime access |

## Business Model

- **Cost:** ~$2/user/month (blended Haiku/Sonnet)
- **Margin:** 93-96% gross margin
- **TAM Signals:** 90K monthly searches for "catch cheating partner", 45B+ TikTok views on #cheating
- **Distribution:** TikTok primary (relationship content goes viral), SEO secondary

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
```

## Architecture

```
app/
├── page.tsx              # Landing page
├── demo/                 # Demo mode (no auth required)
│   ├── page.tsx          # Dashboard
│   ├── chat/page.tsx     # AI chat interface
│   ├── evidence/page.tsx # Evidence log
│   └── toolkit/page.tsx  # Confrontation toolkit
├── (protected)/          # Auth-required routes
│   ├── dashboard/
│   ├── chat/
│   └── evidence/
├── api/
│   ├── demo-chat/        # AI endpoint (demo mode)
│   ├── chat/             # AI endpoint (auth mode)
│   ├── stripe/           # Payment webhooks
│   └── evidence/         # Evidence CRUD
lib/
├── system-prompt.ts      # Vigil's personality + investigation framework
├── demo-store.ts         # localStorage persistence layer
├── types.ts              # TypeScript interfaces
├── anthropic.ts          # Claude API client
└── supabase/             # Supabase client helpers
```

## License

Proprietary. All rights reserved.
