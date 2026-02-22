import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quick Assessment — Am I Being Cheated On? | Vigil',
  description: 'Take this 2-minute assessment to evaluate your situation. 7 key indicators analyzed by AI. Free, private, and instant results.',
  openGraph: {
    title: 'Quick Assessment — Am I Being Cheated On?',
    description: '7 key indicators. 2 minutes. Get your situation assessed by AI — free and 100% private.',
  },
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
