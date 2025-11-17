import React from 'react';

function ApiKeyTest() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
  return (
    <div style={{ position: 'fixed', top: 10, right: 10, background: 'white', padding: '10px', border: '1px solid black', zIndex: 9999 }}>
      <h4>Debug Info:</h4>
      <p>API Key: {apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND'}</p>
      <p>Length: {apiKey ? apiKey.length : 0}</p>
    </div>
  );
}

export default ApiKeyTest;