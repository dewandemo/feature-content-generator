import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { useEffect, useState } from 'react';

// 🔁 Replace with your actual bucket name and key file path
const BUCKET_NAME = 'content-kings2025';
const KEYFILE_PATH = path.resolve(__dirname, '../secrets/credentials.json');

const storage = new Storage({
  keyFilename: KEYFILE_PATH,
});

async function uploadFormData(formData: Record<string, any>) {
    const [timestamp, setTimestamp] = useState<string | null>(null);

    useEffect(() => {
      const now = new Date().toISOString().replace(/[:.]/g, '-');
      setTimestamp(now);
    }, []);
  const id = uuidv4().slice(0, 8);
  const filename = `submissions/${timestamp}-${id}.json`;
  const contents = JSON.stringify(formData, null, 2);

  await storage.bucket(BUCKET_NAME).file(filename).save(contents, {
    contentType: 'application/json',
  });

  console.log(`✅ Uploaded to gs://${BUCKET_NAME}/${filename}`);
}

// Example usage
uploadFormData({
  feature_title: 'Test Feature Upload',
  key_benefits: ['Easy to test', 'Cloud storage verified'],
  submitted_by: 'richard@harness.io',
}).catch(console.error);