import { SessionScope, type User, UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { cache } from "react";
import { prisma } from "@/lib/db";
import {
  createOpaqueSessionToken,
  hashSessionTokenToHex,
} from "@/lib/crypto/session-token";
import { COOKIE_NAME_ADMIN, COOKIE_NAME_CLIENT } from "@/lib/auth/session-constants";
import { getSessionTtlForScope } from "@/lib/auth/session-helpers";

export { getSessionTtlForScope } from "@/lib/auth/session-helpers";
export {
  COOKIE_NAME_ADMIN,
  COOKIE_NAME_CLIENT,
  CLIENT_SESSION_MAX_AGE_SEC,
  ADMIN_SESSION_MAX_AGE_SEC,
} from "@/lib/auth/session-constants";

type UserPublic = { id: string; email: string; role: UserRole };

export type AppSession = {
  id: string;
  user: UserPublic;
  scope: SessionScope;
  mfaComplete: boolean;
};

function toUserPublic(u: User): UserPublic {
  return { id: u.id, email: u.email, role: u.role };
}

async function findSessionByToken(
  rawToken: string,
  expectedScope: SessionScope,
  expectedUserRole: UserRole
): Promise<AppSession | null> {
  const tokenHash = hashSessionTokenToHex(rawToken);
  const row = await prisma.session.findFirst({
    where: { tokenHash, scope: expectedScope },
    include: { user: true },
  });
  if (!row) {
    return null;
  }
  if (row.expiresAt < new Date()) {
    return null;
  }
  if (row.user.role !== expectedUserRole) {
    return null;
  }
  return { id: row.id, user: toUserPublic(row.user), scope: row.scope, mfaComplete: row.mfaComplete };
}

const getClientSessionUncached = async (): Promise<AppSession | null> => {
  const c = await cookies();
  const raw = c.get(COOKIE_NAME_CLIENT)?.value;
  if (!raw) {
    return null;
  }
  const s = await findSessionByToken(raw, SessionScope.CLIENT, UserRole.CLIENT);
  if (!s || !s.mfaComplete) {
    return null;
  }
  return s;
};

const getAnyAdminSessionUncached = async (): Promise<AppSession | null> => {
  const c = await cookies();
  const raw = c.get(COOKIE_NAME_ADMIN)?.value;
  if (!raw) {
    return null;
  }
  return findSessionByToken(raw, SessionScope.ADMIN, UserRole.ADMIN);
};

const getFullAdminSessionUncached = async (): Promise<AppSession | null> => {
  const s = await getAnyAdminSessionUncached();
  if (!s) {
    return null;
  }
  if (!s.mfaComplete) {
    return null;
  }
  return s;
};

/**
 * Deduplikacja w obrębie jednego żądania.
 */
export const getClientSession = cache(getClientSessionUncached);
export const getAnyAdminSession = cache(getAnyAdminSessionUncached);
/**
 * Strefa administracyjna: pełny zestaw, po hasł+TOTP.
 */
export const getFullAdminSession = cache(getFullAdminSessionUncached);
/** @deprecated użyj getFullAdminSession (alias) */
export const getAdminSession = getFullAdminSession;

export async function createClientSessionForUserId(userId: string): Promise<{ token: string }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== UserRole.CLIENT) {
    throw new Error("Invalid client user");
  }
  return createSessionForUserAndScope(user, SessionScope.CLIENT, true);
}

/**
 * `mfaComplete=false` — zaraz po logowaniu hasłem, zanim 2FA zostanie ukończone.
 */
export async function createAdminSessionForUserId(
  userId: string,
  mfaComplete: boolean
): Promise<{ token: string }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== UserRole.ADMIN) {
    throw new Error("Invalid admin user");
  }
  return createSessionForUserAndScope(user, SessionScope.ADMIN, mfaComplete);
}

async function createSessionForUserAndScope(
  user: User,
  scope: SessionScope,
  mfaComplete: boolean
): Promise<{ token: string }> {
  const token = createOpaqueSessionToken();
  const tokenHash = hashSessionTokenToHex(token);
  const ttl = getSessionTtlForScope(scope);
  const expiresAt = new Date(Date.now() + ttl * 1000);
  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash,
      scope,
      expiresAt,
      mfaComplete: scope === SessionScope.CLIENT ? true : mfaComplete,
    },
  });
  return { token };
}

export function getCookieNameForScope(scope: SessionScope): string {
  return scope === SessionScope.ADMIN ? COOKIE_NAME_ADMIN : COOKIE_NAME_CLIENT;
}

export function buildSessionCookieOptions(maxAge: number) {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: isProd,
    maxAge,
  } as const;
}

export async function setSessionMfaCompleteById(
  sessionId: string,
  mfaComplete: boolean
): Promise<void> {
  await prisma.session.update({ where: { id: sessionId }, data: { mfaComplete } });
}

export async function destroySessionById(sessionId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { id: sessionId } });
}

export async function setAdminSessionCookie(token: string): Promise<void> {
  const c = await cookies();
  c.set(
    COOKIE_NAME_ADMIN,
    token,
    buildSessionCookieOptions(getSessionTtlForScope(SessionScope.ADMIN))
  );
}

export async function setClientSessionCookie(token: string): Promise<void> {
  const c = await cookies();
  c.set(
    COOKIE_NAME_CLIENT,
    token,
    buildSessionCookieOptions(getSessionTtlForScope(SessionScope.CLIENT))
  );
}

export async function clearClientSessionCookie(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME_CLIENT);
}

export async function clearAdminSessionCookie(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME_ADMIN);
}

export async function logoutByScopeAndSessionId(
  sessionId: string,
  scope: SessionScope
): Promise<void> {
  await destroySessionById(sessionId);
  if (scope === SessionScope.ADMIN) {
    await clearAdminSessionCookie();
  } else {
    await clearClientSessionCookie();
  }
}
