interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a853" />
          <stop offset="50%" stopColor="#e8c97a" />
          <stop offset="100%" stopColor="#b8862d" />
        </linearGradient>
        <linearGradient id="logoGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b8862d" />
          <stop offset="100%" stopColor="#8a6420" />
        </linearGradient>
        <linearGradient id="brushHandle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6b5035" />
          <stop offset="100%" stopColor="#4a3525" />
        </linearGradient>
        <linearGradient id="ferrule" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c0c0c0" />
          <stop offset="50%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#a0a0a0" />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle cx="60" cy="60" r="56" fill="#1e1e2a" />
      <circle cx="60" cy="60" r="54" fill="none" stroke="url(#logoGold)" strokeWidth="1.5" opacity="0.6" />

      {/* Paintbrush — angled */}
      {/* Handle */}
      <rect x="78" y="12" width="8" height="38" rx="3" transform="rotate(35 82 31)" fill="url(#brushHandle)" />
      {/* Ferrule (metal band) */}
      <rect x="72" y="44" width="10" height="7" rx="1.5" transform="rotate(35 77 47.5)" fill="url(#ferrule)" />
      {/* Bristles */}
      <path
        d="M62 55 Q66 48, 72 50 L76 53 Q73 60, 66 64 Q60 67, 56 62 Q54 58, 62 55Z"
        fill="url(#logoGold)"
      />
      {/* Paint splash from brush */}
      <circle cx="52" cy="68" r="3" fill="#e8c97a" opacity="0.5" />
      <circle cx="58" cy="72" r="2" fill="#d4a853" opacity="0.4" />

      {/* Letter M — elegant serif style */}
      <text
        x="60"
        y="88"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="52"
        fontWeight="900"
        fontStyle="italic"
        fill="url(#logoGold)"
      >
        M
      </text>

      {/* Decorative gold dots */}
      <circle cx="28" cy="72" r="2" fill="#e8c97a" opacity="0.35" />
      <circle cx="92" cy="72" r="2" fill="#e8c97a" opacity="0.35" />
    </svg>
  );
}
