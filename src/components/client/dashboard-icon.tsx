"use client";

import type { DashboardIconKey } from "@/lib/client-dashboard-menu";

type DashboardIconProps = {
  icon: DashboardIconKey;
  className?: string;
};

export function DashboardIcon({ icon, className }: DashboardIconProps) {
  const common = `h-4 w-4 shrink-0 ${className ?? ""}`;
  switch (icon) {
    case "home":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11.5 12 4l9 7.5" /><path d="M6.5 10.5V20h11v-9.5" /></svg>;
    case "tools":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m14 6 4 4" /><path d="M4 20l8.5-8.5a3 3 0 0 0 0-4.2l-.8-.8a3 3 0 0 0-4.2 0L3 11" /><path d="m15 10 5-5" /></svg>;
    case "dashboard":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="5" rx="1.5" /><rect x="13" y="10" width="8" height="11" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /></svg>;
    case "users":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M14.5 20a4 4 0 0 1 6 0" /></svg>;
    case "check":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m8 12 2.5 2.5L16 9" /></svg>;
    case "table":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="12" width="8.5" height="8" rx="1.5" /><rect x="12.5" y="12" width="8.5" height="8" rx="1.5" /></svg>;
    case "calendar":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>;
    case "list":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></svg>;
    case "qr":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" /><path d="M14 14h2v2h-2zM18 14h2v2h-2zM16 18h2v2h-2zM20 18h0" /></svg>;
    case "spark":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 3 2.2 5.4L20 10l-5.8 1.6L12 17l-2.2-5.4L4 10l5.8-1.6L12 3Z" /></svg>;
    case "wallet":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M15 12h6" /><circle cx="15" cy="12" r="1" /></svg>;
    case "receipt":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 3h12v18l-2-1-2 1-2-1-2 1-2-1-2 1V3Z" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>;
    case "settings":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3.2" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.3.7a7 7 0 0 0-1.7-1L14.5 3h-5l-.4 2.7a7 7 0 0 0-1.7 1L5 6l-2 3.5L5 11a7 7 0 0 0 0 2l-2 1.5L5 18l2.3-.7a7 7 0 0 0 1.7 1l.5 2.7h5l.4-2.7a7 7 0 0 0 1.7-1L19 18l2-3.5-2-1.5c.1-.3.1-.7.1-1Z" /></svg>;
    case "gallery":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="m4 17 5-4 3 2 4-3 4 5" /></svg>;
    case "timeline":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h7M13 6h7M4 12h4M10 12h10M4 18h9M15 18h6" /><circle cx="11" cy="6" r="1.3" /><circle cx="8" cy="12" r="1.3" /><circle cx="14" cy="18" r="1.3" /></svg>;
    case "globe":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>;
    case "info":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 10v6M12 7h.01" /></svg>;
    case "book":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5a2 2 0 0 1 2-2h12v17H6a2 2 0 0 0-2 2V5Z" /><path d="M6 3v17" /></svg>;
    case "utensils":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 3v8M5 3v8M5 7.5h3M7 11v10M15 3v8M15 11v10M19 3c0 2.7-1 4-3 4" /></svg>;
    case "plus":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></svg>;
    case "user":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.5" /><path d="M4 20a8 8 0 0 1 16 0" /></svg>;
    case "id":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8" cy="12" r="2" /><path d="M13 10h5M13 14h5" /></svg>;
    case "bell":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 16h12l-1.3-1.4a2 2 0 0 1-.5-1.3V10a4.2 4.2 0 0 0-8.4 0v3.3c0 .5-.2 1-.5 1.3L6 16Z" /><path d="M10 18a2 2 0 0 0 4 0" /></svg>;
    case "package":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3.5 8 12 3l8.5 5v8L12 21l-8.5-5V8Z" /><path d="M12 21v-8.8M3.5 8 12 13l8.5-5" /></svg>;
    case "layers":
      return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 4 8 4-8 4-8-4 8-4ZM4 12l8 4 8-4M4 16l8 4 8-4" /></svg>;
    default:
      return null;
  }
}
