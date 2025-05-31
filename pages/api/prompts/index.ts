import type { NextApiRequest, NextApiResponse } from 'next';
import { templatesMeta } from '@/data/templates';
import { storage, BUCKET_NAME } from '@/lib/storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!templatesMeta || !Array.isArray(templatesMeta)) {
      return res.status(500).json({ error: 'Template metadata not available' });
    }

    const templates = await Promise.all(
      templatesMeta.map(async (meta) => {
        const defaultPath = `default/${meta.id}.json`;
        const updatedPath = `updated/${meta.id}.json`;
        const bucket = storage.bucket(BUCKET_NAME);

        let prompt = '';
        try {
          const [exists] = await bucket.file(updatedPath).exists();
          const filePath = exists ? updatedPath : defaultPath;
          const [contents] = await bucket.file(filePath).download();
          const json = JSON.parse(contents.toString());
          prompt = json.prompt;
        } catch (err) {
          console.error(`Failed to load prompt for ${meta.id}:`, err);
        }

        return { ...meta, prompt };
      })
    );

    return res.status(200).json(templates);
  } catch (err) {
    console.error('Error fetching templates:', err);
    return res.status(500).json({ error: 'Failed to load templates' });
  }
}