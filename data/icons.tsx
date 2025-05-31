import { Megaphone, FileText, Code, Lightbulb } from "lucide-react";
import type { ReactElement } from "react";

export const iconMap: Record<string, ReactElement> = {
  marketing: <Megaphone className="h-5 w-5" />,
  announcement: <FileText className="h-5 w-5" />,
  tech: <Code className="h-5 w-5" />,
  idea: <Lightbulb className="h-5 w-5" />,
};

export function getIconForName(name: string): ReactElement {
  const key = name.toLowerCase();
  if (key.includes("marketing")) return iconMap.marketing;
  if (key.includes("announcement")) return iconMap.announcement;
  if (key.includes("tech") || key.includes("technical")) return iconMap.tech;
  return iconMap.idea;
}