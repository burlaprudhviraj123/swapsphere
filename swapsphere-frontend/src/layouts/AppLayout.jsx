import { forwardRef, memo, isValidElement } from 'react'
import { motion } from 'framer-motion'
import { GlassNavbar } from '../components/glass/GlassNavbar.jsx'
import { BackgroundCanvas } from '../components/background/BackgroundCanvas.jsx'
import { COLORS } from '../theme/colors.js'
import { SPACING } from '../theme/spacing.js'
import { MOTION } from '../theme/motion.js'
import { cn } from '../utils/cn.js'

export const AppLayout = memo(
  forwardRef(function AppLayout(
    {
      children,
      navbar,
      footer,
      sidebar,
      className,
      contentClassName,
      ...props
    },
    ref,
  ) {
    // Allows the navbar prop to either be a React element or a config object for GlassNavbar
    const renderNavbar = () => {
      if (!navbar) return null
      if (isValidElement(navbar)) return navbar
      return <GlassNavbar {...navbar} />
    }

    return (
      <div
        ref={ref}
        className={cn('min-h-screen flex flex-col w-full relative', className)}
        style={{
          color: COLORS.textPrimary,
        }}
        {...props}
      >
        <BackgroundCanvas />
        {renderNavbar()}

        <div className="flex flex-1 w-full h-full relative">
          {/* Optional Sidebar */}
          {sidebar && (
            <aside
              className="hidden lg:flex flex-col flex-shrink-0"
              style={{
                width: `${SPACING.sidebarWidth}px`,
                paddingTop: navbar ? `${SPACING.navbarHeight + SPACING.xl}px` : `${SPACING.pagePadding}px`,
                paddingBottom: `${SPACING.pagePadding}px`,
                paddingLeft: `${SPACING.pagePadding}px`,
              }}
            >
              {sidebar}
            </aside>
          )}

          {/* Main Content Area */}
          <main
            className={cn('flex flex-col flex-1 w-full items-center', contentClassName)}
            style={{
              paddingTop: navbar ? `${SPACING.navbarHeight + SPACING.xl}px` : `${SPACING.pagePadding}px`,
              paddingBottom: `${SPACING.pagePadding}px`,
              paddingLeft: `${SPACING.pagePadding}px`,
              paddingRight: `${SPACING.pagePadding}px`,
            }}
          >
            {/* Centered Responsive Container with Page Transitions */}
            <motion.div
              variants={MOTION.pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col flex-1"
              style={{
                maxWidth: `${SPACING.contentMaxWidth}px`,
              }}
            >
              {children}
            </motion.div>
          </main>
        </div>

        {/* Optional Footer */}
        {footer && (
          <footer className="w-full mt-auto flex-shrink-0">
            {footer}
          </footer>
        )}
      </div>
    )
  })
)

AppLayout.displayName = 'AppLayout'


