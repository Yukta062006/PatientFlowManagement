import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, 
  BookOpen, 
  Video, 
  Gamepad,
  TrendingUp
} from 'lucide-react'

const DashboardSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const categoryCards = [
    { 
      name: 'Medical Research', 
      icon: <BookOpen className="w-5 h-5" />, 
      path: '/medical-knowledge',
      description: 'Find trusted medical articles and research papers',
      color: 'blue'
    },
    { 
      name: 'Surgical Education', 
      icon: <Video className="w-5 h-5" />, 
      path: '/medical-videos',
      description: 'Watch surgical procedures and medical training videos',
      color: 'red'
    },
    { 
      name: 'Health Games', 
      icon: <Gamepad className="w-5 h-5" />, 
      path: '/health-games',
      description: 'Learn through interactive challenges and earn points',
      color: 'green'
    },
    { 
      name: 'Learning Progress', 
      icon: <TrendingUp className="w-5 h-5" />, 
      path: '/learning-progress',
      description: 'Track your journey and celebrate achievements',
      color: 'purple'
    },
  ]

  const searchExamples = [
    { term: 'Diabetes research', icon: <BookOpen className="w-4 h-4" /> },
    { term: 'Heart health', icon: <Video className="w-4 h-4" /> },
    { term: 'First aid', icon: <Gamepad className="w-4 h-4" /> },
    { term: 'Vaccines', icon: <BookOpen className="w-4 h-4" /> },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/medical-knowledge`)
    }
  }

  const handleExampleClick = (term: string) => {
    setSearchTerm(term)
    navigate(`/medical-knowledge`)
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-darkGreen mb-1">Search & Discover</h2>
          <p className="text-secondaryText">Find medical research, educational videos, and interactive games</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Link
            to="/medical-knowledge"
            className="bg-white border border-sage-300 text-darkGreen px-4 py-2 rounded-xl font-medium hover:bg-cream hover:border-primaryGreen transition-colors flex items-center gap-2 text-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Research</span>
          </Link>
          <Link
            to="/medical-videos"
            className="bg-white border border-sage-300 text-darkGreen px-4 py-2 rounded-xl font-medium hover:bg-cream hover:border-primaryGreen transition-colors flex items-center gap-2 text-sm"
          >
            <Video className="w-4 h-4" />
            <span>Videos</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mb-8">
        <div className="absolute left-5 top-1/2 -translate-y-1/2">
          <Search className="w-5 h-5 text-secondaryText" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search diseases, conditions, treatments, or medical topics..."
          className="w-full pl-14 pr-4 py-4 rounded-2xl border border-sage-300 bg-white focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-transparent shadow-sm transition-all"
        />
        <button
          type="submit"
          disabled={!searchTerm.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-darkGreen text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primaryGreen disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Search
        </button>
      </form>

      {/* Search Examples */}
      {searchTerm === '' && (
        <div>
          <p className="text-sm font-medium text-secondaryText mb-3">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {searchExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example.term)}
                className="flex items-center gap-2 px-4 py-2 bg-cream hover:bg-sage-100 border border-sage-200 hover:border-primaryGreen rounded-xl text-sm font-medium text-secondaryText transition-colors"
              >
                {example.icon}
                <span>{example.term}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {categoryCards.map((category, index) => (
          <Link
            key={index}
            to={category.path}
            className={`
              bg-white rounded-xl p-5 text-center transition-all duration-300
              hover:shadow-md border border-sage-200 hover:border-${category.color}-300
            `}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
              category.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              category.color === 'red' ? 'bg-red-50 text-red-600' :
              category.color === 'green' ? 'bg-green-50 text-green-600' :
              'bg-purple-50 text-purple-600'
            }`}>
              {category.icon}
            </div>
            <h3 className="font-semibold text-darkGreen mb-1">{category.name}</h3>
            <p className="text-xs text-secondaryText leading-relaxed">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DashboardSearch