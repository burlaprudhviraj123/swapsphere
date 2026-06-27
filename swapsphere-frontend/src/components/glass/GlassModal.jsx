import { forwardRef, memo, useEffect, useRef, useId, useImperativeHandle, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Glass from './Glass.jsx'
import { GlassButton } from './GlassButton.jsx'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { RADIUS } from '../../theme/radius.js'
import { MOTION } from '../../theme/motion.js'
import { cn } from '../../utils/cn.js'

const SIZE_MAP = {
  sm: '400px',
  md: '600px',
  lg: '800px',
  xl: '1140px',
}

export const GlassModal = memo(
  forwardRef(function GlassModal(
    {
      open,
      onClose,
      title,
      children,
      footer,
      size = 'md',
      closeOnBackdrop = true,
      closeOnEscape = true,
      showCloseButton = true,
      className,
      ...props
    },
    ref,
  ) {
    const internalRef = useRef(null)
    useImperativeHandle(ref, () => internalRef.current)
    const titleId = useId()
    
    // Prevent SSR portal errors
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    useEffect(() => {
      if (!open) return
      const originalOverflow = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      
      const timer = setTimeout(() => {
        internalRef.current?.focus()
      }, 50)
      
      return () => {
        document.body.style.overflow = originalOverflow
        clearTimeout(timer)
      }
    }, [open])

    useEffect(() => {
      if (!open) return
      
      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && closeOnEscape) {
          e.stopPropagation()
          onClose?.()
        }
        
        if (e.key === 'Tab' && internalRef.current) {
          const focusable = internalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          if (!focusable.length) {
            e.preventDefault()
            return
          }
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          
          if (e.shiftKey && document.activeElement === first) {
            last.focus()
            e.preventDefault()
          } else if (!e.shiftKey && document.activeElement === last) {
            first.focus()
            e.preventDefault()
          }
        }
      }
      
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, closeOnEscape, onClose])

    if (!mounted) return null

    return createPortal(
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={MOTION.fast}
              className="absolute inset-0 backdrop-blur-sm"
              style={{ backgroundColor: COLORS.overlay }}
              onClick={() => closeOnBackdrop && onClose?.()}
              aria-hidden="true"
            />
            
            <motion.div
              ref={internalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              tabIndex={-1}
              variants={MOTION.scaleIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn('relative z-10 w-full flex flex-col focus:outline-none', className)}
              style={{ maxWidth: SIZE_MAP[size] }}
              {...props}
            >
              <Glass
                cornerRadius={RADIUS.xl}
                className="w-full max-h-[calc(100vh-64px)] flex flex-col overflow-hidden text-left"
              >
                {(title || showCloseButton) && (
                  <div
                    className="flex items-center justify-between flex-shrink-0"
                    style={{
                      padding: `${SPACING.md}px`,
                      borderBottom: `${SPACING.borderWidth}px solid ${COLORS.glassBorder}`,
                    }}
                  >
                    {title ? (
                      <h2 id={titleId} className="text-lg font-medium m-0" style={{ color: COLORS.textPrimary }}>
                        {title}
                      </h2>
                    ) : <div />}
                    
                    {showCloseButton && (
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        leftIconOnly
                        leftIcon={<X />}
                        onClick={() => onClose?.()}
                        aria-label="Close modal"
                      />
                    )}
                  </div>
                )}
                
                <div
                  className="overflow-y-auto flex-1 overscroll-contain"
                  style={{ padding: `${SPACING.md}px`, color: COLORS.textPrimary }}
                >
                  {children}
                </div>
                
                {footer && (
                  <div
                    className="flex items-center justify-end flex-shrink-0"
                    style={{
                      padding: `${SPACING.md}px`,
                      borderTop: `${SPACING.borderWidth}px solid ${COLORS.glassBorder}`,
                      gap: SPACING.sm,
                    }}
                  >
                    {footer}
                  </div>
                )}
              </Glass>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )
  })
)

GlassModal.displayName = 'GlassModal'


