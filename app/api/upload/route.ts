import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadFileToDrive } from '@/lib/google-drive'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'product' | 'slip'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const timestamp = Date.now()
    const fileName = `${type}_${timestamp}_${file.name}`
    const folderId = type === 'slip'
      ? process.env.GOOGLE_DRIVE_SLIP_FOLDER_ID!
      : process.env.GOOGLE_DRIVE_FOLDER_ID!

    const { fileId, publicUrl } = await uploadFileToDrive(
      buffer,
      fileName,
      file.type,
      folderId
    )

    return NextResponse.json({ fileId, url: publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
