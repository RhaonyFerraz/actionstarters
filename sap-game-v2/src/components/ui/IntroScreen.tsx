import React, { useState, useCallback, useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Play, Database, ShieldCheck } from 'lucide-react';

const Particles: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 10}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-white/20 rounded-full animate-float-slow"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
};

export const IntroScreen: React.FC = () => {
  const [phase, setPhase] = useState<'interaction' | 'animating' | 'finished'>('interaction');
  const [isExiting, setIsExiting] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const setHasSeenIntro = useGameStore((state) => state.setHasSeenIntro);
  const hasSeenIntro = useGameStore((state) => state.hasSeenIntro);

  const playImpactSound = useCallback(() => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    // Whoosh layer (Crescendo)
    const noise = ctx.createOscillator();
    const noiseGain = ctx.createGain();
    noise.type = 'sine';
    noise.frequency.setValueAtTime(50, now);
    noise.frequency.exponentialRampToValueAtTime(1200, now + 1.2);
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.3, now + 1.2);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    
    // Main Thud (Impact)
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(160, now + 1.2);
    thud.frequency.exponentialRampToValueAtTime(30, now + 2.5);
    thudGain.gain.setValueAtTime(0, now);
    thudGain.gain.setValueAtTime(0.8, now + 1.2);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 3);
    thud.connect(thudGain);
    thudGain.connect(ctx.destination);

    // High Digital Click
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = 'square';
    click.frequency.setValueAtTime(3000, now + 1.2);
    clickGain.gain.setValueAtTime(0, now);
    clickGain.gain.setValueAtTime(0.05, now + 1.2);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
    click.connect(clickGain);
    clickGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 1.2);
    thud.start(now + 1.2);
    thud.stop(now + 3);
    click.start(now + 1.2);
    click.stop(now + 1.3);
  }, []);

  const handleStart = () => {
    setPhase('animating');
    playImpactSound();
    
    // Glitch moments
    setTimeout(() => setGlitchActive(true), 1200);
    setTimeout(() => setGlitchActive(false), 1400);
    setTimeout(() => setGlitchActive(true), 3200);
    setTimeout(() => setGlitchActive(false), 3300);

    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setHasSeenIntro(true);
        setPhase('finished');
      }, 1200);
    }, 5500);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasSeenIntro(true);
    setPhase('finished');
  };

  if (hasSeenIntro || phase === 'finished') return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden transition-all duration-1000 ${isExiting ? 'animate-fade-out-intro' : ''}`}>
      
      {/* Background Particles Layer */}
      <Particles />

      {/* Radial Gradient Glow */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent pointer-events-none" />

      {phase === 'interaction' ? (
        <div className="text-center z-10">
          <button 
            onClick={handleStart}
            className="group relative flex flex-col items-center gap-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
              <div className="w-28 h-28 rounded-full border-2 border-white/20 flex items-center justify-center transition-all duration-700 bg-black/40 backdrop-blur-sm group-hover:border-purple-500 group-hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] group-hover:scale-110 relative z-10">
                <Play size={44} className="text-white fill-white transition-colors group-hover:text-purple-400 group-hover:fill-purple-400 translate-x-1" />
              </div>
            </div>
            <div className="space-y-3 relative z-10">
              <h2 className="text-white font-black text-xl sm:text-2xl tracking-[0.6em] uppercase animate-in fade-in slide-in-from-bottom duration-1000">CLIQUE PARA INICIAR</h2>
              <div className="flex items-center justify-center gap-3 opacity-30 group-hover:opacity-60 transition-opacity">
                <ShieldCheck size={14} className="text-purple-400" />
                <p className="text-white text-[10px] font-black uppercase tracking-widest">Acesso Autorizado SAP ERP</p>
              </div>
            </div>
          </button>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center w-full px-4">
          
          {/* Skip Button */}
          <button 
            onClick={handleSkip}
            className="absolute -top-40 right-4 sm:-top-52 sm:right-10 text-[10px] font-black text-white/20 hover:text-white uppercase tracking-[0.4em] transition-all border border-white/10 px-6 py-3 rounded-full bg-black/40 backdrop-blur-sm active:scale-95"
          >
            Pular Introdução
          </button>

          {/* Logo Animation with High Polish */}
          <div className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-12 animate-slow-zoom ${glitchActive ? 'animate-glitch' : ''}`}>
            <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black text-metallic tracking-tighter animate-reveal-logo opacity-0 drop-shadow-2xl" style={{ animationDelay: '1.2s' }}>
              ACTION
            </h1>
            <h1 
              className={`text-6xl sm:text-8xl md:text-[10rem] font-black text-[#A855F7] tracking-tighter animate-reveal-logo animate-flicker opacity-0 drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]`}
              style={{ 
                animationDelay: '1.8s',
                textShadow: '0 0 20px rgba(168,85,247,1), 0 0 50px rgba(168,85,247,0.6), 0 0 100px rgba(168,85,247,0.3)'
              }}
            >
              STARTERS
            </h1>
          </div>

          {/* Loading Subtitle Integration */}
          <div className="mt-20 flex flex-col items-center w-full max-w-xs sm:max-w-md animate-in fade-in duration-1000 delay-[2500ms] opacity-0 fill-mode-forwards">
            <div className="flex items-center justify-between w-full mb-3">
              <p className="text-[10px] font-black text-[#A855F7] uppercase tracking-[0.2em] flex items-center gap-2">
                <Database size={12} />
                Sincronizando Sistema
              </p>
              <p className="text-[10px] font-mono text-white/30 uppercase">v2.0.4-SAP</p>
            </div>
            <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-[#A855F7] to-white animate-progress-load shadow-[0_0_10px_#A855F7]" />
            </div>
            <p className="mt-6 text-white/40 text-[11px] font-black uppercase tracking-[1.2em] text-center ml-[1.2em]">
              Apresenta
            </p>
          </div>
        </div>
      )}

      {/* Screen Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
};
