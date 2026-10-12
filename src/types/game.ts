export interface GameInfo {
  id: string
  title: string
  description: string
  shortDescription: string
  difficulty: 'Easy' | 'Intermediate' | 'Advanced'
  estimatedTime: string
  maxPoints: number
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface MemoryCard {
  id: number
  label: string
  isMatched: boolean
  isFlipped: boolean
}

export interface HabitCard {
  id: number
  text: string
  category: 'healthy' | 'less-healthy' | 'neutral'
  isSorted: boolean
}

export interface HospitalStep {
  id: number
  title: string
  description: string
  completed: boolean
}

export interface MythFactQuestion {
  id: number
  statement: string
  isMyth: boolean
  explanation: string
}
