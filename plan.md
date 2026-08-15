# O'QUV MARKAZ WEB SAYTI
## Antigravity Development Project Plan

---

# 1. LOYIHA MAQSADI

O'quv markazi uchun zamonaviy, minimal, professional va mobil qurilmalarga mos web sayt yaratish.

Saytning asosiy vazifalari:

- O'quv markazini tanishtirish
- O'quv bo'limlari va kurslarni ko'rsatish
- O'qituvchilar haqida ma'lumot berish
- Rahbariyat haqida ma'lumot berish
- O'quv markazi rasmlarini ko'rsatish
- Telegram va Instagram sahifalariga o'tish
- Foydalanuvchilarni ro'yxatdan o'tkazish
- Admin panel orqali sayt ma'lumotlarini boshqarish
- Rasmlarni admin panel orqali almashtirish
- Matnlarni admin panel orqali o'zgartirish
- Keyinchalik hostingga joylashtirish va kengaytirish imkoniyati

---

# 2. ASOSIY TALABLAR

Sayt quyidagi talablarga javob berishi kerak:

- Minimal dizayn
- Professional ko'rinish
- Responsive design
- Mobile-first
- Tez ishlash
- SEO-friendly
- Accessibility talablariga mos
- Xavfsiz
- Admin panelga ega
- Database bilan ishlashi
- Image storage bilan ishlashi
- Keyinchalik o'zgartirish oson bo'lishi
- Kod strukturasi tartibli bo'lishi
- Production uchun tayyor arxitektura

---

# 3. TAVSIYA ETILGAN TEXNOLOGIYALAR

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend

- Next.js Server Actions
- Next.js API Routes kerak bo'lgan joylarda

## Database

- PostgreSQL

## Authentication

- Secure Admin Authentication
- Session-based authentication

## Image Storage

- Supabase Storage
- yoki Cloudinary

## Hosting

- Vercel

## Version Control

- Git
- GitHub

---

# 4. SAYT STRUKTURASI

Public pages:

```text
/
├── Bosh sahifa
├── /about
├── /departments
├── /teachers
├── /management
├── /gallery
├── /contact
├── /privacy
└── /terms