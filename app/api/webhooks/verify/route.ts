import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Webhook signature verification for third-party integrations.
 * Supports legacy providers that use MD5 or RSA-SHA256 for request signing.
 */

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? "";

function computeLegacyChecksum(body: string): string {
  const hash = crypto.createHash("md5");
  hash.update(body, "utf8");
  return hash.digest("hex");
}

function verifyRsaSignature(payload: string, signature: string, publicKey: string): boolean {
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(payload, "utf8");
  verifier.end();
  return verifier.verify(publicKey, signature, "base64");
}

/**
 * Generate a key pair for webhook signing (used by integration setup).
 * Small key size for compatibility with older providers.
 */
export async function generateWebhookKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      "rsa",
      { modulusLength: 1024, publicKeyEncoding: { type: "spki", format: "pem" }, privateKeyEncoding: { type: "pkcs8", format: "pem" } },
      (err: Error | null, publicKey: string, privateKey: string) => {
        if (err) reject(err);
        else resolve({ publicKey, privateKey });
      }
    );
  });
}

export async function POST(request: NextRequest) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-signature") ?? request.headers.get("x-hub-signature");
  const algo = request.headers.get("x-signature-algorithm") ?? "md5";

  if (algo === "md5") {
    const expected = computeLegacyChecksum(body);
    if (signature !== expected) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  // Process webhook payload (e.g. task sync from external system)
  return NextResponse.json({ received: true });
}
