# 👗 Fashion Store — LINE LIFF E-Commerce

ระบบร้านขายเสื้อผ้าออนไลน์พรีเมียม พัฒนาด้วย Next.js รองรับการล็อกอินผ่าน LINE LIFF พร้อมระบบ CRM สะสมแต้ม และหน้าแอดมินจัดการสินค้า/ออเดอร์/สลิปโอนเงิน

---

## ✨ ฟีเจอร์หลัก

### 🛍️ ฝั่งลูกค้า (LINE LIFF Web App)
- **ล็อกอินด้วย LINE** — ไม่ต้องจำรหัสผ่าน
- **เลือกสินค้าตามสี & ไซส์** — สต็อกอัปเดต real-time
- **ตะกร้าสินค้า** — บันทึกในเครื่อง
- **Checkout 2 ขั้นตอน** — กรอกที่อยู่ + แนบสลิปโอนเงิน
- **โปรไฟล์ & ประวัติซื้อ** — ดูสถานะออเดอร์ทุกรายการ
- **ระบบสะสมแต้ม** — ได้แต้มอัตโนมัติเมื่อออเดอร์ได้รับการยืนยัน

### 🛡️ ฝั่งแอดมิน (Backoffice)
- **Dashboard** — ยอดขาย, จำนวนออเดอร์, ลูกค้า, รายได้รวม
- **จัดการสินค้า** — เพิ่ม/แก้ไขสินค้า พร้อมตัวเลือก สี/ไซส์/ราคา/สต็อก
- **อัปโหลดรูปภาพ** — เก็บบน Google Drive อัตโนมัติ
- **ตรวจสอบสลิป** — ดูรูปสลิป กด "อนุมัติ" ระบบเพิ่มแต้มให้ลูกค้าอัตโนมัติ
- **ติดตามการจัดส่ง** — อัปเดตเลขพัสดุ + สถานะ
- **จัดการลูกค้า** — ดูยอดซื้อรวม, แต้มสะสม

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Styling** | Tailwind CSS + Custom Luxury Dark Theme |
| **Database** | PostgreSQL |
| **ORM** | Prisma v5 |
| **Auth** | NextAuth.js v5 (LINE OAuth + Credentials) |
| **Storage** | Google Drive API (รูปสินค้า + สลิปโอนเงิน) |
| **LINE** | LINE Login + LIFF SDK |

---

## 🗃️ โครงสร้างฐานข้อมูล

```
User           → ข้อมูลลูกค้า LINE (lineId, name, image, points)
Admin          → แอดมิน (username, password hash)
Category       → หมวดหมู่สินค้า
Product        → สินค้าหลัก
ProductImage   → รูปภาพ (เก็บ fileId บน Google Drive)
ProductVariant → ตัวเลือก (สี, ไซส์, ราคา, สต็อก)
Order          → ออเดอร์ (status, slipUrl, trackingNum)
OrderItem      → รายการสินค้าในออเดอร์
PointTransaction → ประวัติการได้/ใช้แต้ม
```

---

## 🚀 วิธีติดตั้งและรัน

### 1. Clone & ติดตั้ง dependencies
```bash
git clone https://github.com/YOUR_USERNAME/fashion-store.git
cd fashion-store
npm install
```

### 2. ตั้งค่า Environment Variables
```bash
cp .env.example .env.local
# แก้ไขค่าต่างๆ ใน .env.local
```

### 3. ตั้งค่า Database
```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 4. รัน Dev Server
```bash
npm run dev
# เปิด http://localhost:3000
```

---

## ⚙️ Environment Variables

ดูตัวอย่างทั้งหมดได้ใน [`.env.example`](.env.example)

| Variable | คำอธิบาย |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret key สำหรับ NextAuth |
| `LINE_CLIENT_ID` | LINE Channel ID จาก LINE Developers |
| `LINE_CLIENT_SECRET` | LINE Channel Secret |
| `NEXT_PUBLIC_LINE_LIFF_ID` | LIFF App ID |
| `GOOGLE_CLIENT_EMAIL` | Service Account email |
| `GOOGLE_PRIVATE_KEY` | Service Account private key |
| `GOOGLE_DRIVE_FOLDER_ID` | Drive Folder สำหรับรูปสินค้า |
| `GOOGLE_DRIVE_SLIP_FOLDER_ID` | Drive Folder สำหรับสลิป |

---

## 📖 การตั้งค่า LINE Developer

1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. สร้าง Provider และ Channel (LINE Login)
3. เพิ่ม Callback URL: `http://localhost:3000/api/auth/callback/line`
4. สร้าง LIFF App → ตั้ง Endpoint URL: `http://localhost:3000`
5. คัดลอก Channel ID, Channel Secret และ LIFF ID ไปใส่ใน `.env.local`

---

## 🔑 Admin Login เริ่มต้น

หลังรัน `npm run db:seed`:
- **Username:** `admin`
- **Password:** `admin123`
- **URL:** `/admin/login`

> ⚠️ กรุณาเปลี่ยนรหัสผ่านหลังเข้าใช้งานครั้งแรก

---

## 📜 License

MIT License
