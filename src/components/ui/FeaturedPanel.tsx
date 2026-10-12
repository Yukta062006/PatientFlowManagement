import React from 'react'
import { BookOpen, Video, Gamepad } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FeaturedPanelProps {
  section: string
}

const FeaturedPanel: React.FC<FeaturedPanelProps> = ({ section }) => {
  const featuredContent = {
    'medical-knowledge': {
      title: 'Latest Medical Research',
      description: 'Explore the newest studies and clinical trials published in top medical journals.',
      image: '/images/placeholder-research.svg',
      icon: <BookOpen className="w-12 h-12" />,
      cta: 'Explore Research',
      path: '/medical-knowledge',
    },
    'medical-videos': {
      title: 'Surgical Education',
      description: 'Watch expert-led videos on surgical techniques and medical procedures.',
      image: '/images/placeholder-video.svg',
      icon: <Video className="w-12 h-12" />,
      cta: 'Watch Videos',
      path: '/medical-videos',
    },
    'health-games': {
      title: 'Health Education Games',
      description: 'Learn through interactive challenges and earn points for your learning journey.',
      image: '/images/placeholder-game.svg',
      icon: <Gamepad className="w-12 h-12" />,
      cta: 'Play Games',
      path: '/health-games',
    },
  }

  const content = featuredContent[section as keyof typeof featuredContent] || featuredContent['medical-knowledge']

  return (
    <div className="bg-gradient-to-br from-sage-50 to-white rounded-2xl p-6 shadow-lg border border-sage-200 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-sage-200/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-primaryGreen/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
            Featured
          </span>
        </div>
        
        <div className="h-40 rounded-xl bg-gradient-to-br from-sage-200 to-sage-300 mb-4 flex items-center justify-center overflow-hidden relative">
          <div className="text-sage-700 opacity-80">{content.icon}</div>
          <div className="absolute inset-0 bg-gradient-to-t from-sage-900/20 to-transparent pointer-events-none"></div>
        </div>
        
        <h3 className="font-bold text-xl text-darkGreen mb-2">{content.title}</h3>
        <p className="text-sm text-secondaryText mb-6 leading-relaxed">
          {content.description}
        </p>
        
        <Link
          to={content.path}
          className="w-full bg-gradient-to-r from-primaryGreen to-darkGreen text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-primaryGreen/20 transition-all flex items-center justify-center gap-2 group"
        >
          {content.cta}
          <BookOpen className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}

export default FeaturedPanel