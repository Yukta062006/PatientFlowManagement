export interface VideoResource {
  id: string
  title: string
  description: string
  thumbnail: string
  category: string
  source: string
  sourceUrl?: string
  duration?: string
  views?: string
  likes?: string
  publicationDate?: string
  tags?: string[]
}

export interface VideoCategory {
  id: string
  label: string
  icon: React.ReactNode
}
