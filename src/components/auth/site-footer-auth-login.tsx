"use client";

import { useAuthModal } from "@/components/auth/auth-modal-context";

export function SiteFooterAuthLogin() {
  const { openLogin } = useAuthModal();
  return (
    <button
      type="button"
      className="font-medium text-[#d4b87a] underline decoration-[#c9a050]/60 underline-offset-2 transition hover:text-[#f5e6bc]"
      onClick={openLogin}
    >
      Zaloguj się / panel pary
    </button>
  );
}
