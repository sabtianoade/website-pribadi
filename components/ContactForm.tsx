"use client";
import { motion } from "motion/react";
import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSendWA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    
    // NOTE: Ganti nomor WA di bawah ini dengan nomor Thomas asli (gunakan kode negara 62)
    const phoneNumber = "6289677718775"; // GANTI NOMOR INI
    
    const text = `Halo Thomas! 👋%0A%0AAku ${encodeURIComponent(name)}.%0A${encodeURIComponent(message)}`;
    const waUrl = `https://wa.me/${phoneNumber}?text=${text}`;
    
    window.open(waUrl, "_blank");
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-10 bg-[var(--card)]/30 border-t border-[var(--card-border)] relative z-10">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-6 shadow-[0_0_20px_rgba(255,20,147,0.2)]">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4">Leave a Message</h2>
          <p className="text-[var(--muted)] max-w-lg mx-auto">
            Punya pesan rahasia, pertanyaan, atau mau ngobrol? Tulis aja di sini, nanti langsung masuk ke WhatsApp pribadiku!
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSendWA}
          className="w-full bg-[var(--background)] p-6 md:p-10 rounded-[2rem] border border-[var(--card-border)] shadow-2xl flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-[var(--foreground)] ml-2">Nama Kamu</label>
            <input 
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Siapa namamu?"
              required
              className="w-full bg-[var(--card)] border border-[var(--card-border)] focus:border-[var(--primary)] rounded-xl px-5 py-4 text-[var(--foreground)] outline-none transition-all shadow-inner"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-semibold text-[var(--foreground)] ml-2">Pesan</label>
            <textarea 
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesanmu di sini..."
              required
              rows={4}
              className="w-full bg-[var(--card)] border border-[var(--card-border)] focus:border-[var(--primary)] rounded-xl px-5 py-4 text-[var(--foreground)] outline-none transition-all resize-none shadow-inner"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground)]/90 font-bold py-4 rounded-xl shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
          >
            <Send size={18} />
            Kirim via WhatsApp
          </button>
        </motion.form>
      </div>
    </section>
  );
}
