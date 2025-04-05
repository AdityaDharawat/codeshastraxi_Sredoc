import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Detection from './pages/Detection';
import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';
import AuthPage from './pages/authpage';
import DeepfakeAudio from './pages/DeepfakeAudio'; // New import
import Navigation from './components/Navigation';
import ChatBot from './components/ChatBot';
import FloatingButton from './components/FloatingButton'; // Import reusable button component
import { useState } from 'react';
import { DetectionProvider } from './contexts/DetectionContext';
import { AuthProvider } from './contexts/AuthContext'; // Assuming you have auth context
import { saveAs } from 'file-saver'; // Import saveAs for downloading files
import { Mp3Encoder } from 'lamejs'; // Import Mp3Encoder from lamejs

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // State to store audio blob

  const generateAudioFromText = async (text: string) => {
    if (!text.trim()) return;

    try {
      // Simulate audio generation (replace this with actual audio data if needed)
      const sampleRate = 44100; // 44.1 kHz sample rate
      const samples = new Int16Array(sampleRate * 2); // 2 seconds of silence
      const encoder = new Mp3Encoder(1, sampleRate, 128); // Mono, 128 kbps

      // Encode the samples to MP3
      const mp3Data: Uint8Array[] = [];
      let mp3Buffer = encoder.encodeBuffer(samples);
      if (mp3Buffer.length > 0) mp3Data.push(mp3Buffer);
      mp3Buffer = encoder.flush();
      if (mp3Buffer.length > 0) mp3Data.push(mp3Buffer);

      // Combine MP3 data into a single Blob
      const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });
      setAudioBlob(mp3Blob); // Store the audio blob in state

      // Save the MP3 file
      saveAs(mp3Blob, 'generated_audio.mp3');
    } catch (error) {
      console.error('Error generating MP3 audio:', error);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const toggleChatBot = () => {
    setChatOpen((prev) => !prev);
  };

  return (
    <Router>
      <AuthProvider>
        <DetectionProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navigation />
            <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
            
            <div className="fixed z-50 bottom-8 right-8 flex flex-col items-end gap-4">
              <FloatingButton
                onClick={toggleChatBot}
                bgColor="bg-blue-600"
                hoverColor="hover:bg-blue-700"
                title={chatOpen ? "Close ChatBot" : "Open ChatBot"}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12l9-5-9-5-9 5 9 5z" />
                  </svg>
                }
              />
              {!chatOpen && (
                <>
                  <FloatingButton
                    onClick={() => generateAudioFromText('Sample text for audio generation')}
                    bgColor="bg-indigo-600"
                    hoverColor="hover:bg-indigo-700"
                    title="Generate and Download Audio"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    }
                  />
                  {audioBlob && (
                    <FloatingButton
                      onClick={playAudio}
                      bgColor="bg-green-600"
                      hoverColor="hover:bg-green-700"
                      title="Play Audio"
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-6.586-4.394A1 1 0 007 7.618v8.764a1 1 0 001.166.986l6.586-1.658a1 1 0 00.752-.986v-3.764a1 1 0 00-.752-.986z" />
                        </svg>
                      }
                    />
                  )}
                </>
              )}
            </div>

            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/detect" element={<Detection />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/deepfake-audio" element={<DeepfakeAudio />} /> {/* New route */}
                <Route path="/detection" element={<Detection />} /> {/* Added route */}
              </Routes>
            </AnimatePresence>
          </div>
        </DetectionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;