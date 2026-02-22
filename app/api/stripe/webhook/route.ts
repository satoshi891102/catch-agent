import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(supabase, session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(supabase, subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCanceled(supabase, subscription)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(supabase, invoice)
        break
      }

      default:
        // Ignore unhandled events
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.supabase_user_id
  const plan = session.metadata?.plan as 'weekly' | 'monthly' | 'confrontation'

  if (!userId) return

  if (session.mode === 'payment' && plan === 'confrontation') {
    // One-time payment for confrontation pack
    await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_plan: 'confrontation',
      })
      .eq('id', userId)

    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: null,
        plan: 'confrontation',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: null, // Lifetime
      })
  }
}

async function handleSubscriptionUpdate(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.supabase_user_id
  const plan = subscription.metadata?.plan as 'weekly' | 'monthly'

  if (!userId) {
    // Try to find user by customer ID
    const { data: userRecord } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', subscription.customer)
      .single()

    if (!userRecord) return
  }

  const targetUserId = userId || (await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', subscription.customer)
    .single()).data?.id

  if (!targetUserId) return

  const status = subscription.status === 'active' ? 'active' :
    subscription.status === 'past_due' ? 'past_due' :
    subscription.status === 'trialing' ? 'trialing' : 'canceled'

  // Update user subscription status
  await supabase
    .from('profiles')
    .update({
      subscription_status: status,
      subscription_plan: plan || 'monthly',
    })
    .eq('id', targetUserId)

  // Upsert subscription record
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: targetUserId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      plan: plan || 'monthly',
      status,
      current_period_start: new Date((subscription as unknown as { current_period_start: number }).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    }, {
      onConflict: 'stripe_subscription_id',
    })
}

async function handleSubscriptionCanceled(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  subscription: Stripe.Subscription
) {
  const { data: subscriptionRecord } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (!subscriptionRecord) return

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'canceled',
      subscription_plan: null,
    })
    .eq('id', subscriptionRecord.user_id)

  await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id)
}

async function handlePaymentFailed(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  invoice: Stripe.Invoice
) {
  const invoiceAny = invoice as unknown as { subscription?: string }
  if (!invoiceAny.subscription) return

  const { data: subscriptionRecord } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', invoiceAny.subscription)
    .single()

  if (!subscriptionRecord) return

  await supabase
    .from('profiles')
    .update({ subscription_status: 'past_due' })
    .eq('id', subscriptionRecord.user_id)

  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', invoiceAny.subscription)
}
