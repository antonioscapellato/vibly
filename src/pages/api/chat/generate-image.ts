import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

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
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'No prompt provided' });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return res.status(500).json({ 
        message: 'OpenAI API key is not configured',
        error: 'Missing API key'
      });
    }

    console.log('Generating image with prompt:', prompt);

    try {
      const response = await openai.images.generate({
        model: process.env.OPENAI_IMAGE_MODEL || '',
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "medium",
      });

      console.log('DALL-E API response:', response);

      if (!response.data || !response.data[0]?.url) {
        console.error('Invalid response from DALL-E:', response);
        throw new Error('No image URL received from DALL-E');
      }

      return res.status(200).json({
        imageUrl: response.data[0].url
      });
    } catch (apiError: any) {
      console.error('DALL-E API error details:', {
        error: apiError,
        message: apiError.message,
        status: apiError.status,
        type: apiError.type
      });
      
      return res.status(500).json({ 
        message: 'Error generating image',
        error: apiError.message || 'Unknown API error',
        details: apiError.type || 'No error type provided'
      });
    }
  } catch (error) {
    console.error('General error in generate-image endpoint:', error);
    return res.status(500).json({ 
      message: 'Error processing request',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 