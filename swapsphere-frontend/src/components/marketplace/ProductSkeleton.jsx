import { memo } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '../glass/GlassCard.jsx'
import { RADIUS } from '../../theme/radius.js'
import { SPACING } from '../../theme/spacing.js'

const shimmer = {
  initial: { opacity: 0.3 },
  animate: { opacity: 0.7 },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut'
  }
}

export const ProductSkeleton = memo(function ProductSkeleton() {
  const footer = (
    <div className="flex items-center w-full px-2" style={{ gap: SPACING.sm }}>
      <motion.div 
        className="rounded-full bg-white/10 flex-shrink-0"
        style={{ width: 24, height: 24 }}
        {...shimmer}
      />
      <motion.div 
        className="rounded bg-white/10 h-4 w-24"
        {...shimmer}
      />
    </div>
  )

  return (
    <GlassCard fullWidth padding="sm" footer={footer}>
      {/* Image Placeholder */}
      <motion.div 
        className="w-full bg-white/5"
        style={{ 
          aspectRatio: '4/3', 
          borderRadius: RADIUS.sm,
          marginBottom: SPACING.md
        }}
        {...shimmer}
      />
      
      {/* Text Placeholders */}
      <div className="flex flex-col w-full px-2" style={{ gap: SPACING.sm }}>
        <motion.div className="h-5 w-3/4 rounded bg-white/10" {...shimmer} />
        <motion.div className="h-5 w-1/4 rounded bg-white/10" {...shimmer} />
      </div>
      <div className="mt-2" />
    </GlassCard>
  )
})

ProductSkeleton.displayName = 'ProductSkeleton'
