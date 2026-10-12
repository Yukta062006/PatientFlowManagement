import React, { useState, useCallback } from 'react'
import { SCORES } from '../../services/gameService'
import PointsAnimation from '../ui/PointsAnimation'

interface HospitalScenario {
  id: number
  title: string
  description: string
  correctAction: string
  wrongAction: string
  correctFeedback: string
  wrongFeedback: string
  points: number
}

interface HospitalAdventureProps {
  onComplete: (score: number) => void
  onExit: () => void
}

const HospitalAdventure: React.FC<HospitalAdventureProps> = ({ onComplete, onExit }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [selectedAction, setSelectedAction] = useState<'correct' | 'wrong' | null>(null)
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const scenarios: HospitalScenario[] = [
    {
      id: 1,
      title: 'The Check-In Desk',
      description: 'You arrive at the hospital and need to check in for your appointment. What should you bring?',
      correctAction: 'Insurance card, ID, and appointment confirmation',
      wrongAction: 'Just your phone and wallet',
      correctFeedback: 'Perfect! You have all the necessary documents for check-in.',
      wrongFeedback: 'That might cause delays. You\'ll need proper identification and insurance information.',
      points: 20,
    },
    {
      id: 2,
      title: 'Medication Review',
      description: 'A nurse asks about your medications. What is the most important thing to do?',
      correctAction: 'Show your complete medication list including dosages',
      wrongAction: 'Try to remember what you think you take',
      correctFeedback: 'Excellent! Accurate medication information prevents dangerous interactions.',
      wrongFeedback: 'This could lead to errors. Always share the complete and accurate medication list.',
      points: 20,
    },
    {
      id: 3,
      title: 'Pre-Procedure Fasting',
      description: 'You need to fast before your procedure. When should you stop eating and drinking?',
      correctAction: 'As instructed by your healthcare provider (usually 8 hours)',
      wrongAction: 'Just skip breakfast if your appointment is in the afternoon',
      correctFeedback: 'Correct! Following fasting instructions prevents surgical complications.',
      wrongFeedback: 'This could be dangerous. Always follow the specific fasting guidelines provided.',
      points: 20,
    },
    {
      id: 4,
      title: 'Allergy Information',
      description: 'A doctor asks about allergies before prescribing medication. What should you do?',
      correctAction: 'Tell them about ALL known allergies including reactions',
      wrongAction: 'Only mention severe allergies you think are important',
      correctFeedback: 'Right! Full allergy disclosure is essential for patient safety.',
      wrongFeedback: 'All allergies should be reported, even if you think they\'re minor.',
      points: 20,
    },
    {
      id: 5,
      title: 'Questions Preparation',
      description: 'You have 15 minutes with your doctor. How should you prepare?',
      correctAction: 'Write down questions and concerns beforehand',
      wrongAction: 'Try to remember everything when you\'re there',
      correctFeedback: 'Smart approach! Written questions ensure you cover everything important.',
      wrongFeedback: 'Important topics might be forgotten. Writing them down helps you stay focused.',
      points: 20,
    },
  ]

  const currentScenario = scenarios[currentScenarioIndex]
  const totalScenarios = scenarios.length
  const progress = ((currentScenarioIndex + (showFeedback ? 1 : 0)) / totalScenarios) * 100
  const accuracy = totalScenarios > 0 ? Math.round((correctCount / totalScenarios) * 100) : 0

  const handleActionSelect = useCallback((action: 'correct' | 'wrong') => {
    if (showFeedback) return
    setSelectedAction(action)

    const isCorrect = action === 'correct'
    
    if (isCorrect) {
      const newScore = score + currentScenario.points
      setScore(newScore)
      setCorrectCount(prev => prev + 1)
      setShowPointsAnimation(true)
    }

    setShowFeedback(true)
  }, [showFeedback, score, currentScenario.points])

  const handleNextScenario = useCallback(() => {
    setSelectedAction(null)
    setShowFeedback(false)
    setShowPointsAnimation(false)

    if (currentScenarioIndex < totalScenarios - 1) {
      setCurrentScenarioIndex(prev => prev + 1)
    } else {
      setGameComplete(true)
      const finalScore = score + (correctCount === totalScenarios ? SCORES.QUIZ_COMPLETION_BONUS : 0)
      setTimeout(() => {
        onComplete(finalScore)
      }, 500)
    }
  }, [currentScenarioIndex, totalScenarios, score, correctCount, onComplete])

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onExit}
          className="text-darkGreen hover:bg-sage-100 px-4 py-2 rounded-xl transition-colors flex items-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Exit
        </button>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-secondaryText uppercase tracking-wide">Score</p>
            <p className="text-xl font-bold text-primaryGreen">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondaryText uppercase tracking-wide">Correct</p>
            <p className="text-xl font-bold text-darkGreen">{correctCount}/{totalScenarios}</p>
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
      {showPointsAnimation && (
        <PointsAnimation
          points={currentScenario.points}
          isPositive={true}
          onComplete={() => setShowPointsAnimation(false)}
        />
      )}

      {/* Scenario Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-sage-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-darkGreen">
            Scenario {currentScenarioIndex + 1}/{totalScenarios}
          </span>
          <span className="text-xs text-secondaryText">
            {accuracy}% correct
          </span>
        </div>

        <h3 className="text-2xl font-bold text-darkGreen mb-4">
          {currentScenario.title}
        </h3>

        <p className="text-lg text-secondaryText mb-8 leading-relaxed">
          {currentScenario.description}
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleActionSelect('correct')}
            disabled={showFeedback}
            className={`w-full p-6 rounded-2xl border-2 transition-all ${
              selectedAction === 'correct' && !showFeedback
                ? 'bg-green-50 border-green-500 shadow-md'
                : selectedAction === 'correct' && showFeedback
                ? 'bg-green-100 border-green-500'
                : 'bg-white border-sage-200 hover:border-green-400 hover:bg-green-50'
            } ${showFeedback ? 'cursor-not-allowed' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                Check
              </div>
              <div>
                <p className="font-bold text-green-700">Correct Choice:</p>
                <p className="text-secondaryText mt-1">{currentScenario.correctAction}</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleActionSelect('wrong')}
            disabled={showFeedback}
            className={`w-full p-6 rounded-2xl border-2 transition-all ${
              selectedAction === 'wrong' && !showFeedback
                ? 'bg-red-50 border-red-500 shadow-md'
                : selectedAction === 'wrong' && showFeedback
                ? 'bg-red-100 border-red-500'
                : 'bg-white border-sage-200 hover:border-red-400 hover:bg-red-50'
            } ${showFeedback ? 'cursor-not-allowed' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0">
                Avoid
              </div>
              <div>
                <p className="font-bold text-red-700">Avoid This:</p>
                <p className="text-secondaryText mt-1">{currentScenario.wrongAction}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Feedback Section */}
      {showFeedback && (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border-2 animate-fade-in">
          <div className={`p-4 rounded-xl mb-4 ${
            selectedAction === 'correct'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`font-bold mb-2 ${
              selectedAction === 'correct' ? 'text-green-700' : 'text-red-700'
            }`}>
              {selectedAction === 'correct' ? 'Correct!' : 'Not the best choice'}
            </p>
            <p className="text-secondaryText leading-relaxed">
              {selectedAction === 'correct' 
                ? currentScenario.correctFeedback 
                : currentScenario.wrongFeedback}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondaryText">Points earned: {selectedAction === 'correct' ? currentScenario.points : 0}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        {!showFeedback ? (
          <button
            onClick={handleNextScenario}
            disabled={!selectedAction}
            className={`px-8 py-3 rounded-xl font-medium transition-all ${
              selectedAction !== null
                ? 'bg-darkGreen text-white hover:bg-primaryGreen shadow-md'
                : 'bg-sage-200 text-sage-500 cursor-not-allowed'
            }`}
          >
            Next Scenario
          </button>
        ) : (
          <button
            onClick={handleNextScenario}
            className="px-8 py-3 rounded-xl font-medium bg-darkGreen text-white hover:bg-primaryGreen shadow-md transition-all"
          >
            {currentScenarioIndex < totalScenarios - 1 ? 'Next Scenario' : 'See Results'}
          </button>
        )}
      </div>

      {/* Game Complete */}
      {gameComplete && (
        <div className="mt-6 p-6 rounded-2xl bg-green-50 border-2 border-green-400 text-center">
          <p className="text-2xl font-bold text-green-700 mb-2">Hospital Visit Mastered!</p>
          <p className="text-primaryGreen font-semibold text-lg">
            +{SCORES.QUIZ_COMPLETION_BONUS} completion bonus
          </p>
        </div>
      )}
    </div>
  )
}

export default HospitalAdventure
