import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { createReadStream } from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { audio, format } = req.body;

    if (!audio) {
      return res.status(400).json({ message: 'No audio data provided' });
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, 'base64');

    // Create a temporary file
    const tempFilePath = join(tmpdir(), `audio-${Date.now()}.${format}`);
    await writeFile(tempFilePath, audioBuffer);

    // Call OpenAI API with file stream
    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(tempFilePath),
      model: "whisper-1",
    });

    return res.status(200).json({ text: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({ message: 'Error processing audio' });
  }
} 