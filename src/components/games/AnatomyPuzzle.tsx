import React, { useState, useCallback } from 'react'
import { SCORES } from '../../services/gameService'
import PointsAnimation from '../ui/PointsAnimation'

interface BodyPart {
  id: string
  name: string
  icon: string
  system: string
}

interface AnatomyPuzzleProps {
  onComplete: (score: number) => void
  onExit: () => void
}

const AnatomyPuzzle: React.FC<AnatomyPuzzleProps> = ({ onComplete, onExit }) => {
  const [draggedPart, setDraggedPart] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [matchesFound, setMatchesFound] = useState(0)
  const [draggedOverZone, setDraggedOverZone] = useState<string | null>(null)
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const bodyParts: BodyPart[] = [
    { id: 'heart', name: 'Heart', icon: '❤️', system: 'cardiovascular' },
    { id: 'lungs', name: 'Lungs', icon: '🫁', system: 'respiratory' },
    { id: 'brain', name: 'Brain', icon: '🧠', system: 'nervous' },
    { id: 'stomach', name: 'Stomach', icon: '🥗', system: 'digestive' },
    { id: 'bones', name: 'Bones', icon: '🦴', system: 'skeletal' },
    { id: 'skin', name: 'Skin', icon: '🫧', system: 'integumentary' },
  ]

  const bodySystems = [
    { id: 'cardiovascular', name: 'Cardiovascular System', icon: '❤️' },
    { id: 'respiratory', name: 'Respiratory System', icon: '🫁' },
    { id: 'nervous', name: 'Nervous System', icon: '⚡' },
    { id: 'digestive', name: 'Digestive System', icon: '🥗' },
    { id: 'skeletal', name: 'Skeletal System', icon: '🦴' },
    { id: 'integumentary', name: 'Integumentary System', icon: '🫧' },
  ]

  const [matchedParts, setMatchedParts] = useState<Set<string>>(new Set())

  const handleDragStart = useCallback((partId: string) => {
    if (matchedParts.has(partId)) return
    setDraggedPart(partId)
  }, [matchedParts])

  const handleDragOver = useCallback((systemId: string) => {
    setDraggedOverZone(systemId)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDraggedOverZone(null)
  }, [])

  const handleDrop = useCallback((systemId: string) => {
    if (!draggedPart || matchedParts.has(draggedPart)) return

    const part = bodyParts.find(p => p.id === draggedPart)
    if (!part) return

    const isCorrect = part.system === systemId

    if (isCorrect) {
      setScore(prev => prev + SCORES.CORRECT_MATCH)
      setMatchesFound(prev => prev + 1)
      setShowPointsAnimation(true)
      setMatchedParts(prev => new Set([...prev, part.id]))
      setDraggedPart(null)
      setDraggedOverZone(null)

      // Check if all matched
      if (matchedParts.size + 1 === bodyParts.length) {
        setGameComplete(true)
        const finalScore = score + SCORES.GAME_COMPLETION_BONUS
        setTimeout(() => {
          onComplete(finalScore)
        }, 500)
      }
    } else {
      // Wrong match - just reset
      setDraggedPart(null)
      setDraggedOverZone(null)
    }
  }, [draggedPart, matchedParts, score, onComplete])

  const progress = (matchesFound / bodyParts.length) * 100

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
          Exit
        </button>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-secondaryText uppercase tracking-wide">Score</p>
            <p className="text-xl font-bold text-primaryGreen">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondaryText uppercase tracking-wide">Matched</p>
            <p className="text-xl font-bold text-darkGreen">{matchesFound}/{bodyParts.length}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Body Parts to Drag */}
        <div className="bg-cream p-6 rounded-2xl">
          <h3 className="font-bold text-lg text-darkGreen mb-4">Drag Body Parts</h3>
          <div className="grid grid-cols-2 gap-4">
            {bodyParts.map(part => {
              const isMatched = matchedParts.has(part.id)
              return (
                <div
                  key={part.id}
                  draggable={!isMatched}
                  onDragStart={() => handleDragStart(part.id)}
                  onDragEnd={() => {
                    setDraggedPart(null)
                    setDraggedOverZone(null)
                  }}
                  className={`p-4 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-all ${
                    isMatched
                      ? 'opacity-50 bg-green-50 border-green-300'
                      : draggedPart === part.id
                      ? 'opacity-50'
                      : 'bg-white border-sage-200 hover:border-primaryGreen hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">{part.icon}</span>
                    <span className="font-medium text-darkGreen">{part.name}</span>
                    <span className="text-xs text-secondaryText">{part.system}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Drop Zones */}
        <div className="bg-white p-6 rounded-2xl border border-sage-200">
          <h3 className="font-bold text-lg text-darkGreen mb-4">Match to System</h3>
          <div className="space-y-3">
            {bodySystems.map(system => {
              const isDraggedOver = draggedOverZone === system.id
              return (
                <div
                  key={system.id}
                  onDragOver={(e) => {
                    e.preventDefault()
                    handleDragOver(system.id)
                  }}
                  onDragLeave={handleDragLeave}
                  onDrop={() => handleDrop(system.id)}
                  className={`p-4 rounded-xl border-2 border-dashed transition-all ${
                    isDraggedOver
                      ? 'bg-green-50 border-green-400 scale-102'
                      : 'bg-sage-50 border-sage-300 hover:border-primaryGreen'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{system.icon}</span>
                    <div>
                      <p className="font-bold text-darkGreen">{system.name}</p>
                      <p className="text-xs text-secondaryText">Drag matching body part here</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-white rounded-2xl p-6 border border-sage-200">
        <h3 className="font-bold text-darkGreen mb-3">How to Play</h3>
        <ul className="space-y-2 text-sm text-secondaryText">
          <li>• Drag each body part to its correct system</li>
          <li>• Each correct match: +{SCORES.CORRECT_MATCH} points</li>
          <li>• Drag and drop using mouse or touch</li>
          <li>• Match all body parts to complete the puzzle</li>
        </ul>
      </div>

      {/* Game Complete */}
      {gameComplete && (
        <div className="mt-6 p-6 rounded-2xl bg-green-50 border-2 border-green-400 text-center">
          <p className="text-xl font-bold text-green-700 mb-2">Anatomy Puzzle Solved!</p>
          <p className="text-primaryGreen">
            +{SCORES.GAME_COMPLETION_BONUS} completion bonus
          </p>
        </div>
      )}
    </div>
  )
}

export default AnatomyPuzzle
