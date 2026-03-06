/**
 * PQC test fixture: intentional weak crypto for Neatcode scanner verification.
 * Do not use in production.
 */
import crypto from 'node:crypto';

export function legacyHash(data: string): string {
  const h = crypto.createHash('md5');
  h.update(data);
  return h.digest('hex');
}

export function signWithRsa(payload: Buffer, privateKey: string): string {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(payload);
  return sign.sign(privateKey, 'base64');
}

export function generateWeakKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      'rsa',
      { modulusLength: 1024 },
      (err, publicKey, privateKey) => {
        if (err) reject(err);
        else resolve({ publicKey: publicKey.export({ type: 'spki', format: 'pem' }) as string, privateKey: privateKey.export({ type: 'pkcs8', format: 'pem' }) as string });
      }
    );
  });
}
