import { forwardRef, memo } from 'react'
import { motion } from 'framer-motion'
import Glass from './Glass.jsx'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { RADIUS } from '../../theme/radius.js'
import { MOTION } from '../../theme/motion.js'
import { cn } from '../../utils/cn.js'

export const GlassChip = memo(
  forwardRef(function GlassChip(
    {
      label,
      icon,
      active = false,
      onClick,
      className,
      ...props
    },
    ref,
  ) {
    const isInteractive = !!onClick
    const { whileHover, whileTap, transition } = MOTION.hoverScale

    return (
      <motion.div
        ref={ref}
        className={cn('inline-block', className)}
        whileHover={isInteractive ? whileHover : undefined}
        whileTap={isInteractive ? whileTap : undefined}
        transition={transition}
      >
        <Glass
          cornerRadius={RADIUS.pill}
          active={active}
          className={cn(
            'transition-colors duration-300',
            isInteractive && 'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]',
          )}
          onClick={onClick}
          role={isInteractive ? 'button' : undefined}
          tabIndex={isInteractive ? 0 : undefined}
          onKeyDown={(e) => {
            if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              onClick?.(e)
            }
          }}
          {...props}
        >
          <div 
            className="flex items-center justify-center w-full h-full"
            style={{ gap: SPACING.sm, padding: `${SPACING.sm}px ${SPACING.lg}px` }}
          >
            {icon && (
              <div 
                className="flex items-center justify-center pointer-events-none"
                style={{ color: active ? COLORS.textPrimary : COLORS.textSecondary }}
              >
                {icon}
              </div>
            )}
            <span 
              className="text-sm font-medium whitespace-nowrap pointer-events-none"
              style={{ color: active ? COLORS.textPrimary : COLORS.textSecondary }}
            >
              {label}
            </span>
          </div>
        </Glass>
      </motion.div>
    )
  })
)

GlassChip.displayName = 'GlassChip'
