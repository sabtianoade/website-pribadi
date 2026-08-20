"use client";

import { useEffect, useState } from "react";

export default function TypewriterText({
  text,
  delay = 0,
  speed = 28,
  className = "",
  style = {},
}: {
  text: string;
  delay?: number; // ms before typing starts
  speed?: number; // ms per character
  className?: string;
  style?: React.CSSProperties;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [started, displayed, text, speed]);

  return (
    <span className={className} style={style}>
      {displayed}
      {/* Blinking cursor */}
      {!done && (
        <span
          style={{
            display: "inline-block",
            width: "2px",
            height: "1em",
            background: "var(--primary)",
            marginLeft: "2px",
            verticalAlign: "middle",
            animation: "blink 0.7s step-end infinite",
          }}
          aria-hidden="true"
        />
      )}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
