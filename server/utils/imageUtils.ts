import fs from 'fs/promises';
import path from 'path';
import sharp, { SharpInput } from 'sharp';

export async function optimizeAndSaveImages(
  input: SharpInput | SharpInput[],
  options: {
    width?: number;
    quality?: number;
    uploadDir?: string;
  } = {},
) {
  const config = { width: 1200, quality: 80, uploadDir: 'temp', ...options };
  const uploadDir = path.join(
    process.cwd(),
    'public',
    'uploads',
    config.uploadDir,
  );

  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${Math.floor(Math.random() * 1e6)}.webp`;

  await sharp(input)
    .rotate()
    .resize({ width: config.width, withoutEnlargement: true })
    .webp({ quality: config.quality })
    .toFile(path.join(uploadDir, filename));

  return `/uploads/${config.uploadDir}/${filename}`;
}
