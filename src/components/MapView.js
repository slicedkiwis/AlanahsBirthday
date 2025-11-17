import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar } from 'lucide-react';

import './MapView.css';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 30.4518, lng: -84.27277
};

const HIDDEN_LANDSCAPE_FEATURES = [
  'landscape.natural',
  'poi.park', 
  'landscape.natural.landcover',
  'landscape.natural.terrain'
];

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: HIDDEN_LANDSCAPE_FEATURES.map(featureType => ({
    featureType,
    stylers: [{ visibility: 'off' }]
  }))
};

function MapView({ memories, selectedMemory, onMemorySelect, completedMemories }) {
  const [activeMarker, setActiveMarker] = useState(null);
  const [showMemoryCard, setShowMemoryCard] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapError, setMapError] = useState(false);
  const markersCreatedRef = useRef(false);
  const onMemorySelectRef = useRef(onMemorySelect);

  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  console.log('API Key loaded:', GOOGLE_MAPS_API_KEY ? 'Yes' : 'No');

  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key is missing. Please add REACT_APP_GOOGLE_MAPS_API_KEY to your .env.local file');
  }

  // Keep ref updated
  useEffect(() => {
    onMemorySelectRef.current = onMemorySelect;
  }, [onMemorySelect]);

  const handleMarkerClick = useCallback((memory) => {
    if (!memory || !memory.id) {
      console.error('Invalid memory object in marker click');
      return;
    }
    
    try {
      setActiveMarker(memory.id);
      setShowMemoryCard(true);
      onMemorySelectRef.current(memory);
      
      // Center map on clicked marker
      if (map && memory.location) {
        map.panTo(memory.location);
        map.setZoom(12);
      }
    } catch (error) {
      console.error('Error handling marker click:', error);
    }
  }, [map]);

  const handleCloseCard = () => {
    setShowMemoryCard(false);
    setActiveMarker(null);
  };

  // Update marker colors when completedMemories changes
  useEffect(() => {
    if (markers.length === 0 || memories.length === 0) return;
    
    try {
      markers.forEach((marker, index) => {
        const memory = memories[index];
        if (!memory || !marker || !marker.setIcon) return;
        
        const isCompleted = completedMemories.includes(memory.id);
        const lighterColor = isCompleted ? memory.color + '80' : '#cccccc';
        
        const updatedIcon = {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="50" height="60" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 0C11.2 0 0 11.2 0 25c0 18.75 25 35 25 35s25-16.25 25-35C50 11.2 38.8 0 25 0zm0 35c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="${lighterColor}" stroke="white" stroke-width="3"/>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(50, 60),
          anchor: new window.google.maps.Point(25, 60)
        };
        marker.setIcon(updatedIcon);
      });
    } catch (error) {
      console.error('Error updating marker colors:', error);
    }
  }, [completedMemories, markers, memories]);

  // Update marker color when selectedMemory changes from timeline
  useEffect(() => {
    if (selectedMemory && markers.length > 0) {
      const markerIndex = memories.findIndex(m => m.id === selectedMemory.id);
      if (markerIndex !== -1 && markers[markerIndex]) {
        const updatedIcon = {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="50" height="60" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 0C11.2 0 0 11.2 0 25c0 18.75 25 35 25 35s25-16.25 25-35C50 11.2 38.8 0 25 0zm0 35c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="${selectedMemory.color + '80'}" stroke="white" stroke-width="3"/>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(50, 60),
          anchor: new window.google.maps.Point(25, 60)
        };
        markers[markerIndex].setIcon(updatedIcon);
      }
    }
  }, [selectedMemory, markers, memories]);

  // Clean up markers when component unmounts
  useEffect(() => {
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [markers]);

  if (mapError) {
    return (
      <div className="map-view map-error">
        <div className="error-message">
          <h3>Map temporarily unavailable</h3>
          <p>Please check your internet connection and refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-view">
      {memories.length > 0 && GOOGLE_MAPS_API_KEY ? (
        <LoadScript 
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          onError={(error) => {
            console.log('Google Maps API failed to load:', error);
            setMapError(true);
          }}
          onLoad={() => {
            console.log('Google Maps API loaded successfully');
          }}
          loadingElement={<div className="loading-container">Loading map...</div>}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={memories.length > 0 && memories[0].location ? memories[0].location : { lat: 39.8283, lng: -98.5795 }}
            zoom={4}
            options={mapOptions}
            onLoad={(mapInstance) => {
              if (!window.google || !window.google.maps) {
                console.error('Google Maps API not loaded properly');
                return;
              }
              
              setMap(mapInstance);
              
              // Clear existing markers first
              markers.forEach(marker => marker.setMap(null));
              
              // Create markers with color change functionality
              const newMarkers = memories.map((memory) => {
                const isCompleted = completedMemories.includes(memory.id);
                const lighterColor = isCompleted ? memory.color + '80' : '#cccccc';
                
                // Create custom marker icon
                const markerIcon = {
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                    <svg width="50" height="60" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25 0C11.2 0 0 11.2 0 25c0 18.75 25 35 25 35s25-16.25 25-35C50 11.2 38.8 0 25 0zm0 35c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="${lighterColor}" stroke="white" stroke-width="3"/>
                    </svg>
                  `)}`,
                  scaledSize: new window.google.maps.Size(50, 60),
                  anchor: new window.google.maps.Point(25, 60)
                };
                
                // Create marker with error handling
                let marker;
                try {
                  marker = new window.google.maps.Marker({
                    position: memory.location,
                    map: mapInstance,
                    title: memory.title,
                    icon: markerIcon,
                    optimized: false
                  });
                } catch (error) {
                  console.error('Error creating marker:', error);
                  return null;
                }
                
                marker.addListener('click', () => {
                  console.log('Google Maps marker clicked:', memory.title);
                  handleMarkerClick(memory);
                  
                  // Update marker color after click
                  const updatedIcon = {
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                      <svg width="50" height="60" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 0C11.2 0 0 11.2 0 25c0 18.75 25 35 25 35s25-16.25 25-35C50 11.2 38.8 0 25 0zm0 35c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="${memory.color + '80'}" stroke="white" stroke-width="3"/>
                      </svg>
                    `)}`,
                    scaledSize: new window.google.maps.Size(50, 60),
                    anchor: new window.google.maps.Point(25, 60)
                  };
                  marker.setIcon(updatedIcon);
                });
                
                return marker;
              }).filter(marker => marker !== null);
              
              setMarkers(newMarkers);
            }}
          />
        </LoadScript>
      ) : !GOOGLE_MAPS_API_KEY ? (
        <div className="map-error">
          <div className="error-message">
            <h3>Google Maps API Key Missing</h3>
            <p>Please add your API key to continue.</p>
          </div>
        </div>
      ) : (
        <div className="loading-container">
          Loading memories...
        </div>
      )}
      


      {/* Memory Card Popup */}
      <AnimatePresence>
        {showMemoryCard && selectedMemory && (
          <motion.div
            className="memory-card-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseCard}
          >
            <motion.div
              className="memory-card"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{ '--border-color': selectedMemory.color }}
            >
              <button className="close-button" onClick={handleCloseCard}>
                <X size={24} />
              </button>

              <div className="memory-card-image">
                <img src={selectedMemory.image} alt={selectedMemory.title} />
                <div className="image-overlay" style={{ background: `linear-gradient(to bottom, transparent, ${selectedMemory.color}50)` }} />
              </div>

              <div className="memory-card-content">
                <h2 className="memory-title">{selectedMemory.title}</h2>
                
                <div className="memory-meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{selectedMemory.date}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{selectedMemory.city}</span>
                  </div>
                </div>

                <p className="memory-description">{selectedMemory.description}</p>

                <div className="memory-card-footer">
                  <motion.div
                    className="progress-indicator"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedMemories.length / memories.length) * 100}%` }}
                    style={{ backgroundColor: selectedMemory.color }}
                  />
                  <span className="progress-text">
                    {completedMemories.length} of {memories.length} memories explored
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MapView;
