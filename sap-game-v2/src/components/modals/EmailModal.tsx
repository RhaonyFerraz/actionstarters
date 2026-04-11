import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { 
  Inbox, 
  Send, 
  SquarePen, 
  Mail, 
  MailOpen,
  ChevronLeft,
  Calendar,
  User,
  ArrowRight,
  Monitor
} from 'lucide-react';
import { cn } from '../ui/Button';

export const EmailModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const inbox = useGameStore(state => state.inbox);
  const markEmailAsRead = useGameStore(state => state.markEmailAsRead);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  const selectedEmail = inbox.find(e => e.id === selectedEmailId);

  const handleSelect = (id: string) => {
    setSelectedEmailId(id);
    markEmailAsRead(id);
  };

  const formatRound = (round: number) => `RODADA ${round.toString().padStart(2, '0')}`;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="COMUNICAÇÕES & RELATÓRIOS" 
      centerTitle
      className="max-w-[1400px] w-[95vw] h-[85vh] sm:h-[80vh]"
    >
      <div className="flex flex-col h-full overflow-hidden">
        
        {/* Main Interface */}
        <div className="flex flex-1 min-h-0 gap-6">
          
          {/* Column 1: Categories & Inbox List */}
          <div className={cn(
            "flex flex-col h-full bg-[#0a111a]/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden transition-all duration-500",
            selectedEmailId ? "hidden lg:flex lg:w-[400px] xl:w-[450px]" : "w-full lg:w-[400px] xl:w-[450px]"
          )}>
            
            {/* Header / Search Mock */}
            <div className="p-6 border-b border-white/5 space-y-4">
              <div className="flex items-center justify-between text-[#3b82f6]">
                 <div className="flex items-center gap-2">
                   <Inbox size={20} />
                   <h3 className="text-xs font-black uppercase tracking-[0.3em]">Inbox Operacional</h3>
                 </div>
                 <span className="bg-[#3b82f6]/10 px-3 py-1 rounded-full text-[9px] font-black border border-[#3b82f6]/20 text-[#3b82f6]">
                    {inbox.filter(e => !e.read).length} NOVOS
                 </span>
              </div>
            </div>

            {/* Email List Wrapper */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
              {inbox.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                   <Monitor size={48} strokeWidth={1} className="text-white" />
                   <p className="text-[10px] uppercase font-black mt-4 tracking-widest text-white">Nenhum dado recebido</p>
                </div>
              ) : (
                inbox.map(email => (
                  <button 
                    key={email.id}
                    onClick={() => handleSelect(email.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl transition-all duration-300 relative group overflow-hidden border",
                      selectedEmailId === email.id 
                        ? "bg-[#3b82f6]/5 border-[#3b82f6]/30 shadow-[0_0_20px_rgba(59,130,246,0.05)]" 
                        : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
                    )}
                  >
                    {!email.read && (
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-[#3b82f6] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    )}
                    
                    <div className="flex justify-between items-start mb-1 gap-4">
                       <span className={cn(
                         "text-xs font-black uppercase tracking-widest truncate flex-1",
                         email.read ? "text-gray-400" : "text-white"
                       )}>
                         {email.sender}
                       </span>
                       <span className="text-[9px] font-bold text-gray-500 shrink-0 uppercase tracking-tighter">
                         {formatRound(email.timestampRound)}
                       </span>
                    </div>
                    
                    <h4 className={cn(
                      "text-xs tracking-tight line-clamp-1",
                      email.read ? "text-gray-500 font-medium" : "text-blue-400 font-bold"
                    )}>
                      {email.subject}
                    </h4>
                    
                    <p className="text-[11px] text-gray-500 mt-2 line-clamp-1 leading-relaxed opacity-60">
                      Criptografia de transmissão de dados nível RSA-4096 ativa...
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Column 2: Content View Area */}
          <div className={cn(
            "flex-1 flex flex-col h-full bg-[#0a111a]/20 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden transition-all duration-500",
            !selectedEmailId ? "hidden lg:flex" : "flex"
          )}>
            {selectedEmail ? (
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Email Header */}
                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-4 mb-8 lg:hidden">
                     <button onClick={() => setSelectedEmailId(null)} className="p-2 rounded-xl bg-white/5 text-white hover:bg-white/10">
                        <ChevronLeft size={20} />
                     </button>
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lista de Mensagens</span>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <h2 className="text-xl sm:text-2xl font-bold text-white tracking-normal leading-tight">
                         {selectedEmail.subject}
                       </h2>
                       <div className="flex items-center gap-3">
                         <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                           <Calendar size={12} className="text-[#3b82f6]" />
                           <span className="text-[10px] font-black text-[#3b82f6] uppercase tracking-widest">{formatRound(selectedEmail.timestampRound)}</span>
                         </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-white font-black text-sm">
                        {selectedEmail.sender[0]}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-0.5">Remetente</p>
                        <p className="text-sm text-gray-200 font-bold">{selectedEmail.sender}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-8 custom-scrollbar">
                  <div className="max-w-3xl">
                    <div className="text-gray-300 text-base sm:text-lg leading-relaxed font-medium whitespace-pre-wrap tracking-tight">
                      {selectedEmail.content}
                    </div>
                    
                    <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-6 items-center justify-between">
                       <div className="flex items-center gap-3 opacity-50">
                         <Mail size={20} className="text-gray-400" />
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assinatura Digital Verificada</span>
                       </div>
                       
                       <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3 rounded-2xl flex items-center gap-3 transition-all active:scale-95 group">
                         <span className="text-xs font-black uppercase tracking-widest">Processar Relatório</span>
                         <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30 select-none">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                   <Mail size={40} className="text-white animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white uppercase tracking-widest">Painel Desconectado</h3>
                  <p className="text-xs text-gray-500 font-medium">Selecione uma transmissão na lista lateral para análise técnica.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer (Mobile only close or simple status) */}
        <div className="mt-6 flex justify-end">
           <button 
             onClick={onClose}
             className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl transition-all border border-white/5 active:scale-95"
           >
             ENCERRAR TERMINAL
           </button>
        </div>

      </div>
    </Modal>
  );
};
