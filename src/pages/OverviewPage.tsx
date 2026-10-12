import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Video, 
  Gamepad, 
  Bell, 
  User, 
  TrendingUp,
  Clock,
  Star,
  Heart
} from 'lucide-react'
import DashboardSearch from '../components/ui/DashboardSearch'
import FeaturedBanner from '../components/ui/FeaturedBanner'
import FeaturedPanel from '../components/ui/FeaturedPanel'
import { getTotalPoints, getCompletedGames, getUnlockedAchievements } from '../services/gameService'

const OverviewPage: React.FC = () => {
  const [totalPoints, setTotalPoints] = useState(0)
  const [completedGames, setCompletedGames] = useState(0)
  const [unlockedAchievements, setUnlockedAchievements] = useState(0)
  const [hasActivity, setHasActivity] = useState(false)

  useEffect(() => {
    setTotalPoints(getTotalPoints())
    setCompletedGames(getCompletedGames().length)
    setUnlockedAchievements(getUnlockedAchievements().length)
    setHasActivity(getTotalPoints() > 0 || getCompletedGames().length > 0 || getUnlockedAchievements().length > 0)
  }, [])

  const quickAccessCards = [
    {
      title: 'Medical Research',
      description: 'Explore trusted medical research and understand it in simpler language',
      icon: <BookOpen className="w-6 h-6" />,
      path: '/medical-knowledge',
      color: 'blue',
      iconBg: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Surgical Education',
      description: 'Watch educational videos to better understand medical procedures',
      icon: <Video className="w-6 h-6" />,
      path: '/medical-videos',
      color: 'red',
      iconBg: 'bg-red-100 text-red-600'
    },
    {
      title: 'Health Games',
      description: 'Learn about health through interactive challenges and earn points',
      icon: <Gamepad className="w-6 h-6" />,
      path: '/health-games',
      color: 'green',
      iconBg: 'bg-green-100 text-green-600'
    },
    {
      title: 'Learning Progress',
      description: 'Track your journey and celebrate your achievements',
      icon: <TrendingUp className="w-6 h-6" />,
      path: '/learning-progress',
      color: 'purple',
      iconBg: 'bg-purple-100 text-purple-600'
    },
  ]

  const recentActivity = [
    hasActivity
      ? { 
          title: 'Medical Knowledge Challenge', 
          type: 'game',
          time: '2 hours ago',
          icon: <Gamepad className="w-4 h-4" />,
          color: 'green'
        }
      : null,
    hasActivity
      ? { 
          title: 'Cardiovascular Health Research', 
          type: 'article',
          time: '4 hours ago',
          icon: <BookOpen className="w-4 h-4" />,
          color: 'blue'
        }
      : null,
    hasActivity
      ? { 
          title: 'Understanding Surgery', 
          type: 'video',
          time: 'Yesterday',
          icon: <Video className="w-4 h-4" />,
          color: 'red'
        }
      : null,
  ].filter(Boolean)

  const quickStats = [
    { label: 'Total Points', value: totalPoints, icon: <TrendingUp className="w-5 h-5" />, color: 'green' },
    { label: 'Games Completed', value: completedGames, icon: <Gamepad className="w-5 h-5" />, color: 'purple' },
    { label: 'Achievements', value: unlockedAchievements, icon: <Star className="w-5 h-5" />, color: 'yellow' },
  ]

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-sage-200">
            <img src="/images/logo.png" alt="ClinicOpsAgent Logo" className="w-full h-full object-contain p-1" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-darkGreen mb-1">Patient Engagement</h1>
            <p className="text-secondaryText">Discover trusted medical research, learn from educational videos, and build healthier habits.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white rounded-xl border border-sage-200 text-secondaryText hover:bg-sage-50 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-sage-200 hover:shadow-sm transition-all">
            <div className="w-8 h-8 bg-primaryGreen rounded-full flex items-center justify-center text-white font-medium text-sm">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-darkGreen">User Profile</span>
          </button>
        </div>
      </div>

      {/* Search Section */}
      <DashboardSearch />

      {/* Featured Banner */}
      <FeaturedBanner />

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-xl font-bold text-darkGreen mb-5 flex items-center gap-2">
          Quick Access
          <div className="h-px flex-1 bg-sage-200 ml-4"></div>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickAccessCards.map((card, index) => (
            <Link
              key={index}
              to={card.path}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-sage-200 hover:shadow-md hover:border-primaryGreen transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                {card.icon}
              </div>
              <h3 className="font-bold text-lg text-darkGreen mb-2 group-hover:text-primaryGreen transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-secondaryText leading-relaxed mb-4">
                {card.description}
              </p>
              <div className="flex items-center text-sm font-medium text-primaryGreen group-hover:gap-2 transition-all">
                <span>Explore</span>
                <TrendingUp className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-bold text-darkGreen mb-5 flex items-center gap-2">
              Recent Activity
              <div className="h-px flex-1 bg-sage-200 ml-4"></div>
            </h2>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((item, index) => (
                  <Link
                    key={index}
                    to={item?.type === 'article' ? '/medical-knowledge' : item?.type === 'video' ? '/medical-videos' : '/health-games'}
                    className="bg-white rounded-xl p-4 shadow-sm border border-sage-200 hover:shadow-md transition-all flex items-center gap-4 group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item?.color === 'green' ? 'bg-green-100 text-green-600' :
                      item?.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {item?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-darkGreen group-hover:text-primaryGreen transition-colors truncate">
                        {item?.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-secondaryText mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{item?.time}</span>
                        <span className="w-1 h-1 bg-sage-300 rounded-full"></span>
                        <span className="uppercase tracking-wide font-medium">{item?.type}</span>
                      </div>
                    </div>
                    <div className="text-sage-400 group-hover:text-primaryGreen transition-colors">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-primaryGreen to-darkGreen rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Your Learning Journey Starts Here</h3>
                <p className="text-white/90 mb-6">Start exploring medical research, videos, and games to track your progress.</p>
                <Link
                  to="/medical-knowledge"
                  className="inline-block bg-white text-darkGreen px-6 py-3 rounded-xl font-medium hover:bg-sage-100 transition-colors"
                >
                  Explore Medical Research
                </Link>
              </div>
            )}
          </div>

          {/* Recommended Content */}
          <div>
            <h2 className="text-xl font-bold text-darkGreen mb-5 flex items-center gap-2">
              Recommended For You
              <div className="h-px flex-1 bg-sage-200 ml-4"></div>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                to="/medical-knowledge"
                className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Research</span>
                </div>
                <h3 className="font-bold text-lg text-darkGreen mb-2 group-hover:text-blue-600 transition-colors">
                  Latest Medical Research
                </h3>
                <p className="text-sm text-secondaryText mb-4">
                  Discover the newest studies and clinical trials in various medical fields.
                </p>
                <div className="flex items-center text-sm font-medium text-blue-600">
                  <span>View Research</span>
                  <TrendingUp className="w-4 h-4 ml-1" />
                </div>
              </Link>

              <Link
                to="/medical-videos"
                className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 shadow-sm border border-red-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Video</span>
                </div>
                <h3 className="font-bold text-lg text-darkGreen mb-2 group-hover:text-red-600 transition-colors">
                  Surgical Education
                </h3>
                <p className="text-sm text-secondaryText mb-4">
                  Watch educational videos on medical procedures and patient care.
                </p>
                <div className="flex items-center text-sm font-medium text-red-600">
                  <span>Watch Videos</span>
                  <TrendingUp className="w-4 h-4 ml-1" />
                </div>
              </Link>

              <Link
                to="/health-games"
                className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Gamepad className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Games</span>
                </div>
                <h3 className="font-bold text-lg text-darkGreen mb-2 group-hover:text-green-600 transition-colors">
                  Health Education Games
                </h3>
                <p className="text-sm text-secondaryText mb-4">
                  Learn through interactive challenges and earn points for your progress.
                </p>
                <div className="flex items-center text-sm font-medium text-green-600">
                  <span>Play Games</span>
                  <TrendingUp className="w-4 h-4 ml-1" />
                </div>
              </Link>

              <Link
                to="/learning-progress"
                className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">Progress</span>
                </div>
                <h3 className="font-bold text-lg text-darkGreen mb-2 group-hover:text-purple-600 transition-colors">
                  Your Progress
                </h3>
                <p className="text-sm text-secondaryText mb-4">
                  Track your learning journey and celebrate your achievements.
                </p>
                <div className="flex items-center text-sm font-medium text-purple-600">
                  <span>View Progress</span>
                  <TrendingUp className="w-4 h-4 ml-1" />
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-200">
            <h2 className="text-xl font-bold text-darkGreen mb-5 flex items-center gap-2">
              Your Learning Stats
              <div className="h-px flex-1 bg-sage-200 ml-4"></div>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className="p-4 bg-cream rounded-xl border border-sage-100 hover:border-sage-200 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    stat.color === 'green' ? 'bg-green-100 text-green-600' :
                    stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-darkGreen mb-1">{stat.value}</p>
                  <p className="text-xs text-secondaryText uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Featured Panel */}
          <FeaturedPanel section="medical-knowledge" />

          {/* Achievements Mini-Card */}
          {unlockedAchievements > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-200">
              <h3 className="font-bold text-lg text-darkGreen mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Your Achievements
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="px-3 py-2 bg-yellow-50 rounded-lg text-yellow-700 text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {unlockedAchievements} Unlocked
                </div>
              </div>
              <Link
                to="/learning-progress"
                className="text-sm font-medium text-primaryGreen hover:text-darkGreen flex items-center gap-1"
              >
                View all achievements
                <TrendingUp className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Daily Health Tip */}
          <div className="bg-gradient-to-br from-softYellow to-yellow-50 rounded-2xl p-6 shadow-sm border border-yellow-100">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-darkGreen">Daily Health Tip</h3>
            </div>
            <p className="text-sm text-secondaryText leading-relaxed">
              Staying hydrated is essential for your health. Aim to drink 6-8 glasses of water each day to maintain proper body function and energy levels.
            </p>
            <div className="mt-4 pt-3 border-t border-yellow-200/50">
              <p className="text-xs text-secondaryText">
                Tip provided by ClinicOpsAgent Health Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewPage