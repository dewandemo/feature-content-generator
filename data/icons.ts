// src/data/icons.ts
import { FileText, Megaphone, Code, Lightbulb, Briefcase, PenTool, Newspaper } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TemplateVisualMeta {
  icon: LucideIcon;
  color: string;
}

export const templateMeta: Record<string, TemplateVisualMeta> = {
  announcement: {
    icon: Megaphone,
    color: "bg-green-500/10 text-green-500",
  },
  blog: {
    icon: FileText,
    color: "bg-blue-500/10 text-blue-500",
  },
  tech: {
    icon: Code,
    color: "bg-orange-500/10 text-orange-500",
  },
  idea: {
    icon: Lightbulb,
    color: "bg-yellow-500/10 text-yellow-500",
  },
  marketing: {
    icon: PenTool,
    color: "bg-pink-500/10 text-pink-500",
  },
  se_handover: {
    icon: Briefcase,
    color: "bg-purple-500/10 text-purple-500",
  },
  newsletter: {
    icon: Newspaper,
    color: "bg-yellow-500/10 text-yellow-500",
  },
};