import fs from 'fs';
import crypto from 'crypto';
import { db } from '$lib/db/db'
import type { CustomRequestEvent } from '$lib/types/types';
import type { ResponseBody } from '@sveltejs/kit';

export const POST = async ({ request, locals }: CustomRequestEvent) => {
  let res: ResponseBody = {
    status: 200,
    body: []
  }
  if (!locals?.user) {
    return {
      status: 401,
    }
  }
  try {
    const submittedData = await request.formData();
    const files = submittedData.getAll('file') as File[];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dataToWrite = await file.arrayBuffer()
      const dataBuffer = Buffer.from(dataToWrite);
      const hashSum = crypto.createHash('sha256');
      hashSum.update(dataBuffer);
      const hex = hashSum.digest('hex');
      fs.writeFileSync(`./public/files/${hex}`, dataBuffer)
      await db.file.create({
        data: {
          s3id: hex,
          name: file.name,
        }
      });
      if (Array.isArray(res.body)) {
        res.body.push(hex);
      } else {
        res.body = [hex];
      }
    }
  } catch (error) {
    console.error(error)
    res = {
      status: 500,
    }
  } finally {
    db.$disconnect();
  }
  console.log(res)
  return res;
}