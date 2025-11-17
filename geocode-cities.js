const https = require('https');

const coordinates = {
  '4Kanpe-the-whole-night.jpeg': { lat: 30.842744444444442, lng: -83.28402777777778 },
  'Apartment.jpeg': { lat: 37.20643888888889, lng: -80.39548611111111 },
  'Beach-trip.jpeg': { lat: 30.180633333333333, lng: -85.81552222222221 },
  'Birthday-trip.jpeg': { lat: 27.993380555555557, lng: -82.37041388888888 },
  'escaperoom.jpeg': { lat: 30.866255555555558, lng: -83.28556944444445 },
  'First-trip-panama.jpeg': { lat: 30.209197222222222, lng: -85.62031666666665 },
  'jacksonville-lock.jpeg': { lat: 30.323533333333334, lng: -81.66711388888889 },
  'Jacksonville.jpeg': { lat: 30.436977777777777, lng: -81.72753888888889 },
  'konmpa-and-line-dancing-at-ARJs.jpeg': { lat: 30.842744444444442, lng: -83.28409444444445 },
  'myroom.jpeg': { lat: 30.928066666666666, lng: -83.32229722222222 },
  'Painting-park.jpeg': { lat: 30.91326388888889, lng: -83.24971111111111 },
  'Panama-wine-tasting.jpeg': { lat: 30.187997222222222, lng: -85.7803888888889 },
  'when-i-asked-you-to-be-my-girlfriend.jpeg': { lat: 30.91326388888889, lng: -83.24968611111112 }
};

async function getCityName(lat, lng) {
  return new Promise((resolve, reject) => {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const city = result.city || result.locality || result.principalSubdivision || 'Unknown';
          const state = result.principalSubdivision || '';
          const country = result.countryName || '';
          resolve(`${city}${state ? ', ' + state : ''}${country && country !== 'United States' ? ', ' + country : ''}`);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function geocodeAll() {
  console.log('Reverse geocoding coordinates to city names...\n');
  
  for (const [filename, coords] of Object.entries(coordinates)) {
    try {
      const city = await getCityName(coords.lat, coords.lng);
      console.log(`${filename}: ${city}`);
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.log(`${filename}: Error - ${error.message}`);
    }
  }
}

geocodeAll();