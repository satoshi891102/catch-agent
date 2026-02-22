import Link from 'next/link'
import { Eye, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — Vigil',
  description: 'Terms and conditions for using Vigil.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/30 flex items-center justify-center">
            <Eye className="w-5 h-5 text-[var(--vigil-gold)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Terms of Service</h1>
            <p className="text-sm text-[var(--text-muted)]">Last updated: February 22, 2026</p>
          </div>
        </div>

        <div className="prose-vigil space-y-8">
          <section>
            <h2>1. What Vigil Is</h2>
            <p>
              Vigil is an AI-powered conversation tool that helps people evaluate concerns about relationship fidelity. Vigil provides informational guidance, structured frameworks for thinking through situations, and emotional support during a difficult time.
            </p>
          </section>

          <section>
            <h2>2. What Vigil Is Not</h2>
            <div className="vigil-card p-4 space-y-3">
              <p className="text-sm text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Not a licensed therapist.</strong> Vigil provides informational support, not mental health treatment. If you&apos;re in crisis, contact a mental health professional or crisis hotline.</p>
              <p className="text-sm text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Not a private investigator.</strong> Vigil does not conduct surveillance, access anyone&apos;s accounts, or gather evidence on your behalf.</p>
              <p className="text-sm text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Not a lawyer.</strong> Vigil provides general information about legal considerations but cannot give legal advice. Always consult an attorney for legal matters.</p>
              <p className="text-sm text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Not a substitute for professional help.</strong> For domestic violence, mental health crises, or legal proceedings, seek appropriate professional support.</p>
            </div>
          </section>

          <section>
            <h2>3. Acceptable Use</h2>
            <p>You agree to use Vigil only for its intended purpose: evaluating concerns about your own relationship. You agree NOT to use Vigil to:</p>
            <ul>
              <li>Stalk, harass, or intimidate anyone</li>
              <li>Plan harm against any person</li>
              <li>Access another person&apos;s accounts, devices, or private information</li>
              <li>Conduct surveillance or install tracking software</li>
              <li>Manipulate or control a partner</li>
              <li>Generate false evidence or fabricate claims</li>
              <li>Violate any applicable laws</li>
            </ul>
            <p>
              Vigil actively monitors for abusive use patterns and will refuse to assist with any activity that could cause harm. We reserve the right to terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2>4. AI Limitations</h2>
            <p>
              Vigil uses artificial intelligence to generate responses. While we strive for accuracy and helpfulness, you should understand:
            </p>
            <ul>
              <li>AI responses are generated suggestions, not definitive conclusions</li>
              <li>Vigil cannot determine with certainty whether someone is cheating</li>
              <li>AI may occasionally provide inaccurate or unhelpful responses</li>
              <li>Pattern analysis is probabilistic, not conclusive</li>
              <li>Vigil&apos;s assessments should be one input among many in your decision-making</li>
            </ul>
          </section>

          <section>
            <h2>5. Subscriptions & Billing</h2>
            <ul>
              <li><strong>Free tier:</strong> 10 messages with Vigil, no credit card required</li>
              <li><strong>Weekly plan:</strong> $9.99/week, billed weekly, cancel anytime</li>
              <li><strong>Monthly plan:</strong> $29.99/month, billed monthly, cancel anytime</li>
              <li><strong>Confrontation Pack:</strong> $49.99 one-time purchase, lifetime access</li>
            </ul>
            <p>
              Subscriptions auto-renew unless canceled before the renewal date. Cancel anytime from your account settings or by contacting support. Refunds are available within 48 hours of charge if you&apos;re unsatisfied.
            </p>
          </section>

          <section>
            <h2>6. Data & Privacy</h2>
            <p>
              Your privacy is fundamental to our service. See our <Link href="/privacy" className="text-[var(--vigil-gold)] hover:underline">Privacy Policy</Link> for full details on how we collect, use, and protect your data.
            </p>
            <p>
              Key points: We never sell your data, never share your conversations, and never use your data to train AI models. You can delete all your data at any time.
            </p>
          </section>

          <section>
            <h2>7. Safety & Crisis</h2>
            <p>
              If Vigil detects language suggesting you may be in crisis (suicidal thoughts, domestic violence, intent to harm), it will provide appropriate crisis resources. This is not a substitute for calling emergency services.
            </p>
            <p>
              <strong>If you are in immediate danger, call your local emergency number.</strong>
            </p>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>
              Vigil is provided &quot;as is&quot; without warranties of any kind. We are not liable for decisions you make based on Vigil&apos;s guidance, emotional distress resulting from use of the service, or any direct, indirect, or consequential damages.
            </p>
            <p>
              You are solely responsible for your actions. Vigil provides information and support — how you act on it is your choice and your responsibility.
            </p>
          </section>

          <section>
            <h2>9. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. We&apos;ll notify you of material changes via email (if you have an account) or through the service. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              Questions? Email <span className="text-[var(--vigil-gold)]">legal@vigilai.co</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
