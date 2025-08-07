import React from 'react'

const buttonVariants = ({ variant = 'primary' }: { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-100',
  };
  return variants[variant] || variants.primary;
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          buttonVariants({ variant })
        } ${className || ''}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
