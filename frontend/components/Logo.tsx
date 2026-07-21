/** FinGuard-AI mark: a shield (protection/guard) with a checkmark (verified,
 *  explainable assessment) rather than a decorative or literal-lock icon,
 *  since the platform's core claim is transparent risk *assessment*, not
 *  enforcement. Renders from favicon size up to nav-header size off one
 *  path set, so it stays legible small. */
interface LogoProps {
  className?: string;
  gradientId?: string;
  /** "brand" (navy-to-teal) reads best on light surfaces; "light" (teal-to-cyan) stays visible on the dark footer band. */
  variant?: "brand" | "light";
}

export function Logo({ className, gradientId = "logoGradient", variant = "brand" }: LogoProps) {
  const stops =
    variant === "light" ? (["#12B8B0", "#29C5D8"] as const) : (["#12B8B0", "#0B263D"] as const);
  const accentDot = variant === "light" ? "#F58A66" : "#F0704A";
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="FinGuard-AI logo">
      <defs>
        <linearGradient id={gradientId} x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={stops[0]} />
          <stop offset="100%" stopColor={stops[1]} />
        </linearGradient>
      </defs>
      <path
        d="M16 2.5 27 6.5v8.2c0 8.1-5.8 12.6-11 14.8-5.2-2.2-11-6.7-11-14.8V6.5L16 2.5Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M11 16.2l3.4 3.4L21.5 12"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* coral accent, ties the mark to the site's floating-shape motif */}
      <circle cx="24.5" cy="6.5" r="2.6" fill={accentDot} stroke="#ffffff" strokeWidth="1.1" />
    </svg>
  );
}
