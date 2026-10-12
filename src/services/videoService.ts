import { VideoResource } from '../types/video'

/**
 * Video Resource Service
 * 
 * This service provides video resources for the Medical Videos section.
 * 
 * NOTE: There is no public WebMD Ignite / HealthClips API available.
 * The resources below are educational examples that would typically come from:
 * - WebMD's official educational portal (requires licensing)
 * - YouTube Medical channel (publicly available)
 * - Healthcare education platforms
 * 
 * For production, you should:
 * 1. License content from authorized sources
 * 2. Use YouTube's iframe API for embedding
 * 3. Implement proper content management
 */

// Medical video resources - these would come from an authorized source
export const videoResources: VideoResource[] = [
  {
    id: '1',
    title: 'Preparing for Surgery',
    description: 'Learn about general preparation and what patients may expect before a surgical procedure. Includes pre-operative instructions, what to bring to the hospital, and questions to ask your doctor.',
    thumbnail: '/placeholder-video-1.svg',
    category: 'surgery',
    source: 'Health Education Resources',
    sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '15:30',
    views: '12.4k',
    likes: '856',
    publicationDate: '2024-01-15',
    tags: ['pre-op', 'preparation', 'surgery'],
  },
  {
    id: '2',
    title: 'Understanding Diabetes Management',
    description: 'Comprehensive guide to managing diabetes through lifestyle changes, medication, and regular monitoring. Features expert insights from endocrinologists.',
    thumbnail: '/placeholder-video-2.svg',
    category: 'diabetes',
    source: 'Diabetes Education Series',
    sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '22:45',
    views: '8.2k',
    likes: '623',
    publicationDate: '2024-02-20',
    tags: ['diabetes', 'management', 'lifestyle'],
  },
  {
    id: '3',
    title: 'Cardiac Rehabilitation Exercises',
    description: 'Safe exercise routines for heart patients during recovery. These guided exercises help improve cardiovascular health under medical supervision.',
    thumbnail: '/placeholder-video-3.svg',
    category: 'heart-health',
    source: 'Heart Health Education',
    sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '18:20',
    views: '6.8k',
    likes: '512',
    publicationDate: '2024-03-10',
    tags: ['cardiac', 'rehabilitation', 'exercise'],
  },
  {
    id: '4',
    title: 'First Aid Basics for Common Injuries',
    description: 'Essential first aid techniques for cuts, burns, fractures, and choking. Learn what to do immediately after an injury occurs before professional help arrives.',
    thumbnail: '/placeholder-video-4.svg',
    category: 'first-aid',
    source: 'First Aid Training Series',
    sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '28:15',
    views: '15.6k',
    likes: '1.2k',
    publicationDate: '2024-01-05',
    tags: ['first aid', 'emergency', 'injury'],
  },
  {
    id: '5',
    title: 'Women\'s Health: Annual Screenings',
    description: 'Understanding recommended women\'s health screenings including mammograms, pap smears, and bone density tests. When to start and how often to screen.',
    thumbnail: '/placeholder-video-5.svg',
    category: 'women-s-health',
    source: 'Women\'s Health Education',
    sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '19:40',
    views: '4.5k',
    likes: '378',
    publicationDate: '2024-02-28',
    tags: ['women\'s health', 'screenings', 'preventive care'],
  },
  {
    id: '6',
    title: 'Men\'s Health Checkups',
    description: 'Essential health screenings for men including prostate exams, blood pressure, cholesterol tests, and cancer screenings. Know what to expect.',
    thumbnail: '/placeholder-video-6.svg',
    category: 'men-s-health',
    source: 'Men\'s Health Education',
    sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '21:15',
    views: '3.2k',
    likes: '245',
    publicationDate: '2024-03-05',
    tags: ['men\'s health', 'screenings', 'prevention'],
  },
  {
    id: '7',
    title: 'General Health and Wellness',
    description: 'Comprehensive guide to maintaining overall health through nutrition, exercise, sleep, and stress management. Practical tips for everyday living.',
    thumbnail: '/placeholder-video-1.svg',
    category: 'general-health',
    source: 'Health Education Series',
    sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '25:30',
    views: '9.8k',
    likes: '789',
    publicationDate: '2024-01-25',
    tags: ['wellness', 'nutrition', 'exercise'],
  },
  {
    id: '8',
    title: 'Understanding Heart Health',
    description: 'Learn about heart disease risk factors, prevention strategies, and signs to watch for. Expert insights from cardiovascular specialists.',
    thumbnail: '/placeholder-video-2.svg',
    category: 'heart-health',
    source: 'Heart Health Education',
    sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '24:10',
    views: '7.2k',
    likes: '567',
    publicationDate: '2024-02-15',
    tags: ['heart', 'cardiovascular', 'prevention'],
  },
  {
    id: '9',
    title: 'Surgical Procedure Overview',
    description: 'Step-by-step walkthrough of common surgical procedures. Understanding what happens before, during, and after surgery.',
    thumbnail: '/placeholder-video-3.svg',
    category: 'surgery',
    source: 'Surgical Education Series',
    sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '32:45',
    views: '11.5k',
    likes: '892',
    publicationDate: '2024-03-20',
    tags: ['surgery', 'procedure', 'overview'],
  },
  {
    id: '10',
    title: 'Diabetes Medications',
    description: 'Understanding different types of diabetes medications, how they work, potential side effects, and proper usage. consultation with your healthcare provider.',
    thumbnail: '/placeholder-video-4.svg',
    category: 'diabetes',
    source: 'Diabetes Education Series',
    sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '17:50',
    views: '5.4k',
    likes: '423',
    publicationDate: '2024-02-10',
    tags: ['diabetes', 'medications', 'insulin'],
  },
]

/**
 * Filter videos by category
 */
export function filterByCategory(videos: VideoResource[], category: string): VideoResource[] {
  if (category === 'all') return videos
  return videos.filter(v => v.category === category)
}

/**
 * Search videos by text
 */
export function searchVideos(videos: VideoResource[], searchTerm: string): VideoResource[] {
  if (!searchTerm.trim()) return videos
  
  const term = searchTerm.toLowerCase()
  return videos.filter(video => 
    video.title.toLowerCase().includes(term) ||
    video.description.toLowerCase().includes(term) ||
    video.tags?.some(tag => tag.toLowerCase().includes(term)) ||
    video.source.toLowerCase().includes(term)
  )
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return ['all', 'surgery', 'heart-health', 'diabetes', 'first-aid', 'women-s-health', 'men-s-health', 'general-health']
}
