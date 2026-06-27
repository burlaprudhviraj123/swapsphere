import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  MessageSquare, 
  Share2, 
  Clock, 
  Star, 
  User, 
  ChevronRight,
  ChevronLeft,
  Heart,
  ZoomIn,
  X,
  Edit3,
  Trash2
} from 'lucide-react'
import { AppLayout } from '../../layouts/AppLayout.jsx'
import { Glass } from '../../components/glass/Glass.jsx'
import { GlassCard } from '../../components/glass/GlassCard.jsx'
import { GlassButton } from '../../components/glass/GlassButton.jsx'
import { GlassChip } from '../../components/glass/GlassChip.jsx'
import { ProductPreviewCard } from '../../components/marketplace/ProductPreviewCard.jsx'
import toast from 'react-hot-toast'
import { productService } from '../../services/productService.js'
import { wishlistService } from '../../services/wishlistService.js'
import { conversationService } from '../../services/conversationService.js'
import { authService } from '../../services/authService.js'
import { CATEGORY_MAP } from '../../utils/categoryMap.js'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { RADIUS } from '../../theme/radius.js'

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

// Curated high quality mock product details dataset
const MOCK_DETAILS_DB = {
  'prod-0': {
    id: 'prod-0',
    title: 'Apple iPad Pro 11-inch (M4, 256GB)',
    price: 899,
    condition: 'Brand New',
    category: 'ELECTRONICS',
    description: 'Selling my brand new iPad Pro 11-inch. It has the latest Apple M4 chip, 256GB of storage, and a gorgeous Tandem OLED display. Only used it for a week before deciding to get a MacBook instead. Comes in its original box with all accessories (charging cable and brick). Zero scratches, perfectly pristine condition. AppleCare+ is eligible for registration.',
    createdAt: Date.now() - 3600000 * 2, // 2 hours ago
    updatedAt: Date.now() - 3600000 * 1,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Sarah Jenkins',
      department: 'Computer Science & Engineering',
      joinedDate: 'Sept 2024',
      listingsCount: 8,
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    }
  },
  'prod-1': {
    id: 'prod-1',
    title: 'Campbell Biology (12th Edition) - Core Textbook',
    price: 65,
    condition: 'Good',
    category: 'BOOKS',
    description: 'Required textbook for General Biology (BIO 101/102). The book is in good condition overall. Some minimal yellow highlighting on early chapters, but pages are clean and binding is fully intact. Saving you over $100 compared to the bookstore price!',
    createdAt: Date.now() - 3600000 * 24, // 1 day ago
    updatedAt: Date.now() - 3600000 * 12,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Michael Chen',
      department: 'Biological Sciences',
      joinedDate: 'Jan 2025',
      listingsCount: 3,
      rating: 4.7,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    }
  },
  'prod-2': {
    id: 'prod-2',
    title: 'Sony WH-1000XM4 Wireless Noise Canceling Headphones',
    price: 180,
    condition: 'Like New',
    category: 'ELECTRONICS',
    description: 'Selling my Sony WH-1000XM4 noise-canceling headphones. Incredible sound quality and top-tier noise cancellation. Used primarily in the library. Comes with original carrying case, USB-C cable, and headphone jack adapter. Battery life still lasts up to 30 hours.',
    createdAt: Date.now() - 3600000 * 48, // 2 days ago
    updatedAt: Date.now() - 3600000 * 48,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Alex Rodriguez',
      department: 'Electrical Engineering',
      joinedDate: 'Oct 2023',
      listingsCount: 12,
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    }
  },
  'prod-3': {
    id: 'prod-3',
    title: 'Premium Ergonomic Office Desk Chair',
    price: 120,
    condition: 'Like New',
    category: 'FURNITURE',
    description: 'High-quality ergonomic desk chair with mesh back, adjustable armrests, lumbar support, and tilt lock. Super comfortable for long study sessions. Selling because I am moving out of my hostel room and cannot carry it. Non-smoking, pet-free hostel room.',
    createdAt: Date.now() - 3600000 * 5, // 5 hours ago
    updatedAt: Date.now() - 3600000 * 5,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Emily Watson',
      department: 'Business Administration',
      joinedDate: 'Aug 2024',
      listingsCount: 4,
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
    }
  }
}

// Helper to generate a generic mock product if ID doesn't exist
const getOrGenerateProduct = (id) => {
  if (MOCK_DETAILS_DB[id]) return MOCK_DETAILS_DB[id]

  // Extract index if it exists in pattern prod-X
  const index = parseInt(id.replace('prod-', '')) || 0
  const categories = Object.keys(CATEGORY_MAP)
  const categoryKey = categories[index % categories.length]
  const conditions = ['Brand New', 'Like New', 'Good', 'Fair']
  const condition = conditions[index % conditions.length]

  const mockImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', // watch
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80', // glasses
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'  // red shoe
  ]

  return {
    id,
    title: `${CATEGORY_MAP[categoryKey]} Student Item ${index + 1}`,
    price: 35 + (index * 15) % 800,
    condition,
    category: categoryKey,
    description: `This is a high quality mock student product of category ${CATEGORY_MAP[categoryKey]}. Ideal for everyday college use. Negotiable and available for instant pick-up on campus dorm block C. Please chat if interested.`,
    createdAt: Date.now() - 3600000 * 24 * (index % 10),
    updatedAt: Date.now() - 3600000 * 12 * (index % 5),
    status: 'Available',
    images: [mockImages[index % mockImages.length]],
    seller: {
      name: `Student Seller ${index + 1}`,
      department: 'General Studies',
      joinedDate: 'Sept 2024',
      listingsCount: 5,
      rating: 4.5,
      avatar: ''
    }
  }
}

// Generate 4 related products based on current category
const getRelatedProducts = (currentId, category) => {
  return Object.values(MOCK_DETAILS_DB)
    .filter(p => p.id !== currentId)
    .concat(
      Array.from({ length: 10 }, (_, i) => getOrGenerateProduct(`prod-${i + 10}`))
    )
    .filter(p => p.category === category && p.id !== currentId)
    .slice(0, 4)
}

const DISPLAY_CONDITION = {
  'NEW': 'Brand New',
  'LIKE_NEW': 'Like New',
  'GOOD': 'Good',
  'FAIR': 'Fair',
  'POOR': 'Poor'
}

const getStatusStyle = (status) => {
  const upper = (status || '').toUpperCase()
  if (upper === 'AVAILABLE') {
    return 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
  }
  if (upper === 'RESERVED') {
    return 'bg-blue-500/25 text-blue-300 border-blue-500/40 shadow-blue-500/10'
  }
  return 'bg-rose-500/25 text-rose-300 border-rose-500/40 shadow-rose-500/10'
}

const getConditionStyle = (cond) => {
  const upper = (cond || '').toUpperCase()
  if (upper === 'NEW' || upper === 'BRAND NEW') {
    return 'bg-emerald-500/25 text-emerald-300 border-emerald-500/35'
  }
  if (upper === 'LIKE_NEW' || upper === 'LIKE NEW') {
    return 'bg-sky-500/25 text-sky-300 border-sky-500/35'
  }
  if (upper === 'GOOD') {
    return 'bg-amber-500/25 text-amber-300 border-amber-500/35'
  }
  if (upper === 'FAIR') {
    return 'bg-orange-500/25 text-orange-300 border-orange-500/35'
  }
  return 'bg-zinc-500/25 text-zinc-300 border-zinc-500/35'
}

export function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeImage, setActiveImage] = useState('')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [interested, setInterested] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false)
      }
    }
    if (isLightboxOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen])

  const navbar = useMemo(() => ({
    links: NAVBAR_LINKS,
    activeId: 'marketplace',
    logo: <Logo />,
  }), [])

  useEffect(() => {
    if (!id) return

    let active = true
    setLoading(true)

    const fetchProductDetails = async () => {
      try {
        const prodData = await productService.getProductById(id)
        if (!active) return

        if (prodData.images && Array.isArray(prodData.images)) {
          prodData.images.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        }

        setProduct(prodData)
        
        const coverImg = prodData.images && prodData.images.length > 0 
          ? (prodData.images.find(img => img.cover) || prodData.images[0])
          : null
        setActiveImage(coverImg ? (coverImg.imageUrl || coverImg) : '')

        if (prodData.wishlisted !== undefined) {
          setIsWishlisted(Boolean(prodData.wishlisted))
        }
        if (prodData.interested !== undefined) {
          setInterested(Boolean(prodData.interested))
        }
        setLoading(false)

        // Fetch related products
        if (prodData.category) {
          try {
            const relData = await productService.filterProducts({ category: prodData.category }, 0, 5)
            if (active) {
              const list = relData.content || []
              setRelatedProducts(list.filter(p => String(p.id) !== String(prodData.id)).slice(0, 4))
            }
          } catch (err) {
            console.error('Failed to load related products:', err)
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err)
        toast.error('Failed to retrieve product details from backend')
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchProductDetails()
    window.scrollTo({ top: 0, behavior: 'smooth' })

    return () => {
      active = false
    }
  }, [id])

  // Date formatter helper
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleWishlistToggle = async () => {
    if (!authService.isAuthenticated()) {
      toast('Please log in to add items to your wishlist', { icon: '🔒' })
      navigate('/login')
      return
    }

    const nextState = !isWishlisted
    setIsWishlisted(nextState)
    if (product) product.wishlisted = nextState

    try {
      if (!nextState) {
        await wishlistService.removeFromWishlist(product.id)
        toast.success('Removed from Wishlist')
      } else {
        await wishlistService.addToWishlist(product.id)
        toast.success('Added to Wishlist!')
      }
    } catch (err) {
      console.error(err)
      setIsWishlisted(!nextState)
      if (product) product.wishlisted = !nextState
      toast.error('Failed to update Wishlist')
    }
  }

  const handleDeleteProduct = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    try {
      await productService.deleteProduct(product.id)
      toast.success('Listing deleted successfully')
      navigate('/marketplace')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete listing')
    }
  }

  const handleInterestChatClick = async () => {
    if (!authService.isAuthenticated()) {
      toast('Please log in to chat with sellers', { icon: '💬' })
      navigate('/login')
      return
    }

    try {
      const convo = await conversationService.startConversation(product.id)
      setInterested(true)
      if (product) product.interested = true
      navigate('/messages', { state: { activeConversationId: convo.id } })
    } catch (err) {
      console.error(err)
      toast.error('Failed to start conversation with seller')
    }
  }

  if (loading) {
    return (
      <AppLayout navbar={navbar}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center" style={{ gap: SPACING.md }}>
          <div className="w-12 h-12 rounded-full border-4 border-t-white/80 border-white/20 animate-spin" />
          <span className="text-white/60 text-lg animate-pulse">Loading item details...</span>
        </div>
      </AppLayout>
    )
  }

  if (!product) {
    return (
      <AppLayout navbar={navbar}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center" style={{ gap: SPACING.md }}>
          <span className="text-white/60 text-lg">Item details could not be found.</span>
          <GlassButton variant="secondary" onClick={() => navigate('/marketplace')}>
            Back to Marketplace
          </GlassButton>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout navbar={navbar}>
      {/* 1. Navigation Action Row */}
      <div className="flex items-center justify-between mb-6">
        <GlassButton 
          variant="secondary"
          onClick={() => navigate('/marketplace')}
          leftIcon={<ArrowLeft size={16} />}
        >
          Back to Marketplace
        </GlassButton>
        <div className="flex items-center text-sm text-white/50" style={{ gap: SPACING.xs }}>
          <span>Marketplace</span>
          <ChevronRight size={14} />
          <span>{CATEGORY_MAP[product.category]}</span>
          <ChevronRight size={14} />
          <span className="text-white/80 truncate max-w-[150px]">{product.title}</span>
        </div>
      </div>

      {/* 2. Main 2-Column Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10 mb-12">
        {/* Left Column: Product Image Gallery (40% width / 5 cols) */}
        <div className="lg:col-span-5 flex flex-col" style={{ gap: SPACING.md }}>
          <Glass 
            className="w-full relative overflow-hidden flex items-center justify-center bg-white/5 border border-white/10 group cursor-pointer"
            style={{ 
              aspectRatio: '4/3',
              borderRadius: RADIUS.lg
            }}
            onClick={() => activeImage && setIsLightboxOpen(true)}
          >
            <AnimatePresence mode="wait">
              {activeImage ? (
                <motion.img 
                  key={activeImage}
                  src={activeImage} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white/40">
                  <Clock size={48} className="opacity-30 mb-2" />
                  <span>No image available</span>
                </div>
              )}
            </AnimatePresence>

            {/* Product Status Overlay (Compact size with status color theme) */}
            <div className="absolute top-3 left-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border shadow-sm ${getStatusStyle(product.status)}`}>
                {product.status}
              </span>
            </div>

            {activeImage && (
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/15 flex items-center gap-1.5 pointer-events-none">
                <ZoomIn size={13} />
                <span>Click for full photo</span>
              </div>
            )}
          </Glass>

          {/* Thumbnail row */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center overflow-x-auto pb-1" style={{ gap: SPACING.sm }}>
              {product.images.map((img, idx) => {
                const imgUrl = img.imageUrl || img
                const isSelected = activeImage === imgUrl
                return (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className="relative flex-shrink-0 focus:outline-none transition-transform hover:scale-[1.03]"
                    style={{
                      width: 72,
                      height: 54,
                      borderRadius: RADIUS.sm,
                      overflow: 'hidden',
                      border: isSelected ? `2px solid #3b82f6` : '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-white/10" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column: Metadata, Description & Actions (60% width / 7 cols) */}
        <div className="lg:col-span-7 flex flex-col" style={{ gap: SPACING.lg }}>
          {/* Header metadata row */}
          <div className="flex flex-col" style={{ gap: SPACING.sm }}>
            <div className="flex flex-wrap items-center gap-2">
              <GlassChip label={CATEGORY_MAP[product.category] || product.category} />
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${getConditionStyle(product.condition)}`}>
                Condition: {DISPLAY_CONDITION[product.condition] || product.condition}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold m-0 text-white leading-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline justify-between mt-2 border-b border-white/5 pb-4">
              <span className="text-3xl font-bold text-white">
                {product.price !== undefined ? (product.price === 0 ? 'Free' : `$${product.price}`) : '—'}
              </span>
              <div className="flex items-center text-sm text-white/40" style={{ gap: SPACING.xs }}>
                <Clock size={14} />
                <span>Listed {formatDate(product.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Seller Card */}
          <GlassCard padding="md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center" style={{ gap: SPACING.md }}>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                  <User size={20} className="text-white/60" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-white text-base leading-snug">
                    {product.sellerName || 'Verified Student'}
                  </span>
                  <span className="text-xs text-white/50">
                    {product.collegeName || 'Campus Member'}
                  </span>
                </div>
              </div>

              {/* Stats column */}
              <div className="flex items-center gap-6 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                <div className="flex flex-col items-start sm:items-end">
                  <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Location</span>
                  <span className="text-sm font-medium text-white/80">{product.city || 'Campus'}</span>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                  <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Joined</span>
                  <span className="text-sm font-medium text-white/80">Sept 2025</span>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                  <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Rating</span>
                  <div className="flex items-center text-amber-400 gap-1 text-sm font-medium">
                    <Star size={14} fill="currentColor" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Description Block */}
          <div className="flex flex-col" style={{ gap: SPACING.xs }}>
            <h3 className="text-lg font-medium text-white/80 m-0">Description</h3>
            <p className="text-white/70 leading-relaxed text-base m-0 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-stretch gap-4 mt-4">
            {product.owner ? (
              <>
                <GlassButton 
                  variant="secondary"
                  className="flex-1 h-12 justify-center text-base"
                  leftIcon={<Edit3 size={18} />}
                  onClick={() => toast('Edit listing feature coming soon', { icon: '✏️' })}
                >
                  Edit Product
                </GlassButton>
                <GlassButton 
                  variant="danger"
                  className="flex-1 h-12 justify-center text-base"
                  leftIcon={<Trash2 size={18} />}
                  onClick={handleDeleteProduct}
                >
                  Delete Product
                </GlassButton>
              </>
            ) : (
              <>
                <GlassButton 
                  variant="default"
                  className="flex-1 h-12 justify-center text-base"
                  leftIcon={<MessageSquare size={18} />}
                  onClick={handleInterestChatClick}
                >
                  {interested ? 'Open Chat' : "I'm Interested"}
                </GlassButton>
                <GlassButton 
                  variant="secondary"
                  className={`w-12 h-12 transition-colors flex items-center justify-center flex-shrink-0 ${isWishlisted ? 'text-red-500 border-red-500/30' : ''}`}
                  leftIconOnly
                  leftIcon={<Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />}
                  onClick={handleWishlistToggle}
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                />
              </>
            )}
            <GlassButton 
              variant="secondary"
              className="w-12 h-12 flex items-center justify-center flex-shrink-0"
              leftIconOnly
              leftIcon={<Share2 size={18} />}
              title="Share product"
            />
          </div>
        </div>
      </div>

      {/* 3. Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="flex flex-col border-t border-white/5 pt-10 mt-6" style={{ gap: SPACING.md }}>
          <h2 className="text-2xl font-semibold text-white m-0">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductPreviewCard 
                key={p.id} 
                product={p} 
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. Full Screen Lightbox Modal for Photo Viewing */}
      <AnimatePresence>
        {isLightboxOpen && activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Header Controls */}
            <div 
              className="w-full max-w-6xl flex items-center justify-between z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-white/80">
                <span className="font-semibold text-base sm:text-lg truncate max-w-xs sm:max-w-md">{product?.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 cursor-pointer transition-colors outline-none"
                title="Close full view"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Image Container */}
            <div 
              className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={product?.title}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/15 select-none"
              />
            </div>

            {/* Bottom Thumbnail Navigation */}
            {product?.images && product.images.length > 1 && (
              <div 
                className="flex items-center gap-3 z-10 overflow-x-auto max-w-full p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
              >
                {product.images.map((img, idx) => {
                  const imgUrl = img.imageUrl || img
                  const isSelected = activeImage === imgUrl
                  return (
                    <button
                      key={img.id || idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`w-14 h-11 rounded-lg overflow-hidden border transition-all cursor-pointer p-0 ${isSelected ? 'border-blue-500 scale-105' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  )
}
