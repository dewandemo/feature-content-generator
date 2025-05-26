"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PromptTemplates from "@/components/prompt-templates"
import type { PromptTemplate } from "@/types/prompt"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export default function FeatureForm() {
  const [featureName, setFeatureName] = useState("")
  const [featureDescription, setFeatureDescription] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [selectedTemplates, setSelectedTemplates] = useState<PromptTemplate[]>([])
  const [contextPrompt, setContextPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAddTemplate = (template: PromptTemplate) => {
    if (!selectedTemplates.some((t) => t.id === template.id)) {
      setSelectedTemplates([...selectedTemplates, template])
    }
  }

  const handleRemoveTemplate = (templateId: string) => {
    setSelectedTemplates(selectedTemplates.filter((t) => t.id !== templateId))
  }

  const handleGenerateContent = async () => {
    if (!featureName || !featureDescription || selectedTemplates.length === 0) {
      alert("Please fill in the feature details and select at least one template")
      return
    }

    setIsGenerating(true)
    setGeneratedContent("")

    try {
      // Construct the prompt based on selected templates and context
      const templatesText = selectedTemplates.map((t) => `- ${t.name}: ${t.description}`).join("\n")

      const prompt = `
        Generate content for a new Harness feature with the following details:
        
        Feature Name: ${featureName}
        Feature Description: ${featureDescription}
        Target Audience: ${targetAudience || "Not specified"}
        Expected Release Date: ${releaseDate || "Not specified"}
        
        Content should be generated for the following templates:
        ${templatesText}
        
        Additional Context: ${contextPrompt || "None provided"}
        
        Please format the output with clear headings for each template type.
      `

      // In a real implementation, you would use the AI SDK to generate content
      // For now, we'll simulate the response
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: prompt,
      })

      setGeneratedContent(text)
    } catch (error) {
      console.error("Error generating content:", error)
      setGeneratedContent("An error occurred while generating content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Feature Details</h2>

          <div className="space-y-6">
            <div>
              <Label htmlFor="feature-name">Feature Name</Label>
              <Input
                id="feature-name"
                placeholder="Enter feature name"
                className="mt-1 bg-gray-800 border-gray-700"
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="feature-description">Feature Description</Label>
              <Textarea
                id="feature-description"
                placeholder="Describe the feature and its benefits"
                className="mt-1 bg-gray-800 border-gray-700 min-h-[100px]"
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target-audience">Target Audience</Label>
                <Input
                  id="target-audience"
                  placeholder="Who is this feature for?"
                  className="mt-1 bg-gray-800 border-gray-700"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="release-date">Expected Release Date</Label>
                <Input
                  id="release-date"
                  type="date"
                  className="mt-1 bg-gray-800 border-gray-700"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <Tabs defaultValue="templates">
            <TabsList className="bg-gray-800 mb-6">
              <TabsTrigger value="templates">Prompt Templates</TabsTrigger>
              <TabsTrigger value="selected">Selected Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              <PromptTemplates onSelectTemplate={handleAddTemplate} />
            </TabsContent>

            <TabsContent value="selected">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Selected Templates</h3>
                {selectedTemplates.length === 0 ? (
                  <p className="text-gray-400">
                    No templates selected. Drag and drop templates from the Templates tab.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedTemplates.map((template) => (
                      <div key={template.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-gray-400">{template.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTemplate(template.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Label htmlFor="context-prompt">Context Prompt</Label>
            <Textarea
              id="context-prompt"
              placeholder="Add context about the purpose of the generated content (e.g., feature stage, target audience, tone)"
              className="mt-1 bg-gray-800 border-gray-700 min-h-[100px]"
              value={contextPrompt}
              onChange={(e) => setContextPrompt(e.target.value)}
            />
          </div>

          <Button
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
            onClick={handleGenerateContent}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Content"}
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Generated Content</h2>
            <div className="bg-gray-800 p-4 rounded-md whitespace-pre-wrap">{generatedContent}</div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" className="mr-2">
                Copy
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
