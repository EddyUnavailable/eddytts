import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import os from 'os';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getTTSClient, validateTTSRequest, generateFileName } from './utils';

export async function POST(req) {
  const TEMP_DIR = os.tmpdir(); // Temporary directory for storing the audio file
  const outputPath = path.join(TEMP_DIR, generateFileName());

  try {
    // Parse and validate the request body
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
      ssml = false, // Flag to indicate SSML input
    } = body;

    // Validate SSML input if ssml flag is true
    if (ssml) {
      if (!text.startsWith('<speak>') || !text.endsWith('</speak>')) {
        throw new Error('Invalid SSML input. SSML text must start with <speak> and end with </speak>.');
      }
    }

    const ttsClient = getTTSClient();

    // Configure the TTS request
    const ttsRequest = {
      input: ssml ? { ssml: text } : { text }, // Use SSML or plain text
      voice: { name: voice, languageCode },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0,
        volumeGainDb: 0,
        sampleRateHertz: 24000,
      },
    };

    console.log('🔧 TTS Request:', JSON.stringify(ttsRequest, null, 2));

    // Call the Google Text-to-Speech API
    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);

    // Save the audio file locally
    await fsPromises.writeFile(outputPath, ttsResponse.audioContent, 'binary');
    console.log('✅ Audio file written to:', outputPath);

    if (playWithoutSaving) {
      // Return the audio as Base64 without saving to Google Drive
      const audioBase64 = ttsResponse.audioContent.toString('base64');
      return NextResponse.json({
        message: 'Audio generated successfully (without saving).',
        audioBase64,
      });
    }

    // Upload the audio file to Google Drive
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: path.basename(outputPath), // Name of the file in Google Drive
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Google Drive folder ID
    };

    const media = {
      mimeType: 'audio/mpeg',
      body: fs.createReadStream(outputPath), // Use the correct fs module
    };

    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id, webViewLink, webContentLink',
    });

    console.log('🌐 File uploaded to Google Drive:', driveResponse.data);

    // Return the public URL to the client
    return NextResponse.json({
      message: 'Audio generated successfully.',
      fileId: driveResponse.data.id,
      webViewLink: driveResponse.data.webViewLink,
      webContentLink: driveResponse.data.webContentLink,
    });
  } catch (error) {
    console.error('❌ Error in /api/tts:', error);

    // Clean up the temporary file if it exists
    try {
      if (fs.existsSync(outputPath)) {
        await fsPromises.unlink(outputPath);
      }
    } catch (cleanupError) {
      console.warn('Failed to clean up temporary file:', cleanupError.message);
    }

    return NextResponse.json(
      {
        error: error.message,
        context: 'Error occurred during TTS processing. Please check your input or try again later.',
      },
      { status: 500 }
    );
  }
}