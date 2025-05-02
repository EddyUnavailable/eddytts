import { google } from 'googleapis';
import fs from 'fs';

async function uploadFileToDrive() {
  try {
    // Authenticate using the service account key
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Path to keyfile.json
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // File metadata
    const fileMetadata = {
      name: 'test-upload.mp3', // The name of the file in Google Drive
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Folder ID
    };

    // Media content
    const media = {
      mimeType: 'audio/mpeg',
      body: fs.createReadStream('output.mp3'), // Replace with the file to upload
    };

    // Upload the file
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log('✅ File uploaded successfully! File ID:', response.data.id);
  } catch (error) {
    console.error('❌ Error uploading file to Google Drive:', error.message);
  }
}

uploadFileToDrive();
