import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import './MusicPlayer.css';
// Using a placeholder audio file for now
const chopinNocturne = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);
  const audioRef = useRef(null);

  // Chopin Nocturne Op. 9 No. 2 (Violin and Piano)
  const musicUrl = chopinNocturne;

  useEffect(() => {
    if (!musicUrl || !audioRef.current) return;
    
    audioRef.current.volume = 0.3;
    audioRef.current.currentTime = 9.6;
    
    const handleInteraction = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(console.error);
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [isPlaying]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    try {
      isPlaying ? audioRef.current.pause() : await audioRef.current.play();
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        src={musicUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onLoadedData={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 9.6; // Skip first 9.6 seconds
          }
        }}
      />

      <AnimatePresence>
        {showPlayer && (
          <motion.div
            className="music-player"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="player-content">
              <button
                className="player-button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} />
                )}
              </button>

              <div className="player-info">
                <span className="player-title">
                  {isPlaying ? "🎂 Alanah's Birthday Serenade - Chopin Nocturne" : "Click to play Alanah's birthday music"}
                </span>
              </div>

              <button
                className="player-button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
              </button>

              <button
                className="close-player"
                onClick={() => setShowPlayer(false)}
                aria-label="Close player"
              >
                ✕
              </button>
            </div>

            {isPlaying && (
              <motion.div
                className="audio-wave"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="wave-bar"
                    animate={{
                      height: ["30%", "100%", "30%"],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show player toggle if hidden */}
      {!showPlayer && (
        <motion.button
          className="show-player-button"
          onClick={() => setShowPlayer(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          🎵
        </motion.button>
      )}
    </>
  );
}

export default MusicPlayer;
