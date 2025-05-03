import textToSpeech from '@google-cloud/text-to-speech';
import os from 'os';
import path from 'path';

// Helper function to initialize the Google TTS client
export const getTTSClient = () => {
  const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!keyFilename) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
  }
  return new textToSpeech.TextToSpeechClient({ keyFilename });
};

// Helper function to validate TTS request parameters
export const validateTTSRequest = (body) => {
  const requiredFields = ['text', 'voice', 'languageCode'];
  requiredFields.forEach((field) => {
    if (!body[field]) {
      throw new Error(`Missing required parameter: ${field}`);
    }
  });

  if (!['MP3', 'LINEAR16', 'OGG_OPUS'].includes(body.format || 'MP3')) {
    throw new Error('Invalid audio format. Supported formats are MP3, LINEAR16, and OGG_OPUS.');
  }
};

// Helper function to generate a unique file name
export const generateFileName = (extension = 'mp3') => `output-${Date.now()}.${extension}`;