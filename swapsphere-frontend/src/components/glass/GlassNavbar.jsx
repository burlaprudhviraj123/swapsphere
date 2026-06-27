import { forwardRef, memo, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import Glass from './Glass.jsx'
import { GlassButton } from './GlassButton.jsx'
import { GlassSearch } from './GlassSearch.jsx'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { RADIUS } from '../../theme/radius.js'
import { MOTION } from '../../theme/motion.js'
import { cn } from '../../utils/cn.js'
import { Search, Bell, User, Package, PlusCircle, LogOut } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../../services/authService.js'

// Default SwapSphere Logo matching HomePage/MarketplacePage
const DefaultLogo = () => (
  <a href="/" className="flex items-center no-underline cursor-pointer" style={{ gap: SPACING.xs }}>
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: `linear-gradient(135deg, ${COLORS.textPrimary}, ${COLORS.textSecondary})` }}
    >
      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.background }}>
        <span className="text-white font-bold text-base">S</span>
      </div>
    </div>
    <span className="font-semibold text-xl tracking-tight block" style={{ color: COLORS.textPrimary }}>
      SwapSphere
    </span>
  </a>
)

export const GlassNavbar = memo(
  forwardRef(function GlassNavbar(
    {
      logo,
      links = [],
      activeId,
      onLinkClick,
      className,
      ...props
    },
    ref,
  ) {
    const navigate = useNavigate()
    const location = useLocation()
    const isHomePage = location.pathname === '/'
    const isAuthenticated = authService.isAuthenticated()
    const userProfile = authService.getUserProfileFallback()
    const userInitial = (userProfile?.name || 'U').charAt(0).toUpperCase()

    const [isSearchExpanded, setIsSearchExpanded] = useState(false)
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

    const dropdownRef = useRef(null)
    const searchButtonRef = useRef(null)
    const profileRef = useRef(null)

    // Handle ESC key and outside clicks to close search and profile dropdown
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsSearchExpanded(false)
          setIsProfileDropdownOpen(false)
        }
      }
      const handleClickOutside = (e) => {
        const clickedOutsideSearch = dropdownRef.current && !dropdownRef.current.contains(e.target)
        const clickedOutsideSearchBtn = searchButtonRef.current && !searchButtonRef.current.contains(e.target)
        if (clickedOutsideSearch && clickedOutsideSearchBtn) {
          setIsSearchExpanded(false)
        }

        const clickedOutsideProfile = profileRef.current && !profileRef.current.contains(e.target)
        if (clickedOutsideProfile) {
          setIsProfileDropdownOpen(false)
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('mousedown', handleClickOutside)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])

    return (
      <motion.header
        ref={ref}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex justify-center items-center',
          'px-4 pt-4 sm:px-6 sm:pt-6 transition-all duration-300',
          className
        )}
        initial="hidden"
        animate="visible"
        variants={MOTION.fadeDown}
        {...props}
      >
        {/* HEADER FLEX WRAPPER (Unified flex row with navbar pill and side-by-side Sell chip) */}
        <div className="relative w-full flex items-center justify-center gap-3 sm:gap-4" style={{ maxWidth: 1320 }}>
          {/* MAIN GLASS NAVBAR CONTAINER */}
          <div className="relative flex-1 h-16 flex items-center px-6 transition-all duration-300 backdrop-blur-md bg-white/5 border border-white/10 rounded-full shadow-lg">
            {/* Main Content Row */}
            <div className="relative flex items-center justify-between w-full h-full">
              
              {/* LEFT GROUP: Logo Zone */}
              <div className="flex-1 flex justify-start items-center flex-shrink-0 relative z-10">
                {logo || <DefaultLogo />}
              </div>

              {/* CENTER GROUP: Floating Capsule Zone */}
              <div className="flex-shrink-0 flex justify-center items-center relative z-20">
                {links.length > 0 && (
                  <Glass
                    cornerRadius={RADIUS.pill}
                    fullHeight
                    className="relative overflow-hidden transition-all duration-300 flex items-center"
                    style={{
                      height: 50,
                      padding: '0 6px',
                      backgroundColor: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <LayoutGroup id="navbar-capsule">
                      <div className="flex items-center h-full" style={{ gap: 4 }}>
                        {links.map((link) => {
                          const isActive = activeId === link.id
                          return (
                            <button
                              key={link.id}
                              onClick={() => {
                                if (onLinkClick) {
                                  onLinkClick(link.id)
                                } else {
                                  navigate(`/${link.id}`)
                                }
                              }}
                              className="relative px-5 py-2 rounded-full border-none bg-transparent outline-none cursor-pointer flex items-center justify-center h-[38px] transition-colors duration-200"
                              style={{
                                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                                fontSize: '15px',
                                fontFamily: 'inherit',
                                fontWeight: '600',
                              }}
                            >
                              <span className="relative z-50">{link.label}</span>
                              {isActive && (
                                <>
                                  <motion.div
                                    layoutId="active-pill-bg"
                                    className="absolute inset-0 z-0 bg-white/10 rounded-full border border-white/20 shadow-sm"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                  />
                                  <motion.div
                                    layoutId="active-pill-dot"
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full z-50"
                                    style={{ boxShadow: '0 0 6px rgba(255,255,255,0.8)' }}
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                  />
                                </>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </LayoutGroup>
                  </Glass>
                )}
              </div>

              {/* RIGHT GROUP: Actions & Profile */}
              <div className="flex-1 flex justify-end items-center flex-shrink-0 relative z-10" style={{ gap: 12 }}>
                {!isAuthenticated ? (
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="font-semibold px-4"
                  >
                    Log In
                  </GlassButton>
                ) : (
                  <>
                    {!isHomePage && (
                      <GlassButton
                        ref={searchButtonRef}
                        variant="secondary"
                        size="sm"
                        leftIconOnly
                        leftIcon={<Search size={18} />}
                        onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                        aria-label="Search"
                      />
                    )}

                    {!isHomePage && (
                      <div className="relative flex items-center justify-center">
                        <GlassButton
                          variant="secondary"
                          size="sm"
                          leftIconOnly
                          leftIcon={<Bell size={18} />}
                          onClick={() => {
                            toast('No new notifications', { icon: '🔔' })
                          }}
                          aria-label="Notifications"
                        />
                        <div className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-blue-500 border border-black/80 z-20" />
                      </div>
                    )}

                    <div ref={profileRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 cursor-pointer flex-shrink-0 focus:outline-none hover:border-white/40 transition-all p-0 flex items-center justify-center text-white font-bold text-sm shadow-sm"
                      >
                        {userInitial}
                      </button>

                      <AnimatePresence>
                        {isProfileDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="absolute right-0 top-[calc(100%+12px)] w-56 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl p-2 z-50 flex flex-col gap-1 overflow-hidden"
                            style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                          >
                            <button
                              onClick={() => {
                                setIsProfileDropdownOpen(false)
                                navigate('/profile')
                              }}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 border-none bg-transparent cursor-pointer transition-colors text-left"
                            >
                              <User size={16} className="text-white/60" />
                              <span>My Profile</span>
                            </button>

                            <button
                              onClick={() => {
                                setIsProfileDropdownOpen(false)
                                navigate('/my-activity')
                              }}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 border-none bg-transparent cursor-pointer transition-colors text-left"
                            >
                              <Package size={16} className="text-white/60" />
                              <span>My Products</span>
                            </button>

                            <button
                              onClick={() => {
                                setIsProfileDropdownOpen(false)
                                navigate('/create-listing')
                              }}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 border-none bg-transparent cursor-pointer transition-colors text-left"
                            >
                              <PlusCircle size={16} className="text-white/60" />
                              <span>Sell Item</span>
                            </button>

                            <div className="h-[1px] bg-white/10 my-1 w-full" />

                            <button
                              onClick={() => {
                                setIsProfileDropdownOpen(false)
                                authService.logout()
                                toast.success('Logged out successfully')
                                navigate('/login')
                              }}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border-none bg-transparent cursor-pointer transition-colors text-left"
                            >
                              <LogOut size={16} />
                              <span>Log Out</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* DOWNWARD SLIDING SEARCH PANEL */}
            <AnimatePresence>
              {isSearchExpanded && !isHomePage && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute top-[calc(100%+12px)] right-6 z-40 w-[420px]"
                >
                  <GlassSearch
                    placeholder="Search SwapSphere..."
                    autoFocus
                    onSearch={(q) => {
                      setIsSearchExpanded(false)
                      navigate(`/marketplace?search=${encodeURIComponent(q)}`)
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* STANDALONE SELL CHIP (Placed side-by-side directly to the right of the navbar with matching h-16 height) */}
          {isAuthenticated && (
            <GlassButton
              variant="secondary"
              size="md"
              leftIcon={<PlusCircle size={18} />}
              onClick={() => navigate('/create-listing')}
              className="h-16 px-6 text-base font-bold rounded-full flex-shrink-0 cursor-pointer shadow-xl"
            >
              Sell
            </GlassButton>
          )}
        </div>
      </motion.header>
    )
  })
)

GlassNavbar.displayName = 'GlassNavbar'



