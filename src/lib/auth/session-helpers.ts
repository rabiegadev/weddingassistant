import { SessionScope } from "@prisma/client";
import { ADMIN_SESSION_MAX_AGE_SEC, CLIENT_SESSION_MAX_AGE_SEC } from "./session-constants";

export function getSessionTtlForScope(scope: SessionScope): number {
  return scope === SessionScope.ADMIN ? ADMIN_SESSION_MAX_AGE_SEC : CLIENT_SESSION_MAX_AGE_SEC;
}
