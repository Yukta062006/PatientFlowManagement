import React, { useState, useCallback } from 'react'
import { hospitalSteps, SCORES } from '../../services/gameService'
import PointsAnimation from '../ui/PointsAnimation'

interface HospitalStep {
  id: number
  title: string
  description: string
  completed: boolean
}

interface HospitalJourneyProps {
  onComplete: (score: number) => void
  onExit: () => void
}

const HospitalJourney: React.FC<HospitalJourneyProps> = ({ onComplete, onExit }) => {
  const [steps, setSteps] = useState<HospitalStep[]>(hospitalSteps)
  const [score, setScore] = useState(0)
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)
  const [completedStepId, setCompletedStepId] = useState<number | null>(null)

  const totalSteps = hospitalSteps.length
  const completedCount = steps.filter(s => s.completed).length

  const handleStepComplete = useCallback((id: number) => {
    const step = steps.find(s => s.id === id)
    if (!step || step.completed) return

    const newScore = score + SCORES.CORRECT_ANSWER
    setScore(newScore)
    setCompletedStepId(id)
    setShowPointsAnimation(true)

    const newSteps = steps.map(s =>
      s.id === id ? { ...s, completed: true } : s
    )
    setSteps(newSteps)

    // Check if all steps are completed
    const allCompleted = newSteps.every(s => s.completed)
    if (allCompleted) {
      const finalScore = newScore + SCORES.GAME_COMPLETION_BONUS
      setTimeout(() => {
        onComplete(finalScore)
      }, 500)
    }

    // Clear animation after delay
    setTimeout(() => {
      setShowPointsAnimation(false)
      setCompletedStepId(null)
    }, 1000)
  }, [steps, score, onComplete])

  const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0

  return (
    <div className="max-w-3xl mx-auto">
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
            <p className="text-xs text-secondaryText uppercase tracking-wide">Progress</p>
            <p className="text-xl font-bold text-darkGreen">{completedCount}/{totalSteps}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondaryText uppercase tracking-wide">Score</p>
            <p className="text-xl font-bold text-primaryGreen">{score}</p>
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

      {/* Points Animation */}
      {showPointsAnimation && completedStepId && (
        <PointsAnimation
          points={SCORES.CORRECT_ANSWER}
          isPositive={true}
          onComplete={() => setShowPointsAnimation(false)}
        />
      )}

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-sage-100 to-sage-50 rounded-2xl p-6 mb-8 border border-sage-200">
        <h2 className="text-2xl font-bold text-darkGreen mb-3">Hospital Journey Prep</h2>
        <p className="text-secondaryText leading-relaxed">
          Complete these essential steps to prepare for your hospital visit. 
          Each completed step earns you points!
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`relative p-5 rounded-2xl border-2 transition-all ${
              step.completed
                ? 'bg-green-50 border-green-400'
                : completedStepId === step.id
                ? 'bg-sage-50 border-primaryGreen'
                : 'bg-white border-sage-200'
            }`}
          >
            {/* Points Animation for just-completed step */}
            {completedStepId === step.id && showPointsAnimation && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold animate-bounce">
                  +{SCORES.CORRECT_ANSWER}
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : completedStepId === step.id
                    ? 'bg-primaryGreen text-white'
                    : 'bg-sage-100 text-sage-500'
                }`}
              >
                {step.completed ? '✓' : index + 1}
              </div>
              <div className="flex-1">
                <h3
                  className={`text-lg font-bold mb-1 transition-colors ${
                    step.completed ? 'text-green-700' : 'text-darkGreen'
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-secondaryText leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
              <button
                onClick={() => handleStepComplete(step.id)}
                disabled={step.completed}
                className={`px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${
                  step.completed
                    ? 'bg-green-200 text-green-700 cursor-not-allowed'
                    : 'bg-darkGreen text-white hover:bg-primaryGreen'
                }`}
              >
                {step.completed ? 'Completed' : 'Complete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {completedCount === totalSteps && (
        <div className="mt-8 p-6 rounded-2xl bg-green-50 border-2 border-green-400">
          <div className="text-center">
            <div className="text-3xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-darkGreen mb-2">Preparation Complete!</h3>
            <p className="text-primaryGreen font-semibold text-lg">
              +{SCORES.GAME_COMPLETION_BONUS} completion bonus
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default HospitalJourney