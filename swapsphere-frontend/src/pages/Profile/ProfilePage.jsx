import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Building, MapPin, Calendar, Edit2, LogOut, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { AppLayout } from '../../layouts/AppLayout.jsx'
import { GlassNavbar } from '../../components/glass/GlassNavbar.jsx'
import { GlassCard } from '../../components/glass/GlassCard.jsx'
import { GlassButton } from '../../components/glass/GlassButton.jsx'
import { GlassInput } from '../../components/glass/GlassInput.jsx'
import { GlassModal } from '../../components/glass/GlassModal.jsx'
import { authService } from '../../services/authService.js'
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
      style={{ background: `linear-gradient(135deg, ${COLORS.textPrimary}, ${COLORS.textSecondary})` }}
    >
      <div className="w-7 h-7 rounded-full" style={{ backgroundColor: COLORS.background }} />
    </div>
    <span className="font-semibold text-xl tracking-tight hidden sm:block" style={{ color: COLORS.textPrimary }}>
      SwapSphere
    </span>
  </a>
)

export function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  const [editForm, setEditForm] = useState({
    name: '',
    phoneNumber: '',
    collegeName: '',
    city: '',
    pincode: ''
  })
  
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const userProfile = authService.getUserProfileFallback()
    if (userProfile) {
      setProfile(userProfile)
      setEditForm({
        name: userProfile.name || '',
        phoneNumber: userProfile.phoneNumber || '',
        collegeName: userProfile.collegeName || '',
        city: userProfile.city || '',
        pincode: userProfile.pincode || ''
      })
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateEditForm = () => {
    const tempErrors = {}
    if (!editForm.name || editForm.name.trim().length < 3) {
      tempErrors.name = 'Name must be at least 3 characters'
    }
    const phoneRegex = /^[6-9]\d{9}$/
    if (!editForm.phoneNumber || !phoneRegex.test(editForm.phoneNumber)) {
      tempErrors.phoneNumber = 'Enter a valid 10-digit mobile number'
    }
    const pinRegex = /^\d{6}$/
    if (!editForm.pincode || !pinRegex.test(editForm.pincode)) {
      tempErrors.pincode = 'Pincode must contain exactly 6 digits'
    }
    if (!editForm.collegeName) {
      tempErrors.collegeName = 'College name is required'
    }
    if (!editForm.city) {
      tempErrors.city = 'City is required'
    }
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    if (!validateEditForm()) return
    
    // Save to local registration profile backup cache (backend has no user updates API)
    const updated = authService.updateUserProfileFallback(editForm)
    setProfile(updated)
    setIsEditOpen(false)
    toast.success('Profile details updated successfully')
  }

  const navbar = useMemo(() => ({
    links: NAVBAR_LINKS,
    activeId: 'profile',
    logo: <Logo />,
    onLinkClick: (id) => navigate(`/${id}`)
  }), [navigate])

  if (!profile) return null

  return (
    <AppLayout navbar={navbar}>
      {/* Back Button Row */}
      <div className="flex items-center justify-between mb-8">
        <GlassButton 
          variant="secondary"
          onClick={() => navigate('/my-activity')}
          leftIcon={<ArrowLeft size={16} />}
        >
          Back to Dashboard
        </GlassButton>
        <span className="text-white/40 text-sm">Account ID: #{profile.id || 'N/A'}</span>
      </div>

      <div className="max-w-[720px] mx-auto flex flex-col gap-6">
        {/* Profile Card Header */}
        <GlassCard padding="lg" className="w-full relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 overflow-hidden flex-shrink-0">
              <User size={48} className="opacity-80" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white m-0 leading-tight">
                {profile.name}
              </h1>
              <p className="text-white/60 text-sm flex items-center justify-center sm:justify-start gap-1">
                <Mail size={14} />
                <span>{profile.email}</span>
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                <GlassButton 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setIsEditOpen(true)}
                  leftIcon={<Edit2 size={14} />}
                >
                  Edit Profile
                </GlassButton>
                <GlassButton 
                  variant="danger" 
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<LogOut size={14} />}
                >
                  Log Out
                </GlassButton>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Detailed User Information List */}
        <GlassCard padding="lg" className="w-full flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-white/80 border-b border-white/5 pb-3 m-0">
            Student Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 flex-shrink-0">
                <Building size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">College / University</span>
                <span className="text-sm font-medium text-white/85">{profile.collegeName}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 flex-shrink-0">
                <Phone size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Mobile Contact</span>
                <span className="text-sm font-medium text-white/85">{profile.phoneNumber || 'Not Set'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">City Location</span>
                <span className="text-sm font-medium text-white/85">{profile.city}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Pincode</span>
                <span className="text-sm font-medium text-white/85">{profile.pincode || '000000'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 flex-shrink-0">
                <Calendar size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Joined Platform</span>
                <span className="text-sm font-medium text-white/85">September 2025</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-xs text-white/45 mt-4">
            <strong>Note:</strong> Profile information is cached locally. In the future, these details will synchronize with the database when the backend introduces a dedicated profile/user controller.
          </div>
        </GlassCard>
      </div>

      {/* Edit Profile Modal */}
      <GlassModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profile Details"
        size="sm"
      >
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-5 mt-2">
          <GlassInput
            label="Full Name"
            name="name"
            value={editForm.name}
            onChange={handleEditChange}
            error={errors.name}
            required
            fullWidth
          />
          <GlassInput
            label="Phone Number"
            name="phoneNumber"
            value={editForm.phoneNumber}
            onChange={handleEditChange}
            error={errors.phoneNumber}
            required
            fullWidth
          />
          <GlassInput
            label="College Name"
            name="collegeName"
            value={editForm.collegeName}
            onChange={handleEditChange}
            error={errors.collegeName}
            required
            fullWidth
          />
          <div className="grid grid-cols-2 gap-4">
            <GlassInput
              label="City"
              name="city"
              value={editForm.city}
              onChange={handleEditChange}
              error={errors.city}
              required
              fullWidth
            />
            <GlassInput
              label="Pincode"
              name="pincode"
              value={editForm.pincode}
              onChange={handleEditChange}
              error={errors.pincode}
              required
              fullWidth
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-white/5 pt-4">
            <GlassButton 
              type="button" 
              variant="secondary" 
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton 
              type="submit" 
              variant="default"
            >
              Save Changes
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </AppLayout>
  )
}
