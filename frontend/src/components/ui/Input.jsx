import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold tracking-wider text-cyber-gray ml-1 uppercase">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-cyber-gray/60 pointer-events-none transition-colors duration-300 group-focus-within:text-cyber-blue">
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
        
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          ref={ref}
          className={`
            w-full px-4 py-3.5 bg-[#050811]/90 text-white rounded-xl border border-cyber-border/80
            backdrop-blur-xl focus:outline-none transition-all duration-500 text-sm font-medium
            ${Icon ? 'pl-12' : 'pl-4'}
            ${isPassword ? 'pr-12' : 'pr-4'}
            ${error ? 'border-cyber-pink/50 shadow-neon-pink/15' : 'focus:border-cyber-blue/50 focus:shadow-[0_0_20px_rgba(0,242,254,0.15)]'}
            placeholder:text-gray-700
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-cyber-gray hover:text-white transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
          </button>
        )}
      </div>

      {error && (
        <span className="text-[10px] text-cyber-pink font-semibold ml-1 uppercase tracking-wider">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
