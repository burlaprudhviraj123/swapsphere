import { cloneElement, forwardRef, isValidElement, memo } from 'react'
import { motion } from 'framer-motion'
import Glass from './Glass.jsx'
import { RADIUS } from '../../theme/radius.js'
import { MOTION } from '../../theme/motion.js'
import {
  BUTTON_BASE_CLASSES,
  getButtonStyle,
  getGlassPadding,
  resolveSizeConfig,
  resolveVariantConfig,
} from '../../theme/buttonTheme.js'
import { LoadingSpinner } from '../shared/LoadingSpinner.jsx'
import { cn } from '../../utils/cn.js'

function renderIcon(icon, iconSize) {
  if (!icon) return null

  if (isValidElement(icon)) {
    return cloneElement(icon, {
      'aria-hidden': true,
      size: iconSize,
    })
  }

  return icon
}

function ButtonContent({
  loading,
  leftIcon,
  rightIcon,
  children,
  leftIconOnly,
  rightIconOnly,
  iconSize,
}) {
  if (loading) {
    return <LoadingSpinner size={iconSize} />
  }

  if (leftIconOnly) {
    return renderIcon(leftIcon, iconSize)
  }

  if (rightIconOnly) {
    return renderIcon(rightIcon, iconSize)
  }

  return (
    <span className="inline-flex items-center justify-center gap-2 leading-none">
      {renderIcon(leftIcon, iconSize)}
      {children && <span className="inline-flex items-center justify-center leading-none">{children}</span>}
      {renderIcon(rightIcon, iconSize)}
    </span>
  )
}

export const GlassButton = memo(
  forwardRef(function GlassButton(
    {
      children,
      leftIcon,
      rightIcon,
      leftIconOnly = false,
      rightIconOnly = false,
      loading = false,
      disabled = false,
      fullWidth = false,
      size = 'md',
      variant = 'primary',
      onClick,
      type = 'button',
      className,
      'aria-label': ariaLabel,
      title,
      autoFocus,
      tabIndex,
    },
    ref,
  ) {
    const isDisabled = disabled || loading
    const isIconOnly = leftIconOnly || rightIconOnly
    const sizeConfig = resolveSizeConfig(size)
    const variantConfig = resolveVariantConfig(variant)
    const { whileHover, whileTap, transition } = MOTION.hoverPress

    return (
      <motion.div
        className={cn(fullWidth ? 'w-full' : 'inline-flex items-center justify-center')}
        whileHover={isDisabled ? undefined : whileHover}
        whileTap={isDisabled ? undefined : whileTap}
        transition={transition}
      >
        <Glass
          cornerRadius={RADIUS.pill}
          variant={variant}
          className={cn('h-full flex items-center justify-center', fullWidth && 'w-full', className)}
          style={fullWidth ? { width: '100%' } : undefined}
          onClick={onClick}
        >
          <button
            ref={ref}
            type={type}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            aria-busy={loading}
            aria-label={ariaLabel}
            title={title}
            autoFocus={autoFocus}
            tabIndex={tabIndex}
            onClick={(e) => {
              e.stopPropagation()
              onClick?.(e)
            }}
            className={cn(BUTTON_BASE_CLASSES, sizeConfig.textClass, 'w-full h-full flex items-center justify-center')}
            style={{ 
              ...getButtonStyle(sizeConfig, variantConfig, isDisabled),
              padding: className?.includes('h-') ? '0 24px' : getGlassPadding(sizeConfig, isIconOnly)
            }}
          >
            <ButtonContent
              loading={loading}
              leftIcon={leftIcon}
              rightIcon={rightIcon}
              leftIconOnly={leftIconOnly}
              rightIconOnly={rightIconOnly}
              iconSize={sizeConfig.iconSize}
            >
              {children}
            </ButtonContent>
          </button>
        </Glass>
      </motion.div>
    )
  }),
)

GlassButton.displayName = 'GlassButton'
