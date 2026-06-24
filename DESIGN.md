---
name: Singularity Horizon
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#cebdff'
  on-secondary: '#381385'
  secondary-container: '#4f319c'
  on-secondary-container: '#bea8ff'
  tertiary: '#c7c5d1'
  on-tertiary: '#2f3039'
  tertiary-container: '#90909a'
  on-tertiary-container: '#282932'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#cebdff'
  on-secondary-fixed: '#21005e'
  on-secondary-fixed-variant: '#4f319c'
  tertiary-fixed: '#e3e1ed'
  tertiary-fixed-dim: '#c7c5d1'
  on-tertiary-fixed: '#1a1b23'
  on-tertiary-fixed-variant: '#46464f'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Sora
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Sora
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
This design system centers on a cinematic, atmospheric aesthetic inspired by deep-space exploration and celestial phenomena. The target audience includes tech-forward enthusiasts and creative professionals who value high-fidelity, immersive interfaces. 

The style is a fusion of **Glassmorphism** and **High-Contrast Modernism**. It prioritizes depth through layered luminescence, "light-leak" gradients, and a sense of vastness achieved through purposeful negative space. Every interaction should feel like a localized event within a larger cosmic void—precise, fluid, and evocative.

## Colors
The palette is anchored by "Obsidian Void" (#0a0a0b), providing a near-infinite depth for the vibrant purple hues to resonate. 

- **Primary (Cosmic Purple):** Used for core actions and critical navigational paths.
- **Secondary (Amethyst):** Applied to supporting elements, active states, and highlights.
- **Tertiary (Starlight):** A high-contrast off-white used for primary text to ensure maximum legibility against dark backgrounds.
- **Atmospheric Gradients:** Backgrounds should utilize radial gradients transitioning from `#1e1b4b` (Deep Indigo) at the edges to `#0a0a0b` at the center to mimic gravitational lensing.

## Typography
Typography is utilized as a structural element to contrast the soft gradients of the UI. The **Sora** typeface provides a geometric yet futuristic feel. 

Large display titles should use tight letter spacing and heavy weights to command attention, reminiscent of cinematic title cards. Functional text (body and labels) should maintain generous line heights to ensure clarity against the dark, high-contrast background. Use `label-caps` for secondary metadata and category headers to provide a technical, data-driven feel.

## Layout & Spacing
The design system employs a **Fluid Grid** with wide margins to create a sense of scale and "breathing room." 

- **Desktop:** A 12-column grid with 64px outer margins. Use large vertical gaps (80px+) between major sections to prevent the UI from feeling cluttered.
- **Mobile:** A 4-column grid with 20px margins. 
- **Rhythm:** All spacing should be multiples of the 8px base unit. Component internal padding should be generous to support the atmospheric, premium feel.

## Elevation & Depth
Depth is not communicated through traditional drop shadows, but through **Luminance and Blur**.

- **Surface Tiers:** Higher elevation levels are represented by increasing the opacity of the glass fill and the intensity of the inner border glow.
- **Backdrop Blur:** All floating containers (cards, modals) must apply a `24px` to `40px` backdrop blur to "sample" the cosmic background.
- **Glow Borders:** Use a 1px solid border at 20% opacity of the `secondary_color`. On the top-left edge, apply a linear gradient "shine" to simulate a distant light source hitting the element.

## Shapes
The shape language is "Soft Geometric." Containers and buttons use a `0.5rem` (8px) base radius to feel modern and accessible. For high-level containers or "Hero" cards, use `rounded-xl` (1.5rem) to emphasize the soft, fluid nature of the glassmorphic panels. Interactive elements like tags or category chips should remain pill-shaped to contrast with the more architectural card structures.

## Components
- **Buttons:** Primary buttons use a vibrant gradient from `primary_color` to `secondary_color`. Secondary buttons use a "ghost" style with a 1px Cosmic Purple border and a subtle hover glow.
- **Glass Cards:** Backgrounds use `#ffffff` at 4-8% opacity with a heavy backdrop blur. Include a subtle "noise" texture overlay (2% opacity) to add a film-grain cinematic quality.
- **Inputs:** Dark fields with a `1px` bottom border that illuminates to full `secondary_color` intensity upon focus.
- **Chips/Status:** Use high-saturation purples with a glow effect (`box-shadow: 0 0 10px #8b5cf633`).
- **Data Visualizations:** Use neon-style lines and glowing nodes. Avoid solid fills; prefer gradients and varying line weights to maintain the "Interstellar" aesthetic.