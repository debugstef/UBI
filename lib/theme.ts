/**
 * UBI — Barranco ink, matte pass
 * Low-chroma, dim-bar lighting. No LED mint, no hot coral neon.
 */
export const colors = {
  background: '#0B0A09',
  surface: '#151311',
  deepGreen: '#25211E',
  // Primary accent: dusty brick (matte), not hot coral
  neonGreen: '#A65A45',
  storeGreen: '#5F7364',
  champagne: '#D9D2C5',
  // Brass dulled
  gold: '#9E8B6A',
  purple: '#7A736C',
  electricBlue: '#6E7882',
  magenta: '#8F6558',
  alert: '#B54E4E',
  text: '#E6E0D6',
  muted: '#9B958C',
  dim: '#625E58',
  borderGreen: 'rgba(166,90,69,0.35)',
  borderGold: 'rgba(158,139,106,0.38)',
};

export const gradients = {
  night: ['#0B0A09', '#100E0C', '#151311', '#0B0A09'] as const,
  cta: ['#A65A45', '#A65A45'] as const,
  story: ['#151311', '#25211E', '#151311', '#0B0A09'] as const,
};
