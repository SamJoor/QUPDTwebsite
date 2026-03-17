import crypto from 'crypto';
import { cookies } from 'next/headers';
import { SessionRole, SessionUser } from '@/types';
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';

const DEFAULT_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

function getSessionSecret() {
  return process.env.SESSION_SECRET || 'change-me-in-env';
}

function encode(payload: SessionUser) {
  const json = JSON.stringify(payload);
  const body = Buffer.from(json).toString('base64url');
  const signature = crypto.createHmac('sha256', getSessionSecret()).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function decode(token: string): SessionUser | null {
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  const expected = crypto.createHmac('sha256', getSessionSecret()).update(body).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionUser;
    if (!parsed?.role || !parsed?.email || !parsed?.expiresAt) return null;
    if (Date.now() > parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function createSessionToken(input: { role: SessionRole; email: string; name?: string; expiresInMs?: number }) {
  return encode({
    role: input.role,
    email: input.email,
    name: input.name || input.email,
    expiresAt: Date.now() + (input.expiresInMs ?? DEFAULT_DURATION_MS)
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return decode(token);
}

export async function requireSession(role?: SessionRole) {
  const session = await getSessionUser();
  if (!session) return null;
  if (role && session.role !== role) return null;
  return session;
}
