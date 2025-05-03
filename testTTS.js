const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');

async function testTTS() {
  const client = new textToSpeech.TextToSpeechClient({
    keyFilename: '/home/eddy/workshop/server/keyfile.json', // Replace with your key file path
  });

  const request = {
    input: { text: 'Hello, this is a test!' },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    fs.writeFileSync('output.mp3', response.audioContent, 'binary');
    console.log('Audio generated successfully: output.mp3');
  } catch (error) {
    console.error('Error generating speech:', error);
  }
}

testTTS();