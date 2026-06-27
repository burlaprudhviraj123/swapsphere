import { memo } from 'react'
import { motion } from 'framer-motion'
import { 
  Book, 
  Calculator, 
  FlaskConical, 
  Sofa, 
  Laptop, 
  Bed, 
  Dumbbell, 
  Shirt, 
  Package 
} from 'lucide-react'
import { GlassChip } from '../glass/GlassChip.jsx'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { MOTION } from '../../theme/motion.js'
import { cn } from '../../utils/cn.js'

const CATEGORIES = [
  { id: 'books', label: 'Books', icon: <Book size={16} /> },
  { id: 'calculators', label: 'Calculators', icon: <Calculator size={16} /> },
  { id: 'lab_equipment', label: 'Lab Equipment', icon: <FlaskConical size={16} /> },
  { id: 'furniture', label: 'Furniture', icon: <Sofa size={16} /> },
  { id: 'electronics', label: 'Electronics', icon: <ElectronicsIcon /> }, // Fallback to laptop icon
  { id: 'hostel_items', label: 'Hostel Items', icon: <Bed size={16} /> },
  { id: 'sports', label: 'Sports', icon: <Dumbbell size={16} /> },
  { id: 'fashion', label: 'Fashion', icon: <Shirt size={16} /> },
  { id: 'other', label: 'Other', icon: <Package size={16} /> },
]

function ElectronicsIcon() {
  return <Laptop size={16} />
}

export const CategoriesSection = memo(function CategoriesSection({ 
  className,
  onCategoryClick 
}) {
  return (
    <section 
      className={cn("w-full flex flex-col items-center", className)}
      style={{
        paddingTop: SPACING['3xl'],
        paddingBottom: SPACING['3xl']
      }}
    >
      <motion.div
        variants={MOTION.staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-[1280px] flex flex-col items-center text-center"
        style={{ gap: SPACING.xl }}
      >
        {/* Header */}
        <div className="flex flex-col items-center px-4" style={{ gap: SPACING.xs }}>
          <motion.h2 
            variants={MOTION.staggerItem}
            className="text-3xl sm:text-4xl font-semibold tracking-tight m-0"
            style={{ color: COLORS.textPrimary }}
          >
            Explore Categories
          </motion.h2>
          <motion.p
            variants={MOTION.staggerItem}
            className="text-base sm:text-lg m-0"
            style={{ color: COLORS.textSecondary }}
          >
            Find exactly what you need for your semester.
          </motion.p>
        </div>

        {/* Category List */}
        <motion.div 
          variants={MOTION.staggerItem}
          className="w-full relative"
        >
          <div 
            className="flex md:flex-wrap items-center justify-start md:justify-center overflow-x-auto scroll-smooth w-full pb-4 md:pb-0 px-4 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ 
              gap: SPACING.sm,
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {CATEGORIES.map((cat) => (
              <GlassChip
                key={cat.id}
                label={cat.label}
                icon={cat.icon}
                onClick={() => onCategoryClick?.(cat.id)}
                className="flex-shrink-0"
              />
            ))}
          </div>
          
          {/* Mobile fade edges for horizontal scroll affordance */}
          <div 
            className="absolute top-0 right-0 bottom-4 w-12 pointer-events-none md:hidden"
            style={{
              background: `linear-gradient(to right, ${COLORS.background}00, ${COLORS.background})`
            }}
          />
          <div 
            className="absolute top-0 left-0 bottom-4 w-4 pointer-events-none md:hidden"
            style={{
              background: `linear-gradient(to left, ${COLORS.background}00, ${COLORS.background})`
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
})

CategoriesSection.displayName = 'CategoriesSection'
