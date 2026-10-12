import React, { useState } from 'react'
import { Play, Search } from 'lucide-react'
import { videoResources, getAllCategories, filterByCategory, searchVideos } from '../services/videoService'
import { VideoResource } from '../types/video'

const categoryIcons: Record<string, React.ReactNode> = {
  all: '📋',
  surgery: '🩺',
  'heart-health': '❤️',
  diabetes: '📊',
  'first-aid': '🚑',
  'women-s-health': '♀️',
  'men-s-health': '♂️',
  'general-health': '🌿',
}

const MedicalVideosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = getAllCategories()

  // Apply filters
  const filteredVideos = searchVideos(
    filterByCategory(videoResources, selectedCategory),
    searchTerm
  )

  const handleWatchVideo = (video: VideoResource) => {
    if (video.sourceUrl) {
      window.open(video.sourceUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      all: 'All Videos',
      surgery: 'Surgery',
      'heart-health': 'Heart Health',
      diabetes: 'Diabetes',
      'first-aid': 'First Aid',
      'women-s-health': 'Women\'s Health',
      'men-s-health': 'Men\'s Health',
      'general-health': 'General Health',
    }
    return labels[category] || category
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-darkGreen mb-2">Surgical & Medical Videos</h1>
        <p className="text-secondaryText">
          Explore educational videos to better understand health conditions, medical procedures, and patient preparation.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondaryText" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search videos by title, description, or category..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-primaryGreen bg-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2
                ${selectedCategory === category 
                  ? 'bg-primaryGreen text-white' 
                  : 'bg-white border border-sage-300 text-secondaryText hover:bg-cream'
                }
              `}
            >
              {categoryIcons[category]}
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="bg-cream rounded-2xl p-12 text-center border border-sage-200">
          <div className="w-20 h-20 bg-sage-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-sage-500" />
          </div>
          <h3 className="text-xl font-bold text-darkGreen mb-2">No videos found</h3>
          <p className="text-secondaryText mb-6">
            Try adjusting your search or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}
            className="bg-darkGreen text-white px-6 py-3 rounded-xl font-medium hover:bg-primaryGreen transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Video Grid */}
      {filteredVideos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sage-200 hover:shadow-md transition-all">
              {/* Thumbnail Container */}
              <div className="relative h-48 bg-sage-100 overflow-hidden group cursor-pointer" onClick={() => handleWatchVideo(video)}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // @ts-ignore
                    e.target.style.display = 'none'
                    e.currentTarget.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-sage-100">
                        <div class="text-sage-500">
                          <Play className="w-16 h-16" />
                        </div>
                      </div>
                    `
                  }}
                />
                <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                  {video.duration}
                </div>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white text-darkGreen w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
              </div>

              {/* Video Content */}
              <div className="p-5">
                {/* Category and Date */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-primaryGreen uppercase tracking-wide">
                    {video.category.replace('-', ' ')}
                  </span>
                  {video.publicationDate && (
                    <span className="text-xs text-sage-500">
                      • {new Date(video.publicationDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 
                  className="font-bold text-lg text-darkGreen mb-2 hover:text-primaryGreen transition-colors cursor-pointer line-clamp-2"
                  onClick={() => handleWatchVideo(video)}
                >
                  {video.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-secondaryText mb-4 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs text-sage-600">
                    <span className="font-medium text-darkGreen">Source:</span> {video.source}
                  </span>
                </div>

                {/* Views and Likes */}
                {(video.views || video.likes) && (
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-sage-500">
                    {video.views && (
                      <span className="flex items-center gap-1">
                        👁️ {video.views} views
                      </span>
                    )}
                    {video.likes && (
                      <span className="flex items-center gap-1">
                        👍 {video.likes} likes
                      </span>
                    )}
                  </div>
                )}

                {/* Watch Button */}
                <button
                  onClick={() => handleWatchVideo(video)}
                  className="w-full bg-darkGreen text-white py-3 rounded-xl font-medium hover:bg-primaryGreen transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Watch Video
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MedicalVideosPage
