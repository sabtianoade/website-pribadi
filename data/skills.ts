export interface Skill {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

export const skills: Skill[] = [
  { id: "html", name: "HTML", color: "var(--foreground)", emoji: "⚪" },
  { id: "css", name: "CSS", color: "var(--muted)", emoji: "⚫" },
  { id: "javascript", name: "JavaScript", color: "var(--foreground)", emoji: "⚪" },
  { id: "figma", name: "Figma", color: "var(--muted)", emoji: "⚫" },
];
