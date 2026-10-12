import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  Video, 
  Gamepad, 
  BarChart
} from 'lucide-react'
import { getTotalPoints, getCompletedGames } from '../../services/gameService'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const [points, setPoints] = useState(0)
  const [games, setGames] = useState(0)

  useEffect(() => {
    setPoints(getTotalPoints())
    setGames(getCompletedGames().length)
  }, [location.pathname])

  const menuItems = [
    { path: '/', icon: Home, label: 'Overview' },
    { path: '/medical-knowledge', icon: BookOpen, label: 'Medical Research' },
    { path: '/medical-videos', icon: Video, label: 'Medical Videos' },
    { path: '/health-games', icon: Gamepad, label: 'Health Games' },
    { path: '/learning-progress', icon: BarChart, label: 'Learning Progress' },
  ]

  return (
    <div className="hidden md:flex flex-col w-64 lg:w-72 bg-white rounded-2xl shadow-lg border border-sage-200 h-[calc(100vh-4rem)] sticky top-6 overflow-hidden">
      {/* Logo Section */}
      <div className="p-6 border-b border-sage-100 bg-gradient-to-b from-white to-sage-50/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 flex items-center justify-center shadow-md shadow-primaryGreen/20">
            <img src="/images/logo.png" alt="ClinicOpsAgent Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-lg text-darkGreen block leading-none">ClinicOpsAgent</span>
            <span className="text-xs text-secondaryText block mt-1">Patient Engagement</span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
        <div className="text-xs font-bold text-secondaryText uppercase tracking-wider mb-4 px-2">
          Navigation
        </div>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primaryGreen text-white shadow-md shadow-primaryGreen/20' 
                    : 'text-secondaryText hover:bg-sage-50 hover:text-primaryGreen hover:pl-5'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-sage-500 group-hover:text-primaryGreen'}`} />
                <span className={`font-medium flex-1 ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                )}
              </Link>
            )
          })}
        </div>

        {/* Progress Mini-Card */}
        <div className="mt-8 p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">
            Learning Stats
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondaryText">Points</span>
              <span className="font-semibold text-darkGreen">{points}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondaryText">Games</span>
              <span className="font-semibold text-darkGreen">{games}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondaryText">Articles</span>
              <span className="font-semibold text-darkGreen">0</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sage-100 bg-sage-50/50">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-sage-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primaryGreen rounded-full flex items-center justify-center text-white text-xs font-bold">
              U
            </div>
            <div>
              <p className="text-sm font-medium text-darkGreen">User Account</p>
              <p className="text-xs text-secondaryText">Health Enthusiast</p>
            </div>
          </div>
          <p className="text-xs text-secondaryText text-center">
            Patient Engagement Module v1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar