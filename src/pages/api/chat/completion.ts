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

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Invalid messages format' });
    }

    if (!tutorId) {
      return res.status(400).json({ message: 'Tutor ID is required' });
    }

    const tutorConfig = getTutorConfig(tutorId);
    console.log('Tutor config:', tutorConfig);

    if (!tutorConfig) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

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
        model: process.env.OPENAI_MODEL || '',
        messages: formattedMessages,
      });

      const response = completion.choices[0].message;
      console.log('OpenAI response:', response);

      if (!response || !response.content) {
        throw new Error('Invalid response from OpenAI');
      }

      // Get feedback on how to improve the response
      const feedbackResponse = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || '',
        messages: [
          {
            role: "system",
            content: `You are a helpful speech coach. Analyze the following response and provide constructive feedback on how the user could improve their response in this format:
1. Clarity: Comment on pronunciation, pace, and enunciation
2. Vocabulary: Suggest more precise or sophisticated word choices
3. Structure: Note any improvements in sentence structure or flow
Keep each section brief and encouraging. Focus on 1-2 key points per category.`
          },
          {
            role: "user",
            content: response.content
          }
        ],
        max_tokens: 200
      });

      const improvementTip = feedbackResponse.choices[0].message.content;

      // Get audio from ElevenLabs
      console.log('Calling ElevenLabs with voiceId:', tutorConfig.voiceId);
      console.log('ElevenLabs API Key present:', !!process.env.ELEVENLABS_API_KEY);
      
      if (!process.env.ELEVENLABS_API_KEY) {
        console.error('ElevenLabs API key is missing');
        return res.status(500).json({ 
          message: 'ElevenLabs API key is not configured',
          text: response.content,
          improvementTip: improvementTip
        });
      }

      if (!tutorConfig.voiceId) {
        console.error('Voice ID is missing from tutor config');
        return res.status(500).json({ 
          message: 'Voice ID is not configured for this tutor',
          text: response.content,
          improvementTip: improvementTip
        });
      }

      const audioResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${tutorConfig.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
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
        console.error('ElevenLabs API error:', {
          status: audioResponse.status,
          statusText: audioResponse.statusText,
          error: errorText,
          voiceId: tutorConfig.voiceId
        });
        return res.status(500).json({ 
          message: 'Failed to generate audio response',
          error: `ElevenLabs API error: ${audioResponse.status} ${audioResponse.statusText}`,
          text: response.content,
          improvementTip: improvementTip
        });
      }

      const audioBuffer = await audioResponse.arrayBuffer();
      console.log('Successfully generated audio response');

      return res.status(200).json({
        text: response.content,
        audio: Buffer.from(audioBuffer).toString('base64'),
        improvementTip: improvementTip
      });
    } catch (error) {
      console.error('OpenAI or ElevenLabs API error:', error);
      return res.status(500).json({ 
        message: 'Error processing request',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Detailed error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
