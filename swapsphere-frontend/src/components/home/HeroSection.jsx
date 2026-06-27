import { memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import { GlassSearch } from '../glass/GlassSearch.jsx'
import { GlassButton } from '../glass/GlassButton.jsx'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { MOTION } from '../../theme/motion.js'
import { cn } from '../../utils/cn.js'

export const HeroSection = memo(function HeroSection({ 
  className, 
  onSearch, 
  onBrowse, 
  onSell 
}) {
  return (
    <section 
      className={cn("relative w-full flex flex-col items-center justify-center text-center", className)}
      style={{ 
        minHeight: '70vh',
        paddingTop: SPACING['4xl'],
        paddingBottom: SPACING['4xl'] 
      }}
    >
      {/* Subtle ambient lighting for the VisionOS premium vibe */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center"
        style={{ zIndex: -1 }}
      >
        <div 
          className="w-full max-w-[800px] aspect-square rounded-full blur-[120px]"
          style={{
            background: `radial-gradient(circle at center, ${COLORS.glassBorderActive} 0%, transparent 70%)`,
            opacity: 0.5
          }}
        />
      </div>

      <motion.div
        variants={MOTION.staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center w-full max-w-[720px] px-4"
        style={{ gap: SPACING.xl }}
      >
        {/* Typography Stack */}
        <div className="flex flex-col items-center" style={{ gap: SPACING.md }}>
          <motion.h1 
            variants={MOTION.staggerItem}
            className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight m-0"
            style={{ color: COLORS.textPrimary }}
          >
            Find. Swap. Save.
          </motion.h1>
          
          <motion.p 
            variants={MOTION.staggerItem}
            className="text-lg sm:text-xl md:text-2xl font-normal m-0 max-w-[540px]"
            style={{ color: COLORS.textSecondary, lineHeight: 1.5 }}
          >
            Buy, sell, and exchange items within your college community.
          </motion.p>
        </div>

        {/* Primary Action: Central GlassSearch */}
        <motion.div 
          variants={MOTION.staggerItem}
          className="w-full max-w-[540px] relative z-10"
        >
          <GlassSearch 
            placeholder="Search textbooks, electronics, furniture..." 
            onSearch={onSearch}
            fullWidth
          />
        </motion.div>

        {/* Secondary Actions */}
        <motion.div 
          variants={MOTION.staggerItem}
          className="flex flex-col sm:flex-row items-center justify-center w-full mt-4"
          style={{ gap: SPACING.md }}
        >
          <GlassButton 
            variant="primary" 
            size="lg" 
            rightIcon={<ArrowRight />}
            onClick={onBrowse}
          >
            Browse Marketplace
          </GlassButton>
          
          <GlassButton 
            variant="ghost" 
            size="lg" 
            leftIcon={<Plus />}
            onClick={onSell}
          >
            Sell an Item
          </GlassButton>
        </motion.div>
      </motion.div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'
