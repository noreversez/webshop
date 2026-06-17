const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database re-seed...')

  // 1. Delete all existing order items, products, categories, images, variants
  console.log('Cleaning up old data...')
  await prisma.orderItem.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // 2. Create new specific categories
  console.log('Creating new categories...')
  const catPolo = await prisma.category.create({
    data: { name: 'เสื้อโปโล (Polo)', slug: 'polo' }
  })
  const catTshirt = await prisma.category.create({
    data: { name: 'เสื้อคอกลม (T-Shirt)', slug: 'tshirt' }
  })

  // 3. Read uploaded images
  const uploadDir = path.join(__dirname, '../public/uploads/shirts')
  const files = fs.readdirSync(uploadDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  
  // Sort files so they are ordered nicely
  files.sort()

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
  
  console.log(`Found ${files.length} images. Creating products...`)

  let i = 1;
  for (const file of files) {
    // Alternate categories or just guess based on index
    const category = i % 2 === 0 ? catPolo : catTshirt
    
    // Create product
    const product = await prisma.product.create({
      data: {
        name: `เสื้อ RPCA แบบ ${i}`,
        description: `เสื้อ RPCA พรีเมียม แบบที่ ${i} เนื้อผ้านุ่มระบายอากาศได้ดีเยี่ยม สวมใส่สบาย`,
        categoryId: category.id,
        // Create variants for this product
        variants: {
          create: sizes.map(size => ({
            color: 'Original',
            size: size,
            price: 315, // From user screenshot
            stock: 100, // Default stock
          }))
        },
        // Attach image
        images: {
          create: {
            url: `/uploads/shirts/${file}`,
            isPrimary: true
          }
        }
      }
    })
    
    console.log(`✅ Created Product: ${product.name}`)
    i++
  }

  console.log('🎉 Database re-seeding complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
