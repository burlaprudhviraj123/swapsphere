import { memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ProductPreviewCard } from '../marketplace/ProductPreviewCard.jsx'
import { GlassButton } from '../glass/GlassButton.jsx'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { MOTION } from '../../theme/motion.js'
import { cn } from '../../utils/cn.js'

const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Calculus Early Transcendentals 9th Ed',
    price: '45',
    category: 'Books',
    sellerName: 'Alex Johnson',
    postedTime: '2 hours ago',
    availability: 'Available'
  },
  {
    id: '2',
    title: 'Sony WH-1000XM4 Headphones',
    price: '150',
    category: 'Electronics',
    sellerName: 'Sarah Miller',
    postedTime: '5 hours ago',
    availability: 'Available'
  },
  {
    id: '3',
    title: 'Mini Fridge - Perfect for Dorm',
    price: '65',
    category: 'Hostel Items',
    sellerName: 'David Chen',
    postedTime: '1 day ago',
    availability: 'Pending'
  },
  {
    id: '4',
    title: 'Texas Instruments TI-84 Plus',
    price: '80',
    category: 'Calculators',
    sellerName: 'Emma Watson',
    postedTime: '2 days ago',
    availability: 'Available'
  }
]

export const RecentProductsSection = memo(function RecentProductsSection({ 
  className,
  products = [],
  onProductClick,
  onViewAll
}) {
  const displayProducts = products && products.length > 0 ? products : MOCK_PRODUCTS

  return (
    <section 
      className={cn("w-full flex flex-col items-center", className)}
      style={{
        paddingTop: SPACING['3xl'],
        paddingBottom: SPACING['4xl']
      }}
    >
      <motion.div
        variants={MOTION.staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-[1280px] flex flex-col px-4 sm:px-6 md:px-8"
        style={{ gap: SPACING.xl }}
      >
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between w-full" style={{ gap: SPACING.md }}>
          <div className="flex flex-col" style={{ gap: SPACING.xs }}>
            <motion.h2 
              variants={MOTION.staggerItem}
              className="text-2xl sm:text-3xl font-semibold tracking-tight m-0"
              style={{ color: COLORS.textPrimary }}
            >
              Recently Added
            </motion.h2>
            <motion.p
              variants={MOTION.staggerItem}
              className="text-sm sm:text-base m-0"
              style={{ color: COLORS.textSecondary }}
            >
              Fresh listings from students on campus.
            </motion.p>
          </div>
          
          <motion.div variants={MOTION.staggerItem} className="hidden sm:block">
            <GlassButton 
              variant="ghost" 
              size="sm" 
              rightIcon={<ArrowRight />}
              onClick={onViewAll}
            >
              View Marketplace
            </GlassButton>
          </motion.div>
        </div>

        {/* Responsive Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full"
          style={{ gap: SPACING.md }}
        >
          {displayProducts.map((product) => (
            <motion.div key={product.id} variants={MOTION.staggerItem} className="h-full">
              <ProductPreviewCard 
                product={product} 
                onClick={() => onProductClick?.(product.id)}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Mobile-only View All Button */}
        <motion.div variants={MOTION.staggerItem} className="w-full sm:hidden flex justify-center mt-2">
          <GlassButton 
            variant="ghost" 
            fullWidth
            rightIcon={<ArrowRight />}
            onClick={onViewAll}
          >
            View Marketplace
          </GlassButton>
        </motion.div>

      </motion.div>
    </section>
  )
})

RecentProductsSection.displayName = 'RecentProductsSection'
