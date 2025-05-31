import { NextApiRequest, NextApiResponse } from "next";
import { storage, BUCKET_NAME } from '@/lib/storage';

const DEFAULT_PREFIX = "default";
const UPDATED_PREFIX = "updated";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid prompt ID" });
  }

  const updatedFile = `${UPDATED_PREFIX}/${id}.json`;
  const defaultFile = `${DEFAULT_PREFIX}/${id}.json`;

  try {
    if (req.method === "GET") {
      const fileToRead = await fileExists(updatedFile) ? updatedFile : defaultFile;
      const contents = await readPromptContent(fileToRead);
      return res.status(200).json({ prompt: contents });
    }

    if (req.method === "POST") {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Missing prompt content" });
      }

      await storage.bucket(BUCKET_NAME).file(updatedFile).save(
        JSON.stringify({ prompt }),
        { contentType: "application/json" }
      );

      return res.status(200).json({ message: "Prompt saved" });
    }

    if (req.method === "DELETE") {
      await storage.bucket(BUCKET_NAME).file(updatedFile).delete({ ignoreNotFound: true });
      return res.status(200).json({ message: "Prompt reverted to default" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Prompt API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function readPromptContent(filePath: string): Promise<string> {
  const file = storage.bucket(BUCKET_NAME).file(filePath);
  const [contents] = await file.download();
  const json = JSON.parse(contents.toString("utf-8"));
  return json.prompt;
}

async function fileExists(filePath: string): Promise<boolean> {
  const file = storage.bucket(BUCKET_NAME).file(filePath);
  const [exists] = await file.exists();
  return exists;
}