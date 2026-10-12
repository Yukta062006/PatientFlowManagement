import React, { useEffect, useState } from 'react'
import { Minus, Plus } from 'lucide-react'

interface PointsAnimationProps {
  points: number
  isPositive: boolean
  position?: { x: number; y: number } | 'auto'
  onComplete?: () => void
}

// Custom hook for animation timing with reduced motion preference
const useAnimationDuration = (): number => {
  const [duration, setDuration] = useState(600)
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setDuration(prefersReducedMotion ? 100 : 600)
  }, [])
  
  return duration
}

const PointsAnimation: React.FC<PointsAnimationProps> = ({
  points,
  isPositive,
  position = 'auto',
  onComplete
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [offset, setOffset] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const duration = useAnimationDuration()

  useEffect(() => {
    const startTime = Date.now()
    let animationFrame: number

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setOffset(-40 * easeOut) // Float up 40px
      setOpacity(1 - progress) // Fade out
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setIsVisible(false)
        onComplete?.()
      }
    }

    animationFrame = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [duration, onComplete])

  if (!isVisible) return null

  const positionStyle = position !== 'auto' 
    ? { 
        left: position.x, 
        top: position.y,
        transform: 'translate(-50%, -50%)'
      } 
    : {}

  return (
    <div
      className={`
        fixed pointer-events-none z-50
        ${position !== 'auto' ? 'absolute' : ''}
      `}
      style={{
        ...positionStyle,
        opacity,
        transition: `opacity ${duration * 0.2}ms ease-out`,
      }}
    >
      <div 
        className={`
          flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-lg
          ${isPositive 
            ? 'bg-green-100 text-green-700 border border-green-300 shadow-sm' 
            : 'bg-red-100 text-red-700 border border-red-300 shadow-sm'
          }
        `}
        style={{
          transform: `translateY(${offset}px)`,
          transition: `transform ${duration}ms ease-out`,
        }}
      >
        {isPositive ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
        <span>{isPositive ? '+' : '-'}{points}</span>
      </div>
    </div>
  )
}

// Wrapper component for inline animations
interface InlinePointsProps {
  show: boolean
  points: number
  isPositive?: boolean
  onAnimationComplete?: () => void
}

export const InlinePointsFeedback: React.FC<InlinePointsProps> = ({
  show,
  points,
  isPositive = true,
  onAnimationComplete
}) => {
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (show) {
      setKey(prev => prev + 1)
    }
  }, [show])

  if (!show) return null

  return (
    <PointsAnimation
      key={key}
      points={points}
      isPositive={isPositive}
      onComplete={onAnimationComplete}
    />
  )
}

export default PointsAnimation