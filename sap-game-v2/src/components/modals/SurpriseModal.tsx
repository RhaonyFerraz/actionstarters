import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { surpriseEnglishQuestion } from '../../config/quiz';
import { BrainCircuit, Clock, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

interface SurpriseModalProps {
  isOpen: boolean;
  onDone: () => void;
}

export const SurpriseModal: React.FC<SurpriseModalProps> = ({ isOpen, onDone }) => {
  const addBalance = useGameStore(state => state.addBalance);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [floatingCash, setFloatingCash] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Encontra o container scrollável real via computed style
  const getScrollParent = (node: Element | null): Element | null => {
    if (!node) return null;
    const overflow = window.getComputedStyle(node).overflowY;
    if ((overflow === 'auto' || overflow === 'scroll') && node.scrollHeight > node.clientHeight) {
      return node;
    }
    return getScrollParent(node.parentElement);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      const container = getScrollParent(bottomRef.current?.parentElement ?? null);
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 60);
  };

  // Reset ao abrir
  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setTimeLeft(60);
      setFloatingCash(null);
    }
  }, [isOpen]);

  // Timer de 60 segundos
  useEffect(() => {
    if (!isOpen || isAnswered) return;
    if (timeLeft <= 0) {
      setIsAnswered(true);
      setIsCorrect(false);
      scrollToBottom();
      return;
    }
    const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, [isOpen, isAnswered, timeLeft]);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Rola ao selecionar alternativa
  const handleSelect = (idx: number) => {
    setSelectedOption(idx);
    scrollToBottom();
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === surpriseEnglishQuestion.correctAnswerIndex;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      addBalance(surpriseEnglishQuestion.bonusAmount);
      setFloatingCash(surpriseEnglishQuestion.bonusAmount);
      setTimeout(() => setFloatingCash(null), 2500);
    }
    // Rolar ao resultado
    scrollToBottom();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="SYSTEM EVENT: SurpriseQuestion.exe">
      <div className="font-sans text-black space-y-4">

        {/* E-mail */}
        <div className="bg-white border-2 border-gray-500 p-4 shadow-inner">
          <div className="border-b border-gray-200 pb-2 mb-3 text-xs text-gray-500 space-y-1">
            <p><strong>From:</strong> {surpriseEnglishQuestion.emailHeader}</p>
            <p><strong>Subject:</strong> {surpriseEnglishQuestion.emailSubject}</p>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
            {surpriseEnglishQuestion.emailBody}
          </p>
        </div>

        {/* Timer */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold uppercase text-gray-700">
            <span className="flex items-center gap-1"><Clock size={12} /> Tempo Restante</span>
            <span className={timeLeft <= 15 ? 'text-red-600 animate-pulse' : ''}>{timeLeft}s</span>
          </div>
          <div className="h-5 bg-gray-300 border-2 border-gray-500 p-0.5">
            <div
              className={`h-full transition-all duration-1000 ${timeLeft <= 15 ? 'bg-red-500' : 'bg-[#00cc00]'}`}
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>
        </div>

        {/* Pergunta */}
        <div className="border-t-2 border-gray-400 pt-4">
          <h3 className="font-bold text-base mb-3">❓ {surpriseEnglishQuestion.question}</h3>
          <div className="space-y-2">
            {surpriseEnglishQuestion.options.map((opt, idx) => {
              if (isAnswered && idx !== surpriseEnglishQuestion.correctAnswerIndex && idx !== selectedOption) return null;

              let cls = 'w-full text-left p-3 border-2 flex items-start gap-2 transition-all text-sm ';
              if (!isAnswered) {
                cls += selectedOption === idx
                  ? 'bg-[#ffffcc] border-blue-700 font-semibold'
                  : 'bg-white border-gray-400 hover:bg-gray-50';
              } else {
                if (idx === surpriseEnglishQuestion.correctAnswerIndex) cls += 'bg-green-100 border-green-600 text-green-900 font-semibold';
                else if (selectedOption === idx) cls += 'bg-red-100 border-red-600 text-red-800 line-through opacity-70';
              }

              return (
                <button key={idx} disabled={isAnswered} onClick={() => handleSelect(idx)} className={cls}>
                  <span className="font-bold text-gray-500 shrink-0">{String.fromCharCode(65 + idx)})</span>
                  <span>{opt.substring(3)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-300">
          {!isAnswered ? (
            <button
              disabled={selectedOption === null}
              onClick={handleSubmit}
              className="w-full bg-[#c0c0c0] py-2 px-6 border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500 font-bold text-sm active:border-t-gray-500 active:border-l-gray-500 active:border-b-white active:border-r-white disabled:opacity-40"
            >
              ✔ AUTENTICAR.EXE
            </button>
          ) : (
            <div className="space-y-3">
              <div className={`p-3 border-2 flex items-center gap-2 font-bold text-sm ${isCorrect ? 'bg-green-100 border-green-600 text-green-800' : 'bg-red-100 border-red-600 text-red-800'}`}>
                {isCorrect ? <BrainCircuit size={20} /> : <AlertTriangle size={20} />}
                {isCorrect ? 'SISTEMA INTEGRADO: RESPOSTA PROFISSIONAL ✅' : 'FALHA DE COMUNICAÇÃO ❌'}
              </div>

              {isCorrect && (
                <div className="bg-white border-2 border-gray-400 p-4 whitespace-pre-wrap text-xs leading-relaxed overflow-y-auto max-h-[220px] text-gray-800">
                  {surpriseEnglishQuestion.explanation}
                </div>
              )}

              <button
                onClick={onDone}
                className="w-full bg-[#c0c0c0] py-2 border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500 font-bold text-sm"
              >
                CONTINUAR_JORNADA.EXE ▶
              </button>
            </div>
          )}
        </div>

        {/* Âncora invisível no final — alvo do scroll */}
        <div ref={bottomRef} />

        {/* Flying Cash */}
        {floatingCash !== null && createPortal(
          <div className="fixed pointer-events-none z-[99999] animate-fly-to-bank left-1/2 top-1/2">
            <div className="bg-neon-green/10 border border-neon-green/30 rounded-full px-3 py-1 backdrop-blur-sm flex items-center">
              <span className="text-xl font-digital font-bold text-neon-green">+ {formatBRL(floatingCash)}</span>
            </div>
          </div>,
          document.body
        )}
      </div>
    </Modal>
  );
};
