/**
 * Fallback response engine for when the AI API is unavailable.
 * Provides contextual, empathetic responses based on message content
 * so users still get a meaningful experience.
 */

interface FallbackContext {
  userMessage: string
  messageCount: number
  conversationLength: number
}

// Keyword-based response matching
const RESPONSE_PATTERNS: Array<{
  patterns: RegExp[]
  responses: string[]
}> = [
  {
    // Phone/device behavior
    patterns: [
      /phone|device|screen|app|password|text|message|notification|call/i,
    ],
    responses: [
      "Changes in how someone handles their phone can be really telling. The protective behavior you're describing — that shift from open to guarded — is one of the most common early signs people notice.\n\nCan you think back to roughly when this started? Sometimes pinpointing the timeline helps separate \"they've always been private\" from \"something changed.\"",
      "That's a significant observation. When someone suddenly becomes protective of their device, it often means there's something on it they don't want seen.\n\nHere's what I'd suggest: rather than trying to check the phone (which can backfire), start noting the *patterns*. When does the guarding behavior happen? Is it constant, or only at certain times? Patterns tell us more than any single incident.",
      "What you're describing with the phone behavior is worth paying attention to. I want to be honest with you — on its own, it could mean a few things. But combined with other changes, it starts to paint a picture.\n\nWhat else have you noticed, even small things that seemed odd at the time?",
    ],
  },
  {
    // Schedule changes / late nights
    patterns: [
      /late|overtime|schedule|work trip|gone|disappear|where (was|were|is)|time away|hours|routine/i,
    ],
    responses: [
      "Schedule changes are one of the things that eat at you, aren't they? Because there's always a reasonable explanation available — work is busy, traffic was bad, they had to stay late. And questioning it makes *you* feel like the problem.\n\nBut you're here because something doesn't add up. Trust that instinct. Can you walk me through a recent example?",
      "When someone's routine suddenly shifts, it creates this gap between what they say and what you feel. You know something is different, even if you can't prove it yet.\n\nI'd like to understand the pattern better. Is this happening on specific days? At predictable times? Or is it random?",
      "The hardest part about schedule changes is the gaslighting potential — \"You're being paranoid, I told you I was at work.\" But your gut brought you here for a reason.\n\nLet's look at this systematically. When did the schedule start changing? And does anything else shift on those same days — their mood, their appearance, how they act when they get home?",
    ],
  },
  {
    // Emotional distance
    patterns: [
      /distant|cold|different|changed|not the same|pulling away|intimacy|affection|doesn't care|ignoring|avoid/i,
    ],
    responses: [
      "Emotional distance is painful because it's hard to point to a single moment — it's this gradual erosion that makes you question whether you're imagining it.\n\nYou're not imagining it. When someone who used to be warm becomes distant, that shift is real and worth examining.\n\nWhen did you first feel the change? Not when you could prove it — when did you *feel* it?",
      "What you're describing — that emotional withdrawal — is one of the most painful signs because it affects everything. The way they talk to you, look at you, respond to you.\n\nI want you to know: noticing this doesn't make you needy or paranoid. It makes you perceptive.\n\nCan you describe what \"before\" felt like versus what \"now\" feels like?",
    ],
  },
  {
    // Financial concerns
    patterns: [
      /money|spending|charge|receipt|account|credit card|cash|ATM|hotel|restaurant|gift|expensive/i,
    ],
    responses: [
      "Financial trails are often where the truth hides, because affairs cost money. Dinners, hotels, gifts — they all leave traces.\n\nWhat specifically caught your attention? Even small charges that seem off can be meaningful when you look at the pattern.",
      "Money is one of the hardest things to hide completely. Even careful people slip up — a charge they forgot to delete, a withdrawal that doesn't match their story, a receipt that ends up in the wrong pocket.\n\nTell me what you've found. I'll help you figure out what it means.",
    ],
  },
  {
    // Gut feeling / overreacting concerns
    patterns: [
      /overreact|crazy|paranoid|gut|feeling|instinct|imagining|wrong with me|am I/i,
    ],
    responses: [
      "Let me be direct with you: **you are not crazy.** The fact that you're questioning yourself is actually a very normal response — especially if your partner has been dismissing your concerns.\n\nResearch consistently shows that when people suspect infidelity, they're right more often than they're wrong. Your instincts picked up on something real.\n\nInstead of asking \"am I overreacting,\" let's ask a better question: \"what specific things have I noticed?\" List them out. When you see them together, the picture usually becomes clearer.",
      "I hear this question a lot, and I want to give you an honest answer: the people who come here worried they're overreacting are almost never overreacting.\n\nSomething brought you here — at this hour, to talk to a stranger about your relationship. That's not what someone does when everything is fine.\n\nYour feelings are data. Let's look at what they're telling you.",
    ],
  },
  {
    // How long / timeline
    patterns: [
      /weeks?|months?|years?|how long|started|began|since|recently|lately/i,
    ],
    responses: [
      "Thank you for sharing that timeline. It helps to understand whether this is a sudden shift or something that's been building.\n\nHere's what I'd like to understand next: during that time, have you noticed the changes getting worse? Staying the same? Or coming and going in waves? The pattern often tells us a lot about what's happening underneath.",
      "That's useful context. Sometimes when we look back, we realize the signs started earlier than we first thought — we just didn't want to see them.\n\nThinking about that timeframe, can you identify 2-3 specific incidents that stand out? The ones that really made you stop and think \"something isn't right\"?",
    ],
  },
  {
    // What should I do
    patterns: [
      /what (should|do) I do|what now|next step|help me|advice|where do I start/i,
    ],
    responses: [
      "That's the right question, and the answer depends on where you are right now.\n\nFirst: **don't confront yet.** The biggest mistake people make is confronting too early, with too little information. It gives them a chance to cover their tracks and gaslight you.\n\nInstead, here's what I'd recommend:\n\n**Step 1:** Start documenting. Write down everything you've noticed — dates, times, details. Memory gets fuzzy, but notes don't lie.\n\n**Step 2:** Share more with me about what you've observed. The more I know, the better I can help you see the full picture.\n\n**Step 3:** We'll build a clear assessment together before you decide anything.\n\nWhat have you noticed so far?",
      "Right now, the most important thing is to gather clarity — not to act.\n\nI know that's hard when you're hurting. Every part of you wants answers *right now*. But rushing into a confrontation without a clear picture usually makes things worse, not better.\n\nLet's start by understanding what you're dealing with. Tell me everything that's felt off — no detail is too small. I'll help you separate signal from noise.",
    ],
  },
  {
    // Confrontation
    patterns: [
      /confront|tell them|ask them|talk to (him|her|them)|bring it up|say something/i,
    ],
    responses: [
      "I understand the urge to confront — the not-knowing is its own kind of torture. But here's what I've learned: **confrontation without preparation usually fails.**\n\nHere's why: if they are hiding something, a confrontation without evidence gives them a script. They deny, they deflect, they turn it around on you. Then they get better at hiding.\n\nBefore you confront, you want to be in a position where you already know the answer. The confrontation isn't to find out the truth — it's to see if they'll tell it.\n\nAre you at that point yet, or are you still gathering?",
    ],
  },
]

// Generic responses for when no pattern matches
const GENERIC_RESPONSES = [
  "Thank you for sharing that with me. Every detail helps me understand your situation better.\n\nI want to make sure I'm giving you the most helpful guidance. Can you tell me more about what specifically has been bothering you? The more concrete the details — times, behaviors, changes — the clearer the picture becomes.",
  "I hear you. What you're going through is difficult, and it takes courage to talk about it.\n\nLet me ask you this: if you had to pick the ONE thing that concerns you most — the thing that keeps you up at night — what would it be? Let's start there.",
  "That's important context. I'm building a picture of your situation, and everything you share helps.\n\nI want to focus on what's actionable. Of all the things you've noticed, which ones are *new* behaviors? Changes from how things used to be? Those shifts are usually the most telling.",
]

// First message responses (when someone just says hi or starts vaguely)
const OPENING_RESPONSES = [
  "Take your time. There's no rush here, and there's no wrong way to start.\n\nSome people begin with the thing that's bothering them most. Others start from the beginning. Whatever feels right for you.\n\nI'm here to listen, help you make sense of what you're seeing, and figure out your next move — together.",
  "I'm glad you're here. Whatever brought you — a gut feeling, something you saw, something that doesn't add up — you deserve clarity.\n\nStart wherever feels natural. I'll ask questions along the way to help us build a clear picture.",
]

/**
 * Get a contextual fallback response when the AI API is unavailable.
 * Uses pattern matching on the user's message to provide relevant,
 * empathetic responses.
 */
export function getFallbackResponse(context: FallbackContext): string {
  const { userMessage, messageCount, conversationLength } = context

  // For very early messages or short/vague inputs, use opening responses
  if (
    conversationLength <= 1 ||
    userMessage.trim().split(/\s+/).length < 4
  ) {
    return OPENING_RESPONSES[Math.floor(Math.random() * OPENING_RESPONSES.length)]
  }

  // Try to match against patterns
  for (const { patterns, responses } of RESPONSE_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(userMessage)) {
        return responses[Math.floor(Math.random() * responses.length)]
      }
    }
  }

  // No pattern matched — use generic
  return GENERIC_RESPONSES[Math.floor(Math.random() * GENERIC_RESPONSES.length)]
}
