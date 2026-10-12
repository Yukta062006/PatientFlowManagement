import React, { useState, useEffect, useCallback } from 'react'
import { memoryCardPairs, SCORES } from '../../services/gameService'
import PointsAnimation from '../ui/PointsAnimation'

interface MemoryCard {
  id: number
  label: string
  isMatched: boolean
  isFlipped: boolean
}

interface MedicalMemoryMatchProps {
  onComplete: (score: number) => void
  onExit: () => void
}

const MedicalMemoryMatch: React.FC<MedicalMemoryMatchProps> = ({ onComplete, onExit }) => {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [matchesFound, setMatchesFound] = useState(0)
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)

  const totalPairs = memoryCardPairs.length

  useEffect(() => {
    // Initialize cards (pair each card with itself for matching)
    const cardPairs = [...memoryCardPairs, ...memoryCardPairs]
      .map((item, index) => ({
        ...item,
        originalIndex: index,
        isMatched: false,
        isFlipped: false,
      }))
      .sort(() => Math.random() - 0.5) // Shuffle

    setCards(cardPairs as MemoryCard[])
  }, [])

  const handleCardClick = useCallback((index: number) => {
    if (isLocked || cards[index].isMatched || cards[index].isFlipped || cards.length === 0) return

    const newFlippedIndices = [...flippedIndices, index]
    const newCards = [...cards]
    newCards[index].isFlipped = true
    setCards(newCards)
    setFlippedIndices(newFlippedIndices)

    if (newFlippedIndices.length === 2) {
      setIsLocked(true)
      setMoves(prev => prev + 1)
      checkForMatch(newFlippedIndices)
    }
  }, [isLocked, cards, flippedIndices])

  const checkForMatch = useCallback((indices: number[]) => {
    const [firstIndex, secondIndex] = indices
    const firstCard = cards[firstIndex]
    const secondCard = cards[secondIndex]

    if (firstCard.label === secondCard.label) {
      // Match found
      const newCards = [...cards]
      newCards[firstIndex].isMatched = true
      newCards[secondIndex].isMatched = true
      setCards(newCards)
      
      const matchScore = SCORES.CORRECT_MATCH
      setScore(prev => prev + matchScore)
      setMatchesFound(prev => prev + 1)
      setShowPointsAnimation(true)
      
      setFlippedIndices([])
      setIsLocked(false)

      // Check if all cards are matched
      const allMatched = newCards.every(card => card.isMatched)
      if (allMatched) {
        // Calculate bonus based on moves (fewer moves = higher bonus)
        const maxBonus = 50
        const bonus = Math.max(0, maxBonus - (moves - totalPairs) * 5)
        const finalScore = score + matchScore + bonus
        setTimeout(() => {
          onComplete(finalScore)
        }, 500)
      }
    } else {
      // No match - flip back after delay
      setTimeout(() => {
        const newCards = [...cards]
        newCards[firstIndex].isFlipped = false
        newCards[secondIndex].isFlipped = false
        setCards(newCards)
        setFlippedIndices([])
        setIsLocked(false)
      }, 1000)
    }
  }, [cards, moves, score, totalPairs, onComplete])

  const progress = totalPairs > 0 ? (matchesFound / totalPairs) * 100 : 0

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
            <p className="text-xs text-secondaryText uppercase tracking-wide">Moves</p>
            <p className="text-xl font-bold text-darkGreen">{moves}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondaryText uppercase tracking-wide">Score</p>
            <p className="text-xl font-bold text-primaryGreen">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondaryText uppercase tracking-wide">Matches</p>
            <p className="text-xl font-bold text-darkGreen">{matchesFound}/{totalPairs}</p>
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
          points={SCORES.CORRECT_MATCH}
          isPositive={true}
          onComplete={() => setShowPointsAnimation(false)}
        />
      )}

      {/* Game Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index)}
            className={`aspect-square cursor-pointer ${card.isMatched ? 'opacity-40' : ''}`}
          >
            <div
              className={`relative w-full h-full transition-all duration-500 transform-style-3d ${
                card.isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front of card (hidden when flipped) */}
              <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-sage-200 to-sage-100 rounded-xl flex items-center justify-center border-2 border-sage-300 hover:border-sage-400 hover:scale-105 transition-all">
                <span className="text-4xl text-sage-400 font-bold">?</span>
              </div>

              {/* Back of card (shown when flipped) */}
              <div
                className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-xl flex items-center justify-center border-2 transition-all ${
                  card.isMatched
                    ? 'bg-green-100 border-green-400'
                    : 'bg-white border-sage-300'
                }`}
              >
                <div className="text-center">
                  <span className="text-2xl font-bold text-darkGreen">{card.label}</span>
                  {card.isMatched && (
                    <div className="text-green-500 mt-1">✓</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-cream rounded-xl p-4 text-center">
        <p className="text-secondaryText text-sm">
          Find matching pairs. Each match: +{SCORES.CORRECT_MATCH} points
        </p>
        <p className="text-xs text-secondaryText mt-1">
          Fewer moves = higher completion bonus
        </p>
      </div>
    </div>
  )
}

export default MedicalMemoryMatch