"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { iconMap } from "@/data/icons";
import { cn } from "@/lib/utils";
import { PencilIcon, SaveIcon, FileText } from "lucide-react";
import Navbar from "@/components/navbar";

interface TemplateData {
  id: string;
  name: string;
  description: string;
  prompt: string;
  currentPrompt: string;
  isExpanded: boolean;
  isEditing: boolean;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await fetch("/api/prompts");
      const data = await res.json();
      setTemplates(
        data.map((t: any) => ({
          ...t,
          isExpanded: false,
          isEditing: false,
          currentPrompt: t.prompt,
        }))
      );
      setLoading(false);
    };

    fetchTemplates();
  }, []);

  const toggleEdit = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isExpanded: true, isEditing: true } : t
      )
    );
  };

  const savePrompt = async (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (!template) return;

    await fetch(`/api/prompts/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: template.currentPrompt }),
    });

    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, isEditing: false, isExpanded: false }
          : t
      )
    );
  };

  const resetPrompt = async (id: string) => {
    await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, currentPrompt: t.prompt } : t
      )
    );
  };

  const updatePrompt = (id: string, newPrompt: string) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, currentPrompt: newPrompt } : t
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Prompt Templates</h1>
        <div className="space-y-4">
          {templates.map((template) => {
            const Icon = iconMap[template.id] ?? FileText;
            const hasChanges = template.currentPrompt !== template.prompt;
  
            return (
              <Card
                key={template.id}
                className={cn("bg-gray-900 border-gray-800 p-4 rounded-md w-full")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6" />
                    <div>
                      <h3 className="text-lg font-semibold">{template.name}</h3>
                      <p className="text-sm text-gray-400">{template.description}</p>
                    </div>
                  </div>
                  {!template.isEditing ? (
                    <Button variant="ghost" onClick={() => toggleEdit(template.id)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={() => savePrompt(template.id)}>
                      <SaveIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
  
                {template.isExpanded && (
                  <div className="mt-4 space-y-4">
                    <Textarea
                      className="bg-gray-800 border-gray-700 min-h-[200px]"
                      value={template.currentPrompt}
                      onChange={(e) => updatePrompt(template.id, e.target.value)}
                    />
                    {hasChanges && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetPrompt(template.id)}
                      >
                        Revert to Default
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}