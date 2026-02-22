import Link from 'next/link'
import {
  Shield,
  Lock,
  Clock,
  TrendingUp,
  FileText,
  MessageSquare,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowRight,
  Eye,
  Search,
  Brain,
  Zap,
  X,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen grain-overlay">
      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/30 flex items-center justify-center">
            <Eye className="w-3.5 h-3.5 text-[var(--vigil-gold)]" />
          </div>
          <span className="font-semibold text-[var(--text-primary)] tracking-[0.15em] text-sm">VIGIL</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm px-3 py-1.5">
            Sign in
          </Link>
          <Link href="/demo/chat" className="btn-gold text-sm px-5 py-2">
            Start free
          </Link>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero-bg min-h-screen flex flex-col items-center justify-center px-5 pt-24 pb-20 text-center relative">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[var(--vigil-gold)] text-xs font-medium tracking-[0.2em] uppercase mb-8 px-4 py-2 border border-[var(--vigil-gold)]/25 rounded-full bg-[var(--vigil-gold)]/5">
            <Shield className="w-3.5 h-3.5" />
            Private · Secure · Zero judgment
          </div>

          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-[var(--text-primary)] leading-[1.1] mb-6 tracking-tight">
            You know something<br />
            <span className="text-gold-gradient">isn&apos;t right.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed mb-10 max-w-lg mx-auto">
            Vigil is an AI relationship investigator that helps you find the truth — methodically, legally, and without anyone else knowing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="/demo/chat" className="btn-gold flex items-center gap-2 px-8 py-4 text-base w-full sm:w-auto justify-center">
              Start your investigation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#how-it-works" className="btn-ghost flex items-center gap-2 px-6 py-4 w-full sm:w-auto justify-center">
              See how it works
              <ChevronDown className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[var(--text-muted)]">
            {['Free to start', 'No credit card', 'Available 24/7', '100% private'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--vigil-gold)]/70" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg-elevated)] to-transparent" />
      </section>

      {/* ═══ THE PROBLEM — Emotional Resonance ═══ */}
      <section className="section-elevated px-5 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[clamp(1.25rem,3vw,1.75rem)] font-light text-[var(--text-primary)] leading-relaxed italic" style={{ fontFamily: 'var(--font-display)' }}>
            &ldquo;It&apos;s 2am. You can&apos;t sleep. Something feels off, but you can&apos;t prove it. You don&apos;t know who to talk to — you don&apos;t want to worry your friends, you can&apos;t afford a PI, and Google just makes it worse.&rdquo;
          </p>
          <div className="mt-8 w-12 h-px bg-[var(--vigil-gold)]/40 mx-auto" />
          <p className="mt-6 text-[var(--vigil-gold)] font-medium text-base">
            That&apos;s exactly why Vigil exists.
          </p>
        </div>
      </section>

      {/* ═══ WHY NOTHING ELSE WORKS ═══ */}
      <section className="section-dark px-5 py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--text-primary)] mb-4">
            Why nothing else works
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-12 text-sm">
            Every option has a fatal flaw. Vigil was built to fill the gap.
          </p>
          <div className="space-y-3">
            {[
              { option: 'Private investigator', problem: '$2,000–5,000. Weeks of waiting. Embarrassing to hire.' },
              { option: 'Spy apps', problem: 'Illegal. Require physical access. Ethically wrong.' },
              { option: 'Friends & family', problem: 'Biased. Gossip risk. Can\'t give objective advice.' },
              { option: 'Therapy', problem: '$200/session. Scheduled appointments. Not available at 2am.' },
              { option: 'Google & Reddit', problem: 'Generic. Contradictory. No memory of your situation.' },
              { option: 'ChatGPT', problem: 'No structure. No case file. No methodology. Forgotten tomorrow.' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 vigil-card"
              >
                <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <X className="w-3 h-3 text-red-400/80" />
                </div>
                <div>
                  <span className="font-medium text-[var(--text-primary)] text-sm">{item.option}</span>
                  <span className="text-[var(--text-muted)] text-sm"> — </span>
                  <span className="text-[var(--text-secondary)] text-sm">{item.problem}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="section-elevated px-5 py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--text-primary)] mb-3">
            How Vigil works
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-14 text-sm">
            A structured, methodical approach. Not random advice.
          </p>

          <div className="space-y-0 relative">
            {/* Vertical connector line */}
            <div className="absolute left-[23px] top-[40px] bottom-[40px] w-px bg-gradient-to-b from-[var(--vigil-gold)]/30 via-[var(--vigil-gold)]/15 to-[var(--vigil-gold)]/30 hidden sm:block" />

            {[
              {
                step: '01',
                icon: <MessageSquare className="w-5 h-5" />,
                title: 'Tell your story',
                desc: 'Start by describing what you\'ve noticed. Vigil listens without judgment, asks the right questions, and builds your personal case file.',
              },
              {
                step: '02',
                icon: <Search className="w-5 h-5" />,
                title: 'Guided investigation',
                desc: 'Vigil walks you through 5 investigation modules — digital behavior, schedule patterns, financial red flags, communication changes, and emotional shifts.',
              },
              {
                step: '03',
                icon: <Brain className="w-5 h-5" />,
                title: 'Pattern analysis',
                desc: 'As you gather information, Vigil connects the dots. A single thing can be innocent. Patterns tell the real story.',
              },
              {
                step: '04',
                icon: <FileText className="w-5 h-5" />,
                title: 'The confrontation toolkit',
                desc: 'When you\'re ready, Vigil prepares you — what to say, what not to say, how to handle denial, and what to do with the answer.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 p-5 sm:p-6 relative">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/25 flex items-center justify-center text-[var(--vigil-gold)] relative z-10">
                    {item.icon}
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-wider">{item.step}</span>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2 text-base">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CHAT PREVIEW ═══ */}
      <section className="section-dark px-5 py-24">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--text-primary)] mb-3">
            Feel what it&apos;s like
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-10 text-sm">
            This is how Vigil talks to you.
          </p>

          <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden bg-[var(--bg-card)] shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
              <div className="w-9 h-9 rounded-full bg-[var(--vigil-gold)]/12 border border-[var(--vigil-gold)]/25 flex items-center justify-center">
                <Eye className="w-4 h-4 text-[var(--vigil-gold)]" />
              </div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary)]">Vigil</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Active
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-4">
              {/* Vigil message */}
              <div className="flex gap-3 items-end">
                <div className="w-7 h-7 rounded-full bg-[var(--vigil-gold)]/12 border border-[var(--vigil-gold)]/25 flex items-center justify-center shrink-0">
                  <Eye className="w-3 h-3 text-[var(--vigil-gold)]" />
                </div>
                <div className="bg-[var(--bg-elevated)] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%] border border-[var(--border-subtle)]">
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                    I&apos;m here, and I&apos;m listening. Tell me everything from the beginning — what first made you suspicious? Don&apos;t filter yourself.
                  </p>
                </div>
              </div>

              {/* User message */}
              <div className="flex gap-3 items-end justify-end">
                <div className="bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/20 rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%]">
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                    He started coming home late about 3 weeks ago. Always &quot;meetings&quot; but he never used to work late. And he changed his phone password.
                  </p>
                </div>
              </div>

              {/* Vigil response */}
              <div className="flex gap-3 items-end">
                <div className="w-7 h-7 rounded-full bg-[var(--vigil-gold)]/12 border border-[var(--vigil-gold)]/25 flex items-center justify-center shrink-0">
                  <Eye className="w-3 h-3 text-[var(--vigil-gold)]" />
                </div>
                <div className="bg-[var(--bg-elevated)] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%] border border-[var(--border-subtle)]">
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                    Three weeks ago — that&apos;s a specific starting point, which matters. The phone password change alongside late nights is a notable combination. Let me ask: is it the <em className="text-[var(--vigil-gold)]">same nights</em> each week, or unpredictable?
                  </p>
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="px-5 py-4 border-t border-[var(--border-subtle)] flex items-center gap-3 bg-[var(--bg-elevated)]">
              <div className="flex-1 bg-[var(--bg-primary)] rounded-full px-4 py-2.5 text-sm text-[var(--text-muted)] border border-[var(--border-subtle)]">
                Tell Vigil what you&apos;ve noticed...
              </div>
              <Link href="/demo/chat" className="btn-gold px-5 py-2.5 text-sm">
                Try free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="section-elevated px-5 py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--text-primary)] mb-3">
            What you get
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-14 text-sm">
            Everything a private investigator knows, at a fraction of the cost.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <FileText className="w-5 h-5" />,
                title: 'Persistent Case File',
                desc: 'Every detail you share is remembered and organized. Vigil never forgets.',
              },
              {
                icon: <Clock className="w-5 h-5" />,
                title: '24/7 Availability',
                desc: 'Available at 2am when the anxiety peaks and you can\'t sleep.',
              },
              {
                icon: <TrendingUp className="w-5 h-5" />,
                title: 'Pattern Analysis',
                desc: 'Connects dots across digital, schedule, financial, and behavioral evidence.',
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: 'Legal Methods Only',
                desc: 'Every technique is legal. Vigil will never advise accessing someone\'s accounts.',
              },
              {
                icon: <Lock className="w-5 h-5" />,
                title: 'Complete Privacy',
                desc: 'No real name needed. End-to-end private. No one ever knows you\'re here.',
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'Confrontation Ready',
                desc: 'When you have enough, Vigil prepares you for the conversation.',
              },
            ].map((feature, i) => (
              <div key={i} className="vigil-card p-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--vigil-gold)]/8 border border-[var(--vigil-gold)]/20 flex items-center justify-center mb-4 text-[var(--vigil-gold)]">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2 text-[15px]">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="section-dark px-5 py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--text-primary)] mb-2">
            Simple pricing
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-12 text-sm">
            A fraction of a private investigator. Cancel anytime.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Weekly */}
            <div className="vigil-card p-6 flex flex-col">
              <span className="text-xs text-[var(--vigil-gold)] font-medium uppercase tracking-wider">Start now</span>
              <div className="mt-2 mb-1">
                <span className="text-3xl font-bold text-[var(--text-primary)]">$9.99</span>
                <span className="text-sm text-[var(--text-secondary)]">/week</span>
              </div>
              <span className="text-sm text-[var(--text-muted)] mb-5">Weekly</span>
              <ul className="space-y-2.5 mb-6 flex-1">
                {['Unlimited conversations', 'All 5 investigation modules', 'Pattern analysis', 'Evidence tracking'].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <CheckCircle className="w-3.5 h-3.5 text-[var(--vigil-gold)]/70 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/demo/chat" className="text-center py-3 rounded-xl text-sm font-medium bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all">
                Get started
              </Link>
            </div>

            {/* Monthly — highlighted */}
            <div className="relative p-6 rounded-2xl flex flex-col bg-[var(--vigil-gold)]/[0.06] border-2 border-[var(--vigil-gold)]/40 shadow-[0_0_40px_rgba(201,168,76,0.08)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--vigil-gold)] text-[var(--bg-primary)] text-xs font-bold px-4 py-1 rounded-full tracking-wide">
                MOST POPULAR
              </div>
              <span className="text-xs text-[var(--vigil-gold)] font-medium uppercase tracking-wider">Best value</span>
              <div className="mt-2 mb-1">
                <span className="text-3xl font-bold text-[var(--text-primary)]">$29.99</span>
                <span className="text-sm text-[var(--text-secondary)]">/month</span>
              </div>
              <span className="text-sm text-[var(--text-muted)] mb-5">Monthly</span>
              <ul className="space-y-2.5 mb-6 flex-1">
                {['Everything in Weekly', 'Confrontation toolkit', 'Legal prep guide', 'Exit planning'].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <CheckCircle className="w-3.5 h-3.5 text-[var(--vigil-gold)] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/demo/chat" className="btn-gold text-center py-3 text-sm">
                Get started
              </Link>
            </div>

            {/* Confrontation */}
            <div className="vigil-card p-6 flex flex-col">
              <span className="text-xs text-[var(--vigil-gold)] font-medium uppercase tracking-wider">Ready to act</span>
              <div className="mt-2 mb-1">
                <span className="text-3xl font-bold text-[var(--text-primary)]">$49.99</span>
                <span className="text-sm text-[var(--text-secondary)]"> one-time</span>
              </div>
              <span className="text-sm text-[var(--text-muted)] mb-5">Confrontation</span>
              <ul className="space-y-2.5 mb-6 flex-1">
                {['Complete scripts', 'Recording laws guide', 'Legal prep', 'Lifetime access'].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <CheckCircle className="w-3.5 h-3.5 text-[var(--vigil-gold)]/70 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/demo/chat" className="text-center py-3 rounded-xl text-sm font-medium bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all">
                Get started
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-[var(--text-muted)] mt-8">
            Start free — 10 messages included. No credit card required. Upgrade when ready.
          </p>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section-elevated px-5 py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--text-primary)] mb-12">
            From people who found their answers
          </h2>
          <div className="space-y-4">
            {[
              {
                text: 'I was spiraling at midnight with no one to talk to. Vigil helped me organize my thoughts and realize I actually had three patterns of evidence I\'d dismissed individually. Within a week, I had my answer.',
                author: 'Anonymous — 2 weeks',
              },
              {
                text: 'I was genuinely afraid I was being paranoid. Vigil told me honestly that most of what I\'d found was explainable. That clarity alone was worth the $10.',
                author: 'Anonymous — 3 days',
              },
              {
                text: 'The confrontation prep was everything. I knew exactly what to say, how to handle denial, and what to do after. I wasn\'t blindsided by anything.',
                author: 'Anonymous — 6 weeks',
              },
            ].map((t, i) => (
              <div key={i} className="vigil-card p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[var(--vigil-gold)] fill-[var(--vigil-gold)]" />
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="text-xs text-[var(--text-muted)] font-medium">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section-dark px-5 py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--text-primary)] mb-12">
            Common questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: 'Is this legal?',
                a: 'Yes. Vigil only guides you through legal evidence-gathering methods. It will never advise accessing someone\'s phone, accounts, or installing spy software.',
              },
              {
                q: 'Who can see my conversations?',
                a: 'No one. Your conversations are private and encrypted. We don\'t read them, share them, or sell them. Delete your account and all data at any time.',
              },
              {
                q: 'Do I need to use my real name?',
                a: 'No. You don\'t even need an email — you can start anonymously. We\'ll never ask for your real name or your partner\'s name.',
              },
              {
                q: 'What if the evidence shows they\'re NOT cheating?',
                a: 'Vigil is honest. If the evidence doesn\'t support infidelity, it will tell you. That clarity — in either direction — is what this product is for.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel from your account settings at any moment. No questions asked.',
              },
              {
                q: 'Is there a human on the other end?',
                a: 'No — Vigil is an AI powered by advanced language models. It\'s not a human therapist or PI. But it\'s available when they aren\'t — especially at 2am.',
              },
            ].map((faq, i) => (
              <details key={i} className="vigil-card overflow-hidden group">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-[var(--text-primary)]">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-[var(--text-muted)] faq-chevron shrink-0 ml-4" />
                </summary>
                <div className="px-5 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)] pt-3 -mt-px">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRIVACY SECTION ═══ */}
      <section className="section-elevated px-5 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <Lock className="w-5 h-5 text-[var(--vigil-gold)]" />
            <span className="text-[var(--vigil-gold)] font-medium text-sm uppercase tracking-[0.15em]">Privacy First</span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Your secret is safe here.
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto mb-10 text-sm">
            We handle your situation with the same discretion a trusted friend would. No real name needed. No data sold — ever. Delete everything instantly at any time.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Lock className="w-4 h-4" />, label: 'Encrypted data' },
              { icon: <Eye className="w-4 h-4" />, label: 'Zero content analytics' },
              { icon: <Shield className="w-4 h-4" />, label: 'Anonymous accounts' },
              { icon: <FileText className="w-4 h-4" />, label: 'Instant deletion' },
            ].map((item, i) => (
              <div key={i} className="vigil-card flex flex-col items-center gap-3 p-4">
                <div className="text-[var(--vigil-gold)]">{item.icon}</div>
                <span className="text-xs text-[var(--text-secondary)] text-center font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="section-dark px-5 py-28 relative">
        {/* Top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[var(--vigil-gold)]/[0.04] rounded-full blur-[100px]" />
        <div className="max-w-xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-5 leading-tight tracking-tight">
            You deserve to know<br />the truth.
          </h2>
          <p className="text-[var(--text-secondary)] mb-10 text-lg leading-relaxed">
            Start your investigation free — no credit card, no commitment. Just answers.
          </p>
          <Link href="/demo/chat" className="btn-gold inline-flex items-center gap-2 px-10 py-4 text-lg">
            Start your investigation
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-5 text-xs text-[var(--text-muted)]">
            10 free messages · No credit card · Cancel anytime
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-5 py-8 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-[var(--vigil-gold)]" />
            <span className="text-sm font-medium text-[var(--text-secondary)] tracking-[0.1em]">VIGIL</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-[var(--text-muted)]">
            <Link href="/pricing" className="hover:text-[var(--text-secondary)] transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-[var(--text-secondary)] transition-colors">Sign in</Link>
            <span>© 2026 Vigil</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
