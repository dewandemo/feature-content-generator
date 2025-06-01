"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Submission {
  id: string;
  team: {
    id: string;
    name: string;
    emails: string[];
  };
  feature: {
    name: string;
    description: string;
  };
  selectedTemplates: {
    id: string;
    name: string;
    description: string;
    color: string;
  }[];
  generatedOutput: string;
  timestamp: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const res = await fetch("/api/submissions");
      const data = await res.json();
      setSubmissions(data);
    };

    fetchSubmissions();
  }, []);

  const parseGeneratedOutput = (
    output: string,
    templates: Submission["selectedTemplates"],
    featureName: string
  ) => {
    const parts = output.split("\n---\n");
    const entries = parts.map((section) => {
      const firstLine = section.match(/^# (.+)/);
      const title = firstLine ? firstLine[1].toLowerCase() : "unknown";
      const matchedTemplate = templates.find((t) =>
        title.includes(t.name.toLowerCase())
      );
      const slug = featureName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const filename = `${slug}_${matchedTemplate?.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}.md`;
      return { name: matchedTemplate?.name || title, content: section, filename };
    });
    return entries;
  };

  return (
    <>
      <Navbar />
      <div className="container py-10 space-y-6">
        <h1 className="text-3xl font-bold mb-4">Submissions</h1>
        {submissions.map((submission) => {
          const parsedContent = parseGeneratedOutput(
            submission.generatedOutput,
            submission.selectedTemplates,
            submission.feature.name
          );

          const readableDate = format(
            new Date(submission.timestamp),
            "MMMM do, yyyy"
          );

          return (
            <Card
              key={submission.id}
              className="bg-gray-900 border-gray-800 p-6 rounded-md"
            >
              <div className="mb-2">
                <h2 className="text-xl font-semibold">
                  {submission.feature.name}
                </h2>
                <p className="text-sm text-gray-400">Submitted on {readableDate}</p>
              </div>
              <div className="space-y-2 mt-4">
                {parsedContent.map((entry) => (
                  <div
                    key={entry.filename}
                    className="p-4 bg-gray-800 rounded border border-gray-700"
                  >
                    <h3 className="font-medium text-white mb-2">
                      {entry.name}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const blob = new Blob([entry.content], {
                          type: "text/markdown",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = entry.filename;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download {entry.filename}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
