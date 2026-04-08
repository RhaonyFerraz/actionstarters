import React, { useState } from 'react';
import { Lightbulb, X, ChevronRight } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { cn } from './Button';

const GAME_TIPS = [
  "No módulo Comercial de nível 1, os preços de compra são muito altos. Invista no nível 2 para importar matéria-prima pela metade do preço!",
  "Cuidado com o fluxo de caixa: Dívidas crescem com juros. Sempre reserve capital para pagar os impostos na transição de turno.",
  "Invista na Consultoria! Ela garante bônus constantes de receita ou redução de custos a cada nova rodada.",
  "Maquinário moderno é a chave: ter maquinaria avança sua capacidade de produzir e faturar mais pontos em cada jogada.",
  "Mantenha a barra de navegação superior sempre à vista. O saldo verde é tudo que separa sua empresa da falência iminente.",
  "Sempre leia os seus E-mails! Eventos aleatórios e mensagens importantes do banco ocorrem no correio corporativo.",
  "Dúvidas? O módulo 'Jornada' faz perguntas de múltipla escolha. Acertar engaja bônus extras de conhecimento e balanço rápido!"
];

export const HintSystem: React.FC = () => {
  const { theme } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTip = () => {
    setCurrentIndex((prev) => (prev + 1) % GAME_TIPS.length);
  };

  const currentTip = GAME_TIPS[currentIndex];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end animate-in fade-in slide-in-from-bottom-5 duration-500">
      
      {/* Botão Retrátil */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className={cn(
            "p-3 lg:p-4 rounded-full shadow-2xl transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 group",
            theme === 'retro-2000' ? "bg-[#c0c0c0] retro-outset active:retro-inset p-3 rounded-none" : 
            theme === 'terminal-hacker' ? "bg-black border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-black rounded-sm shadow-[0_0_15px_rgba(56,211,26,0.5)]" :
            theme === 'sap-blue' ? "bg-yellow-400 text-blue-900 border-2 border-yellow-500 shadow-md" :
            theme === 'high-tech-red' ? "bg-red-800 text-white border border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)]" :
            // Default Glass
            "glass-panel text-yellow-400 bg-white/5 border border-yellow-400/30 shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]"
          )}
          title="Dicas do Consultor"
        >
          <Lightbulb size={24} className={theme === 'modern-glass' ? "animate-pulse drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]" : ""} />
        </button>
      )}

      {/* Janela de Dica Aberta */}
      {isOpen && (
        <div className={cn(
          "w-80 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200",
          theme === 'retro-2000' ? "bg-[#c0c0c0] retro-outset" : 
          theme === 'terminal-hacker' ? "bg-black border border-neon-green" :
          theme === 'sap-blue' ? "bg-white border-blue-600 border rounded-lg" :
          theme === 'high-tech-red' ? "bg-red-950/80 border border-red-500 rounded-sm" :
          // Default Glass
          "glass-panel rounded-2xl border border-white/10 backdrop-blur-md bg-black/40"
        )}>
          {/* Header */}
          <div className={cn(
            "flex justify-between items-center px-4 py-3 border-b box-border",
            theme === 'retro-2000' ? "bg-gradient-to-r from-blue-800 to-blue-400 border-blue-900 text-white p-1" :
            theme === 'terminal-hacker' ? "border-neon-green/30 bg-neon-green/10 text-neon-green" :
            theme === 'sap-blue' ? "bg-blue-100 border-blue-200 text-blue-900" :
            theme === 'high-tech-red' ? "bg-red-900/50 border-red-500/30 text-white" :
            // Default Glass
            "border-white/10 bg-white/5 text-neon-green"
          )}>
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className={theme === 'retro-2000' ? "text-yellow-300" : ""} />
              <span className={cn(
                "font-bold uppercase tracking-widest text-xs",
                theme !== 'sap-blue' && theme !== 'retro-2000' ? "font-digital" : ""
              )}>Dica do Consultor</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className={cn(
                "hover:text-red-500 transition-colors",
                theme === 'retro-2000' ? "bg-[#c0c0c0] retro-outset w-5 h-5 flex items-center justify-center text-black font-sans pb-0.5 active:retro-inset" : ""
              )}
            >
              {theme === 'retro-2000' ? "x" : <X size={18} />}
            </button>
          </div>
          
          {/* Corpo da Dica */}
          <div className={cn(
            "p-5 text-sm leading-relaxed",
            theme === 'retro-2000' ? "bg-white text-black font-sans" :
            theme === 'terminal-hacker' ? "text-neon-green font-mono" :
            theme === 'sap-blue' ? "text-gray-700 font-sans" :
            theme === 'high-tech-red' ? "text-red-200" :
            "text-gray-300"
          )}>
            {currentTip}
          </div>

          {/* Footer / Botões */}
          <div className={cn(
            "flex justify-between items-center px-4 py-3 border-t",
            theme === 'retro-2000' ? "bg-[#c0c0c0] border-[#dfdfdf]" :
            theme === 'terminal-hacker' ? "border-neon-green/30 bg-black" :
            theme === 'sap-blue' ? "bg-gray-50 border-gray-200" :
            theme === 'high-tech-red' ? "border-red-500/30 bg-black/40" :
            "border-white/5 bg-black/20"
          )}>
            <div className={cn(
              "text-xs",
              theme === 'terminal-hacker' ? "text-neon-green/50" : "text-gray-500"
            )}>
              {currentIndex + 1} / {GAME_TIPS.length}
            </div>
            <button 
              onClick={nextTip}
              className={cn(
                "flex items-center gap-1 text-xs font-bold uppercase transition-all",
                theme === 'retro-2000' ? "bg-[#c0c0c0] text-black px-2 py-1 retro-outset active:retro-inset" :
                theme === 'terminal-hacker' ? "text-neon-green border border-neon-green px-2 hover:bg-neon-green hover:text-black" :
                theme === 'sap-blue' ? "bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" :
                theme === 'high-tech-red' ? "text-white hover:text-red-400 px-2 py-1 border border-red-500/50 hover:bg-red-900/50" :
                "text-white hover:text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10"
              )}
            >
              Próxima <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
