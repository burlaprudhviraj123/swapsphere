import { memo } from 'react'
import { motion } from 'framer-motion'
import { Users, ShieldCheck, Leaf, Check } from 'lucide-react'
import { GlassCard } from '../glass/GlassCard.jsx'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { MOTION } from '../../theme/motion.js'
import { cn } from '../../utils/cn.js'

export const WhySwapSphereSection = memo(function WhySwapSphereSection({ className }) {
  return (
    <section 
      className={cn("w-full flex flex-col items-center", className)}
      style={{
        paddingTop: SPACING['4xl'],
        paddingBottom: SPACING['5xl']
      }}
    >
      <motion.div
        variants={MOTION.staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-[1280px] flex flex-col px-4 sm:px-6 md:px-8"
        style={{ gap: SPACING['4xl'] }}
      >
        {/* Section Header */}
        <div className="flex flex-col items-center text-center w-full" style={{ gap: SPACING.sm }}>
          <motion.h2 
            variants={MOTION.staggerItem}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight m-0"
            style={{ color: COLORS.textPrimary }}
          >
            Built for Students
          </motion.h2>
          <motion.p
            variants={MOTION.staggerItem}
            className="text-base sm:text-lg m-0 max-w-[600px]"
            style={{ color: COLORS.textSecondary }}
          >
            A trusted, sustainable, and affordable marketplace directly on your campus.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 w-full" style={{ gap: SPACING.lg }}>
          
          {/* Card 1: Campus Community */}
          <motion.div variants={MOTION.staggerItem} className="h-full flex flex-col">
            <GlassCard 
              hoverable
              padding="lg"
              fullWidth
              className="flex-1"
              header={
                <div className="flex items-center" style={{ gap: SPACING.sm }}>
                  <div 
                    className="flex items-center justify-center rounded-full flex-shrink-0" 
                    style={{ 
                      width: 40, 
                      height: 40,
                      backgroundColor: COLORS.glassTint,
                      border: `1px solid ${COLORS.glassBorder}`,
                      color: COLORS.textPrimary
                    }}
                  >
                    <Users size={20} />
                  </div>
                  <span className="font-semibold text-lg" style={{ color: COLORS.textPrimary }}>
                    Campus Community
                  </span>
                </div>
              }
            >
              <p className="text-base m-0 leading-relaxed pt-2" style={{ color: COLORS.textSecondary }}>
                Buy, sell, and swap exclusively within your college network. 
                Keep transactions local and connect safely with peers you trust.
              </p>
            </GlassCard>
          </motion.div>

          {/* Card 2: Safe Marketplace */}
          <motion.div variants={MOTION.staggerItem} className="h-full flex flex-col">
            <GlassCard 
              hoverable
              padding="lg"
              fullWidth
              className="flex-1"
              header={
                <div className="flex items-center" style={{ gap: SPACING.sm }}>
                  <div 
                    className="flex items-center justify-center rounded-full flex-shrink-0" 
                    style={{ 
                      width: 40, 
                      height: 40,
                      backgroundColor: COLORS.glassTint,
                      border: `1px solid ${COLORS.glassBorder}`,
                      color: COLORS.textPrimary
                    }}
                  >
                    <ShieldCheck size={20} />
                  </div>
                  <span className="font-semibold text-lg" style={{ color: COLORS.textPrimary }}>
                    Safe Marketplace
                  </span>
                </div>
              }
            >
              <ul className="flex flex-col m-0 p-0 list-none pt-2" style={{ gap: SPACING.sm }}>
                {[
                  'Verified student accounts.',
                  'Secure communication.',
                  'Transparent listings.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-base leading-relaxed" style={{ color: COLORS.textSecondary, gap: SPACING.xs }}>
                    <Check size={18} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.textPrimary }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

          {/* Card 3: Affordable & Sustainable */}
          <motion.div variants={MOTION.staggerItem} className="h-full flex flex-col">
            <GlassCard 
              hoverable
              padding="lg"
              fullWidth
              className="flex-1"
              header={
                <div className="flex items-center" style={{ gap: SPACING.sm }}>
                  <div 
                    className="flex items-center justify-center rounded-full flex-shrink-0" 
                    style={{ 
                      width: 40, 
                      height: 40,
                      backgroundColor: COLORS.glassTint,
                      border: `1px solid ${COLORS.glassBorder}`,
                      color: COLORS.textPrimary
                    }}
                  >
                    <Leaf size={20} />
                  </div>
                  <span className="font-semibold text-lg" style={{ color: COLORS.textPrimary }}>
                    Affordable & Sustainable
                  </span>
                </div>
              }
            >
              <ul className="flex flex-col m-0 p-0 list-none pt-2" style={{ gap: SPACING.sm }}>
                {[
                  'Save money on essentials.',
                  'Reduce unnecessary waste.',
                  'Give unused items a second life.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-base leading-relaxed" style={{ color: COLORS.textSecondary, gap: SPACING.xs }}>
                    <Check size={18} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.textPrimary }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

        </div>
      </motion.div>
    </section>
  )
})

WhySwapSphereSection.displayName = 'WhySwapSphereSection'
