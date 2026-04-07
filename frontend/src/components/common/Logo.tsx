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
          <stop offset="0%" stopColor="#d4a853" />
          <stop offset="50%" stopColor="#e8c97a" />
          <stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
        <linearGradient id="logoDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1e2a" />
          <stop offset="100%" stopColor="#2a2a3a" />
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="248" fill="url(#logoDark)" stroke="url(#logoGold)" strokeWidth="6" />
      <path
        d="M140 340 C160 280, 200 200, 280 160 C320 140, 360 150, 370 170 C380 190, 360 220, 320 240 C280 260, 220 300, 180 340 C160 360, 140 360, 140 340Z"
        fill="url(#logoGold)"
        opacity="0.25"
      />
      <text
        x="256"
        y="300"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="220"
        fontWeight="700"
        fill="url(#logoGold)"
        letterSpacing="-8"
      >
        M
      </text>
      <text
        x="340"
        y="210"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="72"
        fontWeight="400"
        fontStyle="italic"
        fill="#e8c97a"
        opacity="0.9"
      >
        A
      </text>
      <circle cx="256" cy="380" r="8" fill="#e8c97a" />
      <line x1="226" y1="390" x2="286" y2="390" stroke="#e8c97a" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
