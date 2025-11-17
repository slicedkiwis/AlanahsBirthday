const fs = require('fs');
const path = require('path');
const exifr = require('exifr');

async function extractAllMetadata() {
  const resDir = './src/res';
  const files = fs.readdirSync(resDir).filter(file => file.endsWith('.jpeg'));
  
  const metadata = {};
  
  for (const file of files) {
    try {
      const filePath = path.join(resDir, file);
      const data = await exifr.parse(filePath, { gps: true, tiff: true, exif: true });
      
      if (data) {
        const result = {};
        
        // Extract location
        const latitude = Number(data?.latitude);
        const longitude = Number(data?.longitude);
        
        if (!isNaN(latitude) && !isNaN(longitude) && 
            latitude >= -90 && latitude <= 90 && 
            longitude >= -180 && longitude <= 180) {
          result.location = { lat: latitude, lng: longitude };
        }
        
        // Extract date
        const dateTime = data?.DateTimeOriginal || data?.DateTime || data?.CreateDate;
        if (dateTime) {
          result.date = new Date(dateTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
        
        metadata[file] = result;
        console.log(`${file}:`, result);
      } else {
        console.log(`${file}: No metadata found`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  console.log('\nFinal metadata object:');
  console.log(JSON.stringify(metadata, null, 2));
}

extractAllMetadata();