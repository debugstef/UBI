/**
 * UBI — Dichroic Cupertino
 * Purple-blue mono + immersive glass. No Barranco brick, no rainbow neon.
 */
export const colors = {
  // Core dichroic
  deepIndigo: '#0B0620',
  deepIndigoLift: '#120A2E',
  twilightViolet: '#2A1650',
  twilightVioletLift: '#3D1F6E',
  electricBlue: '#4F6BFF',
  cyanGlow: '#5CE1FF',

  // Surfaces / text
  background: '#0B0620',
  surface: '#120A2E',
  deepGreen: '#2A1650', // legacy alias → twilight surface
  text: '#F2F4FF',
  muted: '#A8B0D6',
  dim: '#6E7699',

  // Accents (primary = electricBlue; secondary = cyan / soft violet)
  neonGreen: '#4F6BFF', // legacy primary CTA → electricBlue
  storeGreen: '#5CE1FF',
  champagne: '#D4DAF5',
  gold: '#8B7EC8', // soft violet secondary (kickers, quiet chrome)
  purple: '#3D1F6E',
  magenta: '#7B5CFF',
  alert: '#FF5C7A',

  // Borders / micro-highlights
  border: 'rgba(255,255,255,0.14)',
  borderGreen: 'rgba(79,107,255,0.45)',
  borderGold: 'rgba(139,126,200,0.40)',
  borderCyan: 'rgba(92,225,255,0.50)',
};

export const gradients = {
  night: ['#0B0620', '#120A2E', '#2A1650', '#0B0620'] as const,
  cta: ['#4F6BFF', '#4F6BFF'] as const,
  story: ['#120A2E', '#2A1650', '#3D1F6E', '#0B0620'] as const,
  meshViolet: ['rgba(42,22,80,0.45)', 'transparent'] as const,
  meshBlue: ['rgba(79,107,255,0.18)', 'transparent'] as const,
  meshCyan: ['rgba(92,225,255,0.04)', 'transparent'] as const, // R3: austerity — prefer not using
};

/** 4pt spacing scale */
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

/** SF-like type ramp — system face only (no Inter/Geist/condensed) */
export const type = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '700' as const, letterSpacing: -0.6 },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const, letterSpacing: -0.4 },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const, letterSpacing: -0.3 },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600' as const, letterSpacing: -0.2 },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const, letterSpacing: -0.2 },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400' as const, letterSpacing: -0.2 },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400' as const, letterSpacing: -0.2 },
  subhead: { fontSize: 15, lineHeight: 20, fontWeight: '600' as const, letterSpacing: -0.1 },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const, letterSpacing: 0 }, // Medium on frost
  caption1: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const, letterSpacing: 0.1 },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: '500' as const, letterSpacing: 0.2 },
} as const;

/** System stack — undefined = RN default / SF-like platform UI */
export const fonts = {
  ui: undefined as string | undefined,
  display: undefined as string | undefined,
};
