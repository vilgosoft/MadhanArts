interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <img
      className={`logo-icon ${className}`}
      src="/logo.png"
      alt="Madhan Arts"
      width={size}
      height={size}
      style={{
        objectFit: 'contain',
        mixBlendMode: 'multiply',
      }}
    />
  );
}
