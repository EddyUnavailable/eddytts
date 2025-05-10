import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import os from 'os';
import { NextResponse } from 'next/server';
import { getTTSClient, validateTTSRequest, generateFileName } from './utils';

export async function POST(req) {
  const TEMP_DIR = os.tmpdir();
  const outputPath = path.join(TEMP_DIR, generateFileName());

  try {
    const body = await req.json();
    validateTTSRequest(body);

    const {
      text,
      voice,
      languageCode,
      format = 'MP3',
      sampleRateHertz = 24000,
      pitch = 0,
      speakingRate = 1.0,
      volumeGain = 0.0,
      playWithoutSaving = false,
      ssml = false,
    } = body;

    if (ssml && (!text.startsWith('<speak>') || !text.endsWith('</speak>'))) {
      throw new Error('Invalid SSML input. Must start with <speak> and end with </speak>.');
    }

    const ttsClient = getTTSClient();

    const ttsRequest = {
      input: ssml ? { ssml: text } : { text },
      voice: { name: voice, languageCode: languageCode || extractedLanguageCode },
      audioConfig: {
        audioEncoding: format,
        speakingRate,
        pitch,
        volumeGainDb: volumeGain,
        sampleRateHertz,
      },
    };

    const extractedLanguageCode = voice.split('-').slice(0, 2).join('-');
    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
    await fsPromises.writeFile(outputPath, ttsResponse.audioContent, 'binary');
    const audioBase64 = ttsResponse.audioContent.toString('base64');
    const fileName = path.basename(outputPath);

    if (playWithoutSaving) {
      return NextResponse.json({
        message: 'Audio generated successfully (without saving).',
        audioBase64,
        fileName,
      });
    }

    // The part where we save the file locally instead of uploading it to Google Drive
    return NextResponse.json({
      message: 'Audio generated and saved successfully.',
      audioBase64,
      fileName,
      filePath: outputPath, // Optionally, send the file path if needed
    });

  } catch (error) {
    console.error('❌ Error in /api/tts:', error);
    try {
      if (fs.existsSync(outputPath)) await fsPromises.unlink(outputPath);
    } catch (cleanupError) {
      console.warn('Cleanup failed:', cleanupError.message);
    }
    return NextResponse.json(
      { error: error.message, context: 'TTS generation failed.' },
      { status: 500 }
    );
  }
}
