# BUILD TASK: Catch Agent — AI Relationship Investigator

Read BLUEPRINT.md in this directory for the full product spec.

## What to build (MVP — Phase 1):

### Tech Stack
- Next.js 15 with App Router, TypeScript, Tailwind CSS v4
- Supabase for auth + database
- Anthropic Claude API for the AI agent
- Stripe for payments
- Mobile-first responsive design

### Pages to build:
1. **Landing page** (`/`) — conversion-optimized, emotional, mobile-first. NOT generic SaaS. Think: warm, private, empowering. Key sections: hero (emotional hook), how it works (3 steps), what you get (features), pricing, FAQ, trust/privacy section.

2. **Auth** (`/login`, `/signup`) — email + password only (privacy). Anonymous option. Clean, minimal. No social login.

3. **Dashboard** (`/dashboard`) — after login. Shows case file summary, current phase, recent evidence, next steps, subscription status.

4. **Chat** (`/chat`) — THE core product. Full-screen mobile chat interface. Message input, scrolling messages, typing indicator. Messages saved to Supabase. Case file context injected into every AI call.

5. **Pricing** (`/pricing`) — $9.99/week, $29.99/month, $49.99 confrontation pack. Stripe Checkout integration.

6. **Evidence Log** (`/evidence`) — timeline of all evidence items the user has logged. Categorized by type (digital, schedule, financial, communication, behavioral).

### API Routes:
- `/api/chat` — POST. Takes user message, loads case file from DB, calls Claude API with system prompt + case context, returns response, saves to DB.
- `/api/stripe/checkout` — POST. Creates Stripe checkout session.
- `/api/stripe/webhook` — POST. Handles subscription events.
- `/api/evidence` — GET/POST. CRUD for evidence items.

### System Prompt:
Build the AI personality described in BLUEPRINT.md. Core traits: calm, experienced, direct but kind, methodical, non-judgmental. Include all 5 investigation modules in the knowledge base. Include safety guardrails (abuse detection, crisis detection, legal boundaries).

### Database Schema (Supabase):
- users (id, email, created_at, subscription_status, subscription_plan)
- case_files (id, user_id, status, phase, partner_profile JSONB, suspicion_level, investigation_progress, created_at, updated_at)
- evidence_items (id, case_file_id, type, description, date_observed, significance_level, module_source, created_at)
- conversations (id, user_id, messages JSONB, created_at, updated_at)
- subscriptions (id, user_id, stripe_subscription_id, plan, status, current_period_start, current_period_end)

### Design:
- Dark, warm color palette. Think: deep navy/charcoal background, warm amber/gold accents
- Mobile-first. The chat MUST feel like a private messaging app
- Clean typography (Inter or similar)
- No emoji as icons — use Lucide icons
- Subtle animations with Framer Motion
- The overall feeling: safe, private, professional, warm

### Critical Requirements:
- All user data must be handled as if it will be encrypted (structure for it even if not implementing encryption in MVP)
- Free tier: 10 messages without subscription
- Paid tier: unlimited messages
- The chat must maintain conversation history and case file context
- System prompt must include safety guardrails
- Landing page must SELL — not just describe

### DO NOT:
- Use placeholder/fake data for the AI — it must actually call Claude API
- Skip Stripe integration — payments must work
- Make it look like a generic SaaS template
- Use emoji as icons
- Skip mobile responsiveness
- Leave any page as "coming soon"

When completely finished, run: openclaw system event --text "Done: Catch Agent MVP built — landing, auth, chat, dashboard, payments, evidence log" --mode now
