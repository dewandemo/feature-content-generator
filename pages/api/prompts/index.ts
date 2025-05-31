import { Storage } from '@google-cloud/storage';
import type { NextApiRequest, NextApiResponse } from 'next';
import { templatesMeta } from '@/data/templates';

const storage = new Storage();
const bucketName = 'content-kings2025';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const templates = await Promise.all(
      templatesMeta.map(async (meta) => {
        const defaultPath = `default/${meta.id}.json`;
        const updatedPath = `updated/${meta.id}.json`;
        const bucket = storage.bucket(bucketName);

        let prompt = '';
        try {
          const [exists] = await bucket.file(updatedPath).exists();
          const file = exists ? updatedPath : defaultPath;
          const contents = await bucket.file(file).download();
          const json = JSON.parse(contents.toString());
          prompt = json.prompt;
        } catch (err) {
          console.error(`Failed to load prompt for ${meta.id}`, err);
        }

        return { ...meta, prompt };
      })
    );

    res.status(200).json(templates); // MUST be an array
  } catch (err) {
    console.error('Failed to fetch templates', err);
    res.status(500).json({ error: 'Failed to load templates' }); // NOT an array
  }
}