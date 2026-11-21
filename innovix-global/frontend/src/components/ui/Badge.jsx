const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '',
  dot = false,
  dotColor 
}) => {
  const variants = {
    default: 'bg-neutral/10 text-neutral border border-neutral/20',
    primary: 'bg-gold/10 text-gold border border-gold/30',
    success: 'bg-green-500/10 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/30',
    gold: 'bg-gold/20 text-gold border border-gold/40',
    published: 'bg-green-500/10 text-green-400 border border-green-500/30',
    draft: 'bg-neutral/10 text-neutral border border-neutral/20',
    featured: 'bg-gold/20 text-gold border border-gold/40',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span 
          className="w-1.5 h-1.5 rounded-full" 
          style={{ backgroundColor: dotColor || 'currentColor' }}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;