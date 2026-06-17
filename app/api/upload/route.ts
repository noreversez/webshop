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
      ? process.env.GOOGLE_DRIVE_SLIP_FOLDER_ID
      : process.env.GOOGLE_DRIVE_FOLDER_ID

    // If Google Drive is not configured, save locally to public/uploads/slips or products
    if (!folderId || folderId === 'placeholder') {
      const fs = await import('fs')
      const path = await import('path')
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', type === 'slip' ? 'slips' : 'products')
      
      // Ensure dir exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      const filePath = path.join(uploadDir, fileName)
      fs.writeFileSync(filePath, buffer)
      
      const publicUrl = `/uploads/${type === 'slip' ? 'slips' : 'products'}/${fileName}`
      return NextResponse.json({ fileId: fileName, url: publicUrl })
    }

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
