/**
 * SwapSphere motion tokens — single source of truth for Framer Motion.
 * Apple VisionOS / macOS spring physics. Import MOTION everywhere;
 * never duplicate transition or variant objects in components.
 */

const spring = {
  type: 'spring',
  stiffness: 400,
  damping: 28,
  mass: 0.85,
};

const gentle = {
  type: 'spring',
  stiffness: 260,
  damping: 32,
  mass: 1,
};

const fast = {
  type: 'spring',
  stiffness: 520,
  damping: 34,
  mass: 0.7,
};

const slow = {
  type: 'spring',
  stiffness: 180,
  damping: 26,
  mass: 1.1,
};

/** @type {Readonly<Record<string, unknown>>} */
export const MOTION = Object.freeze({
  /** Default bouncy spring — primary UI motion */
  spring,

  /** Soft, restrained spring — large panels and overlays */
  gentle,

  /** Snappy spring — toggles, tabs, micro-interactions */
  fast,

  /** Leisurely spring — page-level and hero reveals */
  slow,

  /** Opacity-only entrance */
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: spring },
    exit: { opacity: 0, transition: fast },
  },

  /** Fade with upward drift — cards, list items */
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: spring },
    exit: { opacity: 0, y: 12, transition: fast },
  },

  /** Fade with downward drift — dropdowns, menus */
  fadeDown: {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0, transition: spring },
    exit: { opacity: 0, y: -8, transition: fast },
  },

  /** Slide in from the right */
  slideLeft: {
    initial: { opacity: 0, x: 32 },
    animate: { opacity: 1, x: 0, transition: spring },
    exit: { opacity: 0, x: 16, transition: fast },
  },

  /** Slide in from the left */
  slideRight: {
    initial: { opacity: 0, x: -32 },
    animate: { opacity: 1, x: 0, transition: spring },
    exit: { opacity: 0, x: -16, transition: fast },
  },

  /** Scale up from slightly smaller — modals, FABs */
  scaleIn: {
    initial: { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1, transition: spring },
    exit: { opacity: 0, scale: 0.96, transition: fast },
  },

  /** Parent variant — orchestrates staggered children */
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04, ...gentle },
    },
  },

  /** Child variant — pair with staggerContainer */
  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: spring },
  },

  /** Route and full-page enter/exit */
  pageTransition: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: slow },
    exit: { opacity: 0, y: -12, transition: fast },
  },

  /** Subtle elastic grow — design-system hover scale 1.02 */
  hoverScale: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: spring,
  },

  /** Float upward on hover — glass cards and panels */
  hoverLift: {
    whileHover: { y: -4 },
    whileTap: { y: 0 },
    transition: spring,
  },

  /** Tactile press feedback — buttons and dock items */
  hoverPress: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.96 },
    transition: fast,
  },

  /** Tiny perspective tilt — apply on elements with transform-style preserved */
  hoverTilt: {
    whileHover: { scale: 1.02, rotateX: 2, rotateY: -2 },
    whileTap: { scale: 0.98, rotateX: 0, rotateY: 0 },
    transition: spring,
  },
});
