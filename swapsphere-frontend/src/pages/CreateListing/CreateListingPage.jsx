import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, DollarSign, List, Sparkles, Layers, FileText, ArrowLeft, Clock, CheckCircle2, AlertCircle, Info, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { AppLayout } from '../../layouts/AppLayout.jsx'
import { GlassNavbar } from '../../components/glass/GlassNavbar.jsx'
import { GlassCard } from '../../components/glass/GlassCard.jsx'
import { GlassInput } from '../../components/glass/GlassInput.jsx'
import { GlassButton } from '../../components/glass/GlassButton.jsx'
import { GlassChip } from '../../components/glass/GlassChip.jsx'
import { productService } from '../../services/productService.js'
import { CATEGORY_MAP } from '../../utils/categoryMap.js'
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

const CONDITION_OPTIONS = [
  { value: 'NEW', label: 'Brand New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' }
]

export function CreateListingPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '1',
    category: '',
    condition: '',
    usageDuration: '',
    negotiable: false
  })

  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    if (images.length >= 5) {
      toast.error('Maximum 5 images allowed per listing')
      return
    }

    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed per listing. Trimming extra files.')
      const allowedCount = 5 - images.length
      const allowedFiles = files.slice(0, allowedCount)
      setImages((prev) => [...prev, ...allowedFiles])
      const newPreviews = allowedFiles.map((file) => URL.createObjectURL(file))
      setImagePreviews((prev) => [...prev, ...newPreviews])
    } else {
      setImages((prev) => [...prev, ...files])
      const newPreviews = files.map((file) => URL.createObjectURL(file))
      setImagePreviews((prev) => [...prev, ...newPreviews])
    }

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: '' }))
    }
  }

  const removeImage = (index) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)

    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index])
    const updatedPreviews = [...imagePreviews]
    updatedPreviews.splice(index, 1)
    setImagePreviews(updatedPreviews)
  }

  const validateForm = () => {
    const tempErrors = {}

    if (!formData.title || !formData.title.trim()) {
      tempErrors.title = 'Product title is required'
    }
    
    const priceNum = parseFloat(formData.price)
    if (isNaN(priceNum) || priceNum <= 0) {
      tempErrors.price = 'Price must be a positive number'
    }

    const qtyNum = parseInt(formData.quantity)
    if (isNaN(qtyNum) || qtyNum <= 0) {
      tempErrors.quantity = 'Quantity must be a positive integer'
    }

    if (!formData.category) {
      tempErrors.category = 'Select a product category'
    }

    if (!formData.condition) {
      tempErrors.condition = 'Select the product condition'
    }

    if (images.length === 0) {
      tempErrors.images = 'At least 1 product image is required'
      toast.error('Please upload at least 1 image of your product')
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const productRequest = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        condition: formData.condition,
        usageDuration: formData.usageDuration || null,
        negotiable: formData.negotiable
      }

      await productService.createProduct(productRequest, images)
      toast.success('Listing published successfully!')
      navigate('/marketplace')
    } catch (err) {
      const serverMsg = err.response?.data?.message || 'Failed to publish listing. Try again.'
      toast.error(serverMsg)
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      }
    } finally {
      setLoading(false)
    }
  }

  const navbar = useMemo(() => ({
    links: NAVBAR_LINKS,
    activeId: 'marketplace',
    logo: <Logo />,
    onLinkClick: (id) => navigate(`/${id}`)
  }), [navigate])

  return (
    <AppLayout navbar={navbar}>
      <div className="flex items-center justify-between mb-8">
        <GlassButton 
          variant="secondary"
          onClick={() => navigate('/marketplace')}
          leftIcon={<ArrowLeft size={16} />}
        >
          Back to Marketplace
        </GlassButton>
        <span className="text-white/40 text-sm">Create New Product Listing</span>
      </div>

      <div className="max-w-[780px] mx-auto">
        <GlassCard padding="lg" className="w-full">
          <div className="text-center mb-8 border-b border-white/5 pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold m-0 text-white">Create New Listing</h1>
            <p className="text-white/50 text-sm mt-2">Publish your item to the campus marketplace</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title */}
            <GlassInput
              label="Listing Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="e.g. iPad Pro 11-inch (2024)"
              leftIcon={<Sparkles size={18} />}
              required
              fullWidth
            />

            {/* Price and Quantity Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <GlassInput
                label="Price ($)"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                placeholder="0.00"
                leftIcon={<DollarSign size={18} />}
                required
                fullWidth
              />

              <GlassInput
                label="Quantity Available"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                error={errors.quantity}
                placeholder="1"
                leftIcon={<Layers size={18} />}
                required
                fullWidth
              />
            </div>

            {/* Category and Condition Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/70">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="h-[56px] rounded-lg bg-white/5 border border-white/10 px-4 text-white outline-none focus:border-white/30 backdrop-blur-md transition-all duration-300"
                  style={{ borderRadius: RADIUS.md }}
                >
                  <option value="" className="bg-zinc-900 text-white/50">Select Category</option>
                  {Object.entries(CATEGORY_MAP).map(([key, value]) => (
                    <option key={key} value={key} className="bg-zinc-900 text-white">
                      {value}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="text-red-500 text-xs mt-1">{errors.category}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/70">Condition *</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="h-[56px] rounded-lg bg-white/5 border border-white/10 px-4 text-white outline-none focus:border-white/30 backdrop-blur-md transition-all duration-300"
                  style={{ borderRadius: RADIUS.md }}
                >
                  <option value="" className="bg-zinc-900 text-white/50">Select Condition</option>
                  {CONDITION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.condition && (
                  <span className="text-red-500 text-xs mt-1">{errors.condition}</span>
                )}
              </div>
            </div>

            {/* Optional Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <GlassInput
                label="Usage Duration (Optional)"
                name="usageDuration"
                value={formData.usageDuration}
                onChange={handleChange}
                placeholder="e.g. 3 months, 1 year"
                leftIcon={<Clock size={18} />}
                fullWidth
              />

              {/* Negotiable Checkbox Field */}
              <div 
                className="flex items-center justify-between h-[56px] px-4 rounded-lg bg-white/5 border border-white/10"
                style={{ borderRadius: RADIUS.md }}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">Negotiable Price</span>
                  <span className="text-xs text-white/40">Accept offers from buyers</span>
                </div>
                <input
                  type="checkbox"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/10 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/70">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Provide detailed information regarding the listing (item defects, pickup location, specifications)..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-white/30 backdrop-blur-md transition-all duration-300 placeholder-white/30"
                style={{ borderRadius: RADIUS.md }}
              />
            </div>

            {/* Images Upload area */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white/80">Product Images *</label>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-all ${
                  images.length >= 1 && images.length <= 5 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : errors.images 
                      ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                      : 'bg-white/10 text-white/50 border-white/10'
                }`}>
                  {images.length}/5 uploaded
                </span>
              </div>

              {/* Upload Guidelines & Requirement Checklist */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
                  <Info size={15} className="text-blue-400" />
                  <span>Image Upload Checklist & Guidelines</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-2 ${images.length >= 1 ? 'text-emerald-400 font-medium' : 'text-white/50'}`}>
                    {images.length >= 1 ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-white/30" />}
                    <span>At least 1 photo required (min)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${images.length > 0 && images.length <= 5 ? 'text-emerald-400 font-medium' : 'text-white/50'}`}>
                    {images.length > 0 && images.length <= 5 ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-white/30" />}
                    <span>Maximum 5 photos allowed (max)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <div className="w-3.5 h-3.5 rounded-full border border-white/30 flex items-center justify-center text-[10px]">1</div>
                    <span>First image is used as main cover</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <Check size={14} className="text-white/40" />
                    <span>Clear photos attract more buyers</span>
                  </div>
                </div>
              </div>

              {errors.images && (
                <span className="text-red-400 text-xs font-medium flex items-center gap-1 mt-1">
                  <AlertCircle size={13} />
                  {errors.images}
                </span>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                {/* Upload Trigger Button */}
                <label 
                  className={`aspect-square flex flex-col items-center justify-center border border-dashed rounded-lg transition-all ${
                    images.length >= 5 
                      ? 'border-white/10 bg-white/3 opacity-50 cursor-not-allowed text-white/30' 
                      : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 cursor-pointer text-white/60 hover:text-white'
                  }`}
                  style={{ borderRadius: RADIUS.md }}
                >
                  <Upload size={24} className="mb-2" />
                  <span className="text-xs font-medium">
                    {images.length >= 5 ? 'Limit Reached' : 'Upload File'}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={images.length >= 5}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Previews */}
                {imagePreviews.map((src, index) => (
                  <div 
                    key={index} 
                    className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group"
                    style={{ borderRadius: RADIUS.md }}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {index === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold px-1.5 py-0.5 rounded border border-white/10">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/80 focus:outline-none cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <GlassButton
              type="submit"
              variant="default"
              loading={loading}
              className="py-3 mt-4 justify-center font-semibold text-base"
              fullWidth
            >
              Publish Listing
            </GlassButton>
          </form>
        </GlassCard>
      </div>
    </AppLayout>
  )
}
