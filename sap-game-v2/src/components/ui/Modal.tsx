import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from './Button';
import { useGameStore } from '../../store/useGameStore';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  forceTheme?: 'modern-glass' | 'retro-2000' | 'terminal-hacker' | 'sap-blue' | 'high-tech-red';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className, forceTheme }) => {
  const { theme: globalTheme } = useGameStore();
  const theme = forceTheme || globalTheme;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300",
      theme === 'modern-glass' ? "bg-slate-950/60" : "bg-black/80"
    )}>
      <div 
        className={cn(
          "w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]", 
          theme === 'modern-glass' ? "glass-panel rounded-3xl modern-shadow border-white/5" : "",
          theme === 'retro-2000' ? "bg-[#c0c0c0] retro-outset rounded-none p-1" : "",
          theme === 'terminal-hacker' ? "bg-black terminal-border rounded-sm" : "",
          theme === 'sap-blue' ? "bg-white rounded-lg shadow-2xl border border-blue-200" : "",
          theme === 'high-tech-red' ? "bg-black/90 border-2 border-red-600 rounded-none shadow-[0_0_30px_rgba(220,38,38,0.4)]" : "",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between px-8 py-4",
          theme === 'modern-glass' ? "border-b border-white/5 bg-white/5 py-6" : "",
          theme === 'retro-2000' ? "bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1 mb-2" : "",
          theme === 'terminal-hacker' ? "border-b border-dashed border-neon-green bg-black" : "",
          theme === 'sap-blue' ? "bg-blue-700 text-white border-b border-blue-800" : "",
          theme === 'high-tech-red' ? "bg-red-950/50 border-b-2 border-red-600" : ""
        )}>
          <div className="flex flex-col">
            <h2 className={cn(
              "text-2xl font-bold tracking-tight uppercase leading-none truncate",
              theme === 'modern-glass' ? "font-digital text-white" : "",
              theme === 'retro-2000' ? "text-base font-sans font-bold text-white tracking-normal" : "",
              theme === 'terminal-hacker' ? "font-digital text-neon-green shadow-none text-xl" : "",
              theme === 'sap-blue' ? "font-sans font-semibold text-xl tracking-normal" : "",
              theme === 'high-tech-red' ? "font-digital text-red-500 shadow-[0_0_10px_rgba(220,38,38,0.8)]" : ""
            )}>{title}</h2>

            {theme === 'modern-glass' && (
              <div className="h-1 w-12 bg-neon-purple mt-2 rounded-full shadow-[0_0_10px_rgba(191,0,255,0.8)]" />
            )}
          </div>
          <button 
            onClick={onClose}
            className={cn(
              "transition-all flex items-center justify-center focus:outline-none",
              theme === 'modern-glass' ? "p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 duration-300 border border-white/5" : "",
              theme === 'retro-2000' ? "retro-outset active:retro-inset bg-[#c0c0c0] w-6 h-6 hover:bg-[#dfdfdf]" : "",
              theme === 'terminal-hacker' ? "text-neon-green hover:bg-neon-green hover:text-black border border-neon-green w-8 h-8 font-black" : "",
              theme === 'sap-blue' ? "text-blue-100 hover:text-white hover:bg-blue-600 p-2 rounded-lg" : "",
              theme === 'high-tech-red' ? "text-red-500 hover:bg-red-600 hover:text-black border border-red-600 p-2" : ""
            )}
          >
            {theme === 'retro-2000' ? <span className="text-black font-bold font-sans text-sm pb-[2px]">X</span> : <X size={theme === 'modern-glass' || theme === 'sap-blue' ? 24 : 18} />}
          </button>
        </div>
        
        {/* Content (Scrollable) */}
        <div className={cn(
          "flex-1 overflow-y-auto p-8 custom-scrollbar",
          theme === 'retro-2000' ? "retro-inset bg-white p-6 m-1 text-black" : "",
          theme === 'terminal-hacker' ? "bg-black text-neon-green p-6" : "",
          theme === 'sap-blue' ? "bg-[#f4f4f4] text-gray-800 p-6 font-sans" : "",
          theme === 'high-tech-red' ? "bg-black text-red-50 p-6" : ""
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};
