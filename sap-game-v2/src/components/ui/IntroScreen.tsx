import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Shield, Cpu, Activity, Database, Lock, Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import { cn } from '../ui/Button';

const LOG_MESSAGES = [
  "B1_KERNEL_LOAD: SUCCESS (0.003ms)",
  "BOOT_PROTOCOL: SAP_NUCLEUS_ACTIVE",
  "CORE_AUTH: CEO_CREDENTIALS_VALIDATED",
  "DATABASE_LINK: STABLE (SYNCING...)",
  "SECURITY_GATE: PROTOCOL_822A_ENGAGED",
  "INFRASTRUCTURE: SCALING_CLOUD_ASSETS",
  "UI_ENGINE: RENDERING_EXECUTIVE_PANEL",
  "SYSTEM_READY: ACTION_STARTERS_V2.0"
];

const TechnicalGrid: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
    <div className="absolute inset-0" style={{ 
      backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
      backgroundSize: '40px 40px'
    }} />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-scanline h-[200%]" />
  </div>
);

export const IntroScreen: React.FC = () => {
  const [phase, setPhase] = useState<'interaction' | 'booting' | 'logo' | 'finished'>('interaction');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const setHasSeenIntro = useGameStore((state) => state.setHasSeenIntro);
  const hasSeenIntro = useGameStore((state) => state.hasSeenIntro);

  // High-Tech Digital Sound System
  const playTechSound = useCallback((type: 'blip' | 'boot' | 'chime') => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.1, now);
    master.connect(ctx.destination);

    if (type === 'blip') {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.05, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(g).connect(master);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'boot') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.linearRampToValueAtTime(400, now + 1.5);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.2, now + 0.5);
      g.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc.connect(g).connect(master);
      osc.start(now);
      osc.stop(now + 1.5);
    } else if (type === 'chime') {
      [880, 1320, 1760].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.setValueAtTime(0.1, now + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.5);
        osc.connect(g).connect(master);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.5);
      });
    }
  }, []);

  const startBootSequence = () => {
    setPhase('booting');
    playTechSound('boot');
    
    // Animate Logs
    LOG_MESSAGES.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, msg]);
        setProgress(((i + 1) / LOG_MESSAGES.length) * 100);
        playTechSound('blip');
      }, i * 400);
    });

    // Transition to Logo
    setTimeout(() => {
      setPhase('logo');
      playTechSound('chime');
      
      // Final Finish
      setTimeout(() => {
        setHasSeenIntro(true);
        setPhase('finished');
      }, 4000);
    }, LOG_MESSAGES.length * 400 + 800);
  };

  if (hasSeenIntro || phase === 'finished') return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center overflow-hidden font-sans">
      <TechnicalGrid />

      {phase === 'interaction' && (
        <div className="relative z-10 flex flex-col items-center gap-12 animate-in fade-in zoom-in duration-1000">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full scale-150 animate-pulse" />
            <button 
              onClick={startBootSequence}
              className="relative w-32 h-32 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:border-blue-500/50 group-hover:scale-110 transition-all duration-700 modern-shadow"
            >
              <TerminalIcon size={40} className="text-white group-hover:text-blue-400 transition-colors" />
              <div className="absolute -inset-2 border border-white/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity animate-ping-slow" />
            </button>
          </div>
          
          <div className="text-center space-y-4">
             <h2 className="text-white text-xs font-black tracking-[0.8em] uppercase opacity-50">System_Initialization</h2>
             <div className="flex items-center justify-center gap-3">
                <Shield size={14} className="text-blue-500" />
                <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest">SAP Certified Nucleus v2.0</span>
             </div>
          </div>
        </div>
      )}

      {phase === 'booting' && (
        <div className="relative z-10 w-full max-w-lg px-8 space-y-8">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <Cpu size={20} className="text-blue-500 animate-pulse" />
                 <h3 className="text-white text-sm font-black uppercase tracking-widest">Booting Sequence</h3>
              </div>
              <span className="text-blue-500/50 font-mono text-[10px]">AUTH_MODE: EXE_CEO</span>
           </div>

           <div className="bg-black/40 border border-white/5 rounded-2xl p-6 h-64 font-mono text-[11px] space-y-2 overflow-hidden shadow-2xl">
              {logs.map((log, i) => (
                <div key={i} className="flex items-center gap-3 text-blue-400/80 animate-reveal-terminal">
                   <ChevronRight size={10} className="text-blue-500" />
                   <span className="text-gray-300">{log}</span>
                </div>
              ))}
              <div className="animate-terminal-cursor text-blue-500 text-lg ml-1" />
           </div>

           <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                 <span className="text-white/40 italic">Initializing Assets...</span>
                 <span className="text-blue-500">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-blue-500 shadow-executive transition-all duration-300 ease-out"
                   style={{ width: `${progress}%` }}
                 />
              </div>
           </div>
        </div>
      )}

      {phase === 'logo' && (
        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-1000 scale-90 sm:scale-100">
           <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-12">
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl">
                ACTION
              </h1>
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-blue-500 tracking-tighter shadow-executive" style={{ textShadow: '0 0 40px rgba(59, 130, 246, 0.5)' }}>
                STARTERS
              </h1>
           </div>
           
           <div className="mt-16 flex items-center gap-8 opacity-0 animate-in fade-in duration-1000 delay-500 fill-mode-forwards">
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-white/20" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[1.5em] ml-[1.5em]">APRESENTA</p>
              <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-white/20" />
           </div>

           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent rotate-12 pointer-events-none" />
        </div>
      )}

      {/* Corporate Overlays */}
      <div className="absolute inset-x-0 bottom-0 p-10 flex justify-between items-end pointer-events-none opacity-20">
         <div className="space-y-1">
            <p className="text-[9px] font-black text-white tracking-widest uppercase">Encryption_Status</p>
            <div className="flex gap-1">
               {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />)}
            </div>
         </div>
         <Activity size={24} className="text-blue-500/30" />
      </div>

    </div>
  );
};
