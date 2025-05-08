import textToSpeech from '@google-cloud/text-to-speech';
// import crypto from 'crypto';

/**
 * Creates and returns a Google Text-to-Speech client instance
 * @returns {textToSpeech.TextToSpeechClient} TTS client
 */
export function getTTSClient() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('Missing GOOGLE_APPLICATION_CREDENTIALS');
    throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS environment variable');
  }

  return new textToSpeech.TextToSpeechClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
}

/**
 * Validates the TTS request body
 * @param {Object} requestBody - Request body to validate
 * @throws {Error} If validation fails
 */
export function validateTTSRequest(requestBody) {
  const { text, voice } = requestBody;

  if (!text) {
    throw new Error('Text is required');
  }

  if (!voice) {
    throw new Error('Voice is required');
  }

  if (typeof text !== 'string') {
    throw new Error('Text must be a string');
  }

  if (typeof voice !== 'string') {
    throw new Error('Voice must be a string');
  }

  // Check text length (adjust as needed)
  if (text.length > 5000) {
    throw new Error('Text exceeds maximum length of 5000 characters');
  }
}



export function generateFileName() {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10); // Safe fallback
  return `tts-${timestamp}-${randomString}.mp3`;
}

/**
 * Sanitizes audio configuration options
 * @param {Object} audioConfig - Audio config object from request
 * @returns {Object} Sanitized audio config
 */
export function sanitizeAudioConfig(audioConfig = {}) {
  const validAudioConfigKeys = [
    'audioEncoding',
    'speakingRate',
    'pitch',
    'volumeGainDb',
    'sampleRateHertz'
  ];
  
  return Object.keys(audioConfig)
    .filter((key) => validAudioConfigKeys.includes(key))
    .reduce((sanitized, key) => {
      const value = audioConfig[key];
      
      // Handle numeric values
      if (['speakingRate', 'pitch', 'volumeGainDb'].includes(key)) {
        sanitized[key] = Number.parseFloat(value) || 0;
      } else if (key === 'sampleRateHertz') {
        sanitized[key] = Number.parseInt(value, 10) || 24000;
      } else {
        sanitized[key] = value;
      }
      
      return sanitized;
    }, {});
}