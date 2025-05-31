// data/templateMeta.ts
import { Megaphone, FileText, Code, Lightbulb, Newspaper, Terminal, Users } from "lucide-react";

export const templateMeta = [
  {
    id: "announcement",
    name: "Announcement",
    description: "Create an internal or social launch announcement",
    icon: Megaphone,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "blog",
    name: "Blog",
    description: "Generate a technical blog post from this feature",
    icon: FileText,
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: "tech_doc",
    name: "Tech Doc",
    description: "Produce internal or public-facing technical docs",
    icon: Code,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: "newsletter",
    name: "Newsletter",
    description: "Summarize updates in a short, scannable newsletter",
    icon: Newspaper,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "release_notes",
    name: "Release Notes",
    description: "Write developer-facing release notes",
    icon: Terminal,
    color: "bg-gray-500/10 text-gray-500",
  },
  {
    id: "se_handover",
    name: "SE Handover",
    description: "Prepare a handover doc for Sales Engineering",
    icon: Users,
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    id: "marketing",
    name: "Marketing Copy",
    description: "Create marketing copy highlighting key benefits",
    icon: Lightbulb,
    color: "bg-yellow-500/10 text-yellow-500",
  },
];