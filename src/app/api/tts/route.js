import { google } from 'googleapis';
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { NextResponse } from 'next/server';

// Define the folder where temporary files will be stored
const TEMP_DIR = os.tmpdir();

// Ensure the temporary directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

// Helper function to generate a unique file name
const generateFileName = (extension = 'mp3') => `output-${Date.now()}.${extension}`;

// Endpoint to handle TTS requests
export async function POST(req) {
  const outputPath = path.join(TEMP_DIR, generateFileName());

  try {
    console.log('📥 POST /api/tts received');

    // Parse the incoming request
    const body = await req.json();
    const {
      text,
      format = 'MP3',
      sampleRateHertz = 24000,
      pitch = 0,
      speakingRate = 1.0,
      volumeGain = 0.0,
      ssml = false,
      playWithoutSaving = false,
    } = body;

    // Validate input
    if (!text) {
      return NextResponse.json({ error: 'Text input is required.' }, { status: 400 });
    }

    if (!['MP3', 'LINEAR16', 'OGG_OPUS'].includes(format)) {
      return NextResponse.json({ error: 'Invalid audio format.' }, { status: 400 });
    }

    console.log('🎤 Converting text:', text);

    // Google Text-to-Speech API setup
    const ttsClient = new textToSpeech.TextToSpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    // Prepare the TTS request
    const ttsRequest = {
      input: ssml ? { ssml: text } : { text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: {
        audioEncoding: format,
        sampleRateHertz,
        pitch,
        speakingRate,
        volumeGainDb: volumeGain,
      },
    };

    // Generate the speech
    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);

    if (playWithoutSaving) {
      // Return the audio as Base64 for immediate playback
      return NextResponse.json({
        message: 'Audio generated successfully.',
        audioBase64: ttsResponse.audioContent.toString('base64'),
      });
    }

    // Save the audio file locally
    fs.writeFileSync(outputPath, ttsResponse.audioContent, 'binary');
    console.log('✅ Audio file written to:', outputPath);

    // Return the file path for download
    return NextResponse.json({
      message: 'Audio generated successfully.',
      filePath: outputPath,
    });
  } catch (error) {
    console.error('❌ Error in /api/tts:', error);

    // Clean up the temporary file if it exists
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    return NextResponse.json(
      { error: 'Failed to process TTS.', details: error.message },
      { status: 500 }
    );
  }
}

// Endpoint to list available voices
export async function GET() {
  try {
    console.log('📥 GET /api/tts/voices received');

    const ttsClient = new textToSpeech.TextToSpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    // Fetch available voices
    const [response] = await ttsClient.listVoices();

    // Filter voices for English-speaking regions
    const englishVoices = response.voices.filter((voice) =>
      voice.languageCodes.some((code) => ['en-US', 'en-GB', 'en-AU'].includes(code))
    );

    return NextResponse.json({ voices: englishVoices });
  } catch (error) {
    console.error('❌ Error fetching voices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available voices.', details: error.message },
      { status: 500 }
    );
  }
}

// Endpoint to provide voice previews
export async function PREVIEW() {
  try {
    console.log('📥 PREVIEW /api/tts/preview received');

    const ttsClient = new textToSpeech.TextToSpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    const [response] = await ttsClient.listVoices();
    const englishVoices = response.voices.filter((voice) =>
      voice.languageCodes.some((code) => ['en-US', 'en-GB', 'en-AU'].includes(code))
    );

    // Generate previews for each voice
    const previews = await Promise.all(
      englishVoices.map(async (voice) => {
        const ttsRequest = {
          input: { text: 'This is a voice preview.' },
          voice: { languageCode: voice.languageCodes[0], name: voice.name },
          audioConfig: { audioEncoding: 'MP3' },
        };

        const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);

        // Return Base64-encoded preview
        return {
          name: voice.name,
          language: voice.languageCodes[0],
          ssmlGender: voice.ssmlGender,
          previewAudio: ttsResponse.audioContent.toString('base64'),
        };
      })
    );

    return NextResponse.json({ previews });
  } catch (error) {
    console.error('❌ Error generating previews:', error);
    return NextResponse.json(
      { error: 'Failed to generate voice previews.', details: error.message },
      { status: 500 }
    );
  }
}