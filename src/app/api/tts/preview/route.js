import textToSpeech from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';

export async function POST(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
  }

  try {
    // Parse the request body
    const { voice, languageCode, text = 'This is a voice preview.', audioConfig = {} } = await req.json();
    console.log(`Requested language code: ${languageCode}, Voice: ${voice}`);

    // Validate input
    if (!voice || !languageCode) {
      return NextResponse.json({ error: 'Voice and languageCode are required.' }, { status: 400 });
    }

    if (typeof voice !== 'string' || typeof languageCode !== 'string') {
      return NextResponse.json({ error: 'Invalid input types.' }, { status: 400 });
    }

    // Check for the text length
    if (text.length > 500) { // Adjust the limit based on your needs
      return NextResponse.json({ error: 'Text exceeds maximum length of 500 characters' }, { status: 400 });
    }

    // Validate the content type
    if (req.headers.get('Content-Type') !== 'application/json') {
      return NextResponse.json({ error: 'Invalid content type, expected application/json.' }, { status: 400 });
    }

    // Check for API key validation
    // const apiKey = req.headers.get('x-api-key');
    // if (!apiKey || apiKey !== process.env.TTS_API_KEY) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    console.log('📥 Received voice:', voice, 'languageCode:', languageCode);

    // Initialize Google Text-to-Speech client
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.error('Missing GOOGLE_APPLICATION_CREDENTIALS environment variable');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const ttsClient = new textToSpeech.TextToSpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    // Validate and sanitize audioConfig
    const validAudioConfigKeys = ['audioEncoding', 'speakingRate', 'pitch', 'volumeGainDb', 'sampleRateHertz'];
    const sanitizedAudioConfig = Object.keys(audioConfig)
      .filter((key) => validAudioConfigKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = audioConfig[key];
        return obj;
      }, {});

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
        ...sanitizedAudioConfig,
      },
    };

    console.log('🔧 TTS Request:', JSON.stringify(ttsRequest, null, 2));

    // Call the Google TTS API
    let ttsResponse;
    try {
      ttsResponse = await ttsClient.synthesizeSpeech(ttsRequest);
    } catch (error) {
      console.error('Google TTS API error:', error.message);
      return NextResponse.json({ error: 'Failed to communicate with TTS service', details: error.message }, { status: 500 });
    }

    // Ensure audioContent exists and is a valid buffer
    if (!ttsResponse || !ttsResponse[0] || !ttsResponse[0].audioContent) {
      console.error('Invalid response from TTS API');
      return NextResponse.json({ error: 'No audio content returned by TTS API' }, { status: 500 });
    }

    console.log('✅ TTS Response received.');

    // Return audio content as Base64
    return NextResponse.json({
      message: 'Preview generated successfully.',
      audioBase64: ttsResponse[0].audioContent.toString('base64'),
    });

  } catch (error) {
    console.error('❌ Error generating preview:', error.message, error.details || 'No additional details');
    return NextResponse.json(
      { error: 'Failed to generate preview.', details: error.message },
      { status: 500 },
    );
  }
}
