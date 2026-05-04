"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RegisterPreflight } from "@/lib/captcha/register-preflight";

export type AuthModalMode = "login" | "register";

type AuthModalContextValue = {
  openLogin: () => void;
  openRegister: () => void;
  close: () => void;
  mode: AuthModalMode | null;
  registrationPreflight: RegisterPreflight;
  googleOAuthEnabled: boolean;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal musi być użyte wewnątrz AuthModalProvider");
  }
  return ctx;
}

export function AuthModalProvider({
  children,
  registrationPreflight,
  googleOAuthEnabled,
}: {
  children: ReactNode;
  registrationPreflight: RegisterPreflight;
  googleOAuthEnabled: boolean;
}) {
  const [mode, setMode] = useState<AuthModalMode | null>(null);

  const openLogin = useCallback(() => setMode("login"), []);
  const openRegister = useCallback(() => setMode("register"), []);
  const close = useCallback(() => setMode(null), []);

  const value = useMemo(
    () => ({
      openLogin,
      openRegister,
      close,
      mode,
      registrationPreflight,
      googleOAuthEnabled,
    }),
    [close, mode, openLogin, openRegister, registrationPreflight, googleOAuthEnabled]
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}
