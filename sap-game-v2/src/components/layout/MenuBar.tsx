import { 
  Building2, 
  Landmark, 
  Package,
  Receipt, 
  Mail, 
  Play,
  Eye,
  EyeOff,
  Zap,
  Settings,
  BarChart3
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import React, { useState } from 'react';
import { cn } from '../ui/Button';

interface MenuBarProps {
  onOpenBank: () => void;
  onOpenCommercial: () => void;
  onOpenConsultoria: () => void;
  onOpenEmail: () => void;
  onOpenFinanceiro?: () => void;
  onOpenDespesas?: () => void;
  onOpenSettings: () => void;
  onAdvanceTurn: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onOpenBank,
  onOpenCommercial,
  onOpenConsultoria,
  onOpenEmail,
  onOpenFinanceiro,
  onOpenDespesas,
  onOpenSettings,
  onAdvanceTurn
}) => {
  const { balance, currentRound, inbox, theme } = useGameStore();
  const unreadEmails = inbox.filter(e => !e.read).length;
  const [showTicker, setShowTicker] = useState(true);

  return (
    <div className={cn(
      "w-full fixed z-50 flex flex-col items-center px-1 sm:px-6 transition-all duration-300",
      theme === 'retro-2000' ? "top-0 px-0" : "top-2 sm:top-6"
    )}>
      {/* MAIN TOP BAR (Responsive) */}
      <div className={cn(
        "w-full max-w-6xl flex items-center justify-between relative overflow-hidden group transition-all duration-300",
        theme === 'modern-glass' ? "glass-panel h-14 sm:h-20 rounded-xl sm:rounded-2xl px-2 sm:px-8 border-b-2 border-neon-green/20" : "",
        theme === 'retro-2000' ? "bg-[#c0c0c0] border-b-2 border-b-[#808080] h-10 px-1 shadow-md max-w-full rounded-none" : "",
        theme === 'terminal-hacker' ? "bg-black border border-neon-green h-12 sm:h-14 rounded-sm px-2 sm:px-6" : "",
        theme === 'sap-blue' ? "bg-blue-800 h-12 sm:h-14 rounded-lg sm:rounded-xl px-2 sm:px-8 shadow-lg border-b border-blue-600" : "",
        theme === 'high-tech-red' ? "bg-black border-2 border-red-600 h-12 sm:h-14 rounded-none px-2 sm:px-6 shadow-[0_0_20px_rgba(220,38,38,0.3)]" : ""
      )}>
        {/* Vibrant Green Background Glow (Glass only) */}
        {theme === 'modern-glass' && (
          <>
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-green/20 via-transparent to-white/10 opacity-30 blur-3xl group-hover:opacity-60 transition-opacity duration-1000" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-green/40 to-transparent" />
          </>
        )}
        
        {/* Left: Balance */}
        <div className="flex items-center gap-2 sm:gap-4 relative z-10">
          <div className={cn(
            "flex flex-col items-start justify-center transition-all",
            theme === 'modern-glass' ? "bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-2 sm:px-6 py-1 sm:py-2.5 modern-shadow" : "",
            theme === 'retro-2000' ? "bg-black retro-inset px-2 sm:px-4 py-0.5 sm:py-1 flex-row items-center gap-1 sm:gap-2 h-7 sm:h-8" : "",
            theme === 'terminal-hacker' ? "bg-black border border-dashed border-neon-green px-3 py-1 sm:py-2" : "",
            theme === 'sap-blue' ? "bg-blue-900/50 rounded-lg px-2 sm:px-4 py-1 sm:py-1.5 border border-blue-700" : "",
            theme === 'high-tech-red' ? "bg-red-950/40 border border-red-500 px-3 sm:px-6 py-1 sm:py-2 shadow-[inset_0_0_10px_rgba(220,38,38,0.3)]" : ""
          )}>
            <span className={cn(
              "uppercase font-bold tracking-widest hidden lg:block",
              theme === 'modern-glass' ? "text-[10px] text-black/40 mb-0.5" : "",
              theme === 'sap-blue' ? "text-[9px] text-blue-300 mb-0.5" : ""
            )}>Disponível</span>
            <span className={cn(
              "font-digital tracking-tighter truncate",
              theme === 'modern-glass' ? "text-black text-base sm:text-2xl font-black tracking-tight" : "",
              theme === 'retro-2000' ? "text-neon-green text-sm sm:text-lg drop-shadow-[0_0_3px_rgba(56,211,26,0.5)]" : "",
              theme === 'terminal-hacker' ? "text-neon-green text-sm sm:text-xl" : "",
              theme === 'sap-blue' ? "text-white text-sm sm:text-xl font-sans font-bold tracking-normal" : "",
              theme === 'high-tech-red' ? "text-red-500 text-base sm:text-2xl drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]" : ""
            )}>
              $ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Center: Navigation (Visible only on Desktop/Tablet md+) */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-2 lg:gap-4 relative z-10 mx-2">
          <MenuButton icon={<Building2 size={20} />} label="Banco" onClick={onOpenBank} color="green" />
          <MenuButton icon={<Landmark size={20} />} label="Financeiro" onClick={onOpenFinanceiro || onOpenBank} color="green" />
          <MenuButton icon={<Package size={20} />} label="Estoque" onClick={() => {}} color="blue" />
          <MenuButton icon={<BarChart3 size={20} />} label="Comercial" onClick={onOpenCommercial} color="green" />
          <MenuButton icon={<Zap size={20} />} label="Melhorias" onClick={onOpenConsultoria} color="green" />
          <MenuButton icon={<Receipt size={20} />} label="Despesas" onClick={onOpenDespesas || onOpenFinanceiro || onOpenBank} color="green" />
          <MenuButton 
            icon={<Mail size={20} />} 
            label="E-mail" 
            onClick={onOpenEmail} 
            badge={unreadEmails > 0 ? unreadEmails : undefined} 
            color="green"
          />
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4 relative z-10">
          <div className="flex items-center border-r border-white/5 pr-1 sm:pr-4 mr-1 sm:mr-2 gap-1 sm:gap-2">
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
              {showTicker ? <EyeOff size={18} /> : <Eye size={18} />}
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
              <Settings size={18} />
            </button>
          </div>
          
          <button 
            onClick={onAdvanceTurn}
            className={cn(
              "flex items-center gap-2 group transition-all duration-300 shrink-0",
              theme === 'modern-glass' ? "bg-white text-black rounded-lg sm:rounded-xl px-3 sm:px-8 py-2 sm:py-3 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]" : "",
              theme === 'retro-2000' ? "bg-[#c0c0c0] retro-outset active:retro-inset px-2 h-7 sm:h-8" : "",
              theme === 'terminal-hacker' ? "bg-black border border-neon-green text-neon-green px-3 sm:px-6 py-1.5 sm:py-2 hover:bg-neon-green hover:text-black" : "",
              theme === 'sap-blue' ? "bg-blue-600 text-white rounded-lg px-3 sm:px-6 py-1.5 sm:py-2 hover:bg-blue-500 active:scale-95 shadow-md" : "",
              theme === 'high-tech-red' ? "bg-red-700 text-white border border-red-500 px-3 sm:px-8 py-1.5 sm:py-2 active:scale-95 hover:bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" : ""
            )}
          >
            <Play size={14} className={cn(
              "group-hover:translate-x-0.5 transition-transform",
              theme === 'modern-glass' || theme === 'sap-blue' || theme === 'high-tech-red' ? "fill-white" : "",
              theme === 'retro-2000' ? "text-black fill-black" : "",
              theme === 'terminal-hacker' ? "text-current fill-current" : ""
            )} />
            <span className={cn(
              "font-bold uppercase",
              theme === 'modern-glass' ? "tracking-widest text-[9px] sm:text-xs" : "",
              theme === 'retro-2000' ? "tracking-widest text-[8px] sm:text-[10px] text-black" : "",
              theme === 'terminal-hacker' ? "tracking-wider text-[9px] sm:text-xs" : "",
              theme === 'sap-blue' ? "tracking-wider text-[9px] sm:text-xs font-sans" : "",
              theme === 'high-tech-red' ? "tracking-widest text-[10px] sm:text-sm font-digital" : ""
            )}>
              <span className="hidden sm:inline">
                {theme === 'retro-2000' ? `START/R${currentRound}` : `Rodada ${currentRound}`}
              </span>
              <span className="sm:hidden">R{currentRound}</span>
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION (Visible only on < md) */}
      <div className={cn(
        "md:hidden fixed bottom-0 left-0 w-full z-50 transition-all duration-300 pb-safe",
        theme === 'modern-glass' ? "glass-panel h-20 rounded-t-3xl border-t border-white/10 px-4" : "",
        theme === 'retro-2000' ? "bg-[#c0c0c0] border-t-2 border-t-white h-16 px-2 flex items-center" : "",
        theme === 'terminal-hacker' ? "bg-black border-t border-neon-green h-16 px-4" : "",
        theme === 'sap-blue' ? "bg-blue-800 h-16 rounded-t-xl px-4 border-t border-blue-600" : "",
        theme === 'high-tech-red' ? "bg-black border-t-2 border-red-600 h-16 px-4 shadow-[0_-5px_20px_rgba(220,38,38,0.3)]" : ""
      )}>
        <nav className="flex items-center justify-around h-full w-full">
          <MenuButton icon={<Building2 size={24} />} label="Banco" onClick={onOpenBank} color="green" />
          <MenuButton icon={<Landmark size={24} />} label="Finance" onClick={onOpenFinanceiro || onOpenBank} color="green" />
          <MenuButton icon={<BarChart3 size={24} />} label="Com" onClick={onOpenCommercial} color="green" />
          <MenuButton icon={<Zap size={24} />} label="Up" onClick={onOpenConsultoria} color="green" />
          <MenuButton icon={<Receipt size={24} />} label="Bills" onClick={onOpenDespesas || onOpenFinanceiro || onOpenBank} color="green" />
          <MenuButton 
            icon={<Mail size={24} />} 
            label="E-mail" 
            onClick={onOpenEmail} 
            badge={unreadEmails > 0 ? unreadEmails : undefined} 
            color="green"
          />
        </nav>
      </div>

      {/* Floating Strategy Ticker (Visible on all screens) */}
      {showTicker && (
        <div className={cn(
          "mt-2 sm:mt-3 flex items-center overflow-hidden max-w-4xl w-full mx-auto animate-in fade-in slide-in-from-top-2 duration-500",
          theme === 'modern-glass' ? "bg-black/30 backdrop-blur-sm border border-white/5 h-8 rounded-full px-8" : "",
          theme === 'terminal-hacker' ? "bg-transparent border border-dashed border-neon-green/50 h-6 px-4" : ""
        )}>
          <div className="animate-ticker whitespace-nowrap">
            <span className="text-white font-bold text-[11px] uppercase tracking-[0.4em] flex gap-20 items-center justify-center">
              <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">ESTRATÉGIA: Infraestrutura avançada aumenta massivamente seu lucro por rodada.</span>
              <span className={cn(theme === 'terminal-hacker' ? 'text-neon-green' : 'text-blue-400', "drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]")}>MERCADO: O preço das SKUs varia conforme seu nível comercial.</span>
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

const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onClick, badge, color = 'green' }) => {
  const { theme } = useGameStore();
  const accentColor = color === 'green' ? 'text-neon-green' : 'text-white';

  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center transition-all relative group focus:outline-none shrink-0",
        theme === 'modern-glass' ? "min-w-[48px] sm:min-w-[80px] h-10 sm:h-14 rounded-lg sm:rounded-xl duration-300 active:scale-90" : "",
        theme === 'retro-2000' ? "gap-1 sm:gap-2 px-1 sm:px-3 h-7 sm:h-8 border border-transparent active:retro-inset flex-row" : "",
        theme === 'terminal-hacker' ? "min-w-[48px] sm:min-w-[80px] h-10 sm:h-12 border border-transparent" : "",
        theme === 'sap-blue' ? "min-w-[48px] sm:min-w-[70px] h-10 sm:h-12 rounded-lg active:bg-blue-600 mt-0 sm:mt-1" : "",
        theme === 'high-tech-red' ? "min-w-[48px] sm:min-w-[80px] h-10 sm:h-12 border border-transparent" : ""
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
        "uppercase font-bold tracking-widest transition-colors hidden md:block",
        theme === 'modern-glass' ? cn(
          "text-[9px] mt-1 transition-all duration-300",
          "text-black drop-shadow-[0_0_2px_rgba(255,255,255,0.8)] group-hover:text-black group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,1)]",
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
