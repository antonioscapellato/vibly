import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { getTutorConfig } from '../../utils/tutors';

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
    const { messages, tutorId } = req.body;
    const tutorConfig = getTutorConfig(tutorId);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: tutorConfig.systemPrompt
        },
        ...messages
      ],
    });

    const response = completion.choices[0].message;

    // Get audio from ElevenLabs
    const audioResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${tutorConfig.voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        },
        body: JSON.stringify({
          text: response.content,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    const audioBuffer = await audioResponse.arrayBuffer();

    return res.status(200).json({
      text: response.content,
      audio: Buffer.from(audioBuffer).toString('base64'),
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
