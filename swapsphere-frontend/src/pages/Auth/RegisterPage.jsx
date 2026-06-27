import { useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone, MapPin, Building } from 'lucide-react'
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

export const RegisterPage = memo(function RegisterPage() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    pincode: '',
    collegeName: '',
    city: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear validation error when editing field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Frontend validation logic matching backend JSR-303 annotations
  const validateForm = () => {
    const tempErrors = {}
    
    if (!formData.name || formData.name.trim().length < 3) {
      tempErrors.name = 'Name must be at least 3 characters'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      tempErrors.email = 'Enter a valid email address'
    }
    
    if (!formData.password || formData.password.length < 6 || formData.password.length > 20) {
      tempErrors.password = 'Password must be between 6 and 20 characters'
    }
    
    const phoneRegex = /^[6-9]\d{9}$/
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = 'Enter a valid 10-digit mobile number (starts with 6-9)'
    }
    
    const pinRegex = /^\d{6}$/
    if (!formData.pincode || !pinRegex.test(formData.pincode)) {
      tempErrors.pincode = 'Pincode must contain exactly 6 digits'
    }
    
    if (!formData.collegeName) {
      tempErrors.collegeName = 'College name is required'
    }
    
    if (!formData.city) {
      tempErrors.city = 'City name is required'
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      await authService.register(formData)
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      const serverMsg = err.response?.data?.message || 'Registration failed. Try again.'
      toast.error(serverMsg)
      
      // Map server exception errors if available
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      }
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
      <div className="flex w-full flex-1 items-center justify-center py-10 px-4">
        <GlassCard 
          className="w-full max-w-[540px] p-6 sm:p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold m-0 text-white">Create an Account</h1>
            <p className="text-white/50 text-sm mt-2">Join SwapSphere to trade with verified campus students</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <GlassInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              leftIcon={<User size={18} />}
              required
              fullWidth
            />

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <GlassInput
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                placeholder="9876543210"
                leftIcon={<Phone size={18} />}
                required
                fullWidth
              />

              <GlassInput
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                error={errors.pincode}
                placeholder="600001"
                leftIcon={<MapPin size={18} />}
                required
                fullWidth
              />
            </div>

            <GlassInput
              label="College Name"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              error={errors.collegeName}
              leftIcon={<Building size={18} />}
              required
              fullWidth
            />

            <GlassInput
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              leftIcon={<MapPin size={18} />}
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
              Sign Up
            </GlassButton>

            <div className="text-center mt-4 text-sm text-white/50">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-white hover:underline focus:outline-none cursor-pointer font-medium"
              >
                Log In
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </AppLayout>
  )
})

RegisterPage.displayName = 'RegisterPage'
