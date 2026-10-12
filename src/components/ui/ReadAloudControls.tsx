import React from 'react'
import { Volume2, VolumeX, Pause, Play, Settings } from 'lucide-react'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'

interface ReadAloudControlsProps {
  text: string
  onGenerateSummary?: () => void
}

const ReadAloudControls: React.FC<ReadAloudControlsProps> = ({ text, onGenerateSummary }) => {
  const {
    isPlaying,
    isPaused,
    error,
    supported,
    voices,
    currentSettings,
    play,
    pause,
    stop,
    setSettings,
    getVoiceByName,
  } = useSpeechSynthesis()

  const [settingsError, setSettingsError] = React.useState<string | null>(null)

  // Stop speech when text changes
  React.useEffect(() => {
    if (text) {
      stop()
    }
  }, [text, stop])

  const handlePlay = async () => {
    if (!text) {
      setSettingsError('Generate a research summary first to listen to it.')
      if (onGenerateSummary) {
        onGenerateSummary()
      }
      return
    }

    setSettingsError(null)
    await play(text)
  }

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voice = getVoiceByName(e.target.value)
    if (voice) {
      setSettings({ voice })
    }
  }

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value)
    setSettings({ rate })
  }

  if (!supported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        <div className="flex items-center gap-2">
          <VolumeX className="w-4 h-4" />
          <span>
            Read Aloud is not supported in this browser. You can still read the summary on screen.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Status Message */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
      {settingsError && (
        <div className="text-xs text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
          {settingsError}
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePlay}
          disabled={!text && !isPlaying}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors
            ${isPlaying 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-primaryGreen text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
            }
          `}
        >
          {isPlaying ? (
            isPaused ? (
              <>
                <Play className="w-4 h-4" />
                Resume Reading
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Reading Summary...
              </>
            )
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              Listen to Summary
            </>
          )}
        </button>

        {/* Pause Button */}
        {isPlaying && (
          <button
            onClick={pause}
            className="bg-white border border-sage-300 text-secondaryText hover:bg-cream hover:text-primaryGreen w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
            aria-label="Pause reading"
          >
            <Pause className="w-4 h-4" />
          </button>
        )}

        {/* Stop Button */}
        {(isPlaying || isPaused) && (
          <button
            onClick={stop}
            className="bg-white border border-sage-300 text-secondaryText hover:bg-red-50 hover:text-red-600 w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
            aria-label="Stop reading"
          >
            <VolumeX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Voice & Speed Settings */}
      {isPlaying && (
        <div className="bg-cream rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-darkGreen flex items-center gap-2">
              <Settings className="w-3 h-3" />
              Voice
            </label>
            <select
              value={currentSettings.voice?.name || ''}
              onChange={handleVoiceChange}
              className="px-3 py-1.5 text-sm rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-primaryGreen bg-white"
              aria-label="Select voice"
            >
              {voices.length === 0 ? (
                <option>Loading voices...</option>
              ) : (
                voices.map((voice, index) => (
                  <option key={`${voice.name}-${index}`} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-darkGreen mb-1 block">
                Speed: {currentSettings.rate}x
              </label>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.25"
                value={currentSettings.rate}
                onChange={handleRateChange}
                className="w-full h-2 bg-sage-200 rounded-lg appearance-none cursor-pointer accent-primaryGreen"
                aria-label="Reading speed"
              />
              <div className="flex justify-between text-xs text-secondaryText mt-1">
                <span>Slow (0.75x)</span>
                <span>Normal</span>
                <span>Fast (1.5x)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReadAloudControls
