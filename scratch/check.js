const Jimp = require('jimp');
const path = require('path');

async function check() {
  const faviconPath = path.join(__dirname, '../client/public/favicon.png');
  const image = await Jimp.read(faviconPath);
  console.log('Current dimensions:', image.bitmap.width, 'x', image.bitmap.height);
}

check();
