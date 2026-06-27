import { memo } from 'react'
import { AppLayout } from '../../layouts/AppLayout.jsx'
import { GlassNavbar } from '../../components/glass/GlassNavbar.jsx'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'

const NAVBAR_LINKS = [
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'messages', label: 'Messages' },
  { id: 'my-activity', label: 'My Activity' }
]

const Logo = () => (
  <a href="/" className="flex items-center no-underline cursor-pointer" style={{ gap: SPACING.xs }}>
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: `linear-gradient(135deg, ${COLORS.textPrimary}, ${COLORS.textSecondary})` }}
    >
      <div className="w-7 h-7 rounded-full" style={{ backgroundColor: COLORS.background }} />
    </div>
    <span className="font-semibold text-xl tracking-tight hidden sm:block" style={{ color: COLORS.textPrimary }}>
      SwapSphere
    </span>
  </a>
)

import { useNavigate, useLocation } from 'react-router-dom'

export const AboutPage = memo(function AboutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Extract path to match NAVBAR_LINKS id
  const currentPath = location.pathname.substring(1) // "messages" or "my-activity"
  const activeId = NAVBAR_LINKS.some(link => link.id === currentPath) ? currentPath : 'about'

  const navbar = (
    <GlassNavbar
      logo={<Logo />}
      links={NAVBAR_LINKS}
      activeId={activeId}
      onLinkClick={(id) => navigate(`/${id}`)}
    />
  )


  return (
    <AppLayout navbar={navbar}>
      <div className="flex w-full h-full items-center justify-center flex-1 min-h-[50vh]">
        <h1 className="text-3xl font-semibold m-0" style={{ color: COLORS.textPrimary }}>
          About Page Placeholder
        </h1>
      </div>
    </AppLayout>
  )
})

AboutPage.displayName = 'AboutPage'
