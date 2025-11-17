import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';

import './MemoryTimeline.css';

function MemoryTimeline({ memories, selectedMemory, onMemorySelect, completedMemories }) {
  const isMemoryCompleted = (memoryId) => completedMemories.includes(memoryId);

  return (
    <div className="memory-timeline">
      <div className="timeline-header">
        <h3>Our Journey</h3>
        <p className="timeline-subtitle">{completedMemories.length} / {memories.length} explored</p>
      </div>

      <div className="timeline-items">
        {memories.map((memory, index) => {
          if (!memory || !memory.id) {
            console.warn('Invalid memory object in timeline:', memory);
            return null;
          }
          
          const isCompleted = isMemoryCompleted(memory.id);
          const isSelected = selectedMemory?.id === memory.id;
          
          return (
            <motion.div
              key={memory.id}
              className={`timeline-item ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : 'locked'}`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                if (typeof onMemorySelect === 'function') {
                  onMemorySelect(memory);
                } else {
                  console.error('onMemorySelect is not a function');
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="timeline-connector">
                <div 
                  className="timeline-dot"
                  style={{ 
                    backgroundColor: isCompleted ? memory.color : '#ccc',
                    boxShadow: isCompleted ? `0 0 20px ${memory.color}50` : 'none'
                  }}
                >
                  {isCompleted ? (
                    <Check size={16} color="white" />
                  ) : (
                    <Lock size={16} color="white" />
                  )}
                </div>
                {index < memories.length - 1 && (
                  <div className={`timeline-line ${isCompleted ? 'completed-line' : ''}`} />
                )}
              </div>

              <div className="timeline-content">
                <div className="timeline-thumbnail">
                  <img 
                    src={memory.image} 
                    alt={memory.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      opacity: isCompleted ? 1 : 0.3,
                      filter: isCompleted ? 'none' : 'grayscale(100%)'
                    }}
                    onError={(e) => {
                      console.log('Image failed to load:', memory.image);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                
                <div className="timeline-info">
                  <h4 className="timeline-title">{memory.title}</h4>
                  <p className="timeline-date">{memory.date}</p>
                  {isCompleted && (
                    <motion.div
                      className="completion-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ backgroundColor: memory.color }}
                    >
                      Discovered ✨
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {completedMemories.length === memories.length && (
        <motion.div
          className="completion-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p>🎉 All memories discovered!</p>
          <p className="sub-message">Preparing something special...</p>
        </motion.div>
      )}
    </div>
  );
}

export default MemoryTimeline;
