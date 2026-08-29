"use client";

import { motion } from "motion/react";
import { Instagram } from "lucide-react";
import { WhatsAppIcon, TikTokIcon } from "@/components/Icons";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Footer() {
  const [footerText, setFooterText] = useState("Dibuat dengan ❤️ oleh Thomas");
  const year = new Date().getFullYear();

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from("site_settings").select("value").eq("id", "footer_text").single();
      if (data?.value) setFooterText(data.value);
    }
    fetchSettings();
  }, []);

  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--card-border)", background: "var(--background)" }}
    >
      <div
        className="px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ maxWidth: 1300, margin: "0 auto" }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center md:items-start gap-1"
        >
          <span className="text-xl font-black" style={{ color: "var(--primary)" }}>
            thomas<span style={{ color: "var(--accent)" }}>.</span>
          </span>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {footerText} · {year}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Temukan aku di
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/6289677718775", hoverColor: "hover:text-[#25D366] hover:border-[#25D366]" },
              { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/sabtianooo?igsh=azFoZzlseG5mMGJs&utm_source=qr", hoverColor: "hover:text-[#E1306C] hover:border-[#E1306C]" },
              { icon: TikTokIcon, label: "TikTok", href: "https://www.tiktok.com/@sabtianooo?_r=1&_t=ZS-992uJK9aW7p", hoverColor: "hover:text-[#00f2fe] hover:border-[#00f2fe]" },
            ].map(({ icon: Icon, label, href, hoverColor }, idx) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
                className={`group flex items-center justify-center transition-colors ${hoverColor}`}
              >
                <Icon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs text-center md:text-right"
          style={{ color: "var(--muted)" }}
        >
          Dibangun dengan Next.js · TypeScript · Tailwind CSS
        </motion.p>
      </div>
    </footer>
  );
}
