import { NextApiRequest, NextApiResponse } from "next";
import { storage, BUCKET_NAME } from "@/lib/storage";

const DEFAULT_PREFIX = "default";
const UPDATED_PREFIX = "updated";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const [defaultFiles] = await storage.bucket(BUCKET_NAME).getFiles({ prefix: DEFAULT_PREFIX });
    const [updatedFiles] = await storage.bucket(BUCKET_NAME).getFiles({ prefix: UPDATED_PREFIX });

    const mergedMap: Record<string, any> = {};

    // Load updated files first (they take precedence)
    for (const file of updatedFiles) {
      const id = extractId(file.name, UPDATED_PREFIX);
      if (!id) continue;

      const [contents] = await file.download();
      mergedMap[id] = { id, ...JSON.parse(contents.toString("utf-8")) };
    }

    // Load default files, but only if not overridden
    for (const file of defaultFiles) {
      const id = extractId(file.name, DEFAULT_PREFIX);
      if (!id || mergedMap[id]) continue;

      const [contents] = await file.download();
      mergedMap[id] = { id, ...JSON.parse(contents.toString("utf-8")) };
    }

    return res.status(200).json(Object.values(mergedMap));
  } catch (err) {
    console.error("Error loading templates:", err);
    return res.status(500).json({ error: "Failed to load templates" });
  }
}

function extractId(filename: string, prefix: string): string | null {
  const match = filename.match(new RegExp(`^${prefix}/(.+?)\\.json$`));
  return match ? match[1] : null;
}