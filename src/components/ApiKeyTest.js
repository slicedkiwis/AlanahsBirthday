import React, { useState } from 'react';

function ApiKeyTest() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [musicTest, setMusicTest] = useState('Not tested');
  const [imageTest, setImageTest] = useState('Not tested');
  const [showTestImage, setShowTestImage] = useState(false);
  
  const testMusic = () => {
    const audio = new Audio('/chopin-nocturne-op9-no2.mp3');
    audio.addEventListener('loadstart', () => setMusicTest('Loading...'));
    audio.addEventListener('canplay', () => setMusicTest('Can play'));
    audio.addEventListener('error', (e) => setMusicTest(`Error: ${e.message}`));
    audio.load();
  };
  
  const testImage = () => {
    const img = new Image();
    img.onload = () => {
      setImageTest('Loaded');
      setShowTestImage(true);
    };
    img.onerror = () => setImageTest('Failed to load');
    img.src = '/images/Apartment.jpeg';
  };
  
  return (
    <div style={{ position: 'fixed', top: 10, right: 10, background: 'white', padding: '10px', border: '1px solid black', zIndex: 9999, maxWidth: '300px' }}>
      <h4>Debug Info:</h4>
      <p>API Key: {apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND'}</p>
      <button onClick={testMusic}>Test Music</button> <span>{musicTest}</span><br/>
      <button onClick={testImage}>Test Image</button> <span>{imageTest}</span><br/>
      {showTestImage && <img src="/images/Apartment.jpeg" alt="test" style={{width: '100px', height: '60px', objectFit: 'cover'}} />}
    </div>
  );
}

export default ApiKeyTest;