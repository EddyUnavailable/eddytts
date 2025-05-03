import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getTTSClient, validateTTSRequest, generateFileName } from './utils';

export async function POST(req) {
  const TEMP_DIR = os.tmpdir();
  const outputPath = path.join(TEMP_DIR, generateFileName());

  try {
    console.log('📥 POST /api/tts received');

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
    } = body;

    const ttsClient = getTTSClient();
    const ttsRequest = {
      input: { text },
      voice: { name: voice, languageCode },
      audioConfig: {
        audioEncoding: format,
        sampleRateHertz,
        pitch,
        speakingRate,
        volumeGainDb: volumeGain,
      },
    };

    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);

    // Save the audio file locally
    await fs.writeFile(outputPath, ttsResponse.audioContent, 'binary');
    console.log('✅ Audio file written to:', outputPath);

    // Upload file to Google Drive
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: path.basename(outputPath),
      parents: ['1bmwWFNEhI-ODs3r9Qh_MXEkThggWQss9'], // Google Drive folder ID
    };
    const media = {
      mimeType: 'audio/mpeg',
      body: await fs.readFile(outputPath), // Read the file content
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id, webViewLink, webContentLink',
    });

    console.log('🌐 File uploaded to Google Drive:', response.data);

    // Return the public URL to the client
    return NextResponse.json({
      message: 'Audio generated successfully.',
      fileId: response.data.id,
      webViewLink: response.data.webViewLink,
      webContentLink: response.data.webContentLink,
    });
  } catch (error) {
    console.error('❌ Error in /api/tts:', error);

    // Clean up the temporary file if it exists
    try {
      await fs.unlink(outputPath);
    } catch {
      // Ignore errors during cleanup
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}