// Fallback in-memory store para evitar depender de Redis localmente
const otpStore = new Map<string, { value: string; expiresAt: number }>();
const pendingStore = new Map<string, { data: any; expiresAt: number }>();

const OTP_TTL_MS = 180 * 1000; // 3 minutos
const PENDING_TTL_MS = 300 * 1000; // 5 minutos

// Limpiador automático
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of otpStore.entries()) {
    if (now > item.expiresAt) otpStore.delete(key);
  }
  for (const [key, item] of pendingStore.entries()) {
    if (now > item.expiresAt) pendingStore.delete(key);
  }
}, 60000);

export async function setOtp(email: string, otp: string): Promise<void> {
  otpStore.set(email, { value: otp, expiresAt: Date.now() + OTP_TTL_MS });
}

export async function getOtp(email: string): Promise<string | null> {
  const item = otpStore.get(email);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    otpStore.delete(email);
    return null;
  }
  return item.value;
}

export async function deleteOtp(email: string): Promise<void> {
  otpStore.delete(email);
}

export async function setPendingRegistration(
  email: string,
  data: { username: string; passwordHash: string }
): Promise<void> {
  pendingStore.set(email, { data, expiresAt: Date.now() + PENDING_TTL_MS });
}

export async function getPendingRegistration(
  email: string
): Promise<{ username: string; passwordHash: string } | null> {
  const item = pendingStore.get(email);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    pendingStore.delete(email);
    return null;
  }
  return item.data;
}

export async function deletePendingRegistration(email: string): Promise<void> {
  pendingStore.delete(email);
}

// Dummy export para mantener compatibilidad si algo importa 'redis' por defecto
export default {};
