"use client";

import { useEffect, useRef } from "react";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { ClientLoginForm } from "@/components/auth/client-login-form";
import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

function ModalGoogleBlock({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return null;
  }
  return (
    <>
      <a
        href="/api/auth/google"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300/90 bg-white text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
      >
        <GoogleGlyph />
        Kontynuuj z Google
      </a>
      <div className="relative flex items-center py-0.5">
        <div className="grow border-t border-slate-200" />
        <span className="mx-3 shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
          lub
        </span>
        <div className="grow border-t border-slate-200" />
      </div>
    </>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden className="shrink-0">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export function AuthModalDialog() {
  const { mode, close, openLogin, openRegister, registrationPreflight, googleOAuthEnabled } = useAuthModal();
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mode) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mode, close]);

  useEffect(() => {
    if (!mode || !panelRef.current) {
      return;
    }
    const t = window.setTimeout(() => {
      const sel = mode === "login" ? 'input[type="email"]' : "#name";
      const el = panelRef.current?.querySelector<HTMLElement>(sel);
      el?.focus();
    }, 50);
    return () => window.clearTimeout(t);
  }, [mode]);

  if (!mode) {
    return null;
  }

  const onBackdropPointerDown = (e: React.PointerEvent) => {
    if (e.target === backdropRef.current) {
      close();
    }
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[3px] md:p-8"
      onPointerDown={onBackdropPointerDown}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wa-auth-modal-title"
        className="relative max-h-[min(92vh,44rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-[#d9cfc3]/95 bg-[#fffefb] p-5 shadow-[0_24px_60px_-24px_rgba(35,28,20,0.45)] sm:p-6"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#e5ddd4] bg-white/90 text-lg leading-none text-[#4a423a] shadow-sm transition hover:bg-[#faf6f0]"
          onClick={close}
          aria-label="Zamknij"
        >
          ×
        </button>

        <div className="pr-10">
          <h2
            id="wa-auth-modal-title"
            className="font-sans text-xl font-semibold tracking-tight text-[#1f1c19]"
          >
            {mode === "login" ? "Logowanie" : "Rejestracja"}
          </h2>
          <p className="mt-1 text-sm text-[#5c564f]">
            {mode === "login"
              ? "Konto pary — po zalogowaniu przejdziesz do panelu."
              : "Konto pary — bez karty płatniczej."}
          </p>
        </div>

        <div className="mt-4 flex gap-1 rounded-xl border border-[#e8e2dc] bg-[#f6f2ec]/80 p-1">
          <button
            type="button"
            onClick={openLogin}
            className={`min-h-10 flex-1 rounded-lg px-3 text-sm font-medium transition ${
              mode === "login"
                ? "bg-white text-[#1f1c19] shadow-sm"
                : "text-[#5c564f] hover:text-[#2e2a26]"
            }`}
          >
            Logowanie
          </button>
          <button
            type="button"
            onClick={openRegister}
            className={`min-h-10 flex-1 rounded-lg px-3 text-sm font-medium transition ${
              mode === "register"
                ? "bg-white text-[#1f1c19] shadow-sm"
                : "text-[#5c564f] hover:text-[#2e2a26]"
            }`}
          >
            Rejestracja
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <ModalGoogleBlock enabled={googleOAuthEnabled} />
          {mode === "login" ? (
            <ClientLoginForm />
          ) : (
            <RegisterForm key="register" preflight={registrationPreflight} />
          )}
        </div>

        <p className="mt-5 border-t border-[#ebe4dc] pt-4 text-center text-xs text-[#6b645c]">
          {mode === "login" ? (
            <>
              Nie masz konta?{" "}
              <button type="button" className="font-medium text-[#6B5427] underline" onClick={openRegister}>
                Zarejestruj się
              </button>
              {" · "}
              <Link className="underline" href="/reset-hasla" onClick={close}>
                Reset hasła
              </Link>
            </>
          ) : (
            <>
              Masz konto?{" "}
              <button type="button" className="font-medium text-[#6B5427] underline" onClick={openLogin}>
                Zaloguj się
              </button>
            </>
          )}
        </p>
        <p className="mt-2 text-center text-[0.65rem] text-[#8a827a]">
          <Link href="/logowanie?k=client" className="underline underline-offset-2 hover:text-[#5c544c]" onClick={close}>
            Pełna strona logowania
          </Link>
          {" · "}
          <Link href="/rejestracja" className="underline underline-offset-2 hover:text-[#5c544c]" onClick={close}>
            Pełna strona rejestracji
          </Link>
        </p>
      </div>
    </div>
  );
}
