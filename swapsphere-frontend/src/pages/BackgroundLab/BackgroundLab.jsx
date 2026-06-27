import { memo } from 'react'
import { BackgroundCanvas } from '../../components/background/BackgroundCanvas.jsx'
import { GlassNavbar } from '../../components/glass/GlassNavbar.jsx'
import { Layers } from 'lucide-react'
import { COLORS } from '../../theme/colors.js'

export const BackgroundLab = memo(function BackgroundLab() {
  return (
    <div className="min-h-screen w-full relative flex flex-col">
      <BackgroundCanvas />
      
      <GlassNavbar 
        logo={
          <div className="flex items-center gap-2">
            <Layers size={24} style={{ color: COLORS.textPrimary }} />
            <span className="font-semibold" style={{ color: COLORS.textPrimary }}>
              Background Lab
            </span>
          </div>
        }
        links={[
          { id: 'ambient', label: 'Ambient View' },
          { id: 'glass', label: 'Glass View' },
        ]}
      />
    </div>
  )
})

BackgroundLab.displayName = 'BackgroundLab'
