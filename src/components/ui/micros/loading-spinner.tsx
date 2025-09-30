interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-4'
};

export function LoadingSpinner({ 
  size = 'md', 
  color = 'border-white border-t-transparent',
  className = ''
}: LoadingSpinnerProps) {
  return (
    <div 
      className={`${sizeClasses[size]} ${color} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}