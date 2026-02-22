# Vigil Design Overhaul — App Store Quality

## The Goal
Make Vigil look like it was designed by a top agency. Right now it's functional but "developer-built." 
We need the premium feel of apps like Linear, Raycast, or Bear — where you open it and immediately think "this is quality."

## Brand Identity
- **Product**: AI Relationship Investigator (Vigil)
- **Mood**: Nighttime, secretive, trustworthy, premium, emotionally warm
- **Color**: Gold/amber accent on dark — this is correct, keep it but REFINE it
- **Feel**: Like a luxury PI firm, not a SaaS dashboard

## Design System Changes

### Typography (UPGRADE)
- Display font: **DM Serif Display** (replace Instrument Serif) — more premium, editorial weight
- Body font: **DM Sans** (replace Inter) — pairs perfectly with DM Serif, slightly warmer than Inter
- Import via `next/font/google` (replace Google Fonts CDN link if any)
- Type scale: Hero 56-72px, Section headers 32-40px, Body 15-16px, Small 13px
- Letter-spacing: Display -0.02em, Body normal, Labels +0.05em uppercase

### Color Palette (REFINE, not change)
Keep gold/amber but add depth:
```
--vigil-gold: #c9a84c (keep)
--vigil-gold-light: #dbb863 (warmer, less green)
--vigil-gold-dim: #9a7a32 (keep)
--bg-primary: #09090b (slightly cooler, matches modern dark UIs)
--bg-elevated: #111113 (cleaner step)
--bg-card: #18181b (zinc-900 equivalent)
--bg-card-hover: #27272a (zinc-800)
--text-primary: #fafafa (pure white-ish, cleaner)
--text-secondary: #a1a1aa (zinc-400, neutral not warm)
--text-muted: #52525b (zinc-600)
--border-subtle: rgba(255,255,255,0.06)
--border-default: rgba(255,255,255,0.1)
--border-strong: rgba(201, 168, 76, 0.3)
```

### Spacing (DOUBLE IT)
- Section padding: 96-128px vertical (currently ~80px)
- Card padding: 28-32px (currently 24px)
- Content max-width: 640px for text, 1080px for grids
- Element gaps: Use 8px grid strictly. 16/24/32/48/64

### Radius
- Cards: 16px (keep)
- Buttons: 12px for regular, full for pills
- Inputs: 12px
- Small badges: 8px
- CONSISTENT — never mix

### Shadows (ADD DEPTH)
- Cards: `0 1px 2px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)` 
- Card hover: add subtle gold glow `0 0 20px rgba(201,168,76,0.06)`
- Elevated: `0 4px 24px rgba(0,0,0,0.4)`
- No shadow on everything — use sparingly

## Page-by-Page Instructions

### Landing Page (app/page.tsx) — THE MONEY PAGE
This needs the most dramatic improvement:

1. **Nav**: Slim, minimal. Logo left, 2-3 links center, CTA right. Height 56-60px. Blur backdrop. Border barely visible.

2. **Hero**: 
   - Remove the shield badge pill at top (generic)
   - Headline in DM Serif Display, 56-64px on mobile, 72px on desktop
   - "isn't right" in gold gradient — keep but make gradient more subtle
   - Subtext: lighter weight, 18px, max-width 480px
   - Single primary CTA (not two buttons). Gold pill button, generous padding 16px 40px
   - Below CTA: just the "2-minute assessment" link, subtle
   - Remove the "12 people investigating" fake counter — it's tacky
   - Add subtle ambient glow behind hero text (radial gradient, very faint gold)

3. **"It's 2am" quote section**:
   - This is GREAT copy. Make it shine.
   - DM Serif Display italic, 24-28px
   - More vertical padding (128px top/bottom)
   - Remove the gold divider bar — use whitespace instead
   - The "That's exactly why Vigil exists" line should be DM Sans 14px, uppercase, tracked

4. **"Why nothing else works" section**:
   - Grid of comparison cards instead of a list
   - Each card: red X icon, option name bold, problem in muted text
   - 2 columns on desktop, 1 on mobile
   - Cards with subtle hover effect

5. **"How it works" section**:
   - Numbered steps (01, 02, 03, 04) with gold accent
   - More whitespace between steps
   - Icons slightly larger (48x48 icon containers)
   - Remove the vertical connecting line (cluttered)

6. **Chat preview section**:
   - This is a KEY conversion element. Make it look like a real app screenshot.
   - Add subtle shadow and rounded corners to make it feel like a floating device
   - Slightly larger text inside the chat
   - Add a subtle gradient/glow behind the chat mockup

7. **Features grid**:
   - 3x2 grid with more generous spacing
   - Icon containers: 44x44, rounded-xl, gold/5 bg
   - Titles in DM Sans semibold 16px
   - Descriptions in 14px secondary

8. **Pricing**:
   - Keep 3-tier layout but make "Most Popular" card genuinely stand out
   - Popular card: Slight scale up (scale-105), stronger gold border glow
   - Other cards: more subtle, zinc borders not gold

9. **Testimonials**:
   - Add quotation marks (styled, DM Serif Display, large, gold, decorative)
   - Star ratings are good, keep them

10. **FAQ**:
    - Clean accordion. No card borders, just a subtle separator line between items
    - Smooth open/close animation (already has chevron rotation)

11. **Final CTA**:
    - Simple. "You deserve to know the truth." in DM Serif Display
    - One gold button
    - Lots of space

12. **Footer**: 
    - Minimal. Logo, 4 links, copyright. Single row.

### Demo Layout (app/demo/layout.tsx)
- Sidebar: Cleaner, more spacing between nav items. Active state with left gold bar indicator, not just color change
- Bottom nav: Slightly taller (60px safe area), icons 20px, labels 11px
- Add subtle page transition (framer-motion AnimatePresence)

### Chat Page (app/demo/chat/page.tsx)
- Message bubbles: Slightly more padding (16px horizontal, 12px vertical)
- User bubbles: Subtle gold gradient background (not flat gold/10)
- AI bubbles: Cleaner border, slightly rounded differently (16px all corners, 4px bottom-left)
- Typing indicator: Smoother animation
- Input bar: Taller input (48px), rounder (24px radius), send button integrated
- Suggestion chips: More polished pills, slight scale-up on hover

### Dashboard (app/demo/page.tsx)
- Progress bar: Animated fill with gold gradient
- Stats cards: More compact, cleaner borders
- Investigation modules: Cards with progress indicators

### Evidence Page (app/demo/evidence/page.tsx)
- Card-based layout with category color coding
- Add subtle entry animations (stagger)

## Animated Onboarding Flow (NEW)
Create `app/demo/onboarding/page.tsx`:
- 3 screens with swipe/click navigation
- Screen 1: "Everything stays between us" (privacy)
- Screen 2: "Tell your story, we'll organize the evidence" (how it works)  
- Screen 3: "Ready when you are" (CTA to start chat)
- Each screen: Large icon/illustration (use geometric shapes, not images), headline in DM Serif, subtext, dot indicators
- Smooth cross-fade between screens (framer-motion)
- "Skip" link top-right, "Continue" button bottom
- First-time visitors to /demo redirect here (check localStorage)

## Micro-Interactions (framer-motion)
Add these throughout (framer-motion is already installed):
1. **Page transitions**: Fade + slight upward slide on route change
2. **Card hover**: Scale 1.01, subtle shadow increase, 200ms ease
3. **Button press**: Scale 0.97 on click, spring back
4. **Section reveal**: Fade-in + translateY(20px) on scroll into view (use viewport intersection)  
5. **Chat bubbles**: Slide-in from left/right with spring physics
6. **Loading states**: Skeleton shimmer instead of spinners where possible
7. **Navigation**: Active indicator slides between items (layout animation)

## Technical Notes
- framer-motion is already installed
- Use `next/font/google` for DM Serif Display + DM Sans (not <link> tags)
- Keep all existing functionality — this is a VISUAL overhaul only
- Don't break the chat API, localStorage, evidence extraction, crisis detection
- Don't change file structure unless necessary
- Keep all existing routes working
- Commit frequently with clear messages

## Quality Bar
When done, every page should pass the "10 foot test" — you look at it from 10 feet away and think "that's a premium app." The typography, spacing, and color hierarchy should do the heavy lifting. Less decoration, more craft.

Think Linear. Think Raycast. Think Arc Browser. That level of dark-mode polish.
