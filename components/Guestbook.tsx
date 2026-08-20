"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send } from "lucide-react";

interface Message {
  id: string;
  name: string;
  text: string;
  timestamp: Date;
}

const sampleMessages: Message[] = [];

function formatTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

const COLORS = ["#333333","#555555","#777777","#999999","#1A1A1A","#4A4A4A","#666666","#888888"];
function getColor(name: string): string {
  let h = 0;
  for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<{ name?: string; text?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const validate = () => {
    const e: { name?: string; text?: string } = {};
    if (!name.trim()) e.name = "Nama wajib diisi";
    if (!text.trim()) e.text = "Pesan wajib diisi";
    if (text.trim().length > 280) e.text = "Maksimal 280 karakter";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setMessages((prev) => [
      { id: `msg-${Date.now()}`, name: name.trim(), text: text.trim(), timestamp: new Date() },
      ...prev,
    ]);
    setName("");
    setText("");
    setErrors({});
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="guestbook" className="py-24 px-6 md:px-10" style={{ background: "var(--background)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-3">
            Tinggalin{" "}
            <span className="gradient-text">Pesanmu</span>
          </h2>
          <p style={{ color: "var(--muted)" }} className="text-base max-w-md">
            Sapa aku, tinggalin kesan, atau apapun yang mau kamu tulis. Aku baca kok!
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
            💡 Pesan tidak disimpan permanen dan akan hilang saat halaman di-refresh.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[420px_1fr] gap-10 items-start">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-6 rounded-2xl"
            style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
            noValidate
          >
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="guest-name" className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Namamu
              </label>
              <input
                id="guest-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Siapa namamu?"
                maxLength={50}
                aria-describedby={errors.name ? "name-err" : undefined}
                aria-invalid={!!errors.name}
                className="px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "var(--muted-bg)",
                  border: `1px solid ${errors.name ? "#EF4444" : "var(--card-border)"}`,
                  color: "var(--foreground)",
                }}
              />
              {errors.name && <p id="name-err" className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="guest-msg" className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Pesanmu
              </label>
              <textarea
                id="guest-msg"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tulis apapun yang mau kamu sampaikan..."
                maxLength={280}
                rows={4}
                aria-describedby={errors.text ? "msg-err" : "char-count"}
                aria-invalid={!!errors.text}
                className="px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                style={{
                  background: "var(--muted-bg)",
                  border: `1px solid ${errors.text ? "#EF4444" : "var(--card-border)"}`,
                  color: "var(--foreground)",
                }}
              />
              <div className="flex justify-between">
                {errors.text
                  ? <p id="msg-err" className="text-xs text-red-500">{errors.text}</p>
                  : <span id="char-count" className="text-xs" style={{ color: "var(--muted)" }}>{text.length}/280</span>
                }
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
            >
              <Send size={15} aria-hidden="true" />
              Kirim Pesan
            </motion.button>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-sm font-medium py-2 rounded-xl"
                  style={{ background: "color-mix(in srgb, #10B981 12%, transparent)", color: "#10B981" }}
                  role="status"
                  aria-live="polite"
                >
                  ✅ Pesan terkirim! Makasih udah mampir 🎉
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* Messages */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-sm font-semibold mb-4" style={{ color: "var(--muted)" }}>
              {messages.length} pesan masuk
            </p>
            <div
              className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1"
              role="log"
              aria-label="Pesan buku tamu"
              aria-live="polite"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const color = getColor(msg.name);
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 rounded-2xl"
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--card-border)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: color }}
                          aria-hidden="true"
                        >
                          {msg.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                            {msg.name}
                          </p>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>
                            {mounted ? formatTime(msg.timestamp) : "..."}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {msg.text}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
