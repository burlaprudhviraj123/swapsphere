import { forwardRef, memo } from 'react'
import { motion } from 'framer-motion'
import Glass from './Glass.jsx'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { RADIUS } from '../../theme/radius.js'
import { MOTION } from '../../theme/motion.js'
import { cn } from '../../utils/cn.js'

const CARD_PADDING = {
  none: '0px',
  sm: `${SPACING.sm}px`,
  md: `${SPACING.cardPadding}px`,
  lg: `${SPACING.lg}px`,
}

const CARD_BASE_CLASSES = 'flex w-full flex-col text-left h-full'

const CARD_CONTENT_STYLE = {
  color: COLORS.textPrimary,
}

function resolveCardPadding(padding) {
  return CARD_PADDING[padding] ?? CARD_PADDING.md
}

function handleKeyDown(event, onClick) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onClick?.(event)
  }
}

function CardSection({ children, bordered = false, isFooter = false }) {
  if (!children) return null

  return (
    <div
      className={cn(isFooter ? 'mt-auto' : bordered && 'border-solid')}
      style={{
        paddingBottom: bordered ? SPACING.sm : undefined,
        marginBottom: bordered ? SPACING.sm : undefined,
        paddingTop: isFooter ? SPACING.sm : undefined,
        marginTop: isFooter ? SPACING.sm : undefined,
        borderBottomWidth: bordered ? SPACING.borderWidth : undefined,
        borderTopWidth: isFooter ? SPACING.borderWidth : undefined,
        borderColor: COLORS.glassBorder,
        gap: SPACING.xs,
      }}
    >
      {children}
    </div>
  )
}

export const GlassCard = memo(
  forwardRef(function GlassCard(
    {
      children,
      className,
      padding = 'md',
      hoverable = false,
      clickable = false,
      fullWidth = false,
      onClick,
      header,
      footer,
    },
    ref,
  ) {
    const { whileHover, whileTap, transition } = MOTION.hoverLift
    const enableHover = hoverable

    return (
      <motion.div
        ref={ref}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={clickable ? onClick : undefined}
        onKeyDown={clickable ? (event) => handleKeyDown(event, onClick) : undefined}
        className={cn(
          fullWidth ? 'w-full' : 'inline-block',
          clickable && 'cursor-pointer focus-visible:outline focus-visible:outline-offset-2',
          className
        )}
        style={clickable ? { outlineColor: COLORS.textPrimary } : undefined}
        whileHover={enableHover ? whileHover : undefined}
        whileTap={clickable ? whileTap : undefined}
        transition={transition}
      >
        <Glass
          cornerRadius={RADIUS.glass}
          className={cn(fullWidth && 'w-full', 'h-full')}
          style={fullWidth ? { width: '100%' } : undefined}
        >
          <div className={CARD_BASE_CLASSES} style={{ ...CARD_CONTENT_STYLE, padding: resolveCardPadding(padding) }}>
            <CardSection bordered>{header}</CardSection>
            <div className="flex flex-col flex-1 h-full w-full min-h-0">{children}</div>
            <CardSection isFooter>{footer}</CardSection>
          </div>
        </Glass>
      </motion.div>
    )
  }),
)

GlassCard.displayName = 'GlassCard'


