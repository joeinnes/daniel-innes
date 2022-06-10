import fs from 'fs';
import stream from 'stream';
import { db } from '$lib/db/db'
import type { CustomRequestEvent } from '$lib/types/types';

export const post = async ({ request, locals }: CustomRequestEvent) => {
  if (!locals?.user) {
    throw new Error('Unauthorised')
  }
  try {
    const submittedData = await request.formData();
    const files = submittedData.getAll('file') as File[];
    files.forEach(async file => {
      const uuid = crypto.randomUUID();
      const dataToWrite = await file.arrayBuffer()
      const dataBuffer = Buffer.from(dataToWrite);
      fs.writeFileSync(`./data/files/${uuid}`, dataBuffer)

    });
  } catch (error) {
    console.error(error);
  } finally {
    db.$disconnect();
  }
  return {};
}