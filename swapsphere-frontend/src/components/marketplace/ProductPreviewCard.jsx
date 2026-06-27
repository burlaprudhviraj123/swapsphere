import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image as ImageIcon, MapPin } from 'lucide-react'
import { GlassCard } from '../glass/GlassCard.jsx'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { RADIUS } from '../../theme/radius.js'

const getStatusStyle = (status) => {
  const upper = (status || '').toUpperCase()
  if (upper === 'AVAILABLE') {
    return 'bg-emerald-500/25 text-emerald-300 border-emerald-500/35 shadow-emerald-500/10'
  }
  if (upper === 'RESERVED') {
    return 'bg-blue-500/25 text-blue-300 border-blue-500/35 shadow-blue-500/10'
  }
  return 'bg-rose-500/25 text-rose-300 border-rose-500/35 shadow-rose-500/10'
}

export const ProductPreviewCard = memo(function ProductPreviewCard({ 
  product, 
  onClick, 
  fullWidth = true 
}) {
  const navigate = useNavigate()
  const { id, title, price, status, sellerName, city, coverImage, imageUrl: propImageUrl, images, seller } = product || {}
  const imageUrl = coverImage?.imageUrl || propImageUrl || (images && images.length > 0 ? (images[0].imageUrl || images[0]) : null)
  const dispSellerName = sellerName || seller?.name || product?.sellerName

  const handleCardClick = onClick || (() => {
    if (id) {
      navigate(`/marketplace/${id}`)
    }
  })

  const footer = dispSellerName ? (
    <div className="flex items-center justify-between w-full px-2" style={{ gap: SPACING.sm }}>
      <div className="flex items-center min-w-0" style={{ gap: SPACING.xs }}>
        <div 
          className="rounded-full bg-white/10 flex-shrink-0"
          style={{ width: 22, height: 22 }}
        />
        <span className="text-xs truncate font-medium" style={{ color: COLORS.textSecondary }}>
          {dispSellerName}
        </span>
      </div>
      {city && (
        <div className="flex items-center text-xs text-white/40 flex-shrink-0 gap-1">
          <MapPin size={11} />
          <span>{city}</span>
        </div>
      )}
    </div>
  ) : null

  return (
    <GlassCard
      hoverable
      clickable={true}
      onClick={handleCardClick}
      fullWidth={fullWidth}
      padding="sm"
      footer={footer}
    >
      {/* Image container */}
      <div 
        className="relative w-full overflow-hidden flex items-center justify-center bg-white/5"
        style={{ 
          aspectRatio: '4/3', 
          borderRadius: RADIUS.sm,
          marginBottom: SPACING.md
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={32} style={{ color: COLORS.textSecondary, opacity: 0.5 }} />
        )}
        
        {/* Status Badge */}
        {status && (
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border backdrop-blur-md shadow-sm ${getStatusStyle(status)}`}>
              {status}
            </span>
          </div>
        )}
      </div>
      
      {/* Details */}
      <div className="flex flex-col w-full px-2" style={{ gap: SPACING.xs }}>
        <h3 className="font-semibold text-base m-0 truncate" style={{ color: COLORS.textPrimary }}>
          {title || 'Untitled Item'}
        </h3>
        <span className="font-medium text-base" style={{ color: COLORS.textPrimary }}>
          {price !== undefined ? (Number(price) === 0 ? 'Free' : `$${Number(price).toFixed(2)}`) : '—'}
        </span>
      </div>
      
      <div className="mt-2" /> {/* Spacer before footer */}
    </GlassCard>
  )
})

ProductPreviewCard.displayName = 'ProductPreviewCard'


