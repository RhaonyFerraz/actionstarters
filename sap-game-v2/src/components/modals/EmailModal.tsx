import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { 
  Inbox, 
  Send, 
  Archive, 
  Trash2, 
  Mail, 
  MailOpen,
  ChevronLeft,
  Calendar,
  User,
  ArrowRight,
  Monitor,
  Search,
  Filter,
  Reply,
  Forward,
  MoreVertical,
  CheckCircle2,
  Clock,
  Star
} from 'lucide-react';
import { cn } from '../ui/Button';

export const EmailModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const inbox = useGameStore(state => state.inbox);
  const markEmailAsRead = useGameStore(state => state.markEmailAsRead);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedEmail = inbox.find(e => e.id === selectedEmailId);

  const handleSelect = (id: string) => {
    setSelectedEmailId(id);
    markEmailAsRead(id);
  };

  const formatRound = (round: number) => `Rodada ${round.toString().padStart(2, '0')}`;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="CAIXA DE ENTRADA" 
      centerTitle
      className="max-w-[1300px] w-[95vw] h-[85vh] sm:h-[80vh]"
    >
      <div className="flex h-full overflow-hidden bg-[#050505]/40 backdrop-blur-3xl rounded-[2rem] border border-white/5 shadow-2xl">
        
        {/* Pane 1: Email List (Left) */}
        <div className={cn(
          "flex flex-col w-full lg:w-[380px] xl:w-[420px] border-r border-white/5 bg-black/20 transition-all",
          selectedEmailId ? "hidden lg:flex" : "flex"
        )}>
          
          {/* List Header */}
          <div className="p-6 border-b border-white/5 space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#3b82f6]">
                   <Inbox size={20} />
                   <h3 className="text-xs font-black uppercase tracking-widest">Principal</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-500">{inbox.length} mensagens</span>
             </div>

             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#3b82f6] transition-colors" size={14} />
                <input 
                  type="text" 
                  placeholder="Pesquisar..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#3b82f6]/30 transition-all"
                />
             </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
             {inbox.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-10 py-10 scale-75">
                  <Monitor size={48} />
                  <p className="text-[10px] uppercase font-black mt-2 tracking-widest">Vazio</p>
               </div>
             ) : (
               inbox.filter(e => e.subject.toLowerCase().includes(searchTerm.toLowerCase())).map(email => (
                 <button 
                   key={email.id}
                   onClick={() => handleSelect(email.id)}
                   className={cn(
                     "w-full text-left p-4 rounded-2xl transition-all duration-200 relative group border",
                     selectedEmailId === email.id 
                       ? "bg-[#3b82f6]/10 border-[#3b82f6]/20 shadow-lg" 
                       : "bg-transparent border-transparent hover:bg-white/5"
                   )}
                 >
                   <div className="flex justify-between items-start mb-1 gap-2">
                      <div className="flex items-center gap-2 truncate">
                        {!email.read && <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />}
                        <span className={cn(
                          "text-xs font-bold truncate",
                          email.read ? "text-gray-500" : "text-white"
                        )}>
                          {email.sender}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 shrink-0">
                        {formatRound(email.timestampRound)}
                      </span>
                   </div>
                   
                   <h4 className={cn(
                     "text-xs tracking-tight line-clamp-1 mb-1",
                     email.read ? "text-gray-500 font-medium" : "text-[#3b82f6] font-bold"
                   )}>
                     {email.subject}
                   </h4>
                   
                   <p className="text-[10px] text-gray-500 line-clamp-1 opacity-60">
                     {email.content.substring(0, 60)}...
                   </p>
                 </button>
               ))
             )}
          </div>
        </div>

        {/* Pane 2: Content View Area (Right) */}
        <div className={cn(
          "flex-1 flex flex-col h-full bg-slate-900/10",
          !selectedEmailId ? "hidden lg:flex" : "flex"
        )}>
          {selectedEmail ? (
            <div className="flex flex-col h-full animate-in fade-in duration-500">
              
              {/* Simple Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                 <div className="flex items-center gap-1">
                    <button onClick={() => setSelectedEmailId(null)} className="lg:hidden p-2 rounded-lg bg-white/5 text-white mr-2">
                       <ChevronLeft size={18} />
                    </button>
                    <button className="p-2 rounded-lg text-gray-500 hover:text-white transition-colors" title="Responder"><Reply size={18} /></button>
                    <button className="p-2 rounded-lg text-gray-500 hover:text-white transition-colors" title="Arquivar"><Archive size={18} /></button>
                    <button className="p-2 rounded-lg text-gray-500 hover:text-red-500 transition-colors" title="Excluir"><Trash2 size={18} /></button>
                 </div>
                 <button className="p-2 rounded-lg text-gray-500 hover:text-white transition-colors"><MoreVertical size={18} /></button>
              </div>

              {/* Email Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-8">
                  
                  {/* Header */}
                  <div className="space-y-6">
                     <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                       {selectedEmail.subject}
                     </h2>

                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b82f6] to-blue-900 flex items-center justify-center text-white font-black text-lg">
                          {selectedEmail.sender[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between">
                             <span className="text-sm font-bold text-white truncate">{selectedEmail.sender}</span>
                             <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{formatRound(selectedEmail.timestampRound)}</span>
                           </div>
                           <p className="text-xs text-gray-500 truncate">Para: Você &lt;admin@sap-game.com&gt;</p>
                        </div>
                     </div>
                  </div>

                  {/* Body */}
                  <div className="text-gray-300 text-base sm:text-lg leading-relaxed font-medium whitespace-pre-wrap tracking-wide border-t border-white/5 pt-8">
                    {selectedEmail.content}
                  </div>

                  {/* Action */}
                  <div className="pt-10 flex justify-end">
                     <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3 rounded-xl flex items-center gap-3 transition-all active:scale-95 group shadow-lg shadow-blue-900/20">
                       <span className="text-[10px] font-black uppercase tracking-widest">Processar Informação</span>
                       <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20">
              <Mail size={40} className="text-white animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-[0.2em]">Selecione um e-mail</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
         <button 
           onClick={onClose}
           className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] rounded-xl transition-all border border-white/5 active:scale-95"
         >
           Fechar Terminal
         </button>
      </div>
    </Modal>
  );
};
