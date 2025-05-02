import { google } from 'googleapis';

async function testDriveAccess() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });

  try {
    const response = await drive.files.list({
      q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents`,
      fields: 'files(id, name)',
    });
    console.log('✅ Service Account Access Verified. Files in Folder:', response.data.files);
  } catch (error) {
    console.error('❌ Error Verifying Access:', error.message);
  }
}

testDriveAccess();
