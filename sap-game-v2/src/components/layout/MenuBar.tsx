import { 
  Building2, 
  PiggyBank, 
  Package, 
  Receipt, 
  Mail, 
  Play,
  Eye,
  EyeOff,
  Zap,
  Settings
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import React, { useState } from 'react';

interface MenuBarProps {
  onOpenBank: () => void;
  onOpenCommercial: () => void;
  onOpenConsultoria: () => void;
  onOpenEmail: () => void;
  onOpenFinanceiro?: () => void;
  onOpenInventario?: () => void;
  onOpenDespesas?: () => void;
  onOpenSettings: () => void;
  onAdvanceTurn: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onOpenBank,
  onOpenCommercial,
  onOpenConsultoria,
  onOpenEmail,
  onOpenSettings,
  onAdvanceTurn
}) => {
  const { balance, currentRound, inbox, theme } = useGameStore();
  const unreadEmails = inbox.filter(e => !e.read).length;
  const [showTicker, setShowTicker] = useState(true);

  return (
    <div className={`w-full fixed top-6 left-0 z-50 flex flex-col items-center px-6 ${theme === 'retro-2000' ? 'top-0 px-0' : ''}`}>
      {/* Floating Modern Bar / Retro Toolbar */}
      <div className={cn(
        "w-full max-w-6xl flex items-center justify-between relative overflow-hidden group transition-all duration-300",
        theme === 'modern-glass' ? "glass-panel h-20 rounded-2xl px-8 border-b-2 border-neon-green/20" : "",
        theme === 'retro-2000' ? "bg-[#c0c0c0] border-b-2 border-b-[#808080] h-12 px-2 shadow-md max-w-full rounded-none" : "",
        theme === 'terminal-hacker' ? "bg-black border border-neon-green h-16 rounded-sm px-6" : "",
        theme === 'sap-blue' ? "bg-blue-800 h-16 rounded-xl px-8 shadow-lg border-b border-blue-600" : "",
        theme === 'high-tech-red' ? "bg-black border-2 border-red-600 h-16 rounded-none px-6 shadow-[0_0_20px_rgba(220,38,38,0.3)]" : ""
      )}>
        {/* Vibrant Green Background Glow (Glass only) */}
        {theme === 'modern-glass' && (
          <>
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-green/20 via-transparent to-white/10 opacity-30 blur-3xl group-hover:opacity-60 transition-opacity duration-1000" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-green/40 to-transparent" />
          </>
        )}
        
        {/* Left: Balance */}
        <div className="flex items-center gap-4 relative z-10">
          <div className={cn(
            "flex flex-col items-start justify-center",
            theme === 'modern-glass' ? "bg-white/5 border border-white/10 rounded-xl px-6 py-2.5 modern-shadow" : "",
            theme === 'retro-2000' ? "bg-black retro-inset px-4 py-1 flex-row items-center gap-2 h-8" : "",
            theme === 'terminal-hacker' ? "bg-black border border-dashed border-neon-green px-4 py-2" : "",
            theme === 'sap-blue' ? "bg-blue-900/50 rounded-lg px-4 py-1.5 border border-blue-700" : "",
            theme === 'high-tech-red' ? "bg-red-950/40 border border-red-500 px-6 py-2 shadow-[inset_0_0_10px_rgba(220,38,38,0.3)]" : ""
          )}>
            <span className={cn(
              "uppercase font-bold tracking-widest",
              theme === 'modern-glass' ? "text-[10px] text-gray-400 mb-0.5" : "",
              theme === 'retro-2000' || theme === 'terminal-hacker' || theme === 'high-tech-red' ? "hidden" : "",
              theme === 'sap-blue' ? "text-[9px] text-blue-300 mb-0.5" : ""
            )}>Disponível</span>
            <span className={cn(
              "font-digital tracking-tighter",
              theme === 'modern-glass' ? "text-neon-green text-2xl drop-shadow-[0_0_10px_rgba(56,211,26,0.6)]" : "",
              theme === 'retro-2000' ? "text-neon-green text-lg drop-shadow-[0_0_3px_rgba(56,211,26,0.5)]" : "",
              theme === 'terminal-hacker' ? "text-neon-green text-xl" : "",
              theme === 'sap-blue' ? "text-white text-xl font-sans font-bold tracking-normal" : "",
              theme === 'high-tech-red' ? "text-red-500 text-2xl drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]" : ""
            )}>
              $ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Center: Navigation (Modern Icons) */}
        <nav className="flex items-center gap-2 relative z-10">
          <MenuButton icon={<Building2 size={22} />} label="Banco" onClick={onOpenBank} color="green" />
          <MenuButton icon={<PiggyBank size={22} />} label="Financeiro" onClick={onOpenBank} color="green" />
          <MenuButton icon={<Package size={22} />} label="Inventário" onClick={onOpenCommercial} color="green" />
          <MenuButton icon={<Zap size={22} />} label="Melhorias" onClick={onOpenConsultoria} color="green" />
          <MenuButton icon={<Receipt size={22} />} label="Despesas" onClick={onOpenBank} color="green" />
          <MenuButton 
            icon={<Mail size={22} />} 
            label="E-mail" 
            onClick={onOpenEmail} 
            badge={unreadEmails > 0 ? unreadEmails : undefined} 
            color="green"
          />
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4 relative z-10">
          <div className="flex items-center border-r border-white/5 pr-2 md:pr-4 mr-0 md:mr-2 gap-2">
            <button 
              onClick={() => setShowTicker(!showTicker)}
              className={cn(
                "flex items-center justify-center transition-all",
                theme === 'modern-glass' ? "p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl duration-300" : "",
                theme === 'retro-2000' ? "w-8 h-8 bg-[#c0c0c0] retro-outset active:retro-inset text-black" : "",
                theme === 'terminal-hacker' ? "p-2 text-neon-green hover:bg-neon-green/20 border border-transparent" : "",
                theme === 'sap-blue' ? "p-2 text-blue-200 hover:text-white hover:bg-blue-700 rounded-lg" : "",
                theme === 'high-tech-red' ? "p-2 text-red-500 hover:text-white" : ""
              )}
              title={showTicker ? "Ocultar Letreiro" : "Mostrar Letreiro"}
            >
              {showTicker ? <EyeOff size={theme === 'modern-glass' || theme === 'sap-blue' ? 20 : 16} /> : <Eye size={theme === 'modern-glass' || theme === 'sap-blue' ? 20 : 16} />}
            </button>

            <button 
              onClick={onOpenSettings}
              className={cn(
                "flex items-center justify-center transition-all",
                theme === 'modern-glass' ? "p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl duration-300" : "",
                theme === 'retro-2000' ? "w-8 h-8 bg-[#c0c0c0] retro-outset active:retro-inset text-black" : "",
                theme === 'terminal-hacker' ? "p-2 text-neon-green hover:bg-neon-green hover:text-black border border-transparent hover:border-neon-green" : "",
                theme === 'sap-blue' ? "p-2 text-blue-200 hover:text-white hover:bg-blue-700 rounded-lg" : "",
                theme === 'high-tech-red' ? "p-2 text-red-500 hover:text-white hover:bg-red-600 border border-transparent hover:border-red-500 rounded-sm" : ""
              )}
              title="Configurações (Temas)"
            >
              <Settings size={theme === 'modern-glass' || theme === 'sap-blue' ? 20 : 16} />
            </button>
          </div>
          
          <button 
            onClick={onAdvanceTurn}
            className={cn(
              "flex items-center gap-2 group transition-all duration-300",
              theme === 'modern-glass' ? "bg-white text-black rounded-xl px-8 py-3 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]" : "",
              theme === 'retro-2000' ? "bg-[#c0c0c0] retro-outset active:retro-inset px-4 h-8" : "",
              theme === 'terminal-hacker' ? "bg-black border border-neon-green text-neon-green px-6 py-2 hover:bg-neon-green hover:text-black" : "",
              theme === 'sap-blue' ? "bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-500 active:scale-95 shadow-md" : "",
              theme === 'high-tech-red' ? "bg-red-700 text-white border border-red-500 px-8 py-2 active:scale-95 hover:bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" : ""
            )}
          >
            <Play size={16} className={cn(
              "group-hover:translate-x-0.5 transition-transform",
              theme === 'modern-glass' || theme === 'sap-blue' || theme === 'high-tech-red' ? "fill-white" : "",
              theme === 'retro-2000' ? "text-black fill-black" : "",
              theme === 'terminal-hacker' ? "text-current fill-current" : ""
            )} />
            <span className={cn(
              "font-bold uppercase",
              theme === 'modern-glass' ? "tracking-[0.2em] text-xs" : "",
              theme === 'retro-2000' ? "tracking-widest text-[10px] text-black" : "",
              theme === 'terminal-hacker' ? "tracking-[0.3em] text-xs" : "",
              theme === 'sap-blue' ? "tracking-wider text-xs font-sans" : "",
              theme === 'high-tech-red' ? "tracking-widest text-sm font-digital" : ""
            )}>
              {theme === 'retro-2000' ? `START/${currentRound}` : `Iniciar Rodada ${currentRound}`}
            </span>
          </button>
        </div>
      </div>

      {/* Floating Strategy Ticker - Hide on retro for cleaner look, show differently on terminal */}
      {theme !== 'retro-2000' && showTicker && (
      <div className={cn(
        "mt-3 flex items-center overflow-hidden max-w-4xl w-full mx-auto animate-in fade-in slide-in-from-top-2 duration-500",
        theme === 'modern-glass' ? "bg-black/30 backdrop-blur-sm border border-white/5 h-8 rounded-full px-8" : "",
        theme === 'terminal-hacker' ? "bg-transparent border border-dashed border-neon-green/50 h-6 px-4" : ""
      )}>
        <div className="animate-ticker whitespace-nowrap">
          <span className="text-white font-bold text-[11px] uppercase tracking-[0.4em] flex gap-20 items-center justify-center">
            <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">ESTRATÉGIA: Infraestrutura avançada aumenta massivamente seu lucro por rodada.</span>
            <span className={cn(theme === 'terminal-hacker' ? 'text-neon-green' : 'text-neon-cyan', "drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]")}>MERCADO: O preço das SKUs varia conforme seu nível comercial.</span>
            <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">UPDATE: Novo sistema de gestão SAP ativo.</span>
          </span>
        </div>
      </div>
      )}
    </div>
  );
};

interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  badge?: number;
  color?: 'green' | 'purple';
}

import { cn } from '../ui/Button';

const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onClick, badge, color = 'green' }) => {
  const { theme } = useGameStore();
  const accentColor = color === 'green' ? 'text-neon-green' : 'text-white';

  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center transition-all relative group focus:outline-none",
        theme === 'modern-glass' ? "min-w-[80px] h-14 rounded-xl duration-300 active:scale-90" : "",
        theme === 'retro-2000' ? "gap-2 px-3 h-8 border border-transparent active:retro-inset flex-row" : "",
        theme === 'terminal-hacker' ? "min-w-[80px] h-12 border border-transparent" : "",
        theme === 'sap-blue' ? "min-w-[70px] h-12 rounded-lg active:bg-blue-600 mt-1" : "",
        theme === 'high-tech-red' ? "min-w-[80px] h-12 border border-transparent" : ""
      )}
    >
      <div className={cn(
        accentColor,
        "transition-all duration-300 group-hover:scale-125 group-hover:brightness-150",
        theme === 'modern-glass' ? cn(
          color === 'green' 
            ? "drop-shadow-[0_0_8px_rgba(56,211,26,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(56,211,26,0.8)]" 
            : "drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
        ) : "",
        theme === 'retro-2000' ? "filter drop-shadow-[0_0_2px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_8px_rgba(56,211,26,0.8)]" : "",
        theme === 'terminal-hacker' ? "text-neon-green group-hover:drop-shadow-[0_0_15px_rgba(56,211,26,0.9)]" : "",
        theme === 'sap-blue' ? "text-blue-100 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" : "",
        theme === 'high-tech-red' ? "text-red-500 filter drop-shadow-[0_0_5px_currentColor] group-hover:drop-shadow-[0_0_15px_red]" : ""
      )}>
        {icon}
      </div>
      <span className={cn(
        "uppercase font-bold tracking-widest transition-colors",
        theme === 'modern-glass' ? cn(
          "text-[9px] mt-1 transition-all duration-300",
          "text-gray-500 group-hover:text-white",
          color === 'green' ? "group-hover:drop-shadow-[0_0_8px_rgba(56,211,26,0.5)]" : "group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
        ) : "",
        theme === 'retro-2000' ? "text-[10px] hidden lg:block text-black" : "",
        theme === 'terminal-hacker' ? "text-[8px] mt-1 text-neon-green" : "",
        theme === 'sap-blue' ? "text-[8px] mt-1 text-blue-200 group-hover:text-white font-sans" : "",
        theme === 'high-tech-red' ? "text-[9px] mt-1 text-red-500 font-digital" : ""
      )}>
        {label}
      </span>
      {badge !== undefined && (
        <span className={cn(
          "flex items-center justify-center text-black font-black",
          theme === 'modern-glass' ? `absolute -top-1 -right-1 ${color === 'green' ? 'bg-neon-green' : 'bg-white'} text-[9px] h-4 min-w-[16px] px-1 rounded-full border border-black shadow-[0_0_10px_rgba(0,0,0,0.5)]` : "",
          theme === 'retro-2000' ? `ml-1 ${color === 'green' ? 'bg-neon-green' : 'bg-white'} text-[9px] h-4 px-1 border border-black shadow-[1px_1px_0_white]` : "",
          theme === 'terminal-hacker' ? "ml-1 bg-neon-green text-[9px] h-4 px-1" : "",
          theme === 'sap-blue' ? "absolute -top-1 -right-1 bg-yellow-400 text-blue-900 text-[10px] h-4 min-w-[16px] rounded-full shadow-md font-sans" : "",
          theme === 'high-tech-red' ? "absolute top-0 right-0 bg-white text-red-700 text-[9px] h-4 px-1 border border-red-500 font-digital" : ""
        )}>
          {badge}
        </span>

      )}
    </button>
  );
};
