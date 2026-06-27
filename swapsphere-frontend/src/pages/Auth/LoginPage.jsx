import { useState, memo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { AppLayout } from '../../layouts/AppLayout.jsx'
import { GlassNavbar } from '../../components/glass/GlassNavbar.jsx'
import { GlassCard } from '../../components/glass/GlassCard.jsx'
import { GlassInput } from '../../components/glass/GlassInput.jsx'
import { GlassButton } from '../../components/glass/GlassButton.jsx'
import { authService } from '../../services/authService.js'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'

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

export const LoginPage = memo(function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const showSessionExpired = searchParams.get('expired') === 'true'

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const tempErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!formData.email || !emailRegex.test(formData.email)) {
      tempErrors.email = 'Enter a valid email address'
    }
    if (!formData.password || formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      await authService.login(formData)
      toast.success('Welcome back to SwapSphere!')
      navigate('/marketplace')
    } catch (err) {
      const serverMsg = err.response?.data?.message || 'Login failed. Please check your credentials.'
      toast.error(serverMsg)
    } finally {
      setLoading(false)
    }
  }

  const navbar = (
    <GlassNavbar
      logo={<Logo />}
      links={[]}
    />
  )

  return (
    <AppLayout navbar={navbar}>
      <div className="flex w-full flex-1 items-center justify-center py-16 px-4">
        <GlassCard 
          className="w-full max-w-[440px] p-6 sm:p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold m-0 text-white">Welcome Back</h1>
            <p className="text-white/50 text-sm mt-2">Log in to explore and trade student products</p>
          </div>

          {showSessionExpired && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center mb-5">
              Your session has expired. Please log in again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <GlassInput
              label="College Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              leftIcon={<Mail size={18} />}
              required
              fullWidth
            />

            <GlassInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              leftIcon={<Lock size={18} />}
              required
              fullWidth
            />

            <GlassButton
              type="submit"
              variant="default"
              loading={loading}
              className="py-3 mt-2 justify-center font-semibold text-base"
              fullWidth
            >
              Log In
            </GlassButton>

            <div className="text-center mt-4 text-sm text-white/50">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-white hover:underline focus:outline-none cursor-pointer font-medium"
              >
                Sign Up
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </AppLayout>
  )
})

LoginPage.displayName = 'LoginPage'
