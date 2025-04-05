import { useState, useRef, useEffect } from 'react';
import Button from '../components/Button';
import { Mic, Download, PlayArrow, Pause, GraphicEq } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Slider from '@mui/material/Slider';

// Constants
const FAMOUS_VOICES = [
  {
    id: 'default',
    name: 'Default Voice',
    description: 'Your system default voice',
    icon: <GraphicEq />,
    voiceName: '',
    defaultPitch: 1,
    defaultRate: 1
  },
  {
    id: 'morgan-freeman',
    name: 'Siri (Female)',
    description: 'Deep, calm narrator voice',
    icon: <GraphicEq />,
    voiceName: 'Google US English',
    defaultPitch: 0.8,
    defaultRate: 0.9
  },
  {
    id: 'siri-female',
    name: 'Morgan Freeman',
    description: 'Apple Siri female voice',
    icon: <GraphicEq />,
    voiceName: 'Samantha',
    defaultPitch: 1.2,
    defaultRate: 1.1
  },
  {
    id: 'david-attenborough',
    name: 'David Attenborough',
    description: 'British documentary narrator',
    icon: <GraphicEq />,
    voiceName: 'Daniel',
    defaultPitch: 1,
    defaultRate: 0.95
  }
];

const DeepfakeAudioPage = () => {
  // State
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState(FAMOUS_VOICES[0].id);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Refs
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Voice matching function
  const findBestVoiceMatch = (voiceName: string) => {
    if (!voiceName) return null;
    const exactMatch = availableVoices.find(v => 
      v.name.toLowerCase().includes(voiceName.toLowerCase())
    );
    return exactMatch || availableVoices.find(v => 
      v.name.toLowerCase().includes(voiceName.split(' ')[0].toLowerCase())
    );
  };

  // Initialize audio recording
  const initAudioRecording = () => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const destination = audioContextRef.current.createMediaStreamDestination();
    mediaRecorderRef.current = new MediaRecorder(destination.stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      setAudioBlob(audioBlob);
    };
  };

  // Audio generation
  const handleGenerateAudio = async () => {
    if (!text.trim()) return;
    setIsLoading(true);

    try {
      window.speechSynthesis.cancel();
      initAudioRecording();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Get current voice data
      const voiceData = FAMOUS_VOICES.find(v => v.id === selectedVoice);

      // Apply pitch and rate from sliders
      utterance.pitch = pitch;
      utterance.rate = rate;

      // Set the voice
      if (voiceData) {
        if (voiceData.id === 'default') {
          const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
          if (defaultVoice) utterance.voice = defaultVoice;
        } else {
          const matchedVoice = findBestVoiceMatch(voiceData.voiceName);
          if (matchedVoice) utterance.voice = matchedVoice;
        }
      }

      // Start recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.start();
      }

      // Event handlers
      utterance.onstart = () => {
        setIsPlaying(true);
        startProgressTimer();
      };

      utterance.onend = () => {
        setIsPlaying(false);
        stopProgressTimer();
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
        }
      };

      utterance.onerror = (event) => {
        console.error('SpeechSynthesis error:', event);
        setIsPlaying(false);
        stopProgressTimer();
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Progress control
  const startProgressTimer = () => {
    stopProgressTimer();
    const duration = text.length / (12 * rate); // Adjust duration based on rate
    const increment = 100 / (duration * 10);
    
    progressInterval.current = setInterval(() => {
      setProgress(prev => prev >= 100 ? 100 : prev + increment);
    }, 100);
  };

  const stopProgressTimer = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  // Playback control
  const togglePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
    } else {
      window.speechSynthesis.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setProgress(0);
    stopProgressTimer();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // Download audio
  const handleDownload = () => {
    if (!audioBlob) return;
    
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-${selectedVoice}-${new Date().getTime()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle voice selection
  const handleVoiceSelect = (voiceId: string) => {
    const voice = FAMOUS_VOICES.find(v => v.id === voiceId);
    if (voice) {
      setSelectedVoice(voiceId);
      setPitch(voice.defaultPitch);
      setRate(voice.defaultRate);
    }
  };

  // Effects
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Chrome needs this timeout to properly load voices
      setTimeout(() => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }, 500);
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      stopProgressTimer();
      window.speechSynthesis.cancel();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Audio Generator</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Convert text to high-quality speech with famous voices
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Text Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Text Input</h2>
          <textarea
            className="w-full h-72 p-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            placeholder="Enter the text you want to convert to speech..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          {/* Voice Selection */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Select Voice</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {FAMOUS_VOICES.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => handleVoiceSelect(voice.id)}
                  className={`p-3 rounded-lg border transition-colors flex flex-col items-center ${
                    selectedVoice === voice.id
                      ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-700'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-blue-500 dark:text-blue-400 mb-1">
                    {voice.icon}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{voice.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{voice.description}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Voice Modulation */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Voice Modulation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pitch: {pitch.toFixed(1)}
                </label>
                <Slider
                  value={pitch}
                  onChange={(e, newValue) => setPitch(newValue as number)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  aria-labelledby="pitch-slider"
                  className="text-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Lower</span>
                  <span>Normal</span>
                  <span>Higher</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Speed: {rate.toFixed(1)}
                </label>
                <Slider
                  value={rate}
                  onChange={(e, newValue) => setRate(newValue as number)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  aria-labelledby="rate-slider"
                  className="text-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Slower</span>
                  <span>Normal</span>
                  <span>Faster</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerateAudio}
              loading={isLoading}
              disabled={isLoading || !text.trim()}
              icon={Mic}
              className="w-full"
            >
              {isLoading ? 'Generating...' : 'Generate Audio'}
            </Button>
          </div>
        </motion.div>

        {/* Audio Output Section - Improved Layout */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 h-fit"
        >
          <div className="flex flex-col h-full space-y-6">
            {/* Header with Enhanced Download Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Audio Preview</h2>
              <button
                onClick={handleDownload}
                disabled={!audioBlob}
                className={`flex items-center px-4 py-2 rounded-lg transition-all transform hover:scale-105 ${
                  audioBlob
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-green-500/30'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <Download className="mr-2" />
                <span className="font-medium">Download</span>
              </button>
            </div>

            {/* Player Card with Improved Layout */}
            <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                    text.trim() ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    <GraphicEq className={
                      text.trim() ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                    } />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {text.trim() ? FAMOUS_VOICES.find(v => v.id === selectedVoice)?.name : 'No audio generated'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {text.length > 0 ? `${Math.ceil(text.length / 5)} words` : 'Enter text to preview'}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={togglePlayPause}
                    disabled={!text.trim() || !audioBlob}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      text.trim() && audioBlob
                        ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white shadow-md'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isPlaying ? <Pause className="text-lg" /> : <PlayArrow className="text-lg" />}
                  </button>
                  
                  <button
                    onClick={handleStop}
                    disabled={!isPlaying}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isPlaying
                        ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white shadow-md'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatTime((progress / 100) * (text.length / (12 * rate)))}</span>
                  <span>{formatTime(text.length / (12 * rate))}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Stats Grid - Improved Layout */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Characters</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{text.length}</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {text.length > 0 ? formatTime(text.length / (12 * rate)) : '0:00'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Voice Details Card - Enhanced */}
            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Voice Settings</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-300">Voice Preset:</span>
                  <span className="font-medium text-right">{FAMOUS_VOICES.find(v => v.id === selectedVoice)?.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-300">Pitch Level:</span>
                  <span className="font-mono bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-sm">
                    {pitch.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-300">Playback Speed:</span>
                  <span className="font-mono bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-sm">
                    {rate.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-8"
      >
        <p>This service uses your browser's built-in text-to-speech capabilities</p>
        <p className="mt-1">Voice availability depends on your system and browser</p>
      </motion.div>
    </div>
  );
};

export default DeepfakeAudioPage;