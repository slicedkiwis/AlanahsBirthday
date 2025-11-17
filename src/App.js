import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import MapView from './components/MapView';
import MemoryTimeline from './components/MemoryTimeline';
import FinalMessage from './components/FinalMessage';
import MusicPlayer from './components/MusicPlayer';
import ApiKeyTest from './components/ApiKeyTest';

import { Heart } from 'lucide-react';
import { extractMetadata } from './components/LocationExtractor';
import './App.css';

// Images are now served from public/images folder
const kanpeWholeNight = '/images/4Kanpe-the-whole-night.jpeg';
const apartment = '/images/Apartment.jpeg';
const beachTrip = '/images/Beach-trip.jpeg';
const birthdayTrip = '/images/Birthday-trip.jpeg';
const escaperoom = '/images/escaperoom.jpeg';
const firstTripPanama = '/images/First-trip-panama.jpeg';
const jacksonvilleLock = '/images/jacksonville-lock.jpeg';
const jacksonville = '/images/Jacksonville.jpeg';
const konmpaLineDancing = '/images/konmpa-and-line-dancing-at-ARJs.jpeg';
const myroom = '/images/myroom.jpeg';
const paintingPark = '/images/Painting-park.jpeg';
const panamaWineTasting = '/images/Panama-wine-tasting.jpeg';
const askedGirlfriend = '/images/when-i-asked-you-to-be-my-girlfriend.jpeg'; 

function App() {
  const [currentView, setCurrentView] = useState('welcome');
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [completedMemories, setCompletedMemories] = useState([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [memories, setMemories] = useState([]);
  const [mapKey, setMapKey] = useState(0);
  const [showTransitionMemoryCard, setShowTransitionMemoryCard] = useState(false);
  const [transitionSelectedMemory, setTransitionSelectedMemory] = useState(null);

  useEffect(() => {
    const loadMemories = async () => {
      try {
        const memoryData = [
        {
          id: 1,
          title: "Kanpe The Whole Night 💃",
          description: "Dancing the night away together",
          image: kanpeWholeNight,
          color: "#ff6b9d"
        },
        {
          id: 2,
          title: "Our Apartment 🏠",
          description: "The place we call home, filled with love and laughter",
          image: apartment,
          color: "#f8b500"
        },
        {
          id: 3,
          title: "Beach Trip 🏖️",
          description: "Sun, sand, and unforgettable memories by the ocean",
          image: beachTrip,
          color: "#c44569"
        },
        {
          id: 4,
          title: "Birthday Trip 🎂",
          description: "Celebrating another year of life and love together",
          image: birthdayTrip,
          color: "#fa983a"
        },
        {
          id: 5,
          title: "Escape Room 🔍",
          description: "Solving puzzles and mysteries together",
          image: escaperoom,
          color: "#9c88ff"
        },
        {
          id: 6,
          title: "First Trip Panama 🌴",
          description: "Our first adventure together in Panama",
          image: firstTripPanama,
          color: "#eb2f06"
        },
        {
          id: 7,
          title: "Jacksonville Lock 🔒",
          description: "A special moment by the locks in Jacksonville",
          image: jacksonvilleLock,
          color: "#2ed573"
        },
        {
          id: 8,
          title: "Jacksonville 🌊",
          description: "Exploring the beautiful city of Jacksonville, (I've only been here once)😉",
          image: jacksonville,
          color: "#833471"
        },
        {
          id: 9,
          title: "Konmpa and Line Dancing at ARJ's 🕺",
          description: "Learning new dance moves and having fun at ARJ's",
          image: konmpaLineDancing,
          color: "#fd79a8"
        },
        {
          id: 10,
          title: "My Room 🛏️",
          description: "Cozy moments in our personal space",
          image: myroom,
          color: "#ffa502"
        },
        {
          id: 11,
          title: "Painting Park 🎨",
          description: "A beautiful moment captured in the park",
          image: paintingPark,
          color: "#00c3ffff"
        },
        {
          id: 12,
          title: "Panama Wine Tasting 🍷",
          description: "Savoring fine wines and each other's company",
          image: panamaWineTasting,
          color: "#a55eea"
        },
        {
          id: 13,
          title: "When I Asked You To Be My Girlfriend 💖",
          description: "The moment that changed everything - when I asked you to be mine",
          image: askedGirlfriend,
          color: "#e74c3c"
        }
      ];

        const memoriesWithMetadata = await Promise.all(
          memoryData.map(async (memory) => {
            try {
              const metadata = await extractMetadata(memory.image);
              return {
                ...memory,
                date: metadata?.date || 'Date Unknown',
                city: metadata?.city || 'Location Unknown',
                location: metadata?.location || { 
                  lat: 25 + (memory.id * 5), 
                  lng: -120 + (memory.id * 10) 
                }
              };
            } catch (error) {
              console.error(`Failed to extract metadata for ${memory.title}:`, error);
              return {
                ...memory,
                date: 'Date Unknown',
                city: 'Location Unknown',
                location: { 
                  lat: 25 + (memory.id * 5), 
                  lng: -120 + (memory.id * 10) 
                }
              };
            }
          })
        );

        // Sort memories chronologically based on extracted dates
        const sortedMemories = memoriesWithMetadata.sort((a, b) => {
          if (a.date === 'Date Unknown' && b.date === 'Date Unknown') return 0;
          if (a.date === 'Date Unknown') return 1;
          if (b.date === 'Date Unknown') return -1;
          
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });
        
        // Reassign IDs based on chronological order
        const reorderedMemories = sortedMemories.map((memory, index) => ({
          ...memory,
          id: index + 1
        }));
        
        setMemories(reorderedMemories);
      } catch (error) {
        console.error('Failed to load memories:', error);
        setMemories([]);
      }
    };

    loadMemories();
  }, []);

  useEffect(() => {
    if (memories.length > 0 && completedMemories.length === memories.length) {
      setShowTransition(true);
    }
  }, [completedMemories, memories.length]);

  const handleContinueToFinal = () => {
    setShowTransition(false);
    setShowFinalMessage(true);
  };

  const handleMemoryView = (memory) => {
    if (!memory || !memory.id) {
      console.error('Invalid memory object provided');
      return;
    }
    
    setSelectedMemory(memory);
    if (!completedMemories.includes(memory.id)) {
      const newCompleted = [...completedMemories, memory.id];
      setCompletedMemories(newCompleted);
    }
  };

  const handleStartJourney = () => {
    setCurrentView('map');
  };

  const handleRestart = () => {
    try {
      window.location.reload();
    } catch (error) {
      console.error('Failed to reload page:', error);
      // Fallback: reset state manually
      setCurrentView('welcome');
      setSelectedMemory(null);
      setCompletedMemories([]);
      setShowFinalMessage(false);
      setShowTransition(false);
    }
  };

  return (
    <div className="App">
      <ApiKeyTest />
      <MusicPlayer />

      
      <AnimatePresence mode="wait">
        {currentView === 'welcome' && !showFinalMessage && (
          <WelcomeScreen key="welcome" onStart={handleStartJourney} />
        )}

        {currentView === 'map' && !showFinalMessage && !showTransition && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="main-content"
          >
            <MapView 
              key={mapKey}
              memories={memories}
              selectedMemory={selectedMemory}
              onMemorySelect={handleMemoryView}
              completedMemories={completedMemories}
            />
            <MemoryTimeline
              memories={memories}
              selectedMemory={selectedMemory}
              onMemorySelect={handleMemoryView}
              completedMemories={completedMemories}
            />
          </motion.div>
        )}

        {showTransition && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="transition-screen"
          >
            <div className="transition-content">
              <h2>🎂 Birthday Memory Journey Complete!</h2>
              <p>You've discovered all our precious memories celebrating our beautiful journey together!</p>
              
              <div className="memories-grid">
                {memories.map((memory) => (
                  <div 
                    key={memory.id} 
                    className="memory-card-small" 
                    style={{ borderColor: memory.color, cursor: 'pointer' }}
                    onClick={() => {
                      if (memory && memory.id) {
                        setTransitionSelectedMemory(memory);
                        setShowTransitionMemoryCard(true);
                      }
                    }}
                  >
                    <img src={memory.image} alt={memory.title} />
                    <div className="memory-info">
                      <h4>{memory.title}</h4>
                      <p>{memory.city}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="continue-button"
                onClick={handleContinueToFinal}
              >
                Continue to Birthday Message 🎉✨
              </button>
            </div>
            
            {/* Large Memory Card Popup */}
            <AnimatePresence>
              {showTransitionMemoryCard && transitionSelectedMemory && (
                <motion.div
                  className="memory-card-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowTransitionMemoryCard(false)}
                >
                  <motion.div
                    className="memory-card"
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 50 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ borderTopColor: transitionSelectedMemory.color }}
                  >
                    <button className="close-button" onClick={() => setShowTransitionMemoryCard(false)}>
                      ✕
                    </button>

                    <div className="memory-card-image">
                      <img src={transitionSelectedMemory.image} alt={transitionSelectedMemory.title} />
                      <div className="image-overlay" style={{ background: `linear-gradient(to bottom, transparent, ${transitionSelectedMemory.color}50)` }} />
                    </div>

                    <div className="memory-card-content">
                      <h2 className="memory-title">{transitionSelectedMemory.title}</h2>
                      
                      <div className="memory-meta">
                        <div className="meta-item">
                          <span>📅 {transitionSelectedMemory.date}</span>
                        </div>
                        <div className="meta-item">
                          <span>📍 {transitionSelectedMemory.city}</span>
                        </div>
                      </div>

                      <p className="memory-description">{transitionSelectedMemory.description}</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {showFinalMessage && (
          <FinalMessage key="final" onRestart={handleRestart} />
        )}
      </AnimatePresence>

      {/* Floating hearts animation */}
      <div className="floating-hearts">
        {[...Array(10)].map((_, i) => {
          const initialX = (i * 123 + 456) % window.innerWidth;
          const animateX = ((i * 789 + 321) % window.innerWidth);
          const duration = 8 + (i % 4);
          
          return (
            <motion.div
              key={i}
              className="heart-particle"
              initial={{ 
                x: initialX,
                y: window.innerHeight + 50,
                opacity: 0 
              }}
              animate={{
                y: -100,
                opacity: [0, 1, 1, 0],
                x: animateX
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeOut"
              }}
            >
              <Heart size={20} fill="#ff6b9d" color="#ff6b9d" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
