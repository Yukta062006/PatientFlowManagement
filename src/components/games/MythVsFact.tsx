import React, { useState, useCallback } from 'react'
import { mythFactQuestions, SCORES } from '../../services/gameService'
import PointsAnimation from '../ui/PointsAnimation'

interface MythVsFactProps {
  onComplete: (score: number) => void
  onExit: () => void
}

const MythVsFact: React.FC<MythVsFactProps> = ({ onComplete, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedType, setSelectedType] = useState<'myth' | 'fact' | null>(null)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)

  const currentQuestion = mythFactQuestions[currentQuestionIndex]
  const totalQuestions = mythFactQuestions.length

  const handleTypeSelect = useCallback((type: 'myth' | 'fact') => {
    if (showFeedback || answeredQuestions.has(currentQuestionIndex)) return
    setSelectedType(type)
  }, [showFeedback, answeredQuestions, currentQuestionIndex])

  const handleCheckAnswer = useCallback(() => {
    if (selectedType === null || showFeedback) return

    const isCorrect = selectedType === (currentQuestion.isMyth ? 'myth' : 'fact')

    setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]))

    if (isCorrect) {
      const newScore = score + SCORES.CORRECT_ANSWER
      setScore(newScore)
      setCorrectCount(prev => prev + 1)
      setShowPointsAnimation(true)
    }

    setShowFeedback(true)
  }, [selectedType, showFeedback, currentQuestion.isMyth, currentQuestionIndex, score])

  const handleNextQuestion = useCallback(() => {
    setSelectedType(null)
    setShowFeedback(false)
    setShowPointsAnimation(false)

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Game completed
      const completionScore = score + (correctCount === totalQuestions ? SCORES.QUIZ_COMPLETION_BONUS : 0)
      onComplete(completionScore)
    }
  }, [currentQuestionIndex, totalQuestions, score, correctCount, onComplete])

  const progress = totalQuestions > 0 ? ((currentQuestionIndex + (showFeedback ? 1 : 0)) / totalQuestions) * 100 : 0
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

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
          ← Exit
        </button>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-secondaryText uppercase tracking-wide">Score</p>
            <p className="text-xl font-bold text-primaryGreen">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondaryText uppercase tracking-wide">Correct</p>
            <p className="text-xl font-bold text-darkGreen">{correctCount}/{totalQuestions}</p>
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
          points={SCORES.CORRECT_ANSWER}
          isPositive={true}
          onComplete={() => setShowPointsAnimation(false)}
        />
      )}

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-sage-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-darkGreen">
            Question {currentQuestionIndex + 1}/{totalQuestions}
          </span>
          <span className="text-xs text-secondaryText">
            {accuracy}% accuracy
          </span>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-darkGreen mb-4 leading-relaxed">
            {currentQuestion.statement}
          </h3>
          <p className="text-secondaryText">
            Is this statement a medical myth or fact?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleTypeSelect('myth')}
            disabled={showFeedback}
            className={`p-6 rounded-2xl border-2 transition-all ${
              selectedType === 'myth' && !showFeedback
                ? 'bg-red-50 border-red-500 shadow-md'
                : selectedType === 'myth' && showFeedback
                ? currentQuestion.isMyth
                  ? 'bg-green-100 border-green-500'
                  : 'bg-red-100 border-red-600'
                : 'bg-white border-sage-200 hover:border-red-400 hover:bg-red-50'
            } ${showFeedback ? 'cursor-not-allowed' : ''}`}
          >
            <div className={`text-4xl mb-2 ${selectedType === 'myth' ? 'opacity-100' : 'opacity-50'}`}>
              ❌
            </div>
            <span className={`block font-bold ${
              selectedType === 'myth' ? 'text-red-700' : 'text-sage-600'
            }`}>
              It's a Myth
            </span>
          </button>

          <button
            onClick={() => handleTypeSelect('fact')}
            disabled={showFeedback}
            className={`p-6 rounded-2xl border-2 transition-all ${
              selectedType === 'fact' && !showFeedback
                ? 'bg-green-50 border-green-500 shadow-md'
                : selectedType === 'fact' && showFeedback
                ? !currentQuestion.isMyth
                  ? 'bg-green-100 border-green-500'
                  : 'bg-red-100 border-red-600'
                : 'bg-white border-sage-200 hover:border-green-400 hover:bg-green-50'
            } ${showFeedback ? 'cursor-not-allowed' : ''}`}
          >
            <div className={`text-4xl mb-2 ${selectedType === 'fact' ? 'opacity-100' : 'opacity-50'}`}>
              ✓
            </div>
            <span className={`block font-bold ${
              selectedType === 'fact' ? 'text-green-700' : 'text-sage-600'
            }`}>
              It's a Fact
            </span>
          </button>
        </div>
      </div>

      {/* Feedback Section */}
      {showFeedback && (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-sage-200 animate-fade-in">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                selectedType === (currentQuestion.isMyth ? 'myth' : 'fact')
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {selectedType === (currentQuestion.isMyth ? 'myth' : 'fact') ? '✓' : '✗'}
            </div>
            <div>
              <p className={`font-bold text-lg mb-2 ${
                selectedType === (currentQuestion.isMyth ? 'myth' : 'fact') ? 'text-green-700' : 'text-red-700'
              }`}>
                {selectedType === (currentQuestion.isMyth ? 'myth' : 'fact') ? 'Correct!' : 'Not quite'}
              </p>
              <p className="text-secondaryText leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        {!showFeedback ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedType === null}
            className={`px-8 py-3 rounded-xl font-medium transition-all ${
              selectedType !== null
                ? 'bg-darkGreen text-white hover:bg-primaryGreen shadow-md'
                : 'bg-sage-200 text-sage-500 cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-8 py-3 rounded-xl font-medium bg-darkGreen text-white hover:bg-primaryGreen shadow-md transition-all"
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Next Statement' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  )
}

export default MythVsFact