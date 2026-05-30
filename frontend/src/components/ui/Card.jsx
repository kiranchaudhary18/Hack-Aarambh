import React from 'react';

const Card = ({
  children,
  className = '',
  glowColor = 'cyan', // cyan, green, purple, pink, none
  hoverGlow = true,
  clay = true, // uses claymorphic styling
  gradientBorder = true,
  ...props
}) => {
  const baseStyles = 'rounded-30px p-6 transition-all duration-500 border border-cyber-border/40 backdrop-blur-2xl relative overflow-hidden';
  
  const shadowGlows = {
    cyan: 'shadow-[0_15px_35px_rgba(0,0,0,0.5)] border-cyber-blue/10 hover:border-cyber-blue/30',
    green: 'shadow-[0_15px_35px_rgba(0,0,0,0.5)] border-cyber-glow/10 hover:border-cyber-glow/30',
    purple: 'shadow-[0_15px_35px_rgba(0,0,0,0.5)] border-cyber-purple/10 hover:border-cyber-purple/30',
    pink: 'shadow-[0_15px_35px_rgba(0,0,0,0.5)] border-cyber-pink/10 hover:border-cyber-pink/30',
    none: 'shadow-[0_15px_35px_rgba(0,0,0,0.5)]',
  };

  const styleClass = clay ? 'claymorphism' : 'glassmorphism';
  const glowClass = shadowGlows[glowColor] || '';
  const hoverClass = hoverGlow ? 'hover-lift' : '';
  const borderGradientClass = gradientBorder ? 'gradient-border-card' : '';

  return (
    <div
      className={`${baseStyles} ${styleClass} ${glowClass} ${hoverClass} ${borderGradientClass} ${className}`}
      {...props}
    >
      {/* Dynamic Background Neon Reflection */}
      {glowColor !== 'none' && (
        <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-[40px] opacity-10 pointer-events-none ${
          glowColor === 'cyan' ? 'bg-cyber-blue' :
          glowColor === 'green' ? 'bg-cyber-glow' :
          glowColor === 'purple' ? 'bg-cyber-purple' :
          glowColor === 'pink' ? 'bg-cyber-pink' : ''
        }`} />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 flex items-center justify-between gap-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold tracking-tight text-white font-sans ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-xs text-cyber-gray leading-relaxed mt-1 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`space-y-4 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-cyber-border/40 flex items-center justify-end gap-3 ${className}`}>{children}</div>
);

export default Card;
