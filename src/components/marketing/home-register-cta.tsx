"use client";

import { OpenAuthModalButton } from "@/components/auth/open-auth-modal-button";

export function HomeRegisterCta() {
  return (
    <OpenAuthModalButton
      mode="register"
      className="inline-flex h-12 min-w-[16rem] items-center justify-center rounded-md bg-[#B8955C] px-8 text-sm font-semibold text-white shadow transition hover:brightness-105"
    >
      Załóż darmowe konto
    </OpenAuthModalButton>
  );
}
