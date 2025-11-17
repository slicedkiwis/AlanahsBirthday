// Manual lookup based on coordinates
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

function getCityFromCoordinates(lat, lng) {
  // Valdosta, GA area: ~30.83, -83.28
  if (lat > 30.8 && lat < 31.0 && lng > -83.4 && lng < -83.2) {
    return 'Valdosta, GA';
  }
  
  // Blacksburg, VA area: ~37.2, -80.4
  if (lat > 37.0 && lat < 37.4 && lng > -80.6 && lng < -80.2) {
    return 'Blacksburg, VA';
  }
  
  // Panama City Beach, FL area: ~30.18, -85.8
  if (lat > 30.0 && lat < 30.3 && lng > -86.0 && lng < -85.5) {
    return 'Panama City Beach, FL';
  }
  
  // Tampa, FL area: ~27.99, -82.37
  if (lat > 27.8 && lat < 28.2 && lng > -82.6 && lng < -82.2) {
    return 'Tampa, FL';
  }
  
  // Jacksonville, FL area: ~30.3-30.4, -81.6-81.7
  if (lat > 30.2 && lat < 30.5 && lng > -81.8 && lng < -81.5) {
    return 'Jacksonville, FL';
  }
  
  // Tallahassee, FL area: ~30.4, -84.3
  if (lat > 30.3 && lat < 30.6 && lng > -84.5 && lng < -84.0) {
    return 'Tallahassee, FL';
  }
  
  return 'Unknown Location';
}

console.log('City mapping based on coordinates:\n');

for (const [filename, coords] of Object.entries(coordinates)) {
  const city = getCityFromCoordinates(coords.lat, coords.lng);
  console.log(`${filename}: ${city} (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
}

console.log('\nFormatted for code:');
for (const [filename, coords] of Object.entries(coordinates)) {
  const city = getCityFromCoordinates(coords.lat, coords.lng);
  console.log(`'${filename}': { location: { lat: ${coords.lat}, lng: ${coords.lng} }, city: '${city}' },`);
}