import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Vigil — AI Relationship Investigator'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0c0b09 0%, #141210 50%, #0c0b09 100%)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Subtle gold radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(201, 168, 76, 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Eye icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(201, 168, 76, 0.1)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>

        {/* Brand */}
        <div
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#c9a84c',
            letterSpacing: '0.2em',
            marginBottom: '32px',
          }}
        >
          VIGIL
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '52px',
            fontWeight: 700,
            color: '#f0ebe0',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '800px',
            marginBottom: '16px',
          }}
        >
          You know something
        </div>
        <div
          style={{
            fontSize: '52px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #e0c070, #c9a84c, #a68a3a)',
            backgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '24px',
          }}
        >
          isn&apos;t right.
        </div>

        {/* Subhead */}
        <div
          style={{
            fontSize: '20px',
            color: '#b8a98a',
            textAlign: 'center',
            maxWidth: '600px',
            lineHeight: 1.5,
          }}
        >
          AI relationship investigator. Private. Methodical. Available at 2am.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '14px',
            color: '#7a6f5e',
          }}
        >
          <span>Free to start</span>
          <span style={{ color: '#c9a84c' }}>•</span>
          <span>No credit card</span>
          <span style={{ color: '#c9a84c' }}>•</span>
          <span>100% private</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
