/** Ikony dla kart przykładowych wizytówek (inline SVG, bez zewnętrznych assetów). */

export function IconGlobeDemo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="22" className="fill-[#f4ebe1]" stroke="#d4c4a8" strokeWidth="1.5" />
      <path
        className="stroke-[#6B5427]"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M12 24h24M24 12c4 4 6 8 6 12s-2 8-6 12c-4-4-6-8-6-12s2-8 6-12z"
      />
      <ellipse cx="24" cy="24" rx="10" ry="16" className="stroke-[#6B5427]" strokeWidth="1.75" />
    </svg>
  );
}

/** Oferta / cennik — lista + znacznik ceny. */
export function IconRsvpDemo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="22" className="fill-[#f4ebe1]" stroke="#d4c4a8" strokeWidth="1.5" />
      <rect
        x="14"
        y="12"
        width="20"
        height="24"
        rx="2.5"
        className="stroke-[#6B5427]"
        strokeWidth="1.75"
      />
      <path className="stroke-[#B8955C]" strokeWidth="1.5" strokeLinecap="round" d="M18 19h12M18 25h10M18 31h8" />
      <circle cx="32" cy="17" r="3" className="fill-[#B8955C]/40 stroke-[#6B5427]" strokeWidth="1.25" />
    </svg>
  );
}

export function IconGalleryDemo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="22" className="fill-[#f4ebe1]" stroke="#d4c4a8" strokeWidth="1.5" />
      <rect
        x="12"
        y="14"
        width="24"
        height="18"
        rx="2"
        className="stroke-[#6B5427]"
        strokeWidth="1.75"
      />
      <path
        className="fill-[#B8955C]/35 stroke-[#6B5427]"
        strokeWidth="1.25"
        d="M15 30l6-6 5 5 7-8 5 9H15v0z"
      />
      <circle cx="18" cy="19" r="2" className="fill-[#B8955C]" />
    </svg>
  );
}

export function IconSoonPlaceholder({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="22" className="fill-[#f0ece6]" stroke="#e0d8cc" strokeWidth="1.5" strokeDasharray="4 3" />
      <path
        className="stroke-[#a89888]"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M18 26h12M24 20v12"
      />
    </svg>
  );
}
