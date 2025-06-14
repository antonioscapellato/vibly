import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { getTutorConfig } from '@/config/tutors';

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
    console.log('Received request with tutorId:', tutorId);
    console.log('Messages:', messages);

    const tutorConfig = getTutorConfig(tutorId);
    console.log('Tutor config:', tutorConfig);

    // Ensure messages array is properly formatted and includes all history
    const formattedMessages = [
      {
        role: "system",
        content: tutorConfig.systemPrompt
      },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    console.log('Formatted messages for API:', formattedMessages);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: formattedMessages,
      });

      const response = completion.choices[0].message;
      console.log('OpenAI response:', response);

      if (!response || !response.content) {
        throw new Error('Invalid response from OpenAI');
      }

      // Get audio from ElevenLabs
      console.log('Calling ElevenLabs with voiceId:', tutorConfig.voiceId);
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

      if (!audioResponse.ok) {
        const errorText = await audioResponse.text();
        console.error('ElevenLabs API error:', errorText);
        return res.status(500).json({ 
          message: 'Failed to generate audio response',
          text: response.content 
        });
      }

      const audioBuffer = await audioResponse.arrayBuffer();
      console.log('Successfully generated audio response');

      return res.status(200).json({
        text: response.content,
        audio: Buffer.from(audioBuffer).toString('base64'),
      });
    } catch (error) {
      console.error('Detailed error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } catch (error) {
    console.error('Detailed error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
