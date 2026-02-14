// vite-plugin-sharp.js
import fs from "fs";
import path from "path";
import sharp from "sharp";

export default function sharpOptimizer(options = {}) {
  const {
    inputDir = "src/assets", // your current image folder
    outputDir = "public/optimized", // optimized images will be placed here
    formats = ["webp", "jpeg"], // formats to generate
    quality = 80,
  } = options;

  return {
    name: "vite-plugin-sharp",
    apply: "build",
    async buildStart() {
      const files = fs.readdirSync(inputDir);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if ([".jpg", ".jpeg", ".png"].includes(ext)) {
          const inputPath = path.join(inputDir, file);

          for (const format of formats) {
            const outputPath = path.join(
              outputDir,
              `${path.basename(file, ext)}.${format}`
            );

            await sharp(inputPath)
              .toFormat(format, { quality })
              .toFile(outputPath);

            console.log(`Optimized: ${outputPath}`);
          }
        }
      }
    },
  };
}
