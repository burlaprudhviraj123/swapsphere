/**
 * SwapSphere color tokens — single source of truth.
 * Apple VisionOS–inspired dark liquid-glass palette.
 * Import COLORS everywhere; never hardcode hex values in components.
 */

/** @type {Readonly<Record<string, string>>} */
export const COLORS = Object.freeze({
  /** Deepest canvas — ultra-dark environment behind glass layers */
  background: '#09090B',

  /** Slightly lifted base for sections and scroll regions */
  backgroundElevated: '#111113',

  /** Opaque fallback beneath frosted glass panels */
  surface: '#18181B',

  /** Raised panels, sidebars, and nested containers */
  surfaceLight: '#232326',

  /** Frost wash applied over liquid-glass surfaces */
  glassTint: 'rgba(255, 255, 255, 0.06)',

  /** Brighter frost wash for active or hovered glass elements */
  glassTintActive: 'rgba(255, 255, 255, 0.1)',

  /** Hairline edge highlight — simulates glass rim catch-light */
  glassBorder: 'rgba(255, 255, 255, 0.12)',

  /** Brighter hairline edge highlight for active states */
  glassBorderActive: 'rgba(255, 255, 255, 0.20)',

  /** Modal and sheet scrim — dims content without crushing glass */
  overlay: 'rgba(9, 9, 11, 0.72)',

  /** Headings, labels, and primary body copy */
  textPrimary: '#F4F4F5',

  /** Supporting copy, metadata, and secondary labels */
  textSecondary: '#A1A1AA',

  /** Placeholders, disabled states, and de-emphasized text */
  textMuted: '#71717A',

  /** Pure white — icons, highlights, and glass specular accents */
  white: '#FFFFFF',

  /** Pure black — shadows, masks, and depth anchors */
  black: '#000000',

  /** Confirmations and positive states — muted, not neon */
  success: '#52C67A',

  /** Caution and pending states — warm amber, not electric orange */
  warning: '#D9A066',

  /** Errors and destructive actions — soft red, not fluorescent */
  danger: '#E06363',
});

export default COLORS;
