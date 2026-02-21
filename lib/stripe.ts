import Stripe from 'stripe'

// Lazy singleton — instantiated at request time to avoid build errors when env vars aren't set
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })
  }
  return _stripe
}

// Backward compat proxy
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return Reflect.get(getStripe(), prop)
  },
})

export const STRIPE_PLANS = {
  weekly: {
    priceId: process.env.STRIPE_WEEKLY_PRICE_ID!,
    amount: 999, // $9.99
    interval: 'week' as const,
    name: 'Weekly Plan',
  },
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    amount: 2999, // $29.99
    interval: 'month' as const,
    name: 'Monthly Plan',
  },
  confrontation: {
    priceId: process.env.STRIPE_CONFRONTATION_PRICE_ID!,
    amount: 4999, // $49.99
    interval: null, // one-time
    name: 'Confrontation Pack',
  },
} as const
