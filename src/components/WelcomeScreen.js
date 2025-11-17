import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Music } from 'lucide-react';
import './WelcomeScreen.css';

function WelcomeScreen({ onStart }) {
  return (
    <motion.div
      className="welcome-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="welcome-content">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.5, 
            type: "spring", 
            stiffness: 200 
          }}
          className="welcome-heart"
        >
          <Heart size={80} fill="#ff6b9d" color="#ff6b9d" />
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="welcome-title"
        >
          Happy Birthday Alanah 🎂💕
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="welcome-subtitle"
        >
          Celebrating Alanah with our beautiful memories so far
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="welcome-features"
        >
          <div className="feature">
            <MapPin size={24} />
            <span>Special Places</span>
          </div>
          <div className="feature">
            <Heart size={24} />
            <span>Beautiful Memories</span>
          </div>
          <div className="feature">
            <Music size={24} />
            <span>Our Song</span>
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.9 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 40px rgba(255, 107, 157, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          className="start-button"
          onClick={() => {
            try {
              if (typeof onStart === 'function') {
                onStart();
              }
            } catch (error) {
              console.error('Error starting journey:', error);
            }
          }}
        >
          Start Alanah's Birthday Journey 🎉
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="welcome-note"
        >
          Click on each location to celebrate our story together... Happy Birthday Alanah! 🎈
        </motion.p>
      </div>

      {/* Animated background elements */}
      <div className="background-shapes">
        {[...Array(20)].map((_, i) => {
          const left = (i * 37 + 23) % 100;
          const top = (i * 73 + 41) % 100;
          const duration = 3 + (i % 3);
          const delay = (i * 0.3) % 2;
          
          return (
            <motion.div
              key={i}
              className="shape"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export default WelcomeScreen;
