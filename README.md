# KHAONOI ROI2 63

เขาน้อยร้อย 2 รุ่น 63 นสต. ข้อมูลกองร้อยที่ 2 อาคาร 4 รุ่น 63

เว็บแอปสำหรับจัดการข้อมูลกองร้อยแบบ public + staff พร้อมธีมกรมท่า/เขียว-ทอง-ครีม ตามแนวทางที่ระบุใน prompt

## โครงสร้างพื้นฐาน

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Mali font from `next/font/google`
- Supabase-ready data layer

## การติดตั้ง

```bash
npm install
cp .env.example .env.local
npm run dev
```

## ตัวแปรสภาพแวดล้อม

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

ห้ามนำ `SUPABASE_SERVICE_ROLE_KEY` ไปใช้ใน Client Component หรือ commit ไฟล์ `.env.local`

## สถานะการ deploy

ตอนนี้มีโครงสร้าง route, Supabase client/auth, RLS, staff console, Excel importer และข้อมูลรายชื่อจริงแล้ว แต่ยังต้องติดตั้ง dependency, ตั้งค่า Supabase และทดสอบ production build ก่อน deploy จริง

ไฟล์ต้นฉบับอยู่ในโฟลเดอร์ `xlsx/` และสร้าง `supabase/imported-students.sql` จากไฟล์ BMI แล้ว โดยมี 207 รายชื่อและข้อมูล BMI 2 รอบ ส่วนไฟล์ค่ากรรมการไม่มีเครื่องหมายชำระในเซลล์ จึงยังไม่ใส่สถานะ `paid=true` โดยอัตโนมัติ

## Import Excel

1. รัน `npm install`
2. รัน `npm run import:excel -- ./ชื่อไฟล์.xlsx`
3. ตรวจไฟล์ `supabase/imported-students.sql` แล้วรันหลัง `schema.sql` ใน Supabase SQL Editor
4. รัน `supabase/seed.sql` เพื่อเพิ่มเดือนค่ากรรมการ

คอลัมน์ที่รองรับคือ `ลำดับ`, `รหัส นสต.`, `ยศ ชื่อ-สกุล`, `หมวด`, `หมู่`, `ส่วนสูง`, `น้ำหนัก`, `BMI` และ `การประเมิน` โดย script จะใช้ `student_code` เป็น key และสร้าง BMI จากส่วนสูง/น้ำหนักในแต่ละแถว

## สร้าง staff คนแรก

หลัง import รายชื่อและเปิดใช้ trigger ใน `schema.sql` ให้ตั้งค่า `STAFF_PASSWORD` ชั่วคราวในเครื่อง แล้วรัน `npm run bootstrap:staff` เพื่อสร้างบัญชีรหัส `๒-๑๒๕` และกำหนด role เป็น `staff` เช่น PowerShell: `$env:STAFF_PASSWORD='ตั้งรหัสผ่านใหม่ที่ไม่ใช้ซ้ำ'; $env:STAFF_STUDENT_CODE='๒-๑๒๕'; npm run bootstrap:staff` ห้ามใส่รหัสผ่านจริงใน Git หรือ `.env` ที่ deploy

## Deploy Vercel

ตั้งค่า `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` และ `NEXT_PUBLIC_APP_URL` ใน Vercel Project Settings แล้ว deploy ด้วย `vercel --prod` หรือเชื่อม Git repository ให้ Vercel build อัตโนมัติ

## SQL Schema

ดูไฟล์ `supabase/schema.sql` สำหรับข้อมูล schema และ RLS policy ตามที่กำหนดไว้ใน prompt

## โฟลเดอร์หลัก

- `app/` — pages and layouts
- `components/` — reusable UI components
- `lib/` — helper logic, Supabase client, utils
- `supabase/` — SQL migrations and seed scripts
