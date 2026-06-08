const Jimp = require('jimp');
const path = require('path');

async function cropFavicon() {
  try {
    const faviconPath = path.join(__dirname, '../client/public/favicon.png');
    const image = await Jimp.read(faviconPath);
    
    // Autocrop with 15% tolerance to ignore slight anti-aliasing or faint backgrounds
    image.autocrop(0.15, false);
    
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    console.log('New dimensions after aggressive crop:', width, 'x', height);
    
    const size = Math.max(width, height);
    
    new Jimp(size, size, 0x00000000, (err, squareImage) => {
      if (err) throw err;
      
      const x = Math.floor((size - width) / 2);
      const y = Math.floor((size - height) / 2);
      
      squareImage.composite(image, x, y);
      
      // Save as a completely new filename to guarantee the browser updates it
      const newPath = path.join(__dirname, '../client/public/favicon_large.png');
      squareImage.write(newPath, () => {
        console.log('Successfully aggressively cropped and saved as favicon_large.png!');
      });
    });
    
  } catch (err) {
    console.error('Error processing favicon:', err);
  }
}

cropFavicon();
