import * as exifr from "exifr";

async function getCityFromCoordinates(lat, lng) {
  try {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    const data = await response.json();
    return data.city || data.locality || data.principalSubdivision || 'Unknown Location';
  } catch (error) {
    console.error('Error getting city from coordinates:', error);
    return 'Unknown Location';
  }
}

export async function extractMetadata(picture) {
  if (!picture) {
    console.warn('No picture provided to extractMetadata');
    return null;
  }
  
  try {
    const metadata = await exifr.parse(picture, { gps: true, tiff: true, exif: true });
    
    if (!metadata) {
      return null;
    }
    
    const result = {};
    
    // Extract location
    const latitude = Number(metadata?.latitude);
    const longitude = Number(metadata?.longitude);
    
    if (!isNaN(latitude) && !isNaN(longitude) && 
        latitude >= -90 && latitude <= 90 && 
        longitude >= -180 && longitude <= 180) {
      result.location = { lat: latitude, lng: longitude };
      result.city = await getCityFromCoordinates(latitude, longitude);
    }
    
    // Extract date
    const dateTime = metadata?.DateTimeOriginal || metadata?.DateTime || metadata?.CreateDate;
    if (dateTime) {
      result.date = new Date(dateTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    return Object.keys(result).length > 0 ? result : null;
  } catch (error) {
    console.error('Error extracting EXIF data from picture:', error);
    return null;
  }
}

// Keep backward compatibility
export async function extractLocationData(picture) {
  const metadata = await extractMetadata(picture);
  return metadata?.location || null;
}