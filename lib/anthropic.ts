// Model selection based on task complexity
export const MODELS = {
  // Fast, cost-efficient — for general conversation
  haiku: 'claude-haiku-4-5-20251001',
  // More capable — for pattern analysis, confrontation prep
  sonnet: 'claude-sonnet-4-6',
} as const

export type ModelType = keyof typeof MODELS

// Lazily imports and initializes the Anthropic client at request time
// This avoids Next.js build-time errors when ANTHROPIC_API_KEY is not set
export async function getAnthropicClient() {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  })
}
