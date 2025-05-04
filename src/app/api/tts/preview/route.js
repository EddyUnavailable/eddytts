import textToSpeech from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body
    const { voice, languageCode, text = 'This is a voice preview.', audioConfig = {} } = await req.json();

    // Validate input
    if (!voice || !languageCode) {
      return NextResponse.json({ error: 'Voice and languageCode are required.' }, { status: 400 });
    }

    if (typeof voice !== 'string' || typeof languageCode !== 'string') {
      return NextResponse.json({ error: 'Invalid input types.' }, { status: 400 });
    }

    console.log('📥 Received voice:', voice, 'languageCode:', languageCode);

    // Initialize Google Text-to-Speech client
    const ttsClient = new textToSpeech.TextToSpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    // Configure the TTS request
    const ttsRequest = {
      input: { text },
      voice: { name: voice, languageCode },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0,
        volumeGainDb: 0,
        sampleRateHertz: 24000,
        ...audioConfig,
      },
    };

    console.log('🔧 TTS Request:', JSON.stringify(ttsRequest, null, 2));

    // Call the Google TTS API
    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);

    console.log('✅ TTS Response received.');

    // Return audio content as Base64
    return NextResponse.json({
      message: 'Preview generated successfully.',
      audioBase64: ttsResponse.audioContent.toString('base64'),
    });
  } catch (error) {
    console.error('❌ Error generating preview:', error.message, error.details);
    return NextResponse.json(
      { error: 'Failed to generate preview.', details: error.message },
      { status: 500 },
    );
  }
}