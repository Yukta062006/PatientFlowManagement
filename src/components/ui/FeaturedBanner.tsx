import React from 'react'
import { BookOpen, Gamepad } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getTotalPoints, getCompletedGames, getUnlockedAchievements } from '../../services/gameService'

const FeaturedBanner: React.FC = () => {
  const navigate = useNavigate()
  const totalPoints = getTotalPoints()
  const completedGames = getCompletedGames().length
  const unlockedAchievements = getUnlockedAchievements().length

  return (
    <div className="bg-gradient-to-r from-primaryGreen via-darkGreen to-primaryGreen rounded-2xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400/20 text-yellow-200 rounded-full text-sm font-bold uppercase tracking-wide">
            <BookOpen className="w-4 h-4" />
            Welcome to Your Health Hub
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Take Control of Your Health Journey
          </h2>
          
          <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">
            Explore trusted medical research, discover educational videos, 
            and build healthier habits through interactive challenges. Your 
            personalized healthcare education platform is here to support you.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => navigate('/medical-knowledge')}
              className="bg-white text-darkGreen px-6 py-3.5 rounded-xl font-bold hover:bg-sage-100 transition-colors flex items-center gap-2 shadow-lg shadow-white/10"
            >
              <BookOpen className="w-5 h-5" />
              Explore Medical Research
            </button>
            
            <button
              onClick={() => navigate('/health-games')}
              className="bg-transparent border-2 border-white/30 hover:bg-white/10 text-white px-6 py-3.5 rounded-xl font-bold transition-colors flex items-center gap-2"
            >
              <Gamepad className="w-5 h-5" />
              Play Health Games
            </button>
          </div>
        </div>

        {/* Real Stats - Only show if data exists */}
        {(totalPoints > 0 || completedGames > 0 || unlockedAchievements > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {totalPoints > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-colors">
                <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <div className="w-5 h-5 text-blue-200">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-xs text-white/70 uppercase tracking-wide mt-1">Points Earned</p>
              </div>
            )}
            
            {completedGames > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-colors">
                <div className="w-10 h-10 bg-red-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <div className="w-5 h-5 text-red-200">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold">{completedGames}</p>
                <p className="text-xs text-white/70 uppercase tracking-wide mt-1">Games Completed</p>
              </div>
            )}
            
            {unlockedAchievements > 0 && (
              <div className="col-span-2 md:col-span-1 bg-yellow-400/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30 text-center hover:bg-yellow-400/30 transition-colors">
                <div className="w-10 h-10 bg-yellow-500/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <div className="w-5 h-5 text-yellow-200">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold">{unlockedAchievements}</p>
                <p className="text-xs text-yellow-100 uppercase tracking-wide mt-1">Achievements</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FeaturedBanner