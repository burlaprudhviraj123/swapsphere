import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn.js'
import GLASS from '../../theme/glassTheme.js'

export const Glass = forwardRef(function Glass(
  {
    children,
    variant = 'default',
    active = false,
    error = false,
    className,
    style,
    cornerRadius,
    fullWidth = false,
    fullHeight = false,
    onClick,
    ...props
  },
  ref
) {
  const radius = cornerRadius || GLASS.cornerRadius || 16
  const isInteractive = !!onClick || active

  // Determine background color and border color based on props
  let backgroundColor = 'rgba(255, 255, 255, 0.02)'
  let borderColor = 'rgba(255, 255, 255, 0.08)'

  if (error) {
    borderColor = 'rgba(239, 68, 68, 0.5)' // red-500
    backgroundColor = 'rgba(239, 68, 68, 0.05)'
  } else if (active) {
    backgroundColor = 'rgba(255, 255, 255, 0.06)'
    borderColor = 'rgba(255, 255, 255, 0.2)'
  } else if (variant === 'danger') {
    backgroundColor = 'rgba(239, 68, 68, 0.03)'
    borderColor = 'rgba(239, 68, 68, 0.3)'
  } else if (variant === 'success') {
    backgroundColor = 'rgba(34, 197, 94, 0.03)'
    borderColor = 'rgba(34, 197, 94, 0.3)'
  } else if (variant === 'ghost') {
    backgroundColor = 'transparent'
    borderColor = 'transparent'
  }

  // Combined style including radius, blur, borders, and shadows
  const glassStyle = {
    borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
    backgroundColor,
    border: borderColor !== 'transparent' ? `1px solid ${borderColor}` : 'none',
    backdropFilter: 'blur(20px) saturate(120%)',
    WebkitBackdropFilter: 'blur(20px) saturate(120%)',
    boxShadow: active 
      ? '0 0 0 1px rgba(255,255,255,0.2), 0 8px 32px 0 rgba(0, 0, 0, 0.37)' 
      : '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    ...style
  }

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden',
        fullWidth && 'w-full',
        fullHeight && 'h-full',
        isInteractive && 'transition-colors duration-200 cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.08]',
        className
      )}
      style={glassStyle}
      {...props}
    >
      {/* 1.5px Outer highlight border reflections */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          opacity: 0.15,
          padding: '1.5px',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          boxShadow: '0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.0) 0%, rgba(255, 255, 255, 0.12) 33%, rgba(255, 255, 255, 0.4) 66%, rgba(255, 255, 255, 0.0) 100%)'
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          padding: '1.5px',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          boxShadow: '0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.0) 0%, rgba(255, 255, 255, 0.32) 33%, rgba(255, 255, 255, 0.6) 66%, rgba(255, 255, 255, 0.0) 100%)'
        }}
      />

      {/* Subtle hover/active radial gradient glows */}
      {isInteractive && (
        <>
          <div
            className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-40"
            style={{
              borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
              backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 60%)',
              mixBlendMode: 'overlay'
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-active:opacity-75"
            style={{
              borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
              backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 80%)',
              mixBlendMode: 'overlay'
            }}
          />
        </>
      )}

      {/* Children Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
})

export default Glass
