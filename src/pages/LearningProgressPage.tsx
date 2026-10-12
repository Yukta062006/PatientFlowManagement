import React, { useState, useEffect } from 'react'
import { Gamepad, Trophy, Award, Star, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { games, getTotalPoints, getCompletedGames, getBestScore, achievements, getUnlockedAchievements, getGameHistory } from '../services/gameService'

const LearningProgressPage: React.FC = () => {
  const [totalPoints, setTotalPoints] = useState(0)
  const [completedGames, setCompletedGames] = useState<string[]>([])
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [gameHistory, setGameHistory] = useState<Array<{
    gameId: string
    score: number
    correctAnswers: number
    totalQuestions: number
    timestamp: number
  }>>([])

  useEffect(() => {
    // Load data from localStorage
    setTotalPoints(getTotalPoints())
    setCompletedGames(getCompletedGames())
    setUnlockedAchievements(getUnlockedAchievements())
    setGameHistory(getGameHistory())
  }, [])

  // Calculate stats
  const totalGamesPlayed = completedGames.length
  const totalAvailableGames = games.length
  const unlockedCount = unlockedAchievements.length
  const totalAchievements = achievements.length

  // Get recent games (last 5)
  const recentGames = gameHistory.slice(-5).reverse()

  // Check if user has any activity
  const hasActivity = totalPoints > 0 || totalGamesPlayed > 0 || unlockedCount > 0

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-darkGreen mb-2">Learning Progress</h1>
        <p className="text-secondaryText">Track your journey and celebrate your achievements</p>
      </div>

      {!hasActivity ? (
        // Empty State
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-sage-200 text-center">
          <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gamepad className="w-10 h-10 text-sage-400" />
          </div>
          <h2 className="text-2xl font-bold text-darkGreen mb-3">Your learning journey starts here!</h2>
          <p className="text-secondaryText mb-8 max-w-md mx-auto">
            Play educational games to earn points, unlock achievements, and track your health knowledge progress.
          </p>
          <Link
            to="/games"
            className="inline-flex items-center gap-2 bg-darkGreen text-white px-6 py-3 rounded-xl font-medium hover:bg-primaryGreen transition-colors"
          >
            <Gamepad className="w-5 h-5" />
            Explore Games
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-200 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-darkGreen">{totalPoints}</p>
              <p className="text-xs text-secondaryText uppercase tracking-wide">Total Points</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-200 text-center">
              <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-darkGreen">{totalGamesPlayed}/{totalAvailableGames}</p>
              <p className="text-xs text-secondaryText uppercase tracking-wide">Games Completed</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-200 text-center">
              <Gamepad className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-darkGreen">{gameHistory.length}</p>
              <p className="text-xs text-secondaryText uppercase tracking-wide">Sessions Played</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-200 text-center">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-darkGreen">{unlockedCount}/{totalAchievements}</p>
              <p className="text-xs text-secondaryText uppercase tracking-wide">Achievements</p>
            </div>
          </div>

          {/* Recent Game Results */}
          {recentGames.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-200">
              <h2 className="font-bold text-lg text-darkGreen mb-4">Recent Game Results</h2>
              <div className="space-y-3">
                {recentGames.map((result, index) => {
                  const game = games.find(g => g.id === result.gameId)
                  const accuracy = result.totalQuestions > 0 
                    ? Math.round((result.correctAnswers / result.totalQuestions) * 100) 
                    : 0
                  
                  return (
                    <div 
                      key={`${result.gameId}-${result.timestamp}-${index}`}
                      className="flex items-center justify-between p-4 bg-cream rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          accuracy >= 80 ? 'bg-green-100 text-green-600' :
                          accuracy >= 60 ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {accuracy >= 80 ? '✓' : accuracy >= 60 ? '~' : '×'}
                        </div>
                        <div>
                          <p className="font-medium text-darkGreen">{game?.title || 'Unknown Game'}</p>
                          <p className="text-xs text-secondaryText">
                            {new Date(result.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-darkGreen">{result.score} pts</p>
                        <p className="text-xs text-secondaryText">{accuracy}% accuracy</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Best Scores */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-200">
            <h2 className="font-bold text-lg text-darkGreen mb-4">Best Scores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.slice(0, 4).map(game => {
                const bestScore = getBestScore(game.id)
                const isCompleted = completedGames.includes(game.id)
                
                return (
                  <div 
                    key={game.id}
                    className={`p-4 rounded-xl border ${
                      isCompleted 
                        ? 'bg-cream border-sage-200' 
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isCompleted ? 'bg-primaryGreen/20 text-primaryGreen' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {isCompleted ? <Trophy className="w-5 h-5" /> : <Gamepad className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className={`font-medium ${isCompleted ? 'text-darkGreen' : 'text-slate-500'}`}>
                            {game.title}
                          </p>
                          <p className="text-xs text-secondaryText">{game.difficulty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${isCompleted ? 'text-darkGreen' : 'text-slate-400'}`}>
                          {isCompleted ? `${bestScore} pts` : 'Not played'}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-200">
            <h2 className="font-bold text-lg text-darkGreen mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Your Achievements ({unlockedCount}/{totalAchievements})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {achievements.slice(0, 5).map(achievement => {
                const isUnlocked = unlockedAchievements.includes(achievement.id)
                
                return (
                  <div
                    key={achievement.id}
                    className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${
                      isUnlocked 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-slate-50 border-slate-100 opacity-50'
                    }`}
                  >
                    <div className={`text-3xl mb-2 ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <p className={`font-medium text-sm ${isUnlocked ? 'text-darkGreen' : 'text-slate-500'}`}>
                      {achievement.title}
                    </p>
                    <p className="text-xs text-secondaryText mt-1">{achievement.description}</p>
                    {isUnlocked && (
                      <Trophy className="w-4 h-4 text-yellow-500 mt-2" />
                    )}
                  </div>
                )
              })}
            </div>
            {unlockedAchievements.length > 5 && (
              <p className="text-center text-sm text-secondaryText mt-4">
                +{unlockedAchievements.length - 5} more achievements unlocked
              </p>
            )}
          </div>

          {/* Continue Learning CTA */}
          {completedGames.length < games.length && (
            <Link
              to="/games"
              className="block bg-gradient-to-r from-primaryGreen to-darkGreen rounded-2xl p-6 text-white hover:opacity-95 transition-opacity"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">Continue Learning!</h3>
                  <p className="text-white/80 text-sm">
                    {games.length - completedGames.length} more games to explore
                  </p>
                </div>
                <ChevronRight className="w-6 h-6" />
              </div>
            </Link>
          )}
        </>
      )}
    </div>
  )
}

export default LearningProgressPage