import React, { useState } from 'react'
import { Trophy, Star, Sparkles } from 'lucide-react'
import { games, getBestScore, saveBestScore, achievements, getUnlockedAchievements, checkAndUnlockAchievements, getTotalPoints, getCompletedGames, addTotalPoints, saveGameResult } from '../services/gameService'

// Import game components
import MedicalKnowledgeChallenge from '../components/games/MedicalKnowledgeChallenge'
import MedicalMemoryMatch from '../components/games/MedicalMemoryMatch'
import HealthyHabitsSorting from '../components/games/HealthyHabitsSorting'
import HospitalJourney from '../components/games/HospitalJourney'
import MythVsFact from '../components/games/MythVsFact'
import FirstAidQuiz from '../components/games/FirstAidQuiz'
import HealthyMatch from '../components/games/HealthyMatch'
import HospitalAdventure from '../components/games/HospitalAdventure'
import AnatomyPuzzle from '../components/games/AnatomyPuzzle'

const HealthGamesPage: React.FC = () => {
  const [gameMode, setGameMode] = useState<'library' | 'playing' | 'completed'>('library')
  const [currentGameId, setCurrentGameId] = useState<string | null>(null)
  const [lastGameResult, setLastGameResult] = useState<{
    score: number
    correctAnswers: number
    totalQuestions: number
    isNewBest: boolean
    newlyUnlocked: string[]
  } | null>(null)

  const currentGame = games.find(g => g.id === currentGameId)
  const totalPoints = getTotalPoints()
  const completedGames = getCompletedGames()
  const unlockedAchievements = getUnlockedAchievements()

  const handleGameStart = (gameId: string) => {
    setCurrentGameId(gameId)
    setGameMode('playing')
  }

  const handleGameComplete = (finalScore: number, stats: { correctAnswers: number; totalQuestions: number }) => {
    if (currentGameId) {
      // Save best score
      const { isNewBest } = saveBestScore(currentGameId, finalScore)
      
      // Add to total points
      addTotalPoints(finalScore)
      
      // Save game result
      saveGameResult(currentGameId, {
        score: finalScore,
        correctAnswers: stats.correctAnswers,
        totalQuestions: stats.totalQuestions,
        timestamp: Date.now()
      })

      // Check achievements
      const newlyUnlocked = checkAndUnlockAchievements({
        gamesCompleted: completedGames.length + 1,
        perfectScore: stats.correctAnswers === stats.totalQuestions ? 1 : 0,
        gameCompleted: currentGameId,
        totalPoints: totalPoints + finalScore
      })

      setLastGameResult({
        score: finalScore,
        correctAnswers: stats.correctAnswers,
        totalQuestions: stats.totalQuestions,
        isNewBest,
        newlyUnlocked
      })
    }
    setGameMode('completed')
  }

  const handleRestart = () => {
    setCurrentGameId(null)
    setGameMode('library')
    setLastGameResult(null)
  }

  const handleReturnToOverview = () => {
    window.location.href = '/'
  }

  // Game component mapper - all 9 games
  const gameComponents: Record<string, React.ReactNode> = {
    'medical-knowledge-challenge': currentGameId === 'medical-knowledge-challenge' 
      ? <MedicalKnowledgeChallenge onComplete={(s) => handleGameComplete(s, { correctAnswers: 8, totalQuestions: 8 })} onExit={handleRestart} /> 
      : null,
    'medical-memory-match': currentGameId === 'medical-memory-match' 
      ? <MedicalMemoryMatch onComplete={(s) => handleGameComplete(s, { correctAnswers: 6, totalQuestions: 6 })} onExit={handleRestart} /> 
      : null,
    'healthy-habits-sorting': currentGameId === 'healthy-habits-sorting' 
      ? <HealthyHabitsSorting onComplete={(s) => handleGameComplete(s, { correctAnswers: 8, totalQuestions: 8 })} onExit={handleRestart} /> 
      : null,
    'hospital-journey': currentGameId === 'hospital-journey' 
      ? <HospitalJourney onComplete={(s) => handleGameComplete(s, { correctAnswers: 6, totalQuestions: 6 })} onExit={handleRestart} /> 
      : null,
    'myth-vs-fact': currentGameId === 'myth-vs-fact' 
      ? <MythVsFact onComplete={(s) => handleGameComplete(s, { correctAnswers: 5, totalQuestions: 5 })} onExit={handleRestart} /> 
      : null,
    'first-aid-quiz': currentGameId === 'first-aid-quiz' 
      ? <FirstAidQuiz onComplete={(s) => handleGameComplete(s, { correctAnswers: 8, totalQuestions: 8 })} onExit={handleRestart} /> 
      : null,
    'healthy-match': currentGameId === 'healthy-match' 
      ? <HealthyMatch onComplete={(s) => handleGameComplete(s, { correctAnswers: 5, totalQuestions: 5 })} onExit={handleRestart} /> 
      : null,
    'hospital-adventure': currentGameId === 'hospital-adventure' 
      ? <HospitalAdventure onComplete={(s) => handleGameComplete(s, { correctAnswers: 5, totalQuestions: 5 })} onExit={handleRestart} /> 
      : null,
    'anatomy-puzzle': currentGameId === 'anatomy-puzzle' 
      ? <AnatomyPuzzle onComplete={(s) => handleGameComplete(s, { correctAnswers: 6, totalQuestions: 6 })} onExit={handleRestart} /> 
      : null,
  }

  // Game icon component
  const GameIcon: React.FC<{ gameId: string }> = ({ gameId }) => {
    const icons: Record<string, React.ReactNode> = {
      'medical-knowledge-challenge': (
        <svg viewBox="0 0 24 24" className="w-24 h-24 text-sage-600" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.418a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      ),
      'medical-memory-match': (
        <svg viewBox="0 0 24 24" className="w-24 h-24 text-sage-600" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
      'healthy-habits-sorting': (
        <svg viewBox="0 0 24 24" className="w-24 h-24 text-sage-600" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      ),
      'hospital-journey': (
        <svg viewBox="0 0 24 24" className="w-24 h-24 text-sage-600" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      ),
      'myth-vs-fact': (
        <svg viewBox="0 0 24 24" className="w-24 h-24 text-sage-600" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      ),
      'first-aid-quiz': (
        <svg viewBox="0 0 24 24" className="w-24 h-24 text-sage-600" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
      'healthy-match': (
        <svg viewBox="0 0 24 24" className="w-24 h-24 text-sage-600" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 005.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
      'hospital-adventure': (
        <svg viewBox="0 0 24 24" className="w-24 h-24 text-sage-600" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      'anatomy-puzzle': (
        <svg viewBox="0 0 24 24" className="w-24 h-24 text-sage-600" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      ),
    }
    return icons[gameId] || null
  }

  // Game Selection Card Component
  const GameCard: React.FC<{ game: { id: string; title: string; shortDescription: string; difficulty: string; estimatedTime: string; maxPoints: number } }> = ({ game }) => {
    const bestScore = getBestScore(game.id)

    return (
      <div 
        key={game.id} 
        onClick={() => handleGameStart(game.id)}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sage-200 hover:shadow-lg transition-all cursor-pointer group"
      >
        {/* Card Header with Game Icon */}
        <div className="h-32 bg-gradient-to-br from-sage-100 to-sage-50 p-6 flex items-center justify-center relative overflow-hidden cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-sage-900/10 to-transparent pointer-events-none"></div>
          <div className="z-10 animate-bounce-slow">
            <GameIcon gameId={game.id} />
          </div>
          
          {bestScore > 0 && (
            <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 z-10">
              <Trophy className="w-3 h-3" />
              Best: {bestScore}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-darkGreen mb-1">{game.title}</h3>
              <p className="text-xs text-secondaryText leading-relaxed mb-3">{game.shortDescription}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
              game.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
              game.difficulty === 'Advanced' ? 'bg-purple-100 text-purple-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {game.difficulty}
            </span>
            <span className="text-xs text-secondaryText">• {game.estimatedTime}</span>
            <span className="text-xs text-secondaryText">• {game.maxPoints} pts</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-sage-100">
            <div className="text-xs text-secondaryText">
              Best: <span className="font-medium text-darkGreen">{bestScore} pts</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleGameStart(game.id)
              }}
              className="bg-darkGreen text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-primaryGreen transition-colors shadow-sm hover:shadow-md active:transform active:scale-95"
            >
              {bestScore > 0 ? 'Play Again' : 'Play Now'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Game Playing Mode
  if (gameMode === 'playing' && currentGame && currentGameId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-darkGreen mb-2">{currentGame.title}</h1>
          <p className="text-secondaryText">{currentGame.description}</p>
        </div>
        {gameComponents[currentGameId] || <div className="text-center p-8">Game loading...</div>}
      </div>
    )
  }

  // Completion Screen
  if (gameMode === 'completed' && currentGameId && lastGameResult) {
    const bestScore = getBestScore(currentGameId)
    const accuracy = Math.round((lastGameResult.correctAnswers / lastGameResult.totalQuestions) * 100)
    const isPerfect = lastGameResult.correctAnswers === lastGameResult.totalQuestions

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-sage-200 w-full max-w-md text-center">
          {/* Trophy or Star for perfect score */}
          {isPerfect ? (
            <div className="relative inline-block mb-4">
              <Star className="w-24 h-24 text-yellow-400 mx-auto drop-shadow-lg" />
              <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
          ) : (
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          )}

          <h2 className="text-2xl font-bold text-darkGreen mb-2">
            {isPerfect ? 'Perfect Challenge!' : 'Challenge Complete!'}
          </h2>
          
          {lastGameResult.isNewBest && (
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Trophy className="w-4 h-4" />
              🏆 NEW PERSONAL BEST!
            </div>
          )}

          <p className="text-secondaryText mb-6">
            {isPerfect 
              ? `Perfect score! You mastered the ${currentGame?.title}!` 
              : `You scored ${lastGameResult.score} points`}
          </p>
          
          <div className="bg-cream rounded-xl p-6 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-secondaryText">Final Score</span>
              <span className="font-bold text-darkGreen text-xl">{lastGameResult.score}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondaryText">Best Score</span>
              <span className="font-bold text-primaryGreen text-xl">{bestScore}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondaryText">Correct Answers</span>
              <span className="font-bold text-darkGreen text-xl">{lastGameResult.correctAnswers}/{lastGameResult.totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondaryText">Accuracy</span>
              <span className={`font-bold text-xl ${accuracy >= 80 ? 'text-green-600' : accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {accuracy}%
              </span>
            </div>
          </div>

          {/* Newly Unlocked Achievements */}
          {lastGameResult.newlyUnlocked.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-darkGreen mb-2">Achievements Unlocked!</p>
              <div className="flex flex-wrap justify-center gap-2">
                {lastGameResult.newlyUnlocked.map(id => {
                  const achievement = achievements.find(a => a.id === id)
                  return achievement ? (
                    <div 
                      key={id}
                      className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm"
                    >
                      <span>{achievement.icon}</span>
                      <span className="font-medium">{achievement.title}</span>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setGameMode('playing')
                setLastGameResult(null)
              }}
              className="w-full bg-darkGreen text-white py-3 rounded-xl font-medium hover:bg-primaryGreen transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={() => {
                setGameMode('library')
                setCurrentGameId(null)
                setLastGameResult(null)
              }}
              className="w-full bg-white border border-sage-300 text-darkGreen py-3 rounded-xl font-medium hover:bg-cream transition-colors"
            >
              Choose Another Game
            </button>
            <button
              onClick={handleReturnToOverview}
              className="w-full bg-white border border-sage-300 text-secondaryText py-3 rounded-xl font-medium hover:bg-cream transition-colors"
            >
              Return to Overview
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Game Library
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-darkGreen mb-2">Health Education Games</h1>
        <p className="text-secondaryText">Learn about health through interactive challenges</p>
      </div>

      {/* Progress Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 text-center p-4 bg-cream rounded-xl">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-xs text-secondaryText uppercase tracking-wide mb-1">Games Completed</p>
            <p className="text-2xl font-bold text-darkGreen">{completedGames.length}</p>
          </div>
          <div className="flex-1 text-center p-4 bg-cream rounded-xl">
            <Star className="w-8 h-8 text-primaryGreen mx-auto mb-2" />
            <p className="text-xs text-secondaryText uppercase tracking-wide mb-1">Total Points</p>
            <p className="text-2xl font-bold text-darkGreen">{totalPoints}</p>
          </div>
          <div className="flex-1 text-center p-4 bg-cream rounded-xl">
            <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-xs text-secondaryText uppercase tracking-wide mb-1">Achievements</p>
            <p className="text-2xl font-bold text-darkGreen">{unlockedAchievements.length}</p>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      {unlockedAchievements.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-200">
          <h2 className="font-bold text-lg text-darkGreen mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Unlocked Achievements
          </h2>
          <div className="flex flex-wrap gap-3">
            {unlockedAchievements.slice(0, 6).map(id => {
              const achievement = achievements.find(a => a.id === id)
              return achievement ? (
                <div
                  key={id}
                  className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg border border-yellow-200"
                  title={achievement.description}
                >
                  <span className="text-xl">{achievement.icon}</span>
                  <span className="text-sm font-medium">{achievement.title}</span>
                </div>
              ) : null
            })}
            {unlockedAchievements.length > 6 && (
              <div className="inline-flex items-center px-3 py-2 text-sm text-secondaryText">
                +{unlockedAchievements.length - 6} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}

export default HealthGamesPage