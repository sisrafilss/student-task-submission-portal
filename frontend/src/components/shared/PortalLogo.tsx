import Link from 'next/link';

interface PortalLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function PortalLogo({
  className = '',
  showText = true,
  size = 'md',
}: PortalLogoProps) {
  const iconSizes = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const subtitleSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}
    >
      {/* Dynamic Modern Emblem combining Graduation Cap + Code Brackets */}
      <div
        className={`relative flex ${iconSizes[size]} shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-500 text-primary-foreground shadow-md shadow-primary/25 ring-1 ring-white/20`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5.5 text-white"
        >
          {/* Graduation Cap Top */}
          <polygon points="12 2 2 7 12 12 22 7 12 2" fill="currentColor" fillOpacity="0.2" />
          {/* Cap Base */}
          <path d="M5.5 8.8v5.2c0 2 2.9 3.5 6.5 3.5s6.5-1.5 6.5-3.5V8.8" />
          {/* Tassel */}
          <path d="M22 7v6" />
          {/* Inner Code Bracket Symbol */}
          <path d="M9 14.5l-2-2 2-2" strokeWidth="1.75" />
          <path d="M15 10.5l2 2-2 2" strokeWidth="1.75" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight text-foreground ${titleSizes[size]}`}>
              Nextra<span className="text-primary font-extrabold">Portal</span>
            </span>
            <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
              v1.0
            </span>
          </div>
          <span className={`font-medium text-muted-foreground ${subtitleSizes[size]}`}>
            Student Submission Portal
          </span>
        </div>
      )}
    </Link>
  );
}

