import textToSpeech from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body
    const { voice, languageCode } = await req.json();

    // Validate input
    if (!voice || !languageCode) {
      return NextResponse.json({ error: 'Voice and languageCode are required.' }, { status: 400 });
    }

    console.log('📥 Received voice:', voice, 'languageCode:', languageCode);

    // Initialize Google Text-to-Speech client
    const ttsClient = new textToSpeech.TextToSpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    // Configure the TTS request
    const ttsRequest = {
      input: { text: 'This is a voice preview.' }, // Sample text for preview
      voice: { name: voice, languageCode },       // Use the provided voice and language code
      audioConfig: {
        audioEncoding: 'MP3',       // MP3 format
        speakingRate: 1.0,          // Default speaking rate
        pitch: 0,                   // Default pitch
        volumeGainDb: 0,            // Default volume gain
        sampleRateHertz: 24000,     // Default sample rate
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