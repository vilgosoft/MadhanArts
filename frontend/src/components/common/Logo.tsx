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
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9943e" />
          <stop offset="40%" stopColor="#e8c97a" />
          <stop offset="100%" stopColor="#b8862d" />
        </linearGradient>
        <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a28" />
          <stop offset="100%" stopColor="#252538" />
        </linearGradient>
        <linearGradient id="logoBrush" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8c97a" />
          <stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background circle */}
      <circle cx="256" cy="256" r="250" fill="url(#logoBg)" />
      <circle cx="256" cy="256" r="246" fill="none" stroke="url(#logoGold)" strokeWidth="4" />
      <circle cx="256" cy="256" r="236" fill="none" stroke="url(#logoGold)" strokeWidth="1" opacity="0.3" />

      {/* Decorative brush stroke behind the M */}
      <path
        d="M100 350 Q150 200, 256 160 Q362 120, 420 200 Q440 240, 400 280 Q340 340, 260 360 Q180 380, 120 360 Q100 355, 100 350Z"
        fill="url(#logoGold)"
        opacity="0.08"
      />

      {/* Paintbrush diagonal stroke */}
      <path
        d="M340 130 Q360 140, 370 170 L385 220 Q390 240, 375 250 L360 255 Q350 258, 345 248 L325 185 Q320 165, 330 145 Z"
        fill="url(#logoBrush)"
        opacity="0.6"
        filter="url(#logoGlow)"
      />
      {/* Brush tip */}
      <ellipse cx="378" cy="135" rx="12" ry="20" transform="rotate(-30 378 135)" fill="#e8c97a" opacity="0.4" />

      {/* Bold M letter */}
      <text
        x="245"
        y="320"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="240"
        fontWeight="900"
        fill="url(#logoGold)"
        letterSpacing="-6"
      >
        M
      </text>

      {/* Small paint dots */}
      <circle cx="380" cy="310" r="10" fill="#e8c97a" opacity="0.5" />
      <circle cx="405" cy="285" r="6" fill="#d4a853" opacity="0.35" />
      <circle cx="395" cy="340" r="4" fill="#e8c97a" opacity="0.25" />

      {/* Bottom accent line */}
      <path
        d="M180 375 Q256 395, 340 375"
        fill="none"
        stroke="url(#logoGold)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
