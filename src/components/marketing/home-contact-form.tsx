"use client";

import { useState } from "react";

type HomeContactFormProps = {
  /** Kotwica / ścieżka zapisana przy zapytaniu (np. strona główna #kontakt). */
  sourcePage?: string;
  className?: string;
  /** Mniejsze pola — układ obok kolumny z telefonem. */
  compact?: boolean;
};

export function HomeContactForm({ sourcePage = "/", className = "", compact = false }: HomeContactFormProps) {
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim() || undefined,
      message: String(fd.get("message") ?? "").trim(),
      sourcePage,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setMsg({ type: "err", text: data.error ?? "Nie udało się wysłać." });
      } else {
        setMsg({ type: "ok", text: "Dziękujemy — wiadomość została zapisana." });
        e.currentTarget.reset();
      }
    } catch {
      setMsg({ type: "err", text: "Błąd sieci. Spróbuj ponownie." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-3 text-left text-sm text-[#2B2B2B] ${compact ? "max-w-none" : "mt-6 max-w-xl"} ${className}`}
    >
      <div>
        <label className="block text-xs font-medium text-[#5A5A5A]" htmlFor="hc-name">
          Imię i nazwisko / para
        </label>
        <input
          id="hc-name"
          name="name"
          required
          maxLength={200}
          className="mt-1 w-full rounded-lg border border-[#e8e2dc] bg-white px-3 py-2 text-[#2B2B2B] outline-none ring-[#B8955C]/25 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#5A5A5A]" htmlFor="hc-email">
          E-mail
        </label>
        <input
          id="hc-email"
          name="email"
          type="email"
          required
          maxLength={320}
          className="mt-1 w-full rounded-lg border border-[#e8e2dc] bg-white px-3 py-2 outline-none ring-[#B8955C]/25 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#5A5A5A]" htmlFor="hc-phone">
          Telefon (opcjonalnie)
        </label>
        <input
          id="hc-phone"
          name="phone"
          type="tel"
          maxLength={40}
          className="mt-1 w-full rounded-lg border border-[#e8e2dc] bg-white px-3 py-2 outline-none ring-[#B8955C]/25 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#5A5A5A]" htmlFor="hc-msg">
          Wiadomość
        </label>
        <textarea
          id="hc-msg"
          name="message"
          required
          rows={compact ? 3 : 4}
          maxLength={8000}
          className="mt-1 w-full rounded-lg border border-[#e8e2dc] bg-white px-3 py-2 outline-none ring-[#B8955C]/25 focus:ring-2"
        />
      </div>
      {msg ? (
        <p className={msg.type === "ok" ? "text-sm text-emerald-800" : "text-sm text-rose-700"}>{msg.text}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#B8955C] px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:brightness-105 disabled:opacity-50"
      >
        {pending ? "Wysyłanie…" : "Wyślij wiadomość"}
      </button>
    </form>
  );
}
