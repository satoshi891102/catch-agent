# Vigil Launch Checklist

## What's Built ✅
- 13-page Next.js app deployed at https://catch-agent.vercel.app
- AI chat with Claude (Sonnet for critical moments, Haiku for speed)
- Case file system with phase progression (1→5)
- Evidence tracking with auto-detection from conversations
- Suspicion level calculation (unknown→confirmed)
- Confrontation toolkit with emotional prep + crisis resources
- Shareable assessment report (viral loop)
- Landing page with conversion copy
- Privacy Policy + Terms of Service
- 10 free messages → paywall
- TikTok content scripts (8 ready)
- Supabase schema ready (just needs credentials)

## To Go Live (needs human)

### 1. Supabase Setup (~15 min)
- [ ] Go to https://supabase.com → New Project
- [ ] Name: `vigil` | Region: closest to your users
- [ ] Copy **Project URL** and **anon key** from Settings → API
- [ ] Go to SQL Editor → paste contents of `supabase/schema.sql` → Run
- [ ] Go to Auth → Settings → Enable **Email** + **Anonymous** sign-in
- [ ] Give Basirah the URL, anon key, and service role key
- [ ] I'll update Vercel env vars and swap localStorage → Supabase

### 2. Stripe Setup (~10 min)
- [ ] Go to https://dashboard.stripe.com → Products
- [ ] Create 3 products:
  - **Vigil Weekly**: $9.99/week recurring
  - **Vigil Monthly**: $29.99/month recurring  
  - **Confrontation Pack**: $49.99 one-time
- [ ] Copy the **Price IDs** (price_xxx) for each
- [ ] Copy your **Publishable key** and **Secret key** (use test keys first!)
- [ ] Set up webhook: Settings → Webhooks → Add endpoint
  - URL: `https://catch-agent.vercel.app/api/stripe/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
  - Copy the **Webhook signing secret**
- [ ] Give Basirah all keys
- [ ] I'll update Vercel env vars and test the full flow

### 3. Domain (optional, recommended)
- [ ] Register `vigilai.co` or similar
- [ ] Add to Vercel project: Settings → Domains → Add
- [ ] Update DNS as instructed by Vercel
- [ ] I'll update all internal links and OG tags

### 4. TikTok Account (~5 min)
- [ ] Create TikTok account (or use existing)
- [ ] Add link in bio: `https://catch-agent.vercel.app/demo/chat`
- [ ] First 8 scripts ready in `content/tiktok-scripts-batch1.md`
- [ ] Post 2-3 per day for first week

### 5. Final QA
- [ ] I'll do a complete walkthrough once Supabase + Stripe are live
- [ ] Test: signup → chat → evidence → paywall → payment → unlimited
- [ ] Verify mobile experience on real device

## Revenue Timeline
| Week | Action | Expected |
|------|--------|----------|
| 1 | Launch TikTok, 2-3 posts/day | First impressions, 50-200 demo users |
| 2 | Optimize based on TikTok analytics | First paid conversions ($50-200) |
| 3 | Scale what works, add Telegram bot | Growing recurring revenue |
| 4 | First month review | Target: $500-1000 MRR |

## Cost Structure
| Item | Monthly Cost |
|------|-------------|
| Vercel Hobby | Free |
| Supabase Free Tier | Free (up to 50K MAU) |
| Anthropic API (~$2/active user) | ~$100-400 at scale |
| Domain | ~$1/month |
| **Total at 100 users** | **~$200** |
| **Revenue at 100 users (30% convert)** | **~$900/month** |
| **Margin** | **~78%** |

## What Basirah Will Do Once Creds Are Available
1. Run Supabase schema migration
2. Update all env vars on Vercel
3. Build auth swap (localStorage → Supabase) — estimated 2 hours
4. Test complete payment flow
5. Deploy and verify
6. Begin Telegram bot build (same backend, different interface)
