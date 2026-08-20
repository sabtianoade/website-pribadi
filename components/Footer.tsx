"use client";

import { Instagram } from "lucide-react";
import { WhatsAppIcon, TikTokIcon } from "@/components/Icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--card-border)", background: "var(--background)" }}
    >
      <div
        className="px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ maxWidth: 1300, margin: "0 auto" }}
      >
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-xl font-black" style={{ color: "var(--primary)" }}>
            thomas<span style={{ color: "var(--accent)" }}>.</span>
          </span>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Dibuat dengan ❤️ oleh Thomas · {year}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Temukan aku di
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/6289677718775", hoverColor: "hover:text-[#25D366] hover:border-[#25D366]" },
              { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/sabtianooo?igsh=azFoZzlseG5mMGJs&utm_source=qr", hoverColor: "hover:text-[#E1306C] hover:border-[#E1306C]" },
              { icon: TikTokIcon, label: "TikTok", href: "https://www.tiktok.com/@sabtianooo?_r=1&_t=ZS-992uJK9aW7p", hoverColor: "hover:text-[#00f2fe] hover:border-[#00f2fe]" },
            ].map(({ icon: Icon, label, href, hoverColor }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-center transition-all hover:-translate-y-1 ${hoverColor}`}
              >
                <Icon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <p className="text-xs text-center md:text-right" style={{ color: "var(--muted)" }}>
          Dibangun dengan Next.js · TypeScript · Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
