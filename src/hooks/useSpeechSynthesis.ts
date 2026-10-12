import { useState, useEffect, useCallback, useRef } from 'react'

interface SpeechSettings {
  voice: SpeechSynthesisVoice | null
  rate: number
  pitch: number
}

interface UseSpeechSynthesisReturn {
  isPlaying: boolean
  isPaused: boolean
  error: string | null
  supported: boolean
  voices: SpeechSynthesisVoice[]
  currentSettings: SpeechSettings
  play: (text: string) => Promise<void>
  pause: () => void
  resume: () => void
  stop: () => void
  setSettings: (settings: Partial<SpeechSettings>) => void
  getVoiceByName: (name: string) => SpeechSynthesisVoice | null
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [currentSettings, setCurrentSettings] = useState<SpeechSettings>({
    voice: null,
    rate: 1.0,
    pitch: 1.0,
  })
  
  const synthesisRef = useRef<SpeechSynthesis>(window.speechSynthesis)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Load voices when component mounts
  useEffect(() => {
    // Get available voices
    const loadVoices = () => {
      const availableVoices = synthesisRef.current.getVoices()
      setVoices(availableVoices)
      
      // Set default voice (prefer English)
      const defaultVoice = availableVoices.find(v => v.lang.startsWith('en'))
      if (defaultVoice) {
        setCurrentSettings(prev => ({ ...prev, voice: defaultVoice }))
      }
    }

    loadVoices()
    
    // Load voices on change (some browsers load asynchronously)
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      // Cleanup
      stop()
    }
  }, [])

  const getVoiceByName = useCallback((name: string): SpeechSynthesisVoice | null => {
    return voices.find(v => v.name === name) || null
  }, [voices])

  const setSettings = useCallback((settings: Partial<SpeechSettings>) => {
    setCurrentSettings(prev => ({ ...prev, ...settings }))
  }, [])

  const play = useCallback(async (text: string) => {
    if (!text || text.trim().length === 0) {
      setError('No text to read aloud')
      return
    }

    // Stop any current speech
    stop()

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text)

    // Set voice
    if (currentSettings.voice) {
      utterance.voice = currentSettings.voice
    }

    // Set rate and pitch
    utterance.rate = currentSettings.rate
    utterance.pitch = currentSettings.pitch

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
      setError(null)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onerror = (event) => {
      setIsPlaying(false)
      setIsPaused(false)
      setError(`Speech error: ${event.error}`)
    }

    utteranceRef.current = utterance

    // Speak
    synthesisRef.current.speak(utterance)
  }, [currentSettings.voice, currentSettings.rate, currentSettings.pitch])

  const pause = useCallback(() => {
    if (isPlaying && !isPaused && utteranceRef.current) {
      try {
        synthesisRef.current.pause()
        setIsPaused(true)
      } catch (err) {
        setError('Failed to pause speech')
      }
    }
  }, [isPlaying, isPaused])

  const resume = useCallback(() => {
    if (isPaused && utteranceRef.current) {
      try {
        synthesisRef.current.resume()
        setIsPaused(false)
        setIsPlaying(true)
      } catch (err) {
        setError('Failed to resume speech')
      }
    }
  }, [isPaused])

  const stop = useCallback(() => {
    try {
      synthesisRef.current.cancel()
      setIsPlaying(false)
      setIsPaused(false)
      setError(null)
      
      if (utteranceRef.current) {
        utteranceRef.current = null
      }
    } catch (err) {
      setError('Failed to stop speech')
    }
  }, [])

  return {
    isPlaying,
    isPaused,
    error,
    supported: typeof window !== 'undefined' && 'speechSynthesis' in window,
    voices,
    currentSettings,
    play,
    pause,
    resume,
    stop,
    setSettings,
    getVoiceByName,
  }
}
