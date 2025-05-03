import textToSpeech from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('📥 GET /api/tts/voices received');

    const ttsClient = new textToSpeech.TextToSpeechClient();
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