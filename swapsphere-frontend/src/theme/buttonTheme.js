import { COLORS } from './colors.js'
import { SPACING } from './spacing.js'
import { RADIUS } from './radius.js'

/** Size presets for GlassButton — padding, icons, and typography scale */
export const SIZE_CONFIG = Object.freeze({
  sm: {
    paddingX: SPACING.sm,
    paddingY: SPACING.xs,
    iconPadding: SPACING.sm,
    iconSize: SPACING.iconSm,
    gap: SPACING.xs,
    textClass: 'text-sm',
  },
  md: {
    paddingX: SPACING.buttonPaddingX,
    paddingY: SPACING.buttonPaddingY,
    iconPadding: SPACING.buttonPaddingY,
    iconSize: SPACING.iconMd,
    gap: SPACING.xs,
    textClass: 'text-base',
  },
  lg: {
    paddingX: SPACING.md,
    paddingY: SPACING.sm,
    iconPadding: SPACING.md,
    iconSize: SPACING.iconLg,
    gap: SPACING.sm,
    textClass: 'text-lg',
  },
})

/** Variant presets for GlassButton — text, border, and surface tints */
export const VARIANT_CONFIG = Object.freeze({
  primary: {
    color: COLORS.textPrimary,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glassTint,
  },
  secondary: {
    color: COLORS.textSecondary,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glassTint,
  },
  ghost: {
    color: COLORS.textSecondary,
    borderColor: COLORS.glassTint,
    backgroundColor: COLORS.glassTint,
  },
  success: {
    color: COLORS.success,
    borderColor: COLORS.success,
    backgroundColor: COLORS.glassTint,
  },
  warning: {
    color: COLORS.warning,
    borderColor: COLORS.warning,
    backgroundColor: COLORS.glassTint,
  },
  danger: {
    color: COLORS.danger,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.glassTint,
  },
})

export const BUTTON_BASE_CLASSES =
  'inline-flex w-full items-center justify-center border-solid font-medium focus-visible:outline focus-visible:outline-offset-2'

export function resolveSizeConfig(size) {
  return SIZE_CONFIG[size] ?? SIZE_CONFIG.md
}

export function resolveVariantConfig(variant) {
  return VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.primary
}

export function getGlassPadding(sizeConfig, iconOnly) {
  if (iconOnly) {
    return `${sizeConfig.iconPadding}px`
  }

  return `${sizeConfig.paddingY}px ${sizeConfig.paddingX}px`
}

export function getButtonStyle(sizeConfig, variantConfig, isDisabled) {
  return {
    gap: sizeConfig.gap,
    color: variantConfig.color,
    background: 'transparent',
    border: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    outlineColor: COLORS.textPrimary,
  }
}
