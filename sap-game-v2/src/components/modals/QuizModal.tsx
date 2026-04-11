import React, { useState, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGameStore } from '../../store/useGameStore';
import { knowledgeQuiz, surpriseEnglishQuestion } from '../../config/quiz';
import { HelpCircle, BrainCircuit, ImageIcon, X, Mail, Clock, AlertTriangle, Languages } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '../ui/Button';

export const QuizModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const addBalance = useGameStore(state => state.addBalance);
  const theme = useGameStore(state => state.theme);
  const isModern = theme === 'modern-glass';
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const [floatingCash, setFloatingCash] = useState<number | null>(null);
  const [language, setLanguage] = useState<'en' | 'pt'>(isModern ? 'en' : 'pt');

  // Ref para rolar o modal até o final ao selecionar resposta
  const bottomRef = useRef<HTMLDivElement>(null);

  const getScrollParent = (node: Element | null): Element | null => {
    if (!node) return null;
    const overflow = window.getComputedStyle(node).overflowY;
    if ((overflow === 'auto' || overflow === 'scroll') && node.scrollHeight > node.clientHeight) return node;
    return getScrollParent(node.parentElement);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      const container = getScrollParent(bottomRef.current?.parentElement ?? null);
      if (container) container.scrollTop = container.scrollHeight;
    }, 60);
  };

  // Surprise Question States
  const [isSurpriseActive, setIsSurpriseActive] = useState(false);
  const [surpriseTimeLeft, setSurpriseTimeLeft] = useState(60);
  const [surpriseAnswered, setSurpriseAnswered] = useState(false);
  const [surpriseCorrect, setSurpriseCorrect] = useState(false);
  const [surpriseTriggered, setSurpriseTriggered] = useState(false);

  // Timer Effect for Surprise
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSurpriseActive && surpriseTimeLeft > 0 && !surpriseAnswered) {
      timer = setInterval(() => {
        setSurpriseTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isSurpriseActive && surpriseTimeLeft === 0 && !surpriseAnswered) {
      setSurpriseAnswered(true);
      setSurpriseCorrect(false);
    }
    return () => clearInterval(timer);
  }, [isSurpriseActive, surpriseTimeLeft, surpriseAnswered]);

  // Caso ele tenha zerado o quiz
  if (currentQuestionIndex >= knowledgeQuiz.length && !isSurpriseActive) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Terminal de Conhecimento ERP">
         <div className="text-center p-12 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl">
            <BrainCircuit size={80} className="mx-auto text-neon-green mb-6 animate-pulse neon-text" />
            <h2 className="text-3xl font-digital font-bold text-white mb-4 tracking-tight">Ciclagem Concluída!</h2>
            <p className="text-sm text-gray-400 font-mono-neon uppercase tracking-widest max-w-sm mx-auto">Sua diretoria não possui novos desafios intelectuais. Todos os buffers de conhecimento estão sincronizados.</p>
         </div>
      </Modal>
    )
  }

  const questionData = knowledgeQuiz[currentQuestionIndex];
  
  // Bilingual logic
  const displayQuestion = language === 'en' && questionData.questionEn ? questionData.questionEn : questionData.question;
  const displayOptions = language === 'en' && questionData.optionsEn ? questionData.optionsEn : questionData.options;
  const displayExplanation = language === 'en' && questionData.explanationEn ? questionData.explanationEn : questionData.explanation;
  const displayBonusText = questionData.bonusText;

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const correct = selectedOption === questionData.correctAnswerIndex;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      // 10% penalty ONLY if in modern-glass AND translated to Portuguese
      const hasPenalty = isModern && language === 'pt';
      const finalAmount = hasPenalty ? Math.floor(questionData.bonusAmount * 0.9) : questionData.bonusAmount;
      
      setFloatingCash(finalAmount);
      addBalance(finalAmount);
      
      // Cleanup visual animation after 2.5s
      setTimeout(() => setFloatingCash(null), 2500);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setShowImage(false);
    setLanguage(isModern ? 'en' : 'pt');
    
    // Após qualquer resposta na Q1, disparar a surpresa após 1 segundo (obrigatória)
    if (!surpriseTriggered && currentQuestionIndex === 0) {
      setSurpriseTriggered(true);
      setCurrentQuestionIndex(1);
      setTimeout(() => {
        setIsSurpriseActive(true);
      }, 1000);
      return;
    }

    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handleSurpriseSubmit = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === surpriseEnglishQuestion.correctAnswerIndex;
    setSurpriseCorrect(correct);
    setSurpriseAnswered(true);
    if (correct) {
      addBalance(surpriseEnglishQuestion.bonusAmount);
      setFloatingCash(surpriseEnglishQuestion.bonusAmount);
      setTimeout(() => setFloatingCash(null), 2500);
    }
  };

  const handleSurpriseNext = () => {
    setIsSurpriseActive(false);
    setSurpriseAnswered(false);
    setSelectedOption(null);
    setLanguage(isModern ? 'en' : 'pt');
    // Move para a próxima questão do quiz normal (Q2)
    setCurrentQuestionIndex(1);
  };

  // RENDER SURPRISE UI
  if (isSurpriseActive) {
    return (
      <Modal isOpen={isOpen} onClose={() => {}} title="SYSTEM EVENT: SurpriseQuestion.exe" forceTheme="retro-2000">
        <div className="flex flex-col gap-6 text-black min-h-[450px]">
          
          <div className="bg-[#000080] p-1 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white text-xs font-bold px-1">
              <Mail size={14} />
              <span>SurpriseQuestion.exe - MailPlus Pro</span>
            </div>
          </div>

          <div className="flex-1 bg-white retro-inset m-1 p-6 flex flex-col gap-6 text-black">
            {/* Header / Meta Info */}
            <div className="border-b-2 border-gray-100 pb-4">
              <div className="flex gap-2 text-xs mb-1">
                <span className="text-gray-500 w-12">From:</span>
                <span className="font-bold underline">{surpriseEnglishQuestion.emailHeader}</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-gray-500 w-12">Subject:</span>
                <span className="font-bold">{surpriseEnglishQuestion.emailSubject}</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="bg-[#fcfcfc] p-4 text-sm leading-relaxed border border-gray-100 italic">
               <p className="whitespace-pre-wrap">{surpriseEnglishQuestion.emailBody}</p>
            </div>

            {/* Timer Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-end text-[10px] font-bold uppercase text-blue-900">
                <span className="flex items-center gap-1"><Clock size={12}/> Connection TTL</span>
                <span>{surpriseTimeLeft}s</span>
              </div>
              <div className="h-4 bg-gray-200 border border-gray-400 p-0.5">
                <div 
                  className="h-full bg-blue-600 transition-all duration-1000"
                  style={{ width: `${(surpriseTimeLeft / 60) * 100}%` }}
                />
              </div>
            </div>

            {/* Questions area */}
            <div className="pt-2">
               <h3 className="font-bold text-base mb-4 border-l-4 border-blue-800 pl-3">{surpriseEnglishQuestion.question}</h3>
               <div className="space-y-2">
                 {surpriseEnglishQuestion.options.map((opt, idx) => {
                   if (surpriseAnswered && idx !== surpriseEnglishQuestion.correctAnswerIndex && idx !== selectedOption) return null;
                   let btnClass = "w-full text-left p-3 border-2 transition-all flex items-start gap-3 ";
                   if (!surpriseAnswered) {
                     btnClass += selectedOption === idx ? "bg-blue-50 border-blue-600 shadow-sm" : "bg-white border-gray-200 hover:bg-gray-50";
                   } else {
                     if (idx === surpriseEnglishQuestion.correctAnswerIndex) btnClass += "bg-green-50 border-green-600 text-green-900";
                     else if (selectedOption === idx) btnClass += "bg-red-50 border-red-600 text-red-900 line-through opacity-70";
                   }
                   return (
                     <button key={idx} disabled={surpriseAnswered} onClick={() => setSelectedOption(idx)} className={btnClass}>
                       <span className="font-bold text-blue-800/40 text-xs">{String.fromCharCode(65+idx)})</span>
                       <span className="text-sm">{opt.substring(3)}</span>
                     </button>
                   );
                 })}
               </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              {!surpriseAnswered ? (
                <button disabled={selectedOption === null} onClick={handleSurpriseSubmit} className="bg-[#c0c0c0] px-8 py-2 border-2 border-gray-400 border-t-white border-l-white active:retro-inset font-bold text-sm shadow-md disabled:opacity-50">
                  REPLY.EXE
                </button>
              ) : (
                <div className="w-full space-y-4">
                  <div className={`p-4 border-2 flex items-center gap-3 font-bold ${surpriseCorrect ? 'bg-green-50 border-green-600 text-green-800' : 'bg-red-50 border-red-600 text-red-800'}`}>
                    {surpriseCorrect ? <BrainCircuit size={20} /> : <AlertTriangle size={20} />}
                    <span>{surpriseCorrect ? 'STATUS: TRANSMISSION SUCCESSFUL' : 'STATUS: CONNECTION TERMINATED / ERROR'}</span>
                  </div>
                  {surpriseCorrect && (
                    <div className="bg-gray-50 border border-gray-200 p-4 whitespace-pre-wrap text-[13px] leading-relaxed overflow-y-auto max-h-[150px]">
                      {surpriseEnglishQuestion.explanation}
                    </div>
                  )}
                  <div className="flex justify-end pt-2">
                    <button onClick={handleSurpriseNext} className="bg-[#c0c0c0] px-8 py-2 border-2 border-gray-400 border-t-white border-l-white active:retro-inset font-bold text-sm">
                      CONTINUE_PROCESSION.EXE
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Floating Cash Portal for Surprise Question */}
        {floatingCash !== null && createPortal(
          <div className="fixed pointer-events-none z-[99999] animate-fly-to-bank left-1/2 top-1/2">
            <div className="bg-neon-green/10 border border-neon-green/30 rounded-full px-3 py-1 backdrop-blur-sm shadow-[0_0_10px_rgba(57,255,20,0.2)] flex items-center justify-center">
              <h1 className="text-xl md:text-2xl font-digital font-bold text-neon-green tracking-tight whitespace-nowrap drop-shadow-[0_0_5px_rgba(57,255,20,0.3)]">
                + {formatBRL(floatingCash)}
              </h1>
            </div>
          </div>,
          document.body
        )}
      </Modal>
    );
  }

  // REGULAR UI
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Jornada de Aprendizado SAP">
      <div className="p-2 space-y-6">
        
        <div className="flex items-center gap-6 bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] text-blue-400 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[2px] h-full bg-[#3b82f6]/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
          <HelpCircle size={32} className="shrink-0 opacity-60" />
          <div className="flex-1">
             <div className="flex justify-between items-center mb-1">
                <h3 className="font-digital font-bold text-[9px] uppercase tracking-[0.3em] opacity-40">Diretiva de Bonificação Corporativa</h3>
                
                {/* Mode Differentiation: Irreversible in Modern, Toggle in Classic */}
                {isModern ? (
                  language === 'en' && (
                    <button 
                      onClick={() => setLanguage('pt')}
                      className="flex items-center gap-2 bg-white/5 border border-white/20 px-4 py-1.5 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 active:scale-95 group animate-in fade-in"
                    >
                      <Languages size={14} className="text-white transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                      <span className="tracking-widest group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">TRADUZIR PARA PT-BR</span>
                    </button>
                  )
                ) : (
                  <button 
                    onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1 text-[10px] font-bold transition-all",
                      theme === 'retro-2000' ? "bg-[#c0c0c0] retro-outset active:retro-inset text-black" : "bg-blue-600 text-white rounded hover:bg-blue-500"
                    )}
                  >
                    <Languages size={12} />
                    {language === 'en' ? 'MOSTRAR ORIGINAL (PT)' : 'SEE ENGLISH VERSION'}
                  </button>
                )}
             </div>
             
             <p className="text-sm font-medium text-gray-400 leading-relaxed">
                Responda corretamente para injetar <strong className="text-blue-400 font-digital text-base">{formatBRL(isModern && language === 'pt' ? Math.floor(questionData.bonusAmount * 0.9) : questionData.bonusAmount)}</strong> em sua conta operacional.
                {isModern && language === 'pt' && <span className="block text-[9px] text-red-400/60 mt-1 uppercase font-black italic tracking-widest">⚠️ Penalidade de 10% aplicada por usar tradução</span>}
             </p>
          </div>
        </div>

        <div>
           <div className="relative mb-6">
             <div className="absolute -left-4 top-0 w-[2px] h-full bg-[#3b82f6]/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]" />
             <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pl-4">
               <h2 className="text-xl font-digital font-bold text-white leading-relaxed tracking-normal flex-1">
                 {displayQuestion}
               </h2>
               {questionData.imageUrl && !isAnswered && (
                 <Button onClick={() => setShowImage(!showImage)} variant="neon" className="shrink-0 !py-2 !px-4 !border-blue-400/40 !text-blue-400 hover:!bg-blue-400/10">
                   <ImageIcon size={18} className="mr-2" />
                   {showImage ? 'Ocultar Anexo' : 'Ver Imagem de Apoio'}
                 </Button>
               )}
             </div>
           </div>

           {showImage && !isAnswered && questionData.imageUrl && (
             <div className="mb-6 p-2 bg-slate-950/40 backdrop-blur-sm border border-white/10 rounded-xl animate-in fade-in slide-in-from-top-4 flex flex-col items-center">
               <img src={questionData.imageUrl} alt="Anexo de Apoio" onClick={() => setIsFullscreenImage(true)} className="w-full max-h-[400px] object-contain rounded-lg cursor-pointer hover:opacity-80 transition-opacity" />
               <p className="text-blue-400/40 text-[10px] uppercase font-digital mt-2 tracking-widest text-center">[ Clique na imagem para expandir ]</p>
             </div>
           )}

           <div className="space-y-3">
             {displayOptions.map((option, idx) => {
               if (isAnswered && idx !== questionData.correctAnswerIndex && idx !== selectedOption) return null;
               let className = "w-full text-left p-5 rounded-2xl border transition-all font-mono-neon tracking-wide flex items-center group relative overflow-hidden ";
               if (!isAnswered) {
                 className += selectedOption === idx ? "border-[#3b82f6] bg-[#3b82f6]/5 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)] ring-1 ring-[#3b82f6]/30" : "border-white/5 bg-white/5 text-gray-500 hover:border-white/20 hover:bg-white/[0.07]";
               } else {
                 if (idx === questionData.correctAnswerIndex) className += "border-neon-green bg-neon-green/5 text-neon-green shadow-[0_0_15px_rgba(57,255,20,0.1)] ring-1 ring-neon-green/30";
                 else if (selectedOption === idx) className += "border-red-500 bg-red-950/20 text-red-400 opacity-60 line-through ring-1 ring-red-500/20";
               }
               return (
                 <button key={idx} disabled={isAnswered} onClick={() => { setSelectedOption(idx); scrollToBottom(); }} className={className}>
                   <span className={`shrink-0 inline-block w-6 h-6 rounded-md border text-center text-[10px] leading-5 font-black mr-4 transition-all ${selectedOption === idx ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-slate-800/40 text-gray-600 border-white/10 group-hover:border-white/20'}`}>{String.fromCharCode(65 + idx)}</span>
                   <span className="flex-1">{option}</span>
                 </button>
               )
             })}
           </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end">
          {!isAnswered ? (
            <Button variant="neon" size="lg" disabled={selectedOption === null} onClick={handleSubmit} className="px-12 py-5 rounded-2xl">
              AUTENTICAR DIRETIVA
            </Button>
          ) : (
            <div className="w-full flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                <span className={`font-digital text-base flex items-center gap-3 tracking-tight ${isCorrect ? 'text-neon-green neon-text' : 'text-red-500'}`}>
                  {isCorrect ? (isModern && language === 'pt' ? '✔️ DIRETIVA EXECUTADA (COM PENALIDADE)' : '✔️ DIRETIVA EXECUTADA COM SUCESSO') : '❌ FALHA NA INTEGRIDADE DOS DADOS'}
                </span>
                <Button onClick={handleNext} variant="neon" className={isCorrect ? '!text-neon-green !border-neon-green/40' : '!text-gray-500 !border-white/10'}>
                  {isCorrect ? 'Sincronizar Buffer' : 'Avançar Diretiva'}
                </Button>
              </div>
              {(displayExplanation || displayBonusText) && (
                <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-left space-y-4">
                  {displayExplanation && (
                    <div>
                      <h4 className="text-[#3b82f6] font-bold uppercase tracking-widest text-[9px] mb-2">Justificativa Técnica:</h4>
                      <p className="text-gray-400 text-sm font-sans leading-relaxed whitespace-pre-wrap">{displayExplanation}</p>
                    </div>
                  )}
                  {displayBonusText && (
                    <div className="pt-4 border-t border-white/5">
                      <h4 className="text-yellow-400 font-bold uppercase tracking-widest text-[9px] mb-2 flex items-center gap-2">
                        <HelpCircle size={14} /> Fato Bônus SAP
                      </h4>
                      <p className="text-gray-500 text-sm font-mono-neon leading-relaxed whitespace-pre-wrap">{displayBonusText}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Âncora scroll */}
        <div ref={bottomRef} />

        {/* Portal overlays for Regular UI */}
        {isFullscreenImage && questionData.imageUrl && createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300" onClick={() => setIsFullscreenImage(false)}>
            <button className="absolute top-6 right-6 text-white/50 bg-white/5 p-3 rounded-full"><X size={32} /></button>
            <img src={questionData.imageUrl} alt="Anexo Fullscreen" className="w-full h-full object-contain" onClick={(e) => e.stopPropagation()} />
          </div>,
          document.body
        )}
        {floatingCash !== null && createPortal(
          <div className="fixed pointer-events-none z-[99999] animate-fly-to-bank left-1/2 top-1/2">
            <div className="bg-neon-green/10 border border-neon-green/30 rounded-full px-3 py-1 backdrop-blur-sm flex items-center justify-center">
              <h1 className="text-xl md:text-2xl font-digital font-bold text-neon-green tracking-tight">+ {formatBRL(floatingCash)}</h1>
            </div>
          </div>,
          document.body
        )}
      </div>
    </Modal>
  );
};
