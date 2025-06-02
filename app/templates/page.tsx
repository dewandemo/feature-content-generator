"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { templateMeta } from "@/data/icons";
import { cn } from "@/lib/utils";
import { PencilIcon, SaveIcon, FileText, Trash2Icon, Plus } from "lucide-react";
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

function generateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const DEFAULT_IDS = [
  "blog",
  "se_handover",
  "tech_doc",
  "announcement",
  "release_notes",
  "newsletter",
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    prompt: "",
  });

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
      body: JSON.stringify({
        name: template.name,
        description: template.description,
        prompt: template.currentPrompt,
      }),
    });

    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isEditing: false, isExpanded: false } : t
      )
    );
  };

  const resetPrompt = async (id: string) => {
    await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, currentPrompt: t.prompt } : t))
    );
  };

  const updatePrompt = (id: string, newPrompt: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, currentPrompt: newPrompt } : t))
    );
  };

  const handleDeleteTemplate = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this template?"
    );
    if (!confirmed) return;

    await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTemplate = async () => {
    const { name, description, prompt } = newTemplate;
    if (!name || !prompt) return;

    const id = generateId(name);

    await fetch(`/api/prompts/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, prompt }),
    });

    setTemplates((prev) => [
      ...prev,
      {
        id,
        name,
        description,
        prompt,
        currentPrompt: prompt,
        isExpanded: false,
        isEditing: false,
      },
    ]);

    setNewTemplate({ name: "", description: "", prompt: "" });
    setShowAddForm(false);
  };

  const customTemplates = templates
    .filter((t) => !DEFAULT_IDS.includes(t.id))
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  const defaultTemplates = templates
    .filter((t) => DEFAULT_IDS.includes(t.id))
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  const renderTemplateCard = (template: TemplateData) => {
    const meta = templateMeta[template.id] ?? {
      icon: FileText,
      color: "bg-gray-500/10 text-gray-500",
    };
    const hasChanges = template.currentPrompt !== template.prompt;

    return (
      <Card
        key={template.id}
        className={cn("bg-gray-900 border-gray-800 p-4 rounded-md w-full")}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-md ${meta.color}`}>
              <meta.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{template.name}</h3>
              <p className="text-sm text-gray-400">{template.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!DEFAULT_IDS.includes(template.id) && (
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDeleteTemplate(template.id)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            )}
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
  };

  return (
    <>
      <Navbar />
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Prompt Templates</h1>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => setShowAddForm((prev) => !prev)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Template
          </Button>
        </div>

        {showAddForm && (
          <Card className="bg-gray-900 border-blue-500 border p-4 rounded-md mb-6">
            <div className="space-y-4">
              <input
                placeholder="Name"
                className="w-full bg-gray-800 border-gray-700 p-2 rounded"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              />
              <input
                placeholder="Description"
                className="w-full bg-gray-800 border-gray-700 p-2 rounded"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              />
              <Textarea
                placeholder="Prompt content"
                className="bg-gray-800 border-gray-700 min-h-[100px]"
                value={newTemplate.prompt}
                onChange={(e) => setNewTemplate({ ...newTemplate, prompt: e.target.value })}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewTemplate({ name: "", description: "", prompt: "" });
                    setShowAddForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button className="bg-blue-600" onClick={handleAddTemplate}>
                  Save Template
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-4 mb-10">
          {customTemplates.map(renderTemplateCard)}
        </div>

        {defaultTemplates.length > 0 && (
          <div className="mt-8 border-t-4 border-gray-700 pt-6">
            <h2 className="text-sm text-gray-400 uppercase tracking-widest mb-4">
              Default Templates
            </h2>
            <div className="space-y-4">
              {defaultTemplates.map(renderTemplateCard)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
