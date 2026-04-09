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
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9943e" />
          <stop offset="50%" stopColor="#e8c97a" />
          <stop offset="100%" stopColor="#b8862d" />
        </linearGradient>
        <linearGradient id="logoPaint" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4a853" />
          <stop offset="100%" stopColor="#e8c97a" />
        </linearGradient>
      </defs>

      {/* Brush handle */}
      <rect
        x="58" y="8" width="10" height="40" rx="3"
        transform="rotate(35 63 28)"
        fill="#5c4a32"
      />
      {/* Ferrule (metal band) */}
      <rect
        x="56" y="44" width="12" height="8" rx="2"
        transform="rotate(35 62 48)"
        fill="#a89070"
      />
      {/* Bristles */}
      <path
        d="M38 58 Q42 50, 50 52 L56 56 Q52 64, 44 68 Q36 72, 32 66 Q30 62, 38 58Z"
        fill="url(#logoGold)"
      />
      {/* Paint stroke left by brush */}
      <path
        d="M18 72 Q24 60, 36 64 Q44 68, 38 78 Q34 86, 26 88 Q16 90, 14 82 Q12 76, 18 72Z"
        fill="url(#logoPaint)"
        opacity="0.85"
      />
      {/* Small paint splatter dots */}
      <circle cx="22" cy="68" r="3" fill="#e8c97a" opacity="0.6" />
      <circle cx="48" cy="78" r="2.5" fill="#d4a853" opacity="0.5" />
      <circle cx="14" cy="62" r="2" fill="#e8c97a" opacity="0.4" />
    </svg>
  );
}
