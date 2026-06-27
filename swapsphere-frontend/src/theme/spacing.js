/**
 * SwapSphere spacing tokens — single source of truth.
 * 8px base grid for spacing, sizing, and layout.
 * Import SPACING everywhere; never hardcode padding, margin, gap, or layout dimensions.
 */

/** @type {Readonly<Record<string, number>>} */
export const SPACING = Object.freeze({
  /** 8px — tight gaps, icon inset, compact stacks */
  xs: 8,

  /** 16px — inline groups, form field gaps, button icon spacing */
  sm: 16,

  /** 24px — card inner rhythm, list item padding, default stack gap */
  md: 24,

  /** 32px — section padding, page gutters on tablet */
  lg: 32,

  /** 48px — generous block spacing, hero subsections */
  xl: 48,

  /** 64px — major section separation, floating panel offsets */
  '2xl': 64,

  /** 80px — large vertical breathing room, landing page blocks */
  '3xl': 80,

  /** 96px — hero spacing, full-bleed section margins */
  '4xl': 96,

  /** 128px — maximum layout whitespace, dramatic section breaks */
  '5xl': 128,

  /** Horizontal and vertical inset for page-level content */
  pagePadding: 32,

  /** Vertical gap between major page sections */
  sectionGap: 64,

  /** Internal padding for glass cards and panels */
  cardPadding: 24,

  /** Horizontal padding inside glass inputs */
  inputPaddingX: 16,

  /** Vertical padding inside glass inputs */
  inputPaddingY: 12,

  /** Horizontal padding inside glass buttons */
  buttonPaddingX: 20,

  /** Vertical padding inside glass buttons */
  buttonPaddingY: 10,

  /** Default hairline border — glass edges and dividers */
  borderWidth: 1,

  /** Lucide icon — compact controls, inline metadata */
  iconSm: 16,

  /** Lucide icon — default UI actions and list items */
  iconMd: 20,

  /** Lucide icon — navigation, primary actions */
  iconLg: 24,

  /** Lucide icon — hero features, empty states */
  iconXl: 32,

  /** Height of the floating liquid navbar */
  navbarHeight: 64,

  /** Width of the collapsible glass sidebar */
  sidebarWidth: 288,

  /** Maximum readable width for main content columns */
  contentMaxWidth: 1280,
});
