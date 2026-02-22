import Link from 'next/link'
import { Eye, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — Vigil',
  description: 'How Vigil protects your data and privacy.',
}

export default function PrivacyPage() {
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
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Privacy Policy</h1>
            <p className="text-sm text-[var(--text-muted)]">Last updated: February 22, 2026</p>
          </div>
        </div>

        <div className="prose-vigil space-y-8">
          <section>
            <h2>Your Privacy Is Sacred to Us</h2>
            <p>
              We understand the deeply personal nature of what brings you to Vigil. Your privacy isn&apos;t just a legal requirement — it&apos;s a moral one. Every design decision we make prioritizes your safety and confidentiality.
            </p>
          </section>

          <section>
            <h2>What We Collect</h2>
            <div className="space-y-4">
              <div className="vigil-card p-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Account Information</h3>
                <p className="text-sm text-[var(--text-secondary)]">Email address (if you create an account). Anonymous usage is available — no email required for the demo.</p>
              </div>
              <div className="vigil-card p-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Conversation Data</h3>
                <p className="text-sm text-[var(--text-secondary)]">Messages you send to Vigil and AI responses. This data is used to maintain your case file and provide continuity across sessions. In demo mode, all data is stored locally on your device only.</p>
              </div>
              <div className="vigil-card p-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Evidence & Case Files</h3>
                <p className="text-sm text-[var(--text-secondary)]">Evidence items you log and case file metadata. This is your data — you can delete it at any time.</p>
              </div>
              <div className="vigil-card p-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Payment Information</h3>
                <p className="text-sm text-[var(--text-secondary)]">Processed securely by Stripe. We never see or store your full credit card number.</p>
              </div>
            </div>
          </section>

          <section>
            <h2>What We Never Do</h2>
            <ul>
              <li><strong>Never sell your data.</strong> Not to advertisers, data brokers, or anyone else. Period.</li>
              <li><strong>Never share your conversations.</strong> Your messages with Vigil are confidential.</li>
              <li><strong>Never use your data for AI training.</strong> Your conversations are not used to train any AI model.</li>
              <li><strong>Never store data longer than needed.</strong> Delete your account and we delete everything.</li>
              <li><strong>Never contact your partner or anyone else.</strong> Vigil is a tool for you alone.</li>
            </ul>
          </section>

          <section>
            <h2>AI Processing</h2>
            <p>
              Your messages are processed by Anthropic&apos;s Claude AI to generate responses. Anthropic does not retain conversation data after processing and does not use it for model training. We use their API with explicit data retention opt-out.
            </p>
          </section>

          <section>
            <h2>Demo Mode (localStorage)</h2>
            <p>
              In demo mode, all data — messages, evidence, case files — is stored in your browser&apos;s localStorage. This means:
            </p>
            <ul>
              <li>Your data never leaves your device (except for AI processing of individual messages)</li>
              <li>Clearing your browser data removes everything</li>
              <li>No one else can access it unless they have physical access to your device</li>
              <li>The &quot;Reset&quot; button permanently deletes all demo data</li>
            </ul>
          </section>

          <section>
            <h2>Data Security</h2>
            <ul>
              <li>All data transmitted over HTTPS (TLS 1.3)</li>
              <li>Database encrypted at rest</li>
              <li>No plain-text storage of sensitive information</li>
              <li>Regular security audits</li>
              <li>Minimal data retention — we keep only what&apos;s needed for your active case</li>
            </ul>
          </section>

          <section>
            <h2>Your Rights</h2>
            <ul>
              <li><strong>Delete your data</strong> at any time — account deletion removes everything</li>
              <li><strong>Export your data</strong> — request a full export of your case file and conversations</li>
              <li><strong>Access your data</strong> — see everything we have about you</li>
              <li><strong>Correct your data</strong> — update any information that&apos;s wrong</li>
            </ul>
          </section>

          <section>
            <h2>Safety Considerations</h2>
            <p>
              If you&apos;re concerned about someone discovering your use of Vigil:
            </p>
            <ul>
              <li>Use the demo mode — data stays on your device only</li>
              <li>Use your browser&apos;s incognito/private mode</li>
              <li>Clear your browser history after each session</li>
              <li>We don&apos;t send emails unless you explicitly request them</li>
              <li>Payment descriptions are discreet — shown as &quot;Vigil Services&quot;</li>
            </ul>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about your privacy? Email <span className="text-[var(--vigil-gold)]">privacy@vigilai.co</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
