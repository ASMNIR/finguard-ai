export function ShieldScan({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Illustration of a shield being scanned for verification, representing explainable fraud-risk analysis"
    >
      {/* soft backdrop blob */}
      <path
        d="M75 130c30-55 100-80 165-60 62 19 108 74 100 140-8 65-70 108-140 112-68 4-128-38-142-100C46 182 52 168 75 130Z"
        fill="#DCF3EC"
      />

      {/* shield */}
      <path
        d="M210 66c34 14 66 22 92 24 4 60-4 128-92 176-88-48-96-116-92-176 26-2 58-10 92-24Z"
        fill="#FFFFFF"
        stroke="#0B263D"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M210 66c34 14 66 22 92 24 4 60-4 128-92 176-88-48-96-116-92-176 26-2 58-10 92-24Z"
        fill="#087F8C"
        fillOpacity="0.06"
      />

      {/* checkmark inside shield */}
      <path
        d="M172 176l28 30 52-58"
        stroke="#12B8B0"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* document, peeking bottom-left */}
      <rect x="46" y="230" width="104" height="132" rx="10" fill="#FFFFFF" stroke="#0B263D" strokeWidth="3.5" />
      <line x1="64" y1="256" x2="132" y2="256" stroke="#DCE3EA" strokeWidth="6" strokeLinecap="round" />
      <line x1="64" y1="276" x2="132" y2="276" stroke="#DCE3EA" strokeWidth="6" strokeLinecap="round" />
      <line x1="64" y1="296" x2="110" y2="296" stroke="#F0704A" strokeWidth="6" strokeLinecap="round" />
      <line x1="64" y1="318" x2="120" y2="318" stroke="#DCE3EA" strokeWidth="6" strokeLinecap="round" />
      <line x1="64" y1="338" x2="132" y2="338" stroke="#DCE3EA" strokeWidth="6" strokeLinecap="round" />

      {/* magnifying glass, examining the document */}
      <circle cx="128" cy="300" r="40" fill="#FFFFFF" fillOpacity="0.7" stroke="#0B263D" strokeWidth="4.5" />
      <line x1="157" y1="329" x2="182" y2="354" stroke="#0B263D" strokeWidth="7" strokeLinecap="round" />

      {/* small orbiting dots */}
      <circle cx="330" cy="120" r="6" fill="#F0704A" />
      <circle cx="352" cy="150" r="4" fill="#12B8B0" />
    </svg>
  );
}
