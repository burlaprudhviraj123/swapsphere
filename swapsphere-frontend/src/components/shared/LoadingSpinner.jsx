import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { RADIUS } from '../../theme/radius.js'
import { cn } from '../../utils/cn.js'

export function LoadingSpinner({ size = SPACING.iconMd, className, label = 'Loading' }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-block animate-spin border-solid', className)}
      style={{
        width: size,
        height: size,
        borderWidth: SPACING.borderWidth,
        borderRadius: RADIUS.full,
        borderColor: COLORS.textMuted,
        borderTopColor: COLORS.textPrimary,
      }}
    />
  )
}
