import { forwardRef, memo, useState, useRef, useImperativeHandle } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import Glass from './Glass.jsx'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { RADIUS } from '../../theme/radius.js'
import { MOTION } from '../../theme/motion.js'
import { cn } from '../../utils/cn.js'

export const GlassInput = memo(
  forwardRef(function GlassInput(
    {
      label,
      placeholder,
      value,
      defaultValue,
      onChange,
      type = 'text',
      name,
      id: providedId,
      disabled = false,
      readOnly = false,
      required = false,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      autoComplete,
      autoFocus,
      ...props
    },
    ref,
  ) {
    const internalRef = useRef(null)
    useImperativeHandle(ref, () => internalRef.current)

    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [internalValue, setInternalValue] = useState(defaultValue ?? '')
    const [fallbackId] = useState(() => `glass-input-${Math.random().toString(36).substr(2, 9)}`)

    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue
    const hasValue = currentValue !== undefined && currentValue !== null && currentValue !== ''
    
    const id = providedId || fallbackId
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    const handleFocus = (e) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const handleChange = (e) => {
      if (!isControlled) setInternalValue(e.target.value)
      onChange?.(e)
    }

    const isError = Boolean(error)
    const activeColor = isError ? COLORS.danger : COLORS.textPrimary
    const borderColor = isError 
      ? COLORS.danger 
      : isFocused 
        ? COLORS.glassBorderActive 
        : COLORS.glassBorder

    return (
      <div className={cn('flex flex-col text-left', fullWidth ? 'w-full' : 'inline-flex', className)}>
        <motion.div
          animate={{ scale: isFocused && !disabled ? 1.01 : 1 }}
          transition={MOTION.spring}
          className="relative w-full"
        >
          <Glass
            cornerRadius={RADIUS.md}
            active={isFocused}
            error={isError}
            className="w-full relative transition-colors duration-300"
            style={{
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <div className="relative flex items-center w-full" style={{ minHeight: '56px' }}>
              {leftIcon && (
                <div 
                  className="absolute left-0 flex items-center justify-center pointer-events-none"
                  style={{ width: '48px', color: isFocused ? activeColor : COLORS.textMuted }}
                >
                  {leftIcon}
                </div>
              )}

              {label && (
                <motion.label
                  htmlFor={id}
                  initial={false}
                  animate={{
                    y: isFocused || hasValue ? -12 : 0,
                    scale: isFocused || hasValue ? 0.85 : 1,
                    color: isFocused ? activeColor : (isError ? COLORS.danger : COLORS.textSecondary),
                  }}
                  transition={MOTION.fast}
                  className="absolute origin-top-left pointer-events-none"
                  style={{
                    left: leftIcon ? '48px' : `${SPACING.inputPaddingX}px`,
                    top: '18px',
                  }}
                >
                  {label}
                  {required && <span className="ml-1" style={{ color: COLORS.danger }}>*</span>}
                </motion.label>
              )}

              <input
                ref={internalRef}
                id={id}
                type={inputType}
                name={name}
                value={currentValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                placeholder={isFocused || !label ? placeholder : ''}
                className="w-full bg-transparent border-none outline-none appearance-none"
                style={{
                  color: COLORS.textPrimary,
                  paddingTop: label ? '22px' : `${SPACING.inputPaddingY}px`,
                  paddingBottom: label ? '6px' : `${SPACING.inputPaddingY}px`,
                  paddingLeft: leftIcon ? '48px' : `${SPACING.inputPaddingX}px`,
                  paddingRight: rightIcon || isPassword || isError ? '48px' : `${SPACING.inputPaddingX}px`,
                }}
                {...props}
              />

              <div className="absolute right-0 flex items-center pr-3 h-full" style={{ gap: SPACING.xs }}>
                {isError && !isPassword && !rightIcon && (
                  <AlertCircle size={20} color={COLORS.danger} />
                )}
                {rightIcon}
                {isPassword && (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center p-1 rounded-md transition-colors cursor-pointer"
                    style={{ color: COLORS.textMuted }}
                    onMouseEnter={(e) => e.currentTarget.style.color = COLORS.textPrimary}
                    onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textMuted}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                )}
              </div>
            </div>
          </Glass>
        </motion.div>

        <AnimatePresence>
          {(error || helperText) && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={MOTION.fadeDown}
              className="mt-2 px-1 text-sm flex items-start gap-1.5"
              style={{ color: isError ? COLORS.danger : COLORS.textMuted }}
            >
              {isError && <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />}
              <span>{error || helperText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  })
)

GlassInput.displayName = 'GlassInput'
