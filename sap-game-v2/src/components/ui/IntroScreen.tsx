import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';

export const IntroScreen: React.FC = () => {
  const setHasSeenIntro = useGameStore((state) => state.setHasSeenIntro);
  const hasSeenIntro = useGameStore((state) => state.hasSeenIntro);
  const [isClosing, setIsClosing] = useState(false);

  // If already seen, don't render the screen
  if (hasSeenIntro) return null;

  const handleStart = () => {
    setIsClosing(true);
    setTimeout(() => {
      setHasSeenIntro(true);
    }, 500); // Wait for the fade out to finish
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden font-sans select-none transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      
      <div className="relative z-10 w-full max-w-lg md:max-w-xl px-4 animate-in zoom-in fade-in duration-700">
         <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-10 glow-purple flex flex-col items-center text-center">
            
            <h2 className="text-[#A855F7] text-2xl sm:text-3xl font-black uppercase tracking-widest mb-6">
              JORNADA DO CONHECIMENTO
            </h2>
            
            <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-4 mb-6">
              <p>
                Você começa com uma pequena fábrica de calçados, iniciando com produção terceirizada. 
                Aos poucos, com conhecimento e boas decisões, poderá expandir seu negócio e construir sua própria indústria.
              </p>
              <p>
                Enfrente desafios reais do dia a dia, aproveite oportunidades e evolua sua gestão.
              </p>
              <p>
                Durante a jornada, aprenda conceitos de administração, ERP (como SAP) e inglês.
              </p>
            </div>

            <p className="text-[#38D31A] font-bold text-sm sm:text-base mb-8">
              Seu objetivo: transformar sua fábrica em uma grande indústria. Boa sorte!
            </p>

            <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
              <button className="w-full py-2 bg-[#F97316] hover:bg-[#EA580C] text-white rounded font-bold uppercase text-xs tracking-wider transition-colors shadow-md">
                CRÉDITOS
              </button>
              
              <button className="w-full py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded font-bold uppercase text-xs tracking-wider transition-colors shadow-md">
                PASSWORD
              </button>
              
              <button 
                onClick={handleStart}
                className="w-full py-3 bg-[#A855F7] hover:bg-[#9333EA] text-white rounded-lg font-black uppercase text-sm tracking-widest transition-colors shadow-lg mt-2"
              >
                INICIAR JORNADA
              </button>
            </div>

         </div>
      </div>

    </div>
  );
};
