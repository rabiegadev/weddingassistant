"use client";

import { useAuthModal, type AuthModalMode } from "@/components/auth/auth-modal-context";

export function OpenAuthModalButton({
  mode,
  className,
  children,
}: {
  mode: AuthModalMode;
  className?: string;
  children: React.ReactNode;
}) {
  const { openLogin, openRegister } = useAuthModal();
  const onClick = mode === "login" ? openLogin : openRegister;
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
