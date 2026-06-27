import { memo } from 'react'
import { motion } from 'framer-motion'
import { Code, Mail, MessageCircle } from 'lucide-react'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { cn } from '../../utils/cn.js'

const FooterLink = ({ children, href }) => (
  <motion.a
    href={href}
    className="text-sm cursor-pointer no-underline"
    style={{ color: COLORS.textSecondary }}
    whileHover={{ color: COLORS.textPrimary }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.a>
)

export const FooterSection = memo(function FooterSection({ className }) {
  return (
    <footer 
      className={cn("w-full flex flex-col items-center", className)}
      style={{
        borderTop: `1px solid ${COLORS.glassBorder}`,
        backgroundColor: 'transparent',
        paddingTop: SPACING['4xl'],
        paddingBottom: SPACING['2xl']
      }}
    >
      <div 
        className="w-full max-w-[1280px] px-4 sm:px-6 md:px-8 flex flex-col"
        style={{ gap: SPACING['3xl'] }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 w-full" style={{ gap: SPACING.xl }}>
          
          {/* Left: Logo & Description */}
          <div className="flex flex-col items-start" style={{ gap: SPACING.sm }}>
            <div className="flex items-center" style={{ gap: SPACING.xs }}>
              {/* Minimalist Logo Ring */}
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: `linear-gradient(135deg, ${COLORS.textPrimary}, ${COLORS.textSecondary})`,
                }}
              >
                <div 
                  className="w-7 h-7 rounded-full" 
                  style={{ backgroundColor: COLORS.background }} 
                />
              </div>
              <span className="font-semibold text-xl tracking-tight" style={{ color: COLORS.textPrimary }}>
                SwapSphere
              </span>
            </div>
            <p className="text-sm m-0" style={{ color: COLORS.textSecondary }}>
              The premium student marketplace.
            </p>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex flex-col items-start md:items-center">
            <span className="font-medium text-sm mb-2" style={{ color: COLORS.textPrimary }}>Navigation</span>
            <div className="flex flex-col items-start" style={{ gap: SPACING.sm }}>
              <FooterLink href="#">Marketplace</FooterLink>
              <FooterLink href="#">About</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
            </div>
          </div>

          {/* Right: Contact & Connect */}
          <div className="flex flex-col items-start md:items-end">
            <span className="font-medium text-sm mb-2" style={{ color: COLORS.textPrimary }}>Connect</span>
            <div className="flex flex-col items-start md:items-end" style={{ gap: SPACING.sm }}>
              <motion.a 
                href="#"
                className="flex items-center text-sm cursor-pointer no-underline"
                style={{ color: COLORS.textSecondary, gap: SPACING.xs }}
                whileHover={{ color: COLORS.textPrimary }}
              >
                <Code size={16} /> GitHub
              </motion.a>
              <motion.a 
                href="#"
                className="flex items-center text-sm cursor-pointer no-underline"
                style={{ color: COLORS.textSecondary, gap: SPACING.xs }}
                whileHover={{ color: COLORS.textPrimary }}
              >
                <MessageCircle size={16} /> Contact
              </motion.a>
              <motion.a 
                href="#"
                className="flex items-center text-sm cursor-pointer no-underline"
                style={{ color: COLORS.textSecondary, gap: SPACING.xs }}
                whileHover={{ color: COLORS.textPrimary }}
              >
                <Mail size={16} /> Email
              </motion.a>
            </div>
          </div>

        </div>

        {/* Bottom: Copyright */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-between pt-6 w-full"
          style={{ 
            borderTop: `1px solid ${COLORS.glassBorder}`,
            color: COLORS.textSecondary 
          }}
        >
          <span className="text-sm">© 2026 SwapSphere. All rights reserved.</span>
          <span className="text-xs mt-2 sm:mt-0 opacity-50">Designed in College</span>
        </div>
      </div>
    </footer>
  )
})

FooterSection.displayName = 'FooterSection'
