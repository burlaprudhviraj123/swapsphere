import { memo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../layouts/AppLayout.jsx'
import { GlassNavbar } from '../../components/glass/GlassNavbar.jsx'
import { HeroSection } from '../../components/home/HeroSection.jsx'
import { CategoriesSection } from '../../components/home/CategoriesSection.jsx'
import { RecentProductsSection } from '../../components/home/RecentProductsSection.jsx'
import { WhySwapSphereSection } from '../../components/home/WhySwapSphereSection.jsx'
import { FooterSection } from '../../components/home/FooterSection.jsx'
import { productService } from '../../services/productService.js'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'

const NAVBAR_LINKS = [
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'messages', label: 'Messages' },
  { id: 'my-activity', label: 'My Activity' }
]

const Logo = () => (
  <a 
    href="/" 
    className="flex items-center no-underline cursor-pointer" 
    style={{ gap: SPACING.xs }}
  >
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ 
        background: '#111',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <span className="text-white font-bold text-lg" style={{ fontFamily: 'sans-serif' }}>S</span>
    </div>
    <span 
      className="font-semibold text-xl tracking-tight hidden sm:block" 
      style={{ color: COLORS.textPrimary }}
    >
      SwapSphere
    </span>
  </a>
)

export const HomePage = memo(function HomePage() {
  const navigate = useNavigate()
  const [recentProducts, setRecentProducts] = useState([])

  useEffect(() => {
    let active = true
    const fetchRecent = async () => {
      try {
        const res = await productService.getAllProducts(0, 4)
        if (active && res && res.content) {
          setRecentProducts(res.content)
        }
      } catch (e) {
        console.error('Failed to load recent products on homepage:', e)
      }
    }
    fetchRecent()
    return () => { active = false }
  }, [])

  const navbar = (
    <GlassNavbar
      logo={<Logo />}
      links={NAVBAR_LINKS}
      onLinkClick={(id) => navigate(`/${id}`)}
    />
  )

  return (
    <AppLayout 
      navbar={navbar} 
      footer={<FooterSection />}
    >
      <div className="w-full flex flex-col items-center">
        <HeroSection 
          onSearch={(q) => navigate(`/marketplace?search=${encodeURIComponent(q)}`)}
          onBrowse={() => navigate('/marketplace')}
          onSell={() => navigate('/create-listing')}
        />
        <CategoriesSection 
          onCategoryClick={(catId) => navigate(`/marketplace?category=${catId.toUpperCase()}`)}
        />
        <RecentProductsSection 
          products={recentProducts}
          onProductClick={(id) => navigate(`/marketplace/${id}`)}
          onViewAll={() => navigate('/marketplace')}
        />
        <WhySwapSphereSection />
      </div>
    </AppLayout>
  )
})

HomePage.displayName = 'HomePage'
