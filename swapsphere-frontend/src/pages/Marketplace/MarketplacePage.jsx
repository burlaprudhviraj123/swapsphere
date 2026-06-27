import { memo, useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppLayout } from '../../layouts/AppLayout.jsx'
import { GlassNavbar } from '../../components/glass/GlassNavbar.jsx'
import { GlassButton } from '../../components/glass/GlassButton.jsx'
import { GlassChip } from '../../components/glass/GlassChip.jsx'
import { GlassModal } from '../../components/glass/GlassModal.jsx'
import { GlassRangeSlider } from '../../components/glass/GlassRangeSlider.jsx'
import { ProductPreviewCard } from '../../components/marketplace/ProductPreviewCard.jsx'
import { ProductSkeleton } from '../../components/marketplace/ProductSkeleton.jsx'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { MOTION } from '../../theme/motion.js'
import { CATEGORY_MAP, CATEGORIES } from '../../utils/categoryMap.js'
import { PackageX, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { productService } from '../../services/productService.js'

const NAVBAR_LINKS = [
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'messages', label: 'Messages' },
  { id: 'my-activity', label: 'My Activity' }
]

const Logo = () => (
  <a href="/" className="flex items-center no-underline cursor-pointer" style={{ gap: SPACING.xs }}>
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ 
        background: '#111',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <span className="text-white font-bold text-lg" style={{ fontFamily: 'sans-serif' }}>S</span>
    </div>
    <span className="font-semibold text-xl tracking-tight hidden sm:block" style={{ color: COLORS.textPrimary }}>
      SwapSphere
    </span>
  </a>
)

// Condition Options matching backend filter requirements
const CONDITION_OPTIONS = ['Brand New', 'Like New', 'Good', 'Fair']

const NORMALIZE_CONDITION = {
  'Brand New': 'NEW',
  'Like New': 'LIKE_NEW',
  'Good': 'GOOD',
  'Fair': 'FAIR',
  'Poor': 'POOR',
  'NEW': 'NEW',
  'LIKE_NEW': 'LIKE_NEW',
  'GOOD': 'GOOD',
  'FAIR': 'FAIR',
  'POOR': 'POOR'
}

// Sort Options mapping value -> display label
const SORT_OPTIONS = [
  { value: 'LATEST', label: 'Latest Listed' },
  { value: 'OLDEST', label: 'Oldest Listed' },
  { value: 'RECENT_UPDATE', label: 'Recently Updated' },
  { value: 'PRICE_LOW_HIGH', label: 'Price : Low → High' },
  { value: 'PRICE_HIGH_LOW', label: 'Price : High → Low' },
  { value: 'NAME_A_Z', label: 'Name : A → Z' },
  { value: 'NAME_Z_A', label: 'Name : Z → A' }
]

// Mock product generator with timestamps, price ranges, and central categories
const generateMockProducts = (count) => Array.from({ length: count }, (_, i) => {
  const categoryKey = CATEGORIES[i % CATEGORIES.length]
  return {
    id: `prod-${i}`,
    title: `${CATEGORY_MAP[categoryKey]} Placeholder ${i + 1}`,
    price: Math.floor(Math.random() * 4500) + 150, // range: 150 - 4650
    condition: CONDITION_OPTIONS[Math.floor(Math.random() * CONDITION_OPTIONS.length)],
    category: categoryKey,
    seller: { name: `Student ${i + 1}` },
    createdAt: Date.now() - Math.floor(Math.random() * 100000000), // timestamp logic
    updatedAt: Date.now() - Math.floor(Math.random() * 50000000)
  }
})

export const MarketplacePage = memo(function MarketplacePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const categoryQuery = searchParams.get('category') || ''

  const [viewState, setViewState] = useState('loading') // loading | populated
  const [products, setProducts] = useState([])

  // Modal Open States
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  // Applied State (Triggers actual filter / data pipeline)
  const [appliedFilters, setAppliedFilters] = useState({
    categories: categoryQuery ? [categoryQuery.toUpperCase()] : [], // Sync category URL param
    priceRange: { min: 0, max: 1000000 },
    conditions: [] // Empty means select all
  })
  const [appliedSort, setAppliedSort] = useState('LATEST')

  // Temporary State inside modals (for cancellation / apply mechanics)
  const [tempFilters, setTempFilters] = useState({
    categories: categoryQuery ? [categoryQuery.toUpperCase()] : [],
    priceRange: { min: 0, max: 1000000 },
    conditions: []
  })
  const [tempSort, setTempSort] = useState('LATEST')

  // Sync category URL parameter changes to applied filters
  useEffect(() => {
    if (categoryQuery) {
      setAppliedFilters(prev => ({ ...prev, categories: [categoryQuery.toUpperCase()] }))
    }
  }, [categoryQuery])

  // Fetch real products from backend instead of generating mock items
  useEffect(() => {
    let active = true
    setViewState('loading')
    
    const loadProducts = async () => {
      try {
        let data
        if (searchQuery) {
          data = await productService.searchProducts(searchQuery, 0, 100)
        } else {
          data = await productService.getAllProducts(0, 100)
        }
        if (active) {
          const list = Array.isArray(data) ? data : (data?.content || [])
          setProducts(list)
          setViewState('populated')
        }
      } catch (err) {
        console.error('Failed to load products:', err)
        if (active) {
          setProducts([])
          setViewState('populated')
        }
      }
    }
    loadProducts()

    return () => {
      active = false
    }
  }, [searchQuery])

  // Sync temp state with applied state whenever modals open
  useEffect(() => {
    if (isFilterOpen) {
      setTempFilters({ ...appliedFilters })
    }
  }, [isFilterOpen, appliedFilters])

  useEffect(() => {
    if (isSortOpen) {
      setTempSort(appliedSort)
    }
  }, [isSortOpen, appliedSort])

  // Quick Category Chip helper (memoized)
  const handleQuickCategoryChange = useCallback((catKey) => {
    if (catKey === 'ALL') {
      setAppliedFilters(prev => ({ ...prev, categories: [] }))
    } else {
      setAppliedFilters(prev => ({ ...prev, categories: [catKey] }))
    }
  }, [])

  // Multi-select Category toggle helper (memoized)
  const toggleTempCategory = useCallback((catKey) => {
    setTempFilters(prev => {
      const exists = prev.categories.includes(catKey)
      const categories = exists 
        ? prev.categories.filter(c => c !== catKey) 
        : [...prev.categories, catKey]
      return { ...prev, categories }
    })
  }, [])

  // Multi-select Condition toggle helper (memoized)
  const toggleTempCondition = useCallback((condition) => {
    setTempFilters(prev => {
      const exists = prev.conditions.includes(condition)
      const conditions = exists
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
      return { ...prev, conditions }
    })
  }, [])

  // Modal actions (memoized)
  const applyFilters = useCallback(() => {
    setAppliedFilters({ ...tempFilters })
    setIsFilterOpen(false)
  }, [tempFilters])

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      categories: [],
      priceRange: { min: 0, max: 1000000 },
      conditions: []
    }
    setTempFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
    setIsFilterOpen(false)
    if (searchQuery || categoryQuery) {
      navigate('/marketplace', { replace: true })
    }
  }, [navigate, searchQuery, categoryQuery])

  const applySort = useCallback((option) => {
    setAppliedSort(option)
    setIsSortOpen(false)
  }, [])

  // Pipeline: Filter -> Sort (memoized calculations)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category filtering (case-insensitive enum matching)
      if (appliedFilters.categories.length > 0) {
        const prodCat = (product.category || '').toUpperCase()
        const match = appliedFilters.categories.some(c => c.toUpperCase() === prodCat)
        if (!match) return false
      }
      // 2. Price range filtering
      const numPrice = Number(product.price || 0)
      if (numPrice < appliedFilters.priceRange.min || (appliedFilters.priceRange.max > 0 && numPrice > appliedFilters.priceRange.max)) {
        return false
      }
      // 3. Condition filtering
      if (appliedFilters.conditions.length > 0) {
        const productCond = NORMALIZE_CONDITION[product.condition] || product.condition
        const targetConds = appliedFilters.conditions.map(c => NORMALIZE_CONDITION[c] || c)
        if (!targetConds.includes(productCond)) return false
      }
      return true
    })
  }, [products, appliedFilters])

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const getTimestamp = (val) => {
        if (!val) return 0
        // Handles both numeric timestamps and ISO/yyyy-MM-dd date strings
        return typeof val === 'number' ? val : new Date(val).getTime()
      }

      switch (appliedSort) {
        case 'LATEST':
          return getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
        case 'OLDEST':
          return getTimestamp(a.createdAt) - getTimestamp(b.createdAt)
        case 'RECENT_UPDATE':
          return getTimestamp(b.updatedAt) - getTimestamp(a.updatedAt)
        case 'PRICE_LOW_HIGH':
          return a.price - b.price
        case 'PRICE_HIGH_LOW':
          return b.price - a.price
        case 'NAME_A_Z':
          return (a.title || '').localeCompare(b.title || '')
        case 'NAME_Z_A':
          return (b.title || '').localeCompare(a.title || '')
        default:
          return 0
      }
    })
  }, [filteredProducts, appliedSort])

  // Dynamic derivation of active quick category chip
  const activeQuickId = appliedFilters.categories.length === 1 ? appliedFilters.categories[0] : 'ALL'

  // Memoized Navbar element
  const navbar = useMemo(() => (
    <GlassNavbar
      logo={<Logo />}
      links={NAVBAR_LINKS}
      activeId="marketplace"
      onLinkClick={(id) => navigate(`/${id}`)}
    />
  ), [navigate])

  // Memoized Product Grid to skip diffing/render execution when opening/closing modals or dragging the slider
  const productGrid = useMemo(() => {
    if (viewState === 'loading') {
      return (
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full"
          style={{ gap: SPACING.lg }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )
    }

    if (sortedProducts.length === 0) {
      return (
        <motion.div 
          key="empty"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center py-20"
          style={{ gap: SPACING.md }}
        >
          <div 
            className="rounded-full flex items-center justify-center bg-white/5"
            style={{ width: 80, height: 80 }}
          >
            <PackageX size={40} style={{ color: COLORS.textSecondary }} />
          </div>
          <div>
            <h3 className="text-xl font-semibold m-0 mb-2" style={{ color: COLORS.textPrimary }}>
              No items found
            </h3>
            <p className="text-base m-0 animate-pulse" style={{ color: COLORS.textSecondary }}>
              Try adjusting your filter parameters or categories.
            </p>
          </div>
          <GlassButton variant="ghost" onClick={resetFilters}>
            Clear Filters
          </GlassButton>
        </motion.div>
      )
    }

    return (
      <motion.div 
        key="populated"
        variants={MOTION.staggerContainer}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full"
        style={{ gap: SPACING.lg }}
      >
        {sortedProducts.map((product) => (
          <motion.div key={product.id} variants={MOTION.staggerItem} className="h-full flex flex-col">
            <ProductPreviewCard product={product} className="flex-1" />
          </motion.div>
        ))}
      </motion.div>
    )
  }, [viewState, sortedProducts, resetFilters])

  return (
    <AppLayout navbar={navbar}>
      <div className="flex flex-col w-full min-h-[70vh] pt-8 md:pt-12" style={{ gap: SPACING['3xl'], paddingBottom: SPACING['4xl'] }}>
        
        {/* Page Header with inline Filter / Sort Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full" style={{ gap: SPACING.md }}>
          <div className="flex flex-col" style={{ gap: SPACING.xs }}>
            <h1 className="text-4xl font-semibold m-0" style={{ color: COLORS.textPrimary }}>
              Marketplace
            </h1>
            <p className="text-lg m-0" style={{ color: COLORS.textSecondary }}>
              Discover and trade with verified students on campus.
            </p>
          </div>

          {/* Filter / Sort Actions (Repositioned beside Marketplace title) */}
          <div className="flex flex-row items-center flex-shrink-0" style={{ gap: SPACING.sm }}>
            <GlassButton 
              variant="ghost" 
              leftIcon={<SlidersHorizontal size={18} />}
              onClick={() => setIsFilterOpen(true)}
            >
              Filter
            </GlassButton>
            <GlassButton 
              variant="ghost" 
              leftIcon={<ArrowUpDown size={18} />}
              onClick={() => setIsSortOpen(true)}
            >
              Sort
            </GlassButton>
          </div>
        </div>

        {/* Quick Categories list (Full room width!) */}
        <div 
          className="flex items-center w-full overflow-x-auto pb-2 hide-scrollbar"
          style={{ gap: SPACING.sm }}
        >
          <GlassChip 
            label="All Items"
            active={activeQuickId === 'ALL'}
            onClick={() => handleQuickCategoryChange('ALL')}
          />
          {CATEGORIES.map(catKey => (
            <GlassChip 
              key={catKey}
              label={CATEGORY_MAP[catKey]}
              active={activeQuickId === catKey}
              onClick={() => handleQuickCategoryChange(catKey)}
            />
          ))}
        </div>

        {/* Product Grid Container */}
        <div className="relative w-full min-h-[400px]">
          <AnimatePresence mode="wait">
            {productGrid}
          </AnimatePresence>
        </div>

      </div>

      {/* FILTER GLASS MODAL */}
      <GlassModal
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Products"
        size="md"
        footer={
          <div className="flex items-center justify-end w-full" style={{ gap: SPACING.sm }}>
            <GlassButton variant="ghost" onClick={resetFilters}>
              Reset All
            </GlassButton>
            <GlassButton variant="primary" onClick={applyFilters}>
              Apply Filters
            </GlassButton>
          </div>
        }
      >
        <div className="flex flex-col w-full" style={{ gap: '28px', paddingBottom: '12px' }}>
          {/* Category Selector Section */}
          <div className="flex flex-col w-full" style={{ gap: '10px' }}>
            <span className="text-sm font-semibold uppercase tracking-wider text-white/50">Categories</span>
            <div className="flex flex-wrap items-center w-full" style={{ gap: '8px' }}>
              {CATEGORIES.map(catKey => {
                const isSelected = tempFilters.categories.includes(catKey)
                return (
                  <GlassChip
                    key={catKey}
                    label={CATEGORY_MAP[catKey]}
                    active={isSelected}
                    onClick={() => toggleTempCategory(catKey)}
                  />
                )
              })}
            </div>
          </div>

          {/* Dual-Thumb Price Slider Section */}
          <div className="flex flex-col w-full" style={{ gap: '10px' }}>
            <span className="text-sm font-semibold uppercase tracking-wider text-white/50">Price Range</span>
            <div className="px-1.5 pt-2">
              <GlassRangeSlider
                minValue={0}
                maxValue={5000}
                currentMin={tempFilters.priceRange.min}
                currentMax={tempFilters.priceRange.max}
                onChange={(min, max) => {
                  setTempFilters(prev => ({ ...prev, priceRange: { min, max } }))
                }}
              />
            </div>
          </div>

          {/* Condition Selector Section */}
          <div className="flex flex-col w-full" style={{ gap: '10px' }}>
            <span className="text-sm font-semibold uppercase tracking-wider text-white/50">Condition</span>
            <div className="flex flex-wrap items-center w-full" style={{ gap: '8px' }}>
              {CONDITION_OPTIONS.map(condition => {
                const isSelected = tempFilters.conditions.includes(condition)
                return (
                  <GlassChip
                    key={condition}
                    label={condition}
                    active={isSelected}
                    onClick={() => toggleTempCondition(condition)}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </GlassModal>

      {/* SORT GLASS MODAL */}
      <GlassModal
        open={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        title="Sort Options"
        size="sm"
      >
        <div className="flex flex-col w-full" style={{ gap: '6px' }}>
          {SORT_OPTIONS.map((option) => {
            const isSelected = tempSort === option.value
            return (
              <button
                key={option.value}
                onClick={() => {
                  setTempSort(option.value)
                  applySort(option.value)
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-transparent bg-transparent hover:bg-white/5 transition-all text-left outline-none cursor-pointer"
                style={{
                  color: isSelected ? COLORS.textPrimary : 'rgba(255, 255, 255, 0.65)'
                }}
              >
                <span className="text-base font-medium">{option.label}</span>
                {/* Custom Glass Radio Indicator */}
                <div 
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected 
                      ? 'border-white bg-white/20 shadow-[0_0_8px_rgba(255,255,255,0.4)]' 
                      : 'border-white/25 hover:border-white/50'
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
              </button>
            )
          })}
        </div>
      </GlassModal>
    </AppLayout>
  )
})

MarketplacePage.displayName = 'MarketplacePage'



