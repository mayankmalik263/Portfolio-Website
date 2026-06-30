const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const PUBLIC = path.join(__dirname, "..", "public");

async function optimizeImage(inputPath, outputPath, options = {}) {
  const { width, height, quality = 80, format = "jpeg" } = options;
  let pipeline = sharp(inputPath);

  if (width || height) {
    pipeline = pipeline.resize(width, height, { fit: "cover" });
  }

  if (format === "jpeg") {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  } else if (format === "png") {
    pipeline = pipeline.png({ quality, compressionLevel: 9 });
  } else if (format === "webp") {
    pipeline = pipeline.webp({ quality });
  }

  await pipeline.toFile(outputPath);
  const origSize = fs.statSync(inputPath).size;
  const newSize = fs.statSync(outputPath).size;
  console.log(
    `  ${path.basename(inputPath)} -> ${path.basename(outputPath)}: ` +
      `${(origSize / 1024).toFixed(0)}KB -> ${(newSize / 1024).toFixed(0)}KB ` +
      `(${((1 - newSize / origSize) * 100).toFixed(0)}% smaller)`,
  );
}

async function makeRoundedIcon(inputPath, outputPath, size, borderRadius) {
  const roundedSvg = Buffer.from(
    `<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${borderRadius}" ry="${borderRadius}" /></svg>`,
  );
  await sharp(inputPath)
    .resize(size, size)
    .composite([{ input: roundedSvg, blend: "dest-in" }])
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
  const newSize = fs.statSync(outputPath).size;
  console.log(
    `  ${path.basename(outputPath)}: ${(newSize / 1024).toFixed(0)}KB`,
  );
}

async function run() {
  console.log("\n🖼️  Optimizing portrait photos...");
  const portraits = [
    { file: "me-1.png", out: "me-1.webp" },
    { file: "me-2.jpeg", out: "me-2.webp" },
    { file: "me-3.jpeg", out: "me-3.webp" },
    { file: "me-4.jpeg", out: "me-4.webp" },
  ];
  for (const p of portraits) {
    await optimizeImage(
      path.join(PUBLIC, "img", p.file),
      path.join(PUBLIC, "img", p.out),
      { width: 400, height: 533, quality: 75, format: "webp" },
    );
  }

  console.log("\n🎨 Generating optimized favicon/icons...");
  const logoSrc = path.join(PUBLIC, "m-logo-square.png");

  // favicon.ico replacement — small PNG with rounded corners
  await makeRoundedIcon(logoSrc, path.join(PUBLIC, "favicon.png"), 48, 8);

  // icon-192 with rounded corners
  await makeRoundedIcon(logoSrc, path.join(PUBLIC, "icon-192.png"), 192, 32);

  // icon-512 with rounded corners
  await makeRoundedIcon(logoSrc, path.join(PUBLIC, "icon-512.png"), 512, 80);

  // apple-touch-icon (Apple does its own rounding, so keep square)
  await sharp(logoSrc)
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "apple-touch-icon.png"));
  console.log(
    `  apple-touch-icon.png: ${(fs.statSync(path.join(PUBLIC, "apple-touch-icon.png")).size / 1024).toFixed(0)}KB`,
  );

  console.log("\n✅ Done! All images optimized.");
}

run().catch(console.error);
