import { forwardRef } from 'react';

const Card = forwardRef(({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`bg-secondary rounded-xl border border-neutral/10 transition-all duration-300 ${hover ? 'hover:border-gold/30 hover:shadow-xl hover:shadow-gold/10 hover:-translate-y-1' : ''} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef(({ children, className = '', ...props }, ref) => (
  <h3 ref={ref} className={`font-display text-xl font-medium text-gold ${className}`} {...props}>
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef(({ children, className = '', ...props }, ref) => (
  <p ref={ref} className={`mt-1 text-neutral ${className}`} {...props}>
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`mt-4 pt-4 border-t border-neutral/10 flex items-center gap-3 ${className}`} {...props}>
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

export default Card;