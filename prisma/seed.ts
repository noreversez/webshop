import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default admin account
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Super Admin',
    },
  })

  console.log('✅ Admin created:', admin.username)

  // Create default categories
  const categories = [
    { name: 'เสื้อยืด', slug: 'tshirt' },
    { name: 'เสื้อเชิ้ต', slug: 'shirt' },
    { name: 'กางเกง', slug: 'pants' },
    { name: 'กระโปรง', slug: 'skirt' },
    { name: 'เดรส', slug: 'dress' },
    { name: 'เสื้อแจ็คเก็ต', slug: 'jacket' },
    { name: 'รองเท้า', slug: 'shoes' },
    { name: 'กระเป๋า', slug: 'bag' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  console.log('✅ Categories created:', categories.length)

  // Create sample products
  const shirtCategory = await prisma.category.findUnique({ where: { slug: 'tshirt' } })

  const sampleProduct = await prisma.product.create({
    data: {
      name: 'เสื้อยืด Basic Cotton',
      description: 'เสื้อยืดผ้า Cotton 100% นุ่มสบาย ใส่ได้ทุกโอกาส',
      categoryId: shirtCategory?.id,
      variants: {
        create: [
          { color: 'ขาว', size: 'S', price: 290, stock: 15 },
          { color: 'ขาว', size: 'M', price: 290, stock: 20 },
          { color: 'ขาว', size: 'L', price: 290, stock: 10 },
          { color: 'ขาว', size: 'XL', price: 290, stock: 8 },
          { color: 'ดำ', size: 'S', price: 290, stock: 12 },
          { color: 'ดำ', size: 'M', price: 290, stock: 18 },
          { color: 'ดำ', size: 'L', price: 290, stock: 15 },
          { color: 'ดำ', size: 'XL', price: 290, stock: 6 },
          { color: 'เทา', size: 'S', price: 290, stock: 10 },
          { color: 'เทา', size: 'M', price: 290, stock: 14 },
          { color: 'เทา', size: 'L', price: 290, stock: 9 },
        ],
      },
    },
  })

  console.log('✅ Sample product created:', sampleProduct.name)
  console.log('\n🎉 Seeding complete!')
  console.log('\n📋 Admin credentials:')
  console.log('   Username: admin')
  console.log('   Password: admin123')
  console.log('\n⚠️  Please change the admin password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
