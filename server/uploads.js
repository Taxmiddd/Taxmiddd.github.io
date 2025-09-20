import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage paths
const SECURE_STORAGE = path.join(__dirname, 'storage/secure');
const THUMBNAILS_DIR = path.join(__dirname, '../public/thumbnails');

// Ensure directories exist
await fs.mkdir(SECURE_STORAGE, { recursive: true });
await fs.mkdir(THUMBNAILS_DIR, { recursive: true });

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store original files in secure directory
    cb(null, SECURE_STORAGE);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    document: ['application/pdf']
  };
  
  const allAllowedTypes = [...allowedTypes.image, ...allowedTypes.video, ...allowedTypes.document];
  
  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

// Multer upload configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

/**
 * Generate watermarked thumbnail for images
 * @param {string} inputPath - Path to original image
 * @param {string} outputPath - Path for thumbnail
 * @param {Object} options - Thumbnail options
 */
export async function generateThumbnail(inputPath, outputPath, options = {}) {
  const {
    width = 800,
    height = 600,
    quality = 80,
    watermarkText = '© Portfolio Preview'
  } = options;

  try {
    // Create watermark SVG
    const watermarkSvg = `
      <svg width="${width}" height="${height}">
        <defs>
          <pattern id="watermark" patternUnits="userSpaceOnUse" width="200" height="100" patternTransform="rotate(45)">
            <text x="0" y="20" font-family="Arial" font-size="14" fill="rgba(255,255,255,0.3)" font-weight="bold">
              ${watermarkText}
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#watermark)"/>
      </svg>
    `;

    await sharp(inputPath)
      .resize(width, height, { fit: 'inside', withoutEnlargement: true })
      .composite([{
        input: Buffer.from(watermarkSvg),
        blend: 'over'
      }])
      .jpeg({ quality })
      .toFile(outputPath);

    return true;
  } catch (error) {
    console.error('Thumbnail generation failed:', error);
    return false;
  }
}

/**
 * Generate video thumbnail
 * @param {string} inputPath - Path to original video
 * @param {string} outputPath - Path for thumbnail
 */
export async function generateVideoThumbnail(inputPath, outputPath) {
  try {
    // For video thumbnails, we'll create a placeholder image
    // In production, you might want to use ffmpeg to extract actual frames
    const placeholderSvg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <circle cx="400" cy="300" r="60" fill="#6b7280"/>
        <polygon points="380,270 380,330 420,300" fill="white"/>
        <text x="400" y="380" text-anchor="middle" font-family="Arial" font-size="16" fill="#374151">
          Video Preview
        </text>
        <text x="400" y="420" text-anchor="middle" font-family="Arial" font-size="12" fill="#9ca3af">
          © Portfolio Preview
        </text>
      </svg>
    `;

    await sharp(Buffer.from(placeholderSvg))
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    return true;
  } catch (error) {
    console.error('Video thumbnail generation failed:', error);
    return false;
  }
}

/**
 * Process uploaded file and generate thumbnail
 * @param {Object} file - Multer file object
 * @returns {Object} File information with thumbnail path
 */
export async function processUploadedFile(file) {
  try {
    const fileInfo = {
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      thumbnailPath: null
    };

    // Generate thumbnail for images and videos
    if (file.mimetype.startsWith('image/')) {
      const thumbnailPath = path.join(THUMBNAILS_DIR, `thumb_${file.filename}.jpg`);
      const success = await generateThumbnail(file.path, thumbnailPath);
      if (success) {
        fileInfo.thumbnailPath = `/thumbnails/thumb_${file.filename}.jpg`;
      }
    } else if (file.mimetype.startsWith('video/')) {
      const thumbnailPath = path.join(THUMBNAILS_DIR, `thumb_${file.filename}.jpg`);
      const success = await generateVideoThumbnail(file.path, thumbnailPath);
      if (success) {
        fileInfo.thumbnailPath = `/thumbnails/thumb_${file.filename}.jpg`;
      }
    }

    return fileInfo;
  } catch (error) {
    console.error('File processing failed:', error);
    throw error;
  }
}

/**
 * Delete uploaded file and its thumbnail
 * @param {string} filename - File to delete
 */
export async function deleteUploadedFile(filename) {
  try {
    // Delete original file
    const originalPath = path.join(SECURE_STORAGE, filename);
    await fs.unlink(originalPath).catch(() => {}); // Ignore if file doesn't exist

    // Delete thumbnail
    const thumbnailPath = path.join(THUMBNAILS_DIR, `thumb_${filename}.jpg`);
    await fs.unlink(thumbnailPath).catch(() => {}); // Ignore if file doesn't exist

    return true;
  } catch (error) {
    console.error('File deletion failed:', error);
    return false;
  }
}