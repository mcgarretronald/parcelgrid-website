// Theme removed - always render a single logo

interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-6',
  md: 'h-8', 
  lg: 'h-10',
  xl: 'h-12'
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl'
};

const iconSizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
  xl: 'w-12 h-12 text-lg'
};

export function Logo({ 
  className = '', 
  showText = true, 
  textClassName = '',
  iconOnly = false,
  size = 'md'
}: LogoProps) {
  const logoSrc = "/logo2.png";
  const fallbackLogoSrc = "/logo.png";
  const textFallback = "Escrow Admin";

  if (iconOnly) {
    return (
      <div className={`bg-primary rounded-lg flex items-center justify-center ${iconSizeClasses[size]} ${className}`}>
        <span className="text-primary-foreground font-bold">E</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoSrc}
        alt="ParcelGrid Courier Service Admin Logo"
        width="32"
        height="32"
        className={`${sizeClasses[size]} w-auto`}
        onError={(e) => {
          const target = e.currentTarget;
          // Try fallback once
          if (target.src !== fallbackLogoSrc && fallbackLogoSrc) {
            target.src = fallbackLogoSrc;
            return;
          }
          // If all images fail, hide image and show text fallback
          target.style.display = "none";
          const textElement = target.parentElement?.querySelector('.logo-text-fallback') as HTMLElement;
          if (textElement) {
            textElement.style.display = "flex";
          }
        }}
      />
      
      {/* Text fallback - ONLY shows if ALL images fail to load */}
      <div className="logo-text-fallback items-center gap-2 hidden">
        <div className={`bg-primary rounded-lg flex items-center justify-center ${iconSizeClasses[size]}`}>
          <span className="text-primary-foreground font-bold">E</span>
        </div>
        {showText && (
          <span className={`font-bold text-foreground ${textSizeClasses[size]} ${textClassName}`}>
            {textFallback}
          </span>
        )}
      </div>
    </div>
  );
}