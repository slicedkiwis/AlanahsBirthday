import React, { useState } from 'react';

function ApiKeyTest() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [musicTest, setMusicTest] = useState('Not tested');
  const [imageTest, setImageTest] = useState('Not tested');
  
  const testMusic = () => {
    fetch('/chopin-nocturne-op9-no2.mp3')
      .then(response => setMusicTest(response.ok ? 'Found' : 'Not found'))
      .catch(() => setMusicTest('Error'));
  };
  
  const testImage = () => {
    fetch('/images/Apartment.jpeg')
      .then(response => setImageTest(response.ok ? 'Found' : 'Not found'))
      .catch(() => setImageTest('Error'));
  };
  
  return (
    <div style={{ position: 'fixed', top: 10, right: 10, background: 'white', padding: '10px', border: '1px solid black', zIndex: 9999 }}>
      <h4>Debug Info:</h4>
      <p>API Key: {apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND'}</p>
      <p>Length: {apiKey ? apiKey.length : 0}</p>
      <button onClick={testMusic}>Test Music</button> <span>{musicTest}</span><br/>
      <button onClick={testImage}>Test Image</button> <span>{imageTest}</span>
    </div>
  );
}

export default ApiKeyTest;