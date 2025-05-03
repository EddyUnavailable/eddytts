import textToSpeech from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body
    const { voice } = await req.json();

    // Validate input
    if (!voice) {
      return NextResponse.json({ error: 'Voice parameter is required.' }, { status: 400 });
    }

    console.log('📥 Preview request received for voice:', voice);

    // Initialize Google Text-to-Speech client
    const ttsClient = new textToSpeech.TextToSpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Ensure this environment variable is correctly set
    });
    console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

    // Generate a TTS preview with a fixed example text
    const ttsRequest = {
      input: { text: 'This is a voice preview.' }, // Sample text for preview
      voice: { name: voice, languageCode: 'en-US' }, // Use the provided voice
      audioConfig: { audioEncoding: 'MP3' }, // Generate MP3 format
    };

    // Call the Google TTS API
    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);

    console.log('✅ Preview generated successfully.');

    // Return audio content as Base64
    return NextResponse.json({
      message: 'Preview generated successfully.',
      audioBase64: ttsResponse.audioContent.toString('base64'),
    });
  } catch (error) {
    console.error('❌ Error generating preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview.', details: error.message },
      { status: 500 }
    );
  }
}