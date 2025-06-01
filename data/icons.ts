import { FileText, Megaphone, Code, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  announcement: Megaphone,
  blog: FileText,
  tech: Code,
  idea: Lightbulb,
};
