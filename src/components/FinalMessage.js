import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';
import './FinalMessage.css';

function FinalMessage({ onRestart }) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="final-message"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated background hearts */}
      <div className="floating-hearts-final">
        {[...Array(30)].map((_, i) => {
          const left = (i * 43 + 17) % 100;
          const animationDelay = (i * 0.3) % 3;
          const fontSize = 10 + (i % 20);
          const duration = 8 + (i % 4);
          
          return (
            <motion.div
              key={i}
              className="heart-float"
              style={{
                left: `${left}%`,
                animationDelay: `${animationDelay}s`,
                fontSize: `${fontSize}px`,
              }}
              initial={{ y: '100vh', opacity: 0 }}
              animate={{ 
                y: '-100vh', 
                opacity: [0, 1, 1, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "linear"
              }}
            >
              ❤️
            </motion.div>
          );
        })}
      </div>

      <div className="final-content">
        {/* Sparkle effects */}
        <motion.div
          className="sparkle-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <Sparkles size={60} color="#ffd700" className="sparkle-icon" />
        </motion.div>

        {showMessage && (
          <>
            <motion.h1
              className="final-title"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Happy Birthday Alanah 🎂
            </motion.h1>

            <motion.div
              className="heart-divider"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Heart size={40} fill="#ff6b9d" color="#ff6b9d" />
            </motion.div>

            <motion.h2
              className="final-subtitle"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Another Year of Love & Adventures 🎉
            </motion.h2>

            <motion.div
              className="final-message-text"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <p className="message-para">
                On your special day, I celebrate not just another year of your beautiful life, 
                but all the incredible memories we've created together so far.
              </p>
              <p className="message-para">
                From our first moments to all the adventures we've shared, 
                each experience with you has made my life more colorful, more joyful, and more complete.
              </p>
              <p className="message-para special">
                Happy Birthday my love! Here's to celebrating you today and creating countless more memories together. 🎂💕
              </p>
            </motion.div>

            <motion.div
              className="final-signature"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3 }}
            >
              <p>Happy Birthday Alanah,</p>
              <p className="signature-name">With all my love on your special day 🎉❤️</p>
            </motion.div>

            {/* Star decorations */}
            <motion.div
              className="star-decoration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Star size={20} fill="#ffd700" color="#ffd700" />
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              className="restart-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3 }}
              onClick={onRestart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Over
            </motion.button>
          </>
        )}
      </div>

      {/* Bottom decoration */}
      <div className="bottom-decoration">
        <motion.div
          className="wave"
          animate={{
            x: [0, -100, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </motion.div>
  );
}
export default FinalMessage;
