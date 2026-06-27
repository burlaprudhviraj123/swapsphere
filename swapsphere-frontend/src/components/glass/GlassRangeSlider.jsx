import { useEffect, useRef, useState } from 'react'
import { COLORS } from '../../theme/colors.js'

export function GlassRangeSlider({
  minValue = 0,
  maxValue = 5000,
  currentMin = 0,
  currentMax = 5000,
  step = 50,
  onChange,
  currencySymbol = '₹'
}) {
  const [localMin, setLocalMin] = useState(currentMin)
  const [localMax, setLocalMax] = useState(currentMax)
  const rangeRef = useRef(null)

  // Synchronize local state with props if they change externally (e.g. on Reset)
  useEffect(() => {
    setLocalMin(currentMin)
    setLocalMax(currentMax)
  }, [currentMin, currentMax])

  // Convert to percentage
  const getPercent = (value) =>
    Math.round(((value - minValue) / (maxValue - minValue)) * 100)

  // Set width of the range highlight track dynamically based on local min/max values
  useEffect(() => {
    if (rangeRef.current) {
      const minPercent = getPercent(localMin)
      const maxPercent = getPercent(localMax)

      rangeRef.current.style.left = `${minPercent}%`
      rangeRef.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [localMin, localMax])

  // Trigger parent update only at the end of the dragging interaction
  const handleDragEnd = () => {
    onChange?.(localMin, localMax)
  }

  return (
    <div className="flex flex-col w-full" style={{ gap: '12px' }}>
      {/* Values Display (Updates instantly at 60/120fps from local state) */}
      <div className="flex items-center justify-between text-sm font-semibold animate-pulse-subtle" style={{ color: COLORS.textPrimary }}>
        <span>{currencySymbol}{localMin.toLocaleString()}</span>
        <span>{currencySymbol}{localMax.toLocaleString()}</span>
      </div>

      {/* Slider Container */}
      <div className="relative w-full h-8 flex items-center">
        {/* Layered Range Inputs */}
        <input
          type="range"
          min={minValue}
          max={maxValue}
          value={localMin}
          step={step}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), localMax - step)
            setLocalMin(value)
          }}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
          className="thumb thumb--zindex-3"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={minValue}
          max={maxValue}
          value={localMax}
          step={step}
          onChange={(e) => {
            const value = Math.max(Number(e.target.value), localMin + step)
            setLocalMax(value)
          }}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
          className="thumb thumb--zindex-4"
          aria-label="Maximum price"
        />

        {/* Custom Track (Glassmorphism look) */}
        <div className="absolute left-0 right-0 h-1.5 rounded bg-white/10 border border-white/5 pointer-events-none" />

        {/* Custom Highlight Range (Active filled track) */}
        <div
          ref={rangeRef}
          className="absolute h-1.5 rounded pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.7) 100%)',
            boxShadow: '0 0 8px rgba(255,255,255,0.2)'
          }}
        />
      </div>

      {/* Embedded CSS for range styling */}
      <style>{`
        /* Styling the range inputs */
        .thumb,
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
        }

        .thumb {
          pointer-events: none;
          position: absolute;
          height: 0;
          width: 100%;
          outline: none;
          background: transparent;
          margin: 0;
          padding: 0;
          border: none;
        }

        .thumb--zindex-3 {
          z-index: 3;
        }

        .thumb--zindex-4 {
          z-index: 4;
        }

        /* Webkit Thumbs */
        .thumb::-webkit-slider-thumb {
          background-color: #ffffff;
          border: 1.5px solid rgba(0, 0, 0, 0.2);
          border-radius: 50%;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4), 0 2px 6px rgba(0, 0, 0, 0.4);
          cursor: pointer;
          height: 18px;
          width: 18px;
          margin-top: 0;
          pointer-events: all;
          position: relative;
          transition: transform 0.15s ease, background-color 0.15s ease;
        }

        .thumb::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          background-color: #f3f4f6;
        }

        .thumb::-webkit-slider-thumb:active {
          transform: scale(0.95);
          background-color: #e5e7eb;
        }

        /* Firefox Thumbs */
        .thumb::-moz-range-thumb {
          background-color: #ffffff;
          border: 1.5px solid rgba(0, 0, 0, 0.2);
          border-radius: 50%;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4), 0 2px 6px rgba(0, 0, 0, 0.4);
          cursor: pointer;
          height: 18px;
          width: 18px;
          pointer-events: all;
          position: relative;
          transition: transform 0.15s ease, background-color 0.15s ease;
        }

        .thumb::-moz-range-thumb:hover {
          transform: scale(1.15);
          background-color: #f3f4f6;
        }

        .thumb::-moz-range-thumb:active {
          transform: scale(0.95);
          background-color: #e5e7eb;
        }

        /* Firefox cleanups */
        .thumb::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  )
}



