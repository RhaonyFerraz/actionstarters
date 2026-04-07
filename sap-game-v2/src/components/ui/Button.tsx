import React from 'react';
import { useGameStore } from '../../store/useGameStore';

// Um utilitário simples para juntar classes Tailwind condicionalmente
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'neon' | 'glass' | 'retro' | 'terminal' | 'sap' | 'alert';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const { theme } = useGameStore();

    // Map themes to specific button styles automatically if not overridden by the user explicitly
    let activeVariant = variant;
    if (variant === 'primary' || variant === 'glass') {
      if (theme === 'retro-2000') activeVariant = 'retro';
      if (theme === 'terminal-hacker') activeVariant = 'terminal';
      if (theme === 'sap-blue') activeVariant = 'sap';
      if (theme === 'high-tech-red') activeVariant = 'alert';
    }

    const variants: Record<string, string> = {
      primary: 'bg-neon-purple text-white hover:bg-purple-600 shadow-[0_0_15px_rgba(191,0,255,0.3)] transition-all active:scale-95',
      secondary: theme === 'retro-2000' ? 'bg-[#c0c0c0] text-black retro-outset active:retro-inset' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm',
      danger: theme === 'retro-2000' ? 'bg-red-200 text-red-900 border border-red-500 retro-outset' : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all',
      success: theme === 'retro-2000' ? 'bg-green-200 text-green-900 border border-green-500 retro-outset' : 'bg-neon-green/10 text-neon-green border border-neon-green/20 hover:bg-neon-green/20 transition-all',
      ghost: theme === 'retro-2000' ? 'bg-transparent text-gray-600 hover:text-black border border-transparent' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
      neon: 'bg-black/60 border border-neon-green/30 text-neon-green hover:border-neon-green hover:neon-bloom-green transition-all font-digital tracking-widest',
      glass: 'glass-button text-white neon-bloom-purple active:scale-95',
      retro: 'bg-[#c0c0c0] text-black retro-outset active:retro-inset uppercase font-sans font-bold tracking-widest text-sm',
      terminal: 'bg-black text-neon-green border border-neon-green hover:bg-neon-green hover:text-black uppercase font-digital text-lg shadow-[0_0_10px_rgba(56,211,26,0.2)]',
      sap: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md border border-blue-500 rounded-lg active:scale-95 font-sans',
      alert: 'bg-red-600/90 text-white hover:bg-red-500 border border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)] active:scale-95 uppercase font-digital tracking-widest'
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg font-semibold',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none font-medium',
          theme === 'modern-glass' ? 'rounded-xl' : 'rounded-none',
          variants[activeVariant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
