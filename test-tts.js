import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import { promisify } from 'util';

async function testTTS() {
  // Instantiates a client
  const client = new textToSpeech.TextToSpeechClient();

  // The text to synthesize
  const request = {
    input: { text: 'Hello, world!' },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    console.log('🔍 Testing Text-to-Speech API...');
    const [response] = await client.synthesizeSpeech(request);

    // Save the response locally
    const writeFile = promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('✅ Audio content written to file: output.mp3');
  } catch (error) {
    console.error('❌ Error during Text-to-Speech API call:', error);
  }
}

testTTS();