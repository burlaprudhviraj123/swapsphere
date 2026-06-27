import { forwardRef, memo, useState, useRef, useImperativeHandle } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassInput } from './GlassInput.jsx'
import { COLORS } from '../../theme/colors.js'
import { MOTION } from '../../theme/motion.js'
import { cn } from '../../utils/cn.js'

export const GlassSearch = memo(
  forwardRef(function GlassSearch(
    {
      value,
      defaultValue,
      onChange,
      onSearch,
      placeholder = 'Search...',
      autoFocus,
      fullWidth = false,
      className,
      loading = false,
      ...props
    },
    ref,
  ) {
    const internalRef = useRef(null)
    useImperativeHandle(ref, () => internalRef.current)

    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = useState(defaultValue ?? '')
    const currentValue = isControlled ? value : internalValue
    const hasValue = currentValue !== undefined && currentValue !== null && currentValue !== ''

    const handleChange = (e) => {
      if (!isControlled) {
        setInternalValue(e.target.value)
      }
      onChange?.(e)
    }

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue('')
      }
      
      if (onChange && internalRef.current) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set
        nativeInputValueSetter.call(internalRef.current, '')
        const event = new Event('input', { bubbles: true })
        internalRef.current.dispatchEvent(event)
      } else if (onChange) {
        onChange({ target: { value: '' } })
      }
      
      internalRef.current?.focus()
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onSearch?.(currentValue)
      }
      props.onKeyDown?.(e)
    }

    const rightIcon = (
      <div className="flex items-center justify-center w-5">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={MOTION.fast}
              className="absolute"
            >
              <Loader2 className="animate-spin" size={20} style={{ color: COLORS.textMuted }} />
            </motion.div>
          ) : hasValue ? (
            <motion.button
              key="clear"
              type="button"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={MOTION.fast}
              onClick={handleClear}
              className="absolute flex items-center justify-center p-1 rounded-md transition-colors cursor-pointer -mr-1"
              style={{ color: COLORS.textMuted }}
              onMouseEnter={(e) => e.currentTarget.style.color = COLORS.textPrimary}
              onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textMuted}
              aria-label="Clear search"
            >
              <X size={20} />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
    )

    return (
      <GlassInput
        ref={internalRef}
        type="text"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        fullWidth={fullWidth}
        className={cn('glass-search', className)}
        leftIcon={<Search size={20} />}
        rightIcon={rightIcon}
        {...props}
      />
    )
  })
)

GlassSearch.displayName = 'GlassSearch'
