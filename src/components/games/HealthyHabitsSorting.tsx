import React, { useState, useEffect, useCallback } from 'react'
import { habitCards, SCORES } from '../../services/gameService'
import PointsAnimation from '../ui/PointsAnimation'

interface HabitCard {
  id: number
  text: string
  category: 'healthy' | 'less-healthy' | 'neutral'
  isSorted: boolean
}

interface HealthyHabitsSortingProps {
  onComplete: (score: number) => void
  onExit: () => void
}

const HealthyHabitsSorting: React.FC<HealthyHabitsSortingProps> = ({ onComplete, onExit }) => {
  const [cards, setCards] = useState<HabitCard[]>([])
  const [score, setScore] = useState(0)
  const [sortedCount, setSortedCount] = useState(0)
  const [draggedCardId, setDraggedCardId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({ type: null, message: '' })
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set())

  const totalCards = habitCards.length

  useEffect(() => {
    setCards(habitCards.map(c => ({ ...c, category: c.category as 'healthy' | 'less-healthy' | 'neutral' })))
  }, [])

  const handleDragStart = useCallback((id: number) => {
    if (completedCards.has(id)) return
    setDraggedCardId(id)
  }, [completedCards])

  const handleDrop = useCallback((targetCategory: 'healthy' | 'less-healthy') => {
    if (draggedCardId === null) return

    const card = cards.find(c => c.id === draggedCardId)
    if (!card) return

    const isCorrect = card.category === targetCategory
    
    if (isCorrect) {
      const newScore = score + SCORES.CORRECT_SORTING
      setScore(newScore)
      setSortedCount(prev => prev + 1)
      setShowPointsAnimation(true)
      setFeedback({ type: 'correct', message: `Correct! +${SCORES.CORRECT_SORTING} points` })
      
      // Mark card as completed
      setCompletedCards(prev => new Set([...prev, card.id]))
    } else {
      setFeedback({ type: 'incorrect', message: 'Try again! This habit doesn\'t belong here.' })
    }

    setDraggedCardId(null)

    // Clear feedback after delay
    setTimeout(() => {
      setFeedback({ type: null, message: '' })
    }, 1500)
  }, [draggedCardId, cards, score])

  useEffect(() => {
    if (sortedCount === totalCards && totalCards > 0) {
      // All cards sorted - add completion bonus
      const finalScore = score + SCORES.GAME_COMPLETION_BONUS
      setTimeout(() => {
        onComplete(finalScore)
      }, 500)
    }
  }, [sortedCount, totalCards, score, onComplete])

  const progress = totalCards > 0 ? (sortedCount / totalCards) * 100 : 0
  const remainingCards = cards.filter(c => !completedCards.has(c.id))

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onExit}
          className="text-darkGreen hover:bg-sage-100 px-4 py-2 rounded-xl transition-colors flex items-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          ← Exit
        </button>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-secondaryText uppercase tracking-wide">Score</p>
            <p className="text-xl font-bold text-primaryGreen">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondaryText uppercase tracking-wide">Sorted</p>
            <p className="text-xl font-bold text-darkGreen">{sortedCount}/{totalCards}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-sage-200 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primaryGreen to-darkGreen rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Feedback Message */}
      {feedback.type && (
        <div 
          className={`p-4 rounded-xl mb-6 text-center animate-bounce ${
            feedback.type === 'correct' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          <span className="font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Points Animation */}
      {showPointsAnimation && (
        <PointsAnimation
          points={SCORES.CORRECT_SORTING}
          isPositive={true}
          onComplete={() => setShowPointsAnimation(false)}
        />
      )}

      {/* Categories */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop('healthy')}
          className={`p-6 rounded-2xl border-2 border-dashed transition-all ${
            feedback.type === 'correct'
              ? 'bg-green-50 border-green-400'
              : 'bg-white border-sage-300 hover:border-primaryGreen'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">✓</span>
            <h3 className="text-lg font-bold text-darkGreen">Healthy Habit</h3>
          </div>
          <p className="text-sm text-secondaryText">Drag habits that support good health</p>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop('less-healthy')}
          className={`p-6 rounded-2xl border-2 border-dashed transition-all ${
            feedback.type === 'correct'
              ? 'bg-green-50 border-green-400'
              : 'bg-white border-sage-300 hover:border-red-400'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">✗</span>
            <h3 className="text-lg font-bold text-darkGreen">Less Healthy</h3>
          </div>
          <p className="text-sm text-secondaryText">Drag habits that may be harmful</p>
        </div>
      </div>

      {/* Cards to sort */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {remainingCards.map(card => (
          <div
            key={card.id}
            draggable
            onDragStart={() => handleDragStart(card.id)}
            className="bg-white p-5 rounded-xl border border-sage-200 shadow-sm cursor-grab hover:shadow-md hover:border-sage-300 active:cursor-grabbing transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                card.category === 'healthy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {card.category === 'healthy' ? '✓' : '✗'}
              </div>
              <div>
                <p className="text-base font-medium text-darkGreen leading-relaxed">
                  {card.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {sortedCount === totalCards && (
        <div className="mt-8 text-center">
          <div className="inline-block bg-green-100 text-green-700 px-6 py-3 rounded-xl animate-pulse">
            <p className="font-bold">All habits sorted!</p>
            <p className="text-sm">+{SCORES.GAME_COMPLETION_BONUS} completion bonus</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default HealthyHabitsSorting