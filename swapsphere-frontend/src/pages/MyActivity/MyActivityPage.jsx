import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, LayoutGroup } from 'framer-motion'
import { Package, Heart, Trash2, Plus, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { AppLayout } from '../../layouts/AppLayout.jsx'
import Glass from '../../components/glass/Glass.jsx'
import { GlassCard } from '../../components/glass/GlassCard.jsx'
import { GlassButton } from '../../components/glass/GlassButton.jsx'
import { ProductPreviewCard } from '../../components/marketplace/ProductPreviewCard.jsx'
import { ProductSkeleton } from '../../components/marketplace/ProductSkeleton.jsx'
import { productService } from '../../services/productService.js'
import { wishlistService } from '../../services/wishlistService.js'
import { RADIUS } from '../../theme/radius.js'

const NAVBAR_LINKS = [
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'messages', label: 'Messages' },
  { id: 'my-activity', label: 'My Activity' }
]

export function MyActivityPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('listings') // 'listings' | 'wishlist'

  const [listings, setListings] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUserData = useCallback(async () => {
    setLoading(true)
    try {
      if (activeTab === 'listings') {
        const data = await productService.getMyProducts(0, 50)
        setListings(data.content || [])
      } else {
        const data = await wishlistService.getWishlist(0, 50)
        setWishlist(data.content || [])
      }
    } catch (err) {
      console.error('Failed to load user activity details:', err)
      toast.error('Failed to retrieve activity details from server')
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const handleDeleteListing = async (productId, e) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to permanently delete this product?')) return

    try {
      await productService.deleteProduct(productId)
      toast.success('Product removed successfully')
      fetchUserData()
    } catch (err) {
      toast.error('Failed to delete product')
    }
  }

  const handleRemoveWishlist = async (productId, e) => {
    e.stopPropagation()
    try {
      await wishlistService.removeFromWishlist(productId)
      toast.success('Removed from Wishlist')
      fetchUserData()
    } catch (err) {
      toast.error('Failed to update wishlist')
    }
  }

  const navbar = useMemo(() => ({
    links: NAVBAR_LINKS,
    activeId: 'my-activity',
    onLinkClick: (id) => navigate(`/${id}`)
  }), [navigate])

  return (
    <AppLayout navbar={navbar}>
      <div className="flex flex-col gap-8 mb-16 w-full">
        {/* Sleek Header Section */}
        <div className="flex flex-col gap-1 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight m-0">My Activity</h1>
          <p className="text-base text-white/60 m-0">Manage your active products for sale and saved wishlist items.</p>
        </div>

        {/* Floating Glass Capsule Tab Bar with Framer Motion Layout Animation */}
        <div className="flex justify-start">
          <Glass
            cornerRadius={RADIUS.pill}
            className="relative p-1.5 flex items-center bg-black/40 border border-white/15 shadow-xl overflow-hidden"
          >
            <LayoutGroup id="activity-tabs-group">
              <div className="flex items-center gap-2 relative z-10">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`relative px-6 py-2.5 rounded-full border-none bg-transparent outline-none cursor-pointer text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                    activeTab === 'listings' ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Package size={16} />
                  <span className="relative z-20">My Products</span>
                  {activeTab === 'listings' && (
                    <motion.div
                      layoutId="activity-tab-pill-bg"
                      className="absolute inset-0 z-10 bg-white/15 rounded-full border border-white/20 shadow-sm backdrop-blur-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`relative px-6 py-2.5 rounded-full border-none bg-transparent outline-none cursor-pointer text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                    activeTab === 'wishlist' ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Heart size={16} />
                  <span className="relative z-20">My Wishlist</span>
                  {activeTab === 'wishlist' && (
                    <motion.div
                      layoutId="activity-tab-pill-bg"
                      className="absolute inset-0 z-10 bg-white/15 rounded-full border border-white/20 shadow-sm backdrop-blur-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </div>
            </LayoutGroup>
          </Glass>
        </div>

        {/* Tab Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : activeTab === 'listings' ? (
          listings.length === 0 ? (
            <GlassCard padding="lg" className="text-center py-20 flex flex-col items-center justify-center text-white/40 border border-white/10 rounded-3xl">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Package size={32} className="opacity-40 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white/90 m-0">No Active Products</h3>
              <p className="text-sm text-white/50 mt-2 max-w-md">You haven't listed any products for sale yet. Post an item to start trading with users on campus.</p>
              <GlassButton
                variant="default"
                size="md"
                className="mt-6 font-bold px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 border border-white/20"
                onClick={() => navigate('/create-listing')}
                leftIcon={<Plus size={18} />}
              >
                Sell Item
              </GlassButton>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductPreviewCard product={product} />
                  <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <GlassButton
                      variant="danger"
                      size="sm"
                      leftIconOnly
                      leftIcon={<Trash2 size={15} />}
                      onClick={(e) => handleDeleteListing(product.id, e)}
                      title="Delete Product"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl backdrop-blur-md bg-red-600/80 hover:bg-red-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : wishlist.length === 0 ? (
          <GlassCard padding="lg" className="text-center py-20 flex flex-col items-center justify-center text-white/40 border border-white/10 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Heart size={32} className="opacity-40 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white/90 m-0">Wishlist is Empty</h3>
            <p className="text-sm text-white/50 mt-2 max-w-md">Save items you are interested in while exploring the marketplace.</p>
            <GlassButton
              variant="secondary"
              size="md"
              className="mt-6 font-semibold px-6 py-2.5 rounded-full border border-white/20"
              onClick={() => navigate('/marketplace')}
              rightIcon={<ArrowRight size={16} />}
            >
              Explore Marketplace
            </GlassButton>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="relative group">
                <ProductPreviewCard product={product} />
                <div className="absolute top-4 right-4 z-20">
                  <GlassButton
                    variant="danger"
                    size="sm"
                    leftIconOnly
                    leftIcon={<Trash2 size={15} />}
                    onClick={(e) => handleRemoveWishlist(product.id, e)}
                    title="Remove from wishlist"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl backdrop-blur-md bg-red-600/80 hover:bg-red-600"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
