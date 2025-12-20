export function decryptEmail(emailEncrypted) {
  if (!emailEncrypted) return null;
  return Buffer.from(emailEncrypted, "base64").toString("utf-8");
}
