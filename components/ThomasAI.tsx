"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Minimize2, Maximize2, Bot } from "lucide-react";
import Image from "next/image";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const QNA = [
  {
    q: "Siapa kamu?",
    a: "Halo! Aku Thomas AI. Aku adalah versi robot digital dari Thomas yang ditugaskan buat nemenin kamu di website ini. 🤖"
  },
  {
    q: "Suka makan apa?",
    a: "Bakso setiap hari? Ya bisa. Bahkan mungkin direkomendasikan secara medis (mungkin). 🍜"
  },
  {
    q: "Minuman favorit?",
    a: "Suka banget sama kopi! Energiku dari secangkir kopi, lo-fi beats, dan tekad bulat. ☕✅"
  },
  {
    q: "Kapan paling produktif?",
    a: "Pikiranku paling jernih waktu orang lain udah pada tidur. Aneh tapi nyata. 🌙"
  },
  {
    q: "Bikin web ini pakai apa?",
    a: "Website ini dibuat dengan penuh keringat menggunakan Next.js, Tailwind CSS, Framer Motion, dan tentu saja... banyak sekali kopi. 💻"
  }
];

export default function ThomasAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "bot", text: "Halo! Ada yang bisa kubantu? Tanya apa saja tentang Thomas!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleAsk = (qIndex: number) => {
    const question = QNA[qIndex].q;
    const answer = QNA[qIndex].a;

    // Add user question
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: question }]);
    
    // Simulate typing delay
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "bot", text: answer }]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--primary)] text-white rounded-full flex items-center justify-center shadow-lg shadow-[var(--primary)]/30 z-[90] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
            <Bot size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "60px" : "450px"
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="fixed bottom-6 right-6 w-[350px] bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#222] z-[90] overflow-hidden flex flex-col max-w-[calc(100vw-3rem)]"
          >
            {/* Header */}
            <div 
              className="h-[60px] bg-[var(--primary)] text-white flex items-center justify-between px-4 cursor-pointer"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Thomas AI</h3>
                  <p className="text-[10px] text-white/70">Selalu online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50 dark:bg-[#0a0a0a]">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          msg.sender === 'user' 
                            ? 'bg-[var(--primary)] text-white rounded-tr-none' 
                            : 'bg-white dark:bg-[#222] text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-[#333]'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-[#222] border border-gray-100 dark:border-[#333] p-3 rounded-2xl rounded-tl-none flex gap-1">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area (Predefined buttons) */}
                <div className="p-3 bg-white dark:bg-[#111] border-t border-gray-100 dark:border-[#222] flex flex-wrap gap-2">
                  <p className="w-full text-xs text-gray-400 mb-1 px-1">Pilih pertanyaan:</p>
                  {QNA.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleAsk(index)}
                      disabled={isTyping}
                      className="text-xs bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {item.q}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
