import React, { useState, useEffect, useCallback } from 'react'
import { SCORES } from '../../services/gameService'
import PointsAnimation from '../ui/PointsAnimation'

// Healthy food and wellness icons for match-3
const GAME_ITEMS = [
  { id: 'apple', icon: '🍎', type: 'fruit' },
  { id: 'broccoli', icon: '🥦', type: 'vegetable' },
  { id: 'carrot', icon: '🥕', type: 'vegetable' },
  { id: 'grapes', icon: '🍇', type: 'fruit' },
  { id: 'watermelon', icon: '🍉', type: 'fruit' },
  { id: 'spinach', icon: '🥬', type: 'vegetable' },
  { id: 'heart', icon: '❤️', type: 'health' },
  { id: 'water', icon: '💧', type: 'health' },
]

interface GameCell {
  id: number
  item: typeof GAME_ITEMS[0]
  isMatched: boolean
}

interface HealthyMatchProps {
  onComplete: (score: number) => void
  onExit: () => void
}

const HealthyMatch: React.FC<HealthyMatchProps> = ({ onComplete, onExit }) => {
  const [grid, setGrid] = useState<GameCell[][]>([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const GRID_SIZE = 8
  const MATCH_MIN = 3
  const TOTAL_TURNS = 25
  const TARGET_SCORE = 200

  // Initialize grid with random items
  useEffect(() => {
    const newGrid: GameCell[][] = []
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: GameCell[] = []
      for (let c = 0; c < GRID_SIZE; c++) {
        const randomItem = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)]
        row.push({
          id: r * GRID_SIZE + c,
          item: randomItem,
          isMatched: false,
        })
      }
      newGrid.push(row)
    }
    setGrid(newGrid)
  }, [])

  // Find matches in the grid
  const findMatches = useCallback((currentGrid: GameCell[][]): Set<number> => {
    const matchedIds = new Set<number>()
    
    // Check rows for matches of 3 or more
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - MATCH_MIN + 1; c++) {
        const items = [currentGrid[r][c], currentGrid[r][c + 1], currentGrid[r][c + 2]]
        if (items.every(item => item.item.id === items[0].item.id)) {
          // Check for longer matches
          let matchEnd = c + 2
          while (matchEnd + 1 < GRID_SIZE && currentGrid[r][matchEnd + 1].item.id === items[0].item.id) {
            matchEnd++
          }
          for (let i = c; i <= matchEnd; i++) {
            matchedIds.add(currentGrid[r][i].id)
          }
        }
      }
    }
    
    // Check columns for matches of 3 or more
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - MATCH_MIN + 1; r++) {
        const items = [currentGrid[r][c], currentGrid[r + 1][c], currentGrid[r + 2][c]]
        if (items.every(item => item.item.id === items[0].item.id)) {
          // Check for longer matches
          let matchEnd = r + 2
          while (matchEnd + 1 < GRID_SIZE && currentGrid[matchEnd + 1][c].item.id === items[0].item.id) {
            matchEnd++
          }
          for (let i = r; i <= matchEnd; i++) {
            matchedIds.add(currentGrid[i][c].id)
          }
        }
      }
    }
    
    return matchedIds
  }, [])

  // Check game status
  const checkGameStatus = useCallback(() => {
    if (score >= TARGET_SCORE) {
      setGameComplete(true)
      const finalScore = score + SCORES.GAME_COMPLETION_BONUS
      setTimeout(() => {
        onComplete(finalScore)
      }, 1000)
    } else if (moves >= TOTAL_TURNS) {
      setGameComplete(true)
      const finalScore = score + (score >= TARGET_SCORE * 0.7 ? SCORES.GAME_COMPLETION_BONUS : 0)
      setTimeout(() => {
        onComplete(finalScore)
      }, 1000)
    }
  }, [score, moves, onComplete])

  // Process matches - remove matched tiles and drop down
  const processMatches = useCallback((currentGrid: GameCell[][], matchedIds: Set<number>) => {
    // Mark matched cells
    const newGrid = currentGrid.map(row => 
      row.map(cell => 
        matchedIds.has(cell.id) ? { ...cell, isMatched: true } : cell
      )
    )

    const matchCount = matchedIds.size
    // Base points: 10 per match, plus bonus for 4+ matches
    const pointsEarned = matchCount * SCORES.CORRECT_MATCH + (matchCount >= 4 ? 15 : 0)
    
    setScore(prev => prev + pointsEarned)
    setShowPointsAnimation(true)

    setTimeout(() => {
      // Remove matched cells and drop down
      for (let c = 0; c < GRID_SIZE; c++) {
        let emptyCount = 0
        // Process from bottom up
        for (let r = GRID_SIZE - 1; r >= 0; r--) {
          if (newGrid[r][c].isMatched) {
            emptyCount++
            newGrid[r][c] = {
              id: Math.random(),
              item: GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)],
              isMatched: false,
            }
          } else if (emptyCount > 0) {
            // Drop cell down
            newGrid[r + emptyCount][c] = newGrid[r][c]
            newGrid[r][c] = {
              id: Math.random(),
              item: GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)],
              isMatched: false,
            }
          }
        }
      }

      setGrid(newGrid)
      setIsProcessing(false)
      setShowPointsAnimation(false)

      // Check for cascading matches
      setTimeout(() => {
        const newMatches = findMatches(newGrid)
        if (newMatches.size > 0) {
          processMatches(newGrid, newMatches)
        } else {
          checkGameStatus()
        }
      }, 300)
    }, 500)
  }, [findMatches, checkGameStatus])

  // Handle cell swap
  const handleSwap = useCallback((cell1: { r: number; c: number }, cell2: { r: number; c: number }) => {
    setIsProcessing(true)

    // Create deep copy of grid
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })))
    
    // Swap cells
    const temp = newGrid[cell1.r][cell1.c]
    newGrid[cell1.r][cell1.c] = newGrid[cell2.r][cell2.c]
    newGrid[cell2.r][cell2.c] = temp

    setGrid(newGrid)
    setMoves(prev => prev + 1)

    // Check for matches after swap
    setTimeout(() => {
      const matchedIds = findMatches(newGrid)

      if (matchedIds.size > 0) {
        // Process matches
        processMatches(newGrid, matchedIds)
      } else {
        // No match, swap back with animation
        const revertedGrid = newGrid.map(row => row.map(cell => ({ ...cell })))
        const temp2 = revertedGrid[cell1.r][cell1.c]
        revertedGrid[cell1.r][cell1.c] = revertedGrid[cell2.r][cell2.c]
        revertedGrid[cell2.r][cell2.c] = temp2
        setGrid(revertedGrid)
        setIsProcessing(false)
      }
    }, 300)
  }, [grid, findMatches, processMatches])

  // Handle cell click
  const handleCellClick = useCallback((r: number, c: number) => {
    if (isProcessing || gameComplete) return
    if (moves >= TOTAL_TURNS) return

    const clickedCell = { r, c }

    if (!selectedCell) {
      setSelectedCell(clickedCell)
    } else {
      // Check if adjacent (up, down, left, right)
      const isAdjacent = 
        Math.abs(selectedCell.r - r) + Math.abs(selectedCell.c - c) === 1

      if (isAdjacent) {
        handleSwap(selectedCell, clickedCell)
      }
      setSelectedCell(null)
    }
  }, [selectedCell, isProcessing, gameComplete, moves, handleSwap])

  const progress = Math.min(100, (score / TARGET_SCORE) * 100)

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
            <p className="text-xl font-bold text-darkGreen">{moves}/{TOTAL_TURNS}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondaryText uppercase tracking-wide">Score</p>
            <p className="text-xl font-bold text-primaryGreen">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondaryText uppercase tracking-wide">Target</p>
            <p className="text-xl font-bold text-darkGreen">{TARGET_SCORE}</p>
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
      <div className="bg-cream p-4 rounded-3xl mb-6 shadow-inner">
        <div className="grid grid-cols-8 gap-1.5 mx-auto max-w-[400px]">
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={cell.id}
                onClick={() => handleCellClick(r, c)}
                className={`aspect-square cursor-pointer relative flex items-center justify-center transition-all duration-200 ${
                  selectedCell?.r === r && selectedCell?.c === c
                    ? 'scale-110 ring-4 ring-primaryGreen bg-white rounded-lg shadow-lg z-10'
                    : isProcessing
                    ? 'opacity-80'
                    : 'hover:scale-105 hover:brightness-110'
                }`}
              >
                <span className="text-2xl animate-bounce-slow">{cell.item.icon}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-2xl p-6 border border-sage-200">
        <h3 className="font-bold text-darkGreen mb-3">How to Play</h3>
        <ul className="space-y-2 text-sm text-secondaryText">
          <li>• Match 3 or more identical items in a row or column</li>
          <li>• Click/tap an item, then click an adjacent item to swap</li>
          <li>• Each match: +{SCORES.CORRECT_MATCH} points</li>
          <li>• 4+ match bonus: +15 extra points</li>
          <li>• Reach {TARGET_SCORE} points to win</li>
          <li>• You have {TOTAL_TURNS} moves to achieve your goal</li>
        </ul>
      </div>

      {/* Game Complete Overlay */}
      {gameComplete && (
        <div className="mt-6 p-6 rounded-2xl bg-green-50 border-2 border-green-400 text-center animate-bounce">
          <p className="text-xl font-bold text-green-700 mb-2">Game Complete!</p>
          <p className="text-primaryGreen">
            +{SCORES.GAME_COMPLETION_BONUS} completion bonus
          </p>
        </div>
      )}
    </div>
  )
}

export default HealthyMatch
