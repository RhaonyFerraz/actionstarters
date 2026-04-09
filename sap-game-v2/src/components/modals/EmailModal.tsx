import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { 
  Inbox, 
  Send, 
  SquarePen, 
  Mail, 
  MailOpen,
  Layout,
  ChevronLeft,
  Circle
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

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="📬 MailPlus Pro v1.0" 
      className="max-w-5xl"
      headerClassName="bg-blue-900/60 border-b border-blue-500/30"
    >
      <div className="win95-bg sm:-m-8 p-1 retro-outset font-sans text-black grow flex flex-col overflow-hidden">
        
        {/* Win95 Header (Internal) - Hidden on mobile as the Modal already has a title */}
        <div className="hidden sm:flex win95-title-bar mb-1" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#111827' }}>
          <div className="flex items-center gap-2">
            <Layout size={12} className="text-gray-600" />
            <span className="text-[11px] tracking-tight text-gray-800">MailPlus Pro v1.0 - [Inbox]</span>
          </div>
          <button onClick={onClose} className="w-4 h-4 bg-[#c0c0c0] text-black border border-white border-b-gray-800 border-r-gray-800 flex items-center justify-center text-[10px] font-bold active:border-inset">
            X
          </button>
        </div>

        <div className="flex-1 flex min-h-0 gap-1 overflow-hidden">
          
          {/* Sidebar - Only visible on LG screens and up */}
          <div className="hidden lg:flex w-44 flex-col gap-1 shrink-0">
            <SidebarItem icon={<Inbox size={14} className="text-blue-600" />} label="Entrada" active />
            <SidebarItem icon={<Send size={14} className="text-green-600" />} label="Saída" />
            <SidebarItem icon={<SquarePen size={14} className="text-gray-400" />} label="ESCREVER" />
            
            <div className="flex-1 mt-2 retro-inset bg-white overflow-hidden p-2">
               {/* Decorative white space */}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* Table Headers - Hidden on mobile, visible on lg */}
            <div className="hidden lg:flex gap-px bg-gray-400 border-b border-gray-800">
              <div className="flex-[3] win95-button rounded-none border-t-white border-l-white justify-start pl-4 font-sans uppercase tracking-tighter text-[9px]">Assunto</div>
              <div className="w-32 win95-button rounded-none border-t-white border-l-white font-sans uppercase tracking-tighter text-[9px]">Data Recebida</div>
            </div>

            {/* Email List / Content */}
            <div className="flex-1 bg-white retro-inset overflow-y-auto mt-px">
              {!selectedEmail ? (
                <div className="min-h-full">
                  {inbox.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                      <Mail size={48} strokeWidth={1} />
                      <p className="text-[10px] uppercase font-bold mt-2">Caixa de entrada vazia</p>
                    </div>
                  ) : (
                    inbox.map(email => (
                      <button 
                        key={email.id}
                        onClick={() => handleSelect(email.id)}
                        className="w-full flex items-center px-4 py-3 sm:py-1.5 hover:bg-[#000080] hover:text-white text-left group focus:bg-[#000080] focus:text-white border-b border-gray-50 transition-colors"
                      >
                        <div className="flex-[3] flex items-center gap-3 min-w-0">
                          {email.read ? 
                            <MailOpen size={14} className="text-gray-400 group-hover:text-blue-200 shrink-0" /> : 
                            <Mail size={14} className="text-blue-600 group-hover:text-white shrink-0" />
                          }
                          <span className={cn(
                            "truncate text-xs font-sans",
                            !email.read && "font-bold"
                          )}>
                            {email.subject}
                          </span>
                        </div>
                        <div className="w-32 text-right text-[10px] font-mono shrink-0 pr-2 opacity-60">
                          05/04/2026
                        </div>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="p-4 sm:p-6 flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-2 duration-200">
                  <div className="mb-4 pb-4 border-b border-dashed border-gray-300">
                    <button 
                      onClick={() => setSelectedEmailId(null)}
                      className="text-[10px] font-bold text-blue-800 hover:underline mb-4 flex items-center gap-1 group"
                    >
                      <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                      VOLTAR PARA LISTA
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2 tracking-tight">{selectedEmail.subject}</h2>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] text-gray-500 uppercase tracking-widest font-sans">
                      <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">De: {selectedEmail.sender}</span>
                      <span className="flex items-center gap-1"><Circle size={6} className="fill-blue-500 text-blue-500" /> Round: {selectedEmail.timestampRound}</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto text-gray-800 text-[15px] sm:text-[13px] font-sans leading-relaxed whitespace-pre-wrap selection:bg-[#000080] selection:text-white pr-4">
                    {selectedEmail.content}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Status Bar - Stacked on mobile, grid on sm */}
        <div className="mt-1 flex flex-col sm:grid sm:grid-cols-4 gap-1 shrink-0">
          <div className="hidden xs:flex sm:col-span-3 retro-inset px-3 h-8 sm:h-6 items-center gap-2 bg-[#c0c0c0]">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
            <span className="text-[10px] font-sans font-bold text-gray-600 truncate">Sistema Online: <span className="text-green-700 uppercase">Operação</span></span>
          </div>
          <button 
            onClick={onClose}
            className="win95-button text-red-700 font-black h-10 sm:h-6 text-xs sm:text-[10px]"
          >
            FECHAR JANELA
          </button>
        </div>

      </div>
    </Modal>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-3 py-1.5 text-[11px] font-sans transition-all",
      active ? "retro-inset bg-gray-50 font-bold border-l-4 border-l-blue-600" : "win95-button border-l-transparent text-gray-700"
    )}>
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
};



