import { useId } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Bold framed monogram — reads clearly at 36–40px. Gold “M” on deep ink with a thick gallery-style frame.
 */
export default function Logo({ size = 40, className = '' }: LogoProps) {
  const uid = useId().replace(/:/g, '');
  const gradGold = `logo-grad-gold-${uid}`;
  const gradFrame = `logo-grad-frame-${uid}`;
  const gradGlow = `logo-grad-glow-${uid}`;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradGold} x1="12%" y1="8%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#f0d78c" />
          <stop offset="45%" stopColor="#d4a853" />
          <stop offset="100%" stopColor="#9a7020" />
        </linearGradient>
        <linearGradient id={gradFrame} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8c97a" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8a6420" />
        </linearGradient>
        <radialGradient id={gradGlow} cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#d4a853" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#d4a853" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer frame — thick, visible border */}
      <rect x="3" y="3" width="94" height="94" rx="18" fill="#121018" />
      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        rx="18"
        fill="none"
        stroke={`url(#${gradFrame})`}
        strokeWidth="5"
      />
      <rect x="10" y="10" width="80" height="80" rx="12" fill="none" stroke="rgba(212,168,83,0.15)" strokeWidth="1" />

      {/* Soft glow behind letter */}
      <ellipse cx="50" cy="48" rx="32" ry="28" fill={`url(#${gradGlow})`} />

      {/* Accent corner — folded canvas / portfolio hint */}
      <path d="M78 14 L86 22 L78 30 Z" fill={`url(#${gradGold})`} opacity="0.85" />

      {/* Bold geometric M — vector paths, no webfont dependency */}
      <path
        fill={`url(#${gradGold})`}
        d="
          M 22 76
          L 22 28
          L 34 28
          L 50 52
          L 66 28
          L 78 28
          L 78 76
          L 66 76
          L 66 44
          L 52 64
          L 48 64
          L 34 44
          L 34 76
          Z
        "
      />
    </svg>
  );
}
