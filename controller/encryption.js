import crypto from 'crypto';
const secretKey = '52345678941834567870723486789012'; // Must be 32 bytes for AES-256
const algorithm = 'aes-256-cbc';

// Encrypt function
export function vishal_encryption(data) {
  const iv = crypto.randomBytes(16); 
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const encryptedDataWithIV = Buffer.from(`${encrypted}::${iv.toString('hex')}`).toString('base64');
  return encryptedDataWithIV;
}

// Decrypt function
export function vishal_decryption(encryptedDataWithIV) {
  const decoded = Buffer.from(encryptedDataWithIV, 'base64').toString('utf8');
  const [encryptedData, ivHex] = decoded.split('::');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}




