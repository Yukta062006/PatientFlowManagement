// Game Service - Data and game logic

export const games = [
  {
    id: 'medical-knowledge-challenge',
    title: 'Medical Knowledge Challenge',
    description: 'Test your medical knowledge with multiple choice questions covering basic health, hygiene, prevention, and more',
    shortDescription: 'Multiple choice medical knowledge quiz',
    difficulty: 'Intermediate',
    estimatedTime: '5-10 minutes',
    maxPoints: 100,
    totalQuestions: 8,
  },
  {
    id: 'medical-memory-match',
    title: 'Medical Memory Match',
    description: 'Match medical concepts with their corresponding body systems in this visual memory game',
    shortDescription: 'Memory matching game with medical concepts',
    difficulty: 'Intermediate',
    estimatedTime: '3-5 minutes',
    maxPoints: 100,
    totalQuestions: 6,
  },
  {
    id: 'healthy-habits-sorting',
    title: 'Healthy Habits Sorting',
    description: 'Classify daily habits as healthy, less healthy, or neutral in this interactive sorting challenge',
    shortDescription: 'Sort habits into healthy and unhealthy categories',
    difficulty: 'Easy',
    estimatedTime: '3-5 minutes',
    maxPoints: 100,
    totalQuestions: 8,
  },
  {
    id: 'hospital-journey',
    title: 'Hospital Journey',
    description: 'Prepare for hospital visits by completing essential steps and understanding the patient journey',
    shortDescription: 'Hospital preparation and patient education',
    difficulty: 'Intermediate',
    estimatedTime: '5-7 minutes',
    maxPoints: 75,
    totalQuestions: 6,
  },
  {
    id: 'myth-vs-fact',
    title: 'Medical Myth vs Fact',
    description: 'Distinguish between common medical myths and facts with evidence-based education',
    shortDescription: 'Identify medical myths and facts',
    difficulty: 'Advanced',
    estimatedTime: '5-8 minutes',
    maxPoints: 100,
    totalQuestions: 5,
  },
  {
    id: 'first-aid-quiz',
    title: 'First Aid Education',
    description: 'Learn essential first aid knowledge for common emergencies and injuries',
    shortDescription: 'First aid scenarios and responses',
    difficulty: 'Intermediate',
    estimatedTime: '5-10 minutes',
    maxPoints: 100,
    totalQuestions: 8,
  },
  {
    id: 'healthy-match',
    title: 'Healthy Match',
    description: 'Match healthy foods and wellness items in this interactive match-3 puzzle game',
    shortDescription: 'Match-3 puzzle with healthy foods',
    difficulty: 'Easy',
    estimatedTime: '5-8 minutes',
    maxPoints: 150,
    totalQuestions: 5,
  },
  {
    id: 'hospital-adventure',
    title: 'Hospital Adventure',
    description: 'Navigate hospital scenarios and learn essential patient preparation steps',
    shortDescription: 'Interactive hospital scenario game',
    difficulty: 'Intermediate',
    estimatedTime: '5-7 minutes',
    maxPoints: 120,
    totalQuestions: 5,
  },
  {
    id: 'anatomy-puzzle',
    title: 'Anatomy Puzzle',
    description: 'Learn body systems by matching organs and body parts to their correct systems',
    shortDescription: 'Body parts to system matching',
    difficulty: 'Advanced',
    estimatedTime: '5-10 minutes',
    maxPoints: 150,
    totalQuestions: 6,
  },
]

export const medicalKnowledgeQuestions = [
  {
    id: 1,
    question: 'What is the most important step in hand hygiene before eating?',
    options: ['Washing with soap and water', 'Using hand sanitizer', 'Wiping with a napkin', 'Rinsing with water'],
    correctAnswer: 0,
    explanation: 'Washing with soap and water for at least 20 seconds is the most effective way to remove germs before eating.',
  },
  {
    id: 2,
    question: 'How many glasses of water should most adults drink daily?',
    options: ['1-2 glasses', '3-4 glasses', '6-8 glasses', '10-12 glasses'],
    correctAnswer: 2,
    explanation: 'Most adults should aim for 6-8 glasses of water daily to stay properly hydrated.',
  },
  {
    id: 3,
    question: 'What is the recommended amount of sleep for adults?',
    options: ['4-5 hours', '6-7 hours', '7-9 hours', '10-12 hours'],
    correctAnswer: 2,
    explanation: 'Adults need 7-9 hours of sleep per night for optimal health and functioning.',
  },
  {
    id: 4,
    question: 'Which vaccine helps prevent liver infection?',
    options: ['MMR vaccine', 'Hepatitis B vaccine', 'Flu shot', 'Tetanus shot'],
    correctAnswer: 1,
    explanation: 'The Hepatitis B vaccine prevents liver infection caused by the hepatitis B virus.',
  },
  {
    id: 5,
    question: 'What is a healthy blood pressure reading for adults?',
    options: ['Below 120/80', 'Below 130/85', 'Below 140/90', 'Below 150/95'],
    correctAnswer: 0,
    explanation: 'A healthy blood pressure reading for adults is below 120/80 mmHg.',
  },
  {
    id: 6,
    question: 'Which symptom requires immediate medical attention?',
    options: ['Mild headache', 'Low-grade fever', 'Chest pain', 'Minor muscle soreness'],
    correctAnswer: 2,
    explanation: 'Chest pain can indicate a serious condition and requires immediate medical attention.',
  },
  {
    id: 7,
    question: 'How often should you visit the dentist for checkups?',
    options: ['Once a year', 'Every 6 months', 'Every 3 months', 'Only when in pain'],
    correctAnswer: 1,
    explanation: 'Most people should visit the dentist every 6 months for preventive care.',
  },
  {
    id: 8,
    question: 'What is the primary function of white blood cells?',
    options: ['Carry oxygen', 'Fight infection', 'Clot blood', 'Regulate temperature'],
    correctAnswer: 1,
    explanation: 'White blood cells are part of the immune system and help fight infections.',
  },
]

export const memoryCardPairs = [
  { id: 1, label: 'Heart' },
  { id: 2, label: 'Lungs' },
  { id: 3, label: 'Brain' },
  { id: 4, label: 'Bones' },
  { id: 5, label: 'Stomach' },
  { id: 6, label: 'Skin' },
]

export const habitCards = [
  { id: 1, text: 'Eating balanced meals with fruits and vegetables', category: 'healthy', isSorted: false },
  { id: 2, text: 'Getting 7-9 hours of sleep nightly', category: 'healthy', isSorted: false },
  { id: 3, text: 'Regular physical activity (30 minutes daily)', category: 'healthy', isSorted: false },
  { id: 4, text: 'Smoking tobacco products', category: 'less-healthy', isSorted: false },
  { id: 5, text: 'Excessive consumption of sugary drinks', category: 'less-healthy', isSorted: false },
  { id: 6, text: 'Sitting for long periods without movement', category: 'less-healthy', isSorted: false },
  { id: 7, text: 'Washing hands regularly', category: 'healthy', isSorted: false },
  { id: 8, text: 'Managing stress through relaxation techniques', category: 'healthy', isSorted: false },
]

export const sortingCategories = [
  { id: 'healthy', label: 'Healthy Habit' },
  { id: 'less-healthy', label: 'Less Healthy' },
]

export const mythFactQuestions = [
  {
    id: 1,
    statement: 'You should wait 30 minutes after eating before swimming',
    isMyth: true,
    explanation: 'This is a myth. There is no scientific evidence that swimming after eating causes drowning.',
  },
  {
    id: 2,
    statement: 'Vaccines help prevent infectious diseases',
    isMyth: false,
    explanation: 'This is a fact. Vaccines train the immune system to recognize and fight harmful viruses and diseases.',
  },
  {
    id: 3,
    statement: 'Antibiotics can treat viral infections like colds and flu',
    isMyth: true,
    explanation: 'This is a myth. Antibiotics only treat bacterial infections.',
  },
  {
    id: 4,
    statement: 'Drinking 8 glasses of water daily is necessary for everyone',
    isMyth: false,
    explanation: 'This is mostly a fact. While individual needs vary, most adults benefit from adequate fluid intake.',
  },
  {
    id: 5,
    statement: 'Cracking your knuckles causes arthritis',
    isMyth: true,
    explanation: 'This is a myth. Multiple studies have shown that knuckle cracking does not cause arthritis.',
  },
]

export const hospitalSteps = [
  { id: 1, title: 'Confirm Appointment', description: 'Verify date, time, location, and any special instructions', completed: false },
  { id: 2, title: 'Prepare Documents', description: 'Bring insurance card, ID, and medication list', completed: false },
  { id: 3, title: 'Medication Review', description: 'Know all medications and allergies to share with staff', completed: false },
  { id: 4, title: 'Follow Instructions', description: 'Follow any pre-visit instructions like fasting', completed: false },
  { id: 5, title: 'Questions Preparation', description: 'Write down questions to ask your healthcare team', completed: false },
  { id: 6, title: 'Aftercare Plan', description: 'Understand discharge instructions and follow-up appointments', completed: false },
]

// Scoring Constants
export const SCORES = {
  CORRECT_ANSWER: 10,
  CORRECT_SORTING: 10,
  CORRECT_MATCH: 10,
  GAME_COMPLETION_BONUS: 25,
  QUIZ_COMPLETION_BONUS: 50,
  PERFECT_SCORE_BONUS: 20,
  ALL_CORRECT_BONUS: 20,
}

// Achievement Definitions
export const achievements = [
  {
    id: 'health-beginner',
    title: '🌱 Health Beginner',
    description: 'Complete your first game',
    icon: '🌱',
    requirement: { gamesCompleted: 1 },
  },
  {
    id: 'health-learner',
    title: '🌿 Health Learner',
    description: 'Complete three different games',
    icon: '🌿',
    requirement: { gamesCompleted: 3 },
  },
  {
    id: 'perfect-challenge',
    title: '🏆 Perfect Challenge',
    description: 'Achieve a perfect score in any game',
    icon: '🏆',
    requirement: { perfectScore: 1 },
  },
  {
    id: 'knowledge-explorer',
    title: '🧠 Knowledge Explorer',
    description: 'Complete the Medical Knowledge Challenge',
    icon: '🧠',
    requirement: { gameCompleted: 'medical-knowledge-challenge' },
  },
  {
    id: 'memory-master',
    title: '🏅 Memory Master',
    description: 'Complete the Medical Memory Match game',
    icon: '🏅',
    requirement: { gameCompleted: 'medical-memory-match' },
  },
  {
    id: 'habit-hero',
    title: '💪 Habit Hero',
    description: 'Complete the Healthy Habits Sorting game',
    icon: '💪',
    requirement: { gameCompleted: 'healthy-habits-sorting' },
  },
  {
    id: 'hospital-hero',
    title: '🏥 Hospital Hero',
    description: 'Complete the Hospital Journey game',
    icon: '🏥',
    requirement: { gameCompleted: 'hospital-journey' },
  },
  {
    id: 'myth-buster',
    title: '🔍 Myth Buster',
    description: 'Complete the Myth vs Fact game',
    icon: '🔍',
    requirement: { gameCompleted: 'myth-vs-fact' },
  },
  {
    id: 'first-aid-expert',
    title: '🚑 First Aid Expert',
    description: 'Complete the First Aid Education game',
    icon: '🚑',
    requirement: { gameCompleted: 'first-aid-quiz' },
  },
  {
    id: 'point-collector',
    title: '⭐ Point Collector',
    description: 'Earn 100 total points',
    icon: '⭐',
    requirement: { totalPoints: 100 },
  },
]

// Persistence Keys
const STORAGE_KEYS = {
  BEST_SCORE: (gameId: string) => `game-bestscore-${gameId}`,
  TOTAL_POINTS: 'game-total-points',
  COMPLETED_GAMES: 'game-completed-games',
  UNLOCKED_ACHIEVEMENTS: 'game-achievements',
  GAME_HISTORY: 'game-history',
}

// Safe localStorage helpers
const getStorageItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const setStorageItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value)
  } catch {
    console.warn('Failed to save to localStorage')
  }
}

// Best Score Functions
export function saveBestScore(gameId: string, score: number): { isNewBest: boolean; previousBest: number } {
  const key = STORAGE_KEYS.BEST_SCORE(gameId)
  const existing = getStorageItem(key)
  const previousBest = existing ? parseInt(existing) : 0
  
  if (score > previousBest) {
    setStorageItem(key, score.toString())
    return { isNewBest: true, previousBest }
  }
  return { isNewBest: false, previousBest }
}

export function getBestScore(gameId: string): number {
  const score = getStorageItem(STORAGE_KEYS.BEST_SCORE(gameId))
  return score ? parseInt(score) : 0
}

// Total Points Functions
export function addTotalPoints(points: number): number {
  const existing = getStorageItem(STORAGE_KEYS.TOTAL_POINTS)
  const current = existing ? parseInt(existing) : 0
  const newTotal = current + points
  setStorageItem(STORAGE_KEYS.TOTAL_POINTS, newTotal.toString())
  return newTotal
}

export function getTotalPoints(): number {
  const score = getStorageItem(STORAGE_KEYS.TOTAL_POINTS)
  return score ? parseInt(score) : 0
}

// Completed Games Functions
export function markGameCompleted(gameId: string): void {
  const existing = getStorageItem(STORAGE_KEYS.COMPLETED_GAMES)
  const completed = existing ? JSON.parse(existing) : []
  
  if (!completed.includes(gameId)) {
    completed.push(gameId)
    setStorageItem(STORAGE_KEYS.COMPLETED_GAMES, JSON.stringify(completed))
  }
}

export function getCompletedGames(): string[] {
  const completed = getStorageItem(STORAGE_KEYS.COMPLETED_GAMES)
  return completed ? JSON.parse(completed) : []
}

// Achievements Functions
export function unlockAchievement(achievementId: string): void {
  const existing = getStorageItem(STORAGE_KEYS.UNLOCKED_ACHIEVEMENTS)
  const unlocked = existing ? JSON.parse(existing) : []
  
  if (!unlocked.includes(achievementId)) {
    unlocked.push(achievementId)
    setStorageItem(STORAGE_KEYS.UNLOCKED_ACHIEVEMENTS, JSON.stringify(unlocked))
  }
}

export function getUnlockedAchievements(): string[] {
  const unlocked = getStorageItem(STORAGE_KEYS.UNLOCKED_ACHIEVEMENTS)
  return unlocked ? JSON.parse(unlocked) : []
}

export function checkAndUnlockAchievements(params: {
  gamesCompleted?: number
  perfectScore?: number
  gameCompleted?: string
  totalPoints?: number
}): string[] {
  const newlyUnlocked: string[] = []
  
  for (const achievement of achievements) {
    // Skip if already unlocked
    if (getUnlockedAchievements().includes(achievement.id)) continue
    
    let unlocked = false
    
    if (achievement.requirement.gamesCompleted && params.gamesCompleted) {
      unlocked = params.gamesCompleted >= achievement.requirement.gamesCompleted
    }
    
    if (achievement.requirement.perfectScore && params.perfectScore) {
      unlocked = params.perfectScore >= achievement.requirement.perfectScore
    }
    
    if (achievement.requirement.gameCompleted && params.gameCompleted) {
      const completed = getCompletedGames()
      unlocked = completed.includes(achievement.requirement.gameCompleted)
    }
    
    if (achievement.requirement.totalPoints && params.totalPoints) {
      unlocked = params.totalPoints >= achievement.requirement.totalPoints
    }
    
    if (unlocked) {
      unlockAchievement(achievement.id)
      newlyUnlocked.push(achievement.id)
    }
  }
  
  return newlyUnlocked
}

// Game History
export function saveGameResult(gameId: string, result: {
  score: number
  correctAnswers: number
  totalQuestions: number
  timestamp: number
}): void {
  const existing = getStorageItem(STORAGE_KEYS.GAME_HISTORY)
  const history = existing ? JSON.parse(existing) : []
  
  history.push({ gameId, ...result })
  
  // Keep only last 20 results
  if (history.length > 20) {
    history.shift()
  }
  
  setStorageItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history))
}

export function getGameHistory(): Array<{
  gameId: string
  score: number
  correctAnswers: number
  totalQuestions: number
  timestamp: number
}> {
  const history = getStorageItem(STORAGE_KEYS.GAME_HISTORY)
  return history ? JSON.parse(history) : []
}

// Reset Functions
export function resetGameProgress(gameId: string): void {
  localStorage.removeItem(STORAGE_KEYS.BEST_SCORE(gameId))
}

export function resetAllProgress(): void {
  games.forEach(game => {
    localStorage.removeItem(STORAGE_KEYS.BEST_SCORE(game.id))
  })
  localStorage.removeItem(STORAGE_KEYS.TOTAL_POINTS)
  localStorage.removeItem(STORAGE_KEYS.COMPLETED_GAMES)
  localStorage.removeItem(STORAGE_KEYS.UNLOCKED_ACHIEVEMENTS)
  localStorage.removeItem(STORAGE_KEYS.GAME_HISTORY)
}

// Calculate game completion bonus
export function calculateCompletionBonus(
  score: number,
  correctAnswers: number,
  totalQuestions: number
): { finalScore: number; bonuses: string[] } {
  const bonuses: string[] = []
  let finalScore = score
  
  // Game completion bonus
  finalScore += SCORES.GAME_COMPLETION_BONUS
  bonuses.push(`Completion: +${SCORES.GAME_COMPLETION_BONUS}`)
  
  // Perfect score bonus (all correct)
  if (correctAnswers === totalQuestions && totalQuestions > 0) {
    finalScore += SCORES.PERFECT_SCORE_BONUS
    bonuses.push(`Perfect Score: +${SCORES.PERFECT_SCORE_BONUS}`)
  }
  
  return { finalScore, bonuses }
}