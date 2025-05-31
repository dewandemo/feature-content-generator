import { Storage } from '@google-cloud/storage';
import type { NextApiRequest, NextApiResponse } from 'next';

const storage = new Storage({
  keyFilename: 'secrets/credentials.json', // Or use env var
});

const BUCKET_NAME = 'content-kings2025';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  try {
    const submission = req.body;
    const filePath = `teams/${submission.team.id}/submission.json`;

    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(filePath);

    await file.save(JSON.stringify(submission, null, 2), {
      contentType: 'application/json',
    });

    res.status(200).json({ message: 'Saved', path: filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save submission' });
  }
}