import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, STRIPE_PLANS } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Please sign in to subscribe' }, { status: 401 })
    }

    const body = await request.json()
    const { plan, success_url, cancel_url } = body as {
      plan: 'weekly' | 'monthly' | 'confrontation'
      success_url?: string
      cancel_url?: string
    }

    if (!plan || !STRIPE_PLANS[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Get or create Stripe customer
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single()

    let stripeCustomerId = userProfile?.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userProfile?.email || user.email || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      stripeCustomerId = customer.id

      // Save customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const selectedPlan = STRIPE_PLANS[plan]

    let session

    if (plan === 'confrontation') {
      // One-time payment
      session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: selectedPlan.priceId,
            quantity: 1,
          },
        ],
        success_url: success_url || `${appUrl}/dashboard?upgraded=true`,
        cancel_url: cancel_url || `${appUrl}/pricing`,
        metadata: {
          supabase_user_id: user.id,
          plan,
        },
        allow_promotion_codes: true,
      })
    } else {
      // Recurring subscription
      session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: selectedPlan.priceId,
            quantity: 1,
          },
        ],
        success_url: success_url || `${appUrl}/dashboard?upgraded=true`,
        cancel_url: cancel_url || `${appUrl}/pricing`,
        metadata: {
          supabase_user_id: user.id,
          plan,
        },
        subscription_data: {
          metadata: {
            supabase_user_id: user.id,
            plan,
          },
        },
        allow_promotion_codes: true,
      })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
