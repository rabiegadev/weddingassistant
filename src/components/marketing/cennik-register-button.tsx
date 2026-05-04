"use client";

import { OpenAuthModalButton } from "@/components/auth/open-auth-modal-button";

export function CennikRegisterButton() {
  return (
    <OpenAuthModalButton
      mode="register"
      className="inline-block w-full rounded-md border border-[#B8955C] py-2 text-center text-sm font-medium text-[#2B2B2B] transition hover:bg-white"
    >
      Utwórz konto, aby złożyć zamówienie
    </OpenAuthModalButton>
  );
}
