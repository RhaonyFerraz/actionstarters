import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { cn } from '../ui/Button';

const IMAGES = Array.from({ length: 11 }, (_, i) => `${import.meta.env.BASE_URL}cenario1/${String(i + 1).padStart(2, '0')}.png`);

export const BackgroundCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { theme } = useGameStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 20000); // 20 segundos

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black flex items-center justify-center">
      {(theme === 'modern-glass' || theme === 'retro-2000' || theme === 'sap-blue') ? (
        <>
          {IMAGES.map((img, index) => (
            <div 
              key={img}
              className={cn(
                "absolute inset-0 transition-opacity duration-2000 ease-in-out", // 2 seconds fade
                currentIndex === index ? "opacity-100" : "opacity-0"
              )}
              style={{ 
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          ))}
          
          {/* Overlay suave para melhorar legibilidade, sem embaçar ou alterar cores (igual para SAP, Glass e Retro) */}
          <div className="absolute inset-0 bg-black/20" />
        </>
      ) : theme === 'terminal-hacker' ? (
        <div className="absolute inset-0 pointer-events-none pb-20 opacity-10 bg-black">

           <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(56,211,26,0.1)_0,transparent_100%)]"></div>
        </div>
      ) : theme === 'high-tech-red' ? (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950 via-black to-black opacity-80" />
      ) : null}
    </div>
  );

};
