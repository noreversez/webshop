import { google } from 'googleapis'
import { Readable } from 'stream'

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
})

const drive = google.drive({ version: 'v3', auth })

export async function uploadFileToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  folderId: string
): Promise<{ fileId: string; publicUrl: string }> {
  const fileStream = Readable.from(fileBuffer)

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: fileStream,
    },
    fields: 'id, webViewLink, webContentLink',
  })

  const fileId = response.data.id!

  // Make file publicly readable
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  })

  const publicUrl = `https://drive.google.com/uc?export=view&id=${fileId}`

  return { fileId, publicUrl }
}

export async function deleteFileFromDrive(fileId: string): Promise<void> {
  try {
    await drive.files.delete({ fileId })
  } catch (error) {
    console.error('Error deleting file from Drive:', error)
  }
}

export async function getFileFromDrive(fileId: string) {
  const response = await drive.files.get({
    fileId,
    fields: 'id, name, webViewLink, webContentLink, mimeType',
  })
  return response.data
}
