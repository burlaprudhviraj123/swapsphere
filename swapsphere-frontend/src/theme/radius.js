/**
 * SwapSphere border-radius tokens — single source of truth.
 * Import RADIUS everywhere; never hardcode border-radius or LiquidGlass cornerRadius.
 */

/** @type {Readonly<Record<string, number>>} */
export const RADIUS = Object.freeze({
  /** Sharp edges — dividers, full-bleed media */
  none: 0,

  /** Micro rounding — code chips, compact controls */
  xs: 6,

  /** Small controls — tags, icon buttons */
  sm: 10,

  /** Default UI elements — inputs, list rows */
  md: 16,

  /** Medium panels — nested cards, popovers */
  lg: 20,

  /** Large containers — modals, hero sections */
  xl: 24,

  /** LiquidGlass default — floating glass panels and cards */
  glass: 28,

  /** Capsule shape — pill buttons, segmented controls */
  pill: 9999,

  /** Fully rounded — avatars, circular actions (same as pill) */
  full: 9999,
});
