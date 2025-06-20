import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { getTutorConfig } from '@/config/tutors';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Map tutor roles to language codes
const languageMap: Record<string, string> = {
  'English Tutor': 'en',
  'Italian Tutor': 'it',
  'Spanish Tutor': 'es',
  'German Tutor': 'de',
  'Chinese Tutor': 'zh',
  'French Tutor': 'fr'
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { audio, format, tutorId } = req.body;

    if (!audio) {
      return res.status(400).json({ message: 'No audio data provided' });
    }

    if (!tutorId) {
      return res.status(400).json({ message: 'Tutor ID is required' });
    }

    // Get tutor config to determine language
    const tutorConfig = getTutorConfig(tutorId);
    const language = languageMap[tutorConfig.role] || 'en'; // Default to English if role not found

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, 'base64');

    // Create a temporary file
    const tempFilePath = join(tmpdir(), `audio-${Date.now()}.${format}`);
    await writeFile(tempFilePath, audioBuffer);

    try {
      // Call OpenAI API with file stream and language
      const transcription = await openai.audio.transcriptions.create({
        file: createReadStream(tempFilePath),
        model: "whisper-1",
        language: language
      });

      if (!transcription || !transcription.text) {
        throw new Error('No transcription text received');
      }

      // Get speech analysis and tips
      const analysisResponse = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || '',
        messages: [
          {
            role: "system",
            content: `You are a concise speech coach. Analyze the transcribed speech and provide:
1. A score from 0-10 (whole number only)
2. One specific tip for improvement
3. Any grammar mistakes found (if none, write "No grammar mistakes found")

Format your response exactly like this:
Score: [number]/10
Tip: [one specific, actionable tip]
Grammar: [list any grammar mistakes or "No grammar mistakes found"]

Keep the tip under 100 characters and focus on the most impactful improvement needed.`
          },
          {
            role: "user",
            content: transcription.text
          }
        ],
        max_tokens: 150
      });

      const speechTip = analysisResponse.choices[0].message.content;
      const scoreMatch = speechTip?.match(/Score: (\d+)\/10/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

      return res.status(200).json({ 
        text: transcription.text,
        speechTip: speechTip,
        score: score
      });
    } catch (error) {
      console.error('OpenAI API error:', error);
      return res.status(500).json({ 
        message: 'Error processing audio',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      // Clean up the temporary file
      try {
        await unlink(tempFilePath);
      } catch (error) {
        console.error('Error cleaning up temporary file:', error);
      }
    }
  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({ 
      message: 'Error processing audio',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 