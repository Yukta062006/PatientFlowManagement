import React, { useState, useCallback } from 'react'
import { medicalKnowledgeQuestions, SCORES } from '../../services/gameService'
import PointsAnimation from '../ui/PointsAnimation'

interface MedicalKnowledgeChallengeProps {
  onComplete: (score: number) => void
  onExit: () => void
}

const MedicalKnowledgeChallenge: React.FC<MedicalKnowledgeChallengeProps> = ({ onComplete, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)

  const currentQuestion = medicalKnowledgeQuestions[currentQuestionIndex]
  const totalQuestions = medicalKnowledgeQuestions.length

  const handleOptionSelect = useCallback((index: number) => {
    if (showFeedback || answeredQuestions.has(currentQuestionIndex)) return
    setSelectedOption(index)
  }, [showFeedback, answeredQuestions, currentQuestionIndex])

  const handleCheckAnswer = useCallback(() => {
    if (selectedOption === null || showFeedback) return
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer
    
    setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]))
    
    if (isCorrect) {
      const newScore = score + SCORES.CORRECT_ANSWER
      setScore(newScore)
      setCorrectCount(prev => prev + 1)
      setShowPointsAnimation(true)
    }
    
    setShowFeedback(true)
  }, [selectedOption, showFeedback, currentQuestion.correctAnswer, currentQuestionIndex, score])

  const handleNextQuestion = useCallback(() => {
    setSelectedOption(null)
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

  const progress = ((currentQuestionIndex + (showFeedback ? 1 : 0)) / totalQuestions) * 100
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with Score */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onExit}
          className="text-darkGreen hover:bg-sage-100 px-4 py-2 rounded-xl transition-colors"
        >
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

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-sage-200 mb-6 relative">
        {/* Points Animation */}
        {showPointsAnimation && (
          <PointsAnimation
            points={SCORES.CORRECT_ANSWER}
            isPositive={true}
            onComplete={() => setShowPointsAnimation(false)}
          />
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-darkGreen">
            Question {currentQuestionIndex + 1}/{totalQuestions}
          </span>
          <span className="text-xs text-secondaryText">
            {accuracy}% accuracy
          </span>
        </div>

        <h3 className="text-xl font-bold text-darkGreen mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index
            const isCorrect = index === currentQuestion.correctAnswer
            const showCorrect = showFeedback && isCorrect
            const showWrong = showFeedback && isSelected && !isCorrect
            const isAnswered = answeredQuestions.has(currentQuestionIndex)

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  showCorrect
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : showWrong
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : isSelected
                    ? 'bg-sage-50 border-sage-400'
                    : 'bg-white border-sage-200 hover:border-sage-400 hover:bg-sage-50'
                } ${isAnswered ? 'cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      showCorrect
                        ? 'bg-green-500 text-white'
                        : showWrong
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-sage-500 text-white'
                        : 'bg-sage-100 text-sage-600'
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={showCorrect || showWrong ? 'font-semibold' : ''}>
                    {option}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Feedback Section */}
      {showFeedback && (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-sage-200 animate-fade-in">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                selectedOption === currentQuestion.correctAnswer
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {selectedOption === currentQuestion.correctAnswer ? '✓' : '✗'}
            </div>
            <div>
              <p className={`font-bold text-lg mb-2 ${
                selectedOption === currentQuestion.correctAnswer ? 'text-green-700' : 'text-red-700'
              }`}>
                {selectedOption === currentQuestion.correctAnswer ? 'Correct!' : 'Not quite right'}
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
            disabled={selectedOption === null}
            className={`px-8 py-3 rounded-xl font-medium transition-all ${
              selectedOption !== null
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
            {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  )
}

export default MedicalKnowledgeChallenge