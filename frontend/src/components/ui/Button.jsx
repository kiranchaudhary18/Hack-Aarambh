import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none relative overflow-hidden group cursor-pointer';
  
  const sizes = {
    sm: 'px-4 py-2 text-xs font-semibold',
    md: 'px-6 py-3 text-sm font-semibold',
    lg: 'px-8 py-4 text-base font-bold',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-black font-bold shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] border border-transparent hover:brightness-110',
    secondary: 'glassmorphism hover:bg-white/5 text-white border border-cyber-border hover:border-cyber-blue/40 shadow-none hover:shadow-[0_0_15px_rgba(0,242,254,0.15)]',
    danger: 'bg-gradient-to-r from-cyber-pink to-red-500 text-white font-bold shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] border border-transparent hover:brightness-110',
    glow: 'bg-transparent text-cyber-glow border border-cyber-glow/50 hover:border-cyber-glow hover:shadow-neon-green hover:text-black hover:bg-cyber-glow font-bold',
    text: 'bg-transparent text-cyber-gray hover:text-white transition-colors duration-200 border-transparent p-0 hover:underline',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Premium Button Shine Overlay (Primary & Danger only) */}
      {(variant === 'primary' || variant === 'danger') && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      )}
      
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 mr-2" />}
      <span className="relative z-10">{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 ml-2" />}
    </button>
  );
};

export default Button;
