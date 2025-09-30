import { useTheme } from "../theme-provider";

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
  const { theme } = useTheme();

  // Determine the actual theme considering system preference
  const getResolvedTheme = () => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  };

  // Choose logo based on theme
  const logoSrc = getResolvedTheme() === "dark" ? "/logo.svg" : "/logo-light.svg";
  const fallbackLogoSrc = "/logo-light.svg";
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
        alt="Escrow Admin Logo"
        className={`${sizeClasses[size]} w-auto`}
        onError={(e) => {
          const target = e.currentTarget;
          
          // Try fallback logo first
          if (target.src !== fallbackLogoSrc && fallbackLogoSrc) {
            console.log("Primary logo failed, trying fallback:", fallbackLogoSrc);
            target.src = fallbackLogoSrc;
            return;
          }
          
          // If all images fail, hide image and show text fallback
          console.log("All logos failed, showing text fallback");
          target.style.display = "none";
          const textElement = target.parentElement?.querySelector('.logo-text-fallback') as HTMLElement;
          if (textElement) {
            textElement.style.display = "flex";
          }
        }}
        onLoad={() => {
          // When image loads successfully, ensure text fallback is hidden
          const textElement = document.querySelector('.logo-text-fallback') as HTMLElement;
          if (textElement) {
            textElement.style.display = "none";
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