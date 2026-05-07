const sharp = require('sharp');
const fs = require('fs');

async function roundCorners(inputPath) {
  const output = inputPath + '.tmp.png';
  const width = 512;
  const height = 512;
  const rx = 80; // border radius (curved corners)
  
  const rectSvg = Buffer.from(
    `<svg><rect x="0" y="0" width="${width}" height="${height}" rx="${rx}" ry="${rx}" /></svg>`
  );

  await sharp(inputPath)
    .resize(width, height)
    .composite([{
      input: rectSvg,
      blend: 'dest-in'
    }])
    .png()
    .toFile(output);
    
  fs.renameSync(output, inputPath);
}

async function run() {
  try {
    await roundCorners('src/app/icon.png');
    await roundCorners('src/app/apple-icon.png');
    console.log("Successfully rounded corners of icons.");
  } catch (error) {
    console.error("Error rounding corners:", error);
  }
}

run();
