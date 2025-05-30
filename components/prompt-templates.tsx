"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, FileText, Megaphone, Briefcase, Code, PenTool } from "lucide-react"
import type { PromptTemplate } from "@/types/prompt"

const defaultTemplates: PromptTemplate[] = [
  {
    id: "blog",
    name: "Blog Post",
    description: "Create a blog post announcing the feature",
    icon: <FileText className="h-5 w-5" />,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "announcement",
    name: "Announcement",
    description: "Create a concise announcement for the feature",
    icon: <Megaphone className="h-5 w-5" />,
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: "sales",
    name: "Sales Engineering Handover",
    description: "Create a detailed handover document for the sales team",
    icon: <Briefcase className="h-5 w-5" />,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: "technical",
    name: "Technical Documentation",
    description: "Create technical documentation for developers",
    icon: <Code className="h-5 w-5" />,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "marketing",
    name: "Marketing Copy",
    description: "Create marketing copy highlighting key benefits",
    icon: <PenTool className="h-5 w-5" />,
    color: "bg-pink-500/10 text-pink-500",
  },
]

interface PromptTemplatesProps {
  selectedTemplates: PromptTemplate[]
  onSelectionChange: (templates: PromptTemplate[]) => void
}

export default function PromptTemplates({ selectedTemplates, onSelectionChange }: PromptTemplatesProps) {
  const [templates, setTemplates] = useState<PromptTemplate[]>(defaultTemplates)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateDescription, setNewTemplateDescription] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleToggleSelect = (template: PromptTemplate) => {
    const isSelected = selectedTemplates.some((t) => t.id === template.id)
    if (isSelected) {
      onSelectionChange(selectedTemplates.filter((t) => t.id !== template.id))
    } else {
      onSelectionChange([...selectedTemplates, template])
    }
  }

  const handleAddNewTemplate = () => {
    if (!newTemplateName || !newTemplateDescription) return

    const newTemplate: PromptTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplateName,
      description: newTemplateDescription,
      icon: <FileText className="h-5 w-5" />,
      color: "bg-gray-500/10 text-gray-500",
      isCustom: true,
    }

    setTemplates([...templates, newTemplate])
    setNewTemplateName("")
    setNewTemplateDescription("")
    setDialogOpen(false)
  }

  const handleDragStart = (e: React.DragEvent, template: PromptTemplate) => {
    e.dataTransfer.setData("template", JSON.stringify(template))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Available Templates</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" /> Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="Enter template name"
                  className="mt-1 bg-gray-800 border-gray-700"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="template-description">Template Description</Label>
                <Textarea
                  id="template-description"
                  placeholder="Describe what this template will generate"
                  className="mt-1 bg-gray-800 border-gray-700"
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleAddNewTemplate}>
                Create Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-sm text-gray-400 mb-4">Select templates to add them to your project</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {templates.map((template) => {
          const isSelected = selectedTemplates.some((t) => t.id === template.id)
          return (
            <Card
              key={template.id}
              className={`bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer ${isSelected ? 'ring-2 ring-green-500 border-green-500' : ''}`}
              onClick={() => handleToggleSelect(template)}
            >
              <div className="p-4 flex items-start space-x-3">
                <div className={`p-2 rounded-md ${template.color}`}>{template.icon}</div>
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </div>

              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
