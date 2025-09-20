import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

const HMAC_SECRET = process.env.HMAC_SECRET || 'your-super-secret-hmac-key-change-in-production';
const URL_EXPIRY_MINUTES = 30; // URLs expire after 30 minutes

/**
 * Generate a signed URL for secure file access
 * @param {string} filename - The filename to generate URL for
 * @param {number} expiryMinutes - Minutes until URL expires (default: 30)
 * @returns {string} Signed URL path
 */
export function generateSignedUrl(filename, expiryMinutes = URL_EXPIRY_MINUTES) {
  const expiry = Date.now() + (expiryMinutes * 60 * 1000);
  const payload = `${filename}:${expiry}`;
  
  // Create HMAC signature
  const signature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(payload)
    .digest('hex');
  
  return `/api/secure/${filename}?expires=${expiry}&signature=${signature}`;
}

/**
 * Verify a signed URL and return the filename if valid
 * @param {string} filename - The requested filename
 * @param {string} expires - Expiry timestamp
 * @param {string} signature - HMAC signature
 * @returns {boolean} True if URL is valid
 */
export function verifySignedUrl(filename, expires, signature) {
  // Check if URL has expired
  if (Date.now() > parseInt(expires)) {
    return false;
  }
  
  // Recreate the expected signature
  const payload = `${filename}:${expires}`;
  const expectedSignature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(payload)
    .digest('hex');
  
  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

/**
 * Generate signed URL for CV download
 * @param {string} filename - CV filename
 * @returns {string} Signed URL for CV
 */
export function generateCVSignedUrl(filename) {
  return generateSignedUrl(`cv/${filename}`, 60); // CV URLs valid for 1 hour
}

/**
 * Generate signed URL for high-res media download
 * @param {string} filename - Media filename
 * @returns {string} Signed URL for media
 */
export function generateMediaSignedUrl(filename) {
  return generateSignedUrl(`media/${filename}`, URL_EXPIRY_MINUTES);
}

/**
 * Middleware to handle signed URL verification
 */
export function handleSignedUrl(req, res, next) {
  const { filename } = req.params;
  const { expires, signature } = req.query;
  
  if (!expires || !signature) {
    return res.status(400).json({ error: 'Missing signature or expiry' });
  }
  
  if (!verifySignedUrl(filename, expires, signature)) {
    return res.status(403).json({ error: 'Invalid or expired URL' });
  }
  
  req.verifiedFilename = filename;
  next();
}