# 🗓️ MT Content Planner - Content & Marketing Management Platform

![MT Content Planner Banner](public/logo.png)

แพลตฟอร์มรวบรวมเครื่องมืออเนกประสงค์แบบ Self-hosted ที่สร้างขึ้นด้วย **Next.js 16 (App Router)** และ **Tailwind CSS** ออกแบบมาสำหรับนักการตลาดดิจิทัล นักพัฒนา และผู้ที่ใส่ใจเรื่องความเป็นส่วนตัว โดยแพลตฟอร์มนี้ให้บริการเครื่องมือต่างๆ มากมายโดยไม่มีโฆษณา ไม่มีการติดตามผู้ใช้ และลดการประมวลผลบนเซิร์ฟเวอร์ที่ไม่จำเป็น

> **สถานะ:** กำลังพัฒนา (Active Development)  
> **ภาษาที่รองรับ:** ภาษาไทย 🇹🇭 | ภาษาอังกฤษ 🇬🇧 (รองรับระบบหลายภาษาเต็มรูปแบบ)

## ✨ ฟีเจอร์หลัก

### 📋 Content Planner (ระบบวางแผนคอนเทนต์)
*   **Planner Board:** วางแผนงานโพสต์ด้วย Drag & Drop พร้อมระบบสถานะ (Draft / Scheduled / Done)
*   **Calendar View:** ดูแผนงานในมุมมองปฏิทินรายเดือน
*   **Content Scoring:** ให้คะแนนคอนเทนต์อัตโนมัติตาม Hashtag, Caption, รูปภาพ และเวลาโพสต์
*   **Supabase Backend:** เก็บข้อมูลบน Supabase พร้อมระบบ Login

### 🔗 เครื่องมือจัดการลิงก์ (Link Tools)
*   **แปลงลิงก์ข้ามบล็อก (Link Bypass):** แปลงลิงก์ให้สามารถแชร์บน Facebook, LINE, Discord ได้โดยไม่ถูกบล็อก ใช้ระบบ Client-side Redirect (meta-refresh) ที่ข้ามการตรวจจับ
*   **ย่อลิงก์อัตโนมัติ (URL Shortener):** สร้างลิงก์สั้น `/s/xxxxxx` พร้อมระบบข้ามบล็อกในตัว เก็บข้อมูลใน SQLite ไม่ต้องพึ่งบริการภายนอก
*   **แปลง + ย่อในคลิกเดียว:** กดปุ่มเดียวแปลงข้ามบล็อกและย่อลิงก์ให้อัตโนมัติ

### 🔐 เครื่องมือด้านความปลอดภัย & ยืนยันตัวตน (Security & Identity)
*   **2FA Authenticator:** สร้างรหัสผ่านแบบใช้ครั้งเดียว (TOTP) ได้อย่างปลอดภัยผ่านเบราว์เซอร์ (ทำงานแบบออฟไลน์ได้ 100%)
*   **Check UID (ตรวจสอบสถานะบัญชี):** ตรวจสอบว่า Facebook UID ยังใช้งานได้ (Live) หรือถูกระงับ (Die)
*   **Get UID (ดึงไอดี):** ดึงรหัส UID ตัวเลขจากลิงก์โปรไฟล์ เพจ หรือ Username ของ Facebook
*   **UID to Year:** ประมาณการปีที่สร้างบัญชี Facebook จากช่วงรหัส UID ตัวเลข

### 📝 เครื่องมือจัดการข้อความ & ข้อมูล (Text & Data)
*   **ตัวจัดการข้อความ (Text Editor):** เรียงลำดับ (A-Z/Z-A), ตัดช่องว่าง (Trim), ลบข้อมูลซ้ำ และลบบรรทัดว่าง
*   **เครื่องมือแยกและรวมข้อความ:** แบ่งข้อความยาวๆ เป็นส่วนย่อย หรือรวมรายการข้อความหลายบรรทัดเข้าด้วยกัน
*   **จัดรูปแบบและตัวพิมพ์:** แปลงเป็น UPPERCASE, lowercase, Title Case หรือใส่เลขบรรทัด
*   **ระบบกรองและกลับข้อความ:** กรองข้อความด้วยคีย์เวิร์ด (รวม/ไม่รวม) หรือกลับด้านตัวอักษรและบรรทัด

### 🍪 เครื่องมือสำหรับนักพัฒนา & เครือข่าย (Developer & Network)
*   **จัดการ Cookie (Cookie Manager):** ดึง UID และ Token จาก Cookie Facebook, ลบ Cookie เสีย และจัดรูปแบบให้พร้อมใช้
*   **ตรวจสอบ IP (IP Geolocation):** ตรวจจับ Public IP พร้อมข้อมูลสถานที่, ISP, โซนเวลา และพิกัดบนแผนที่
*   **ดึงข้อมูล HTML (HTML Extractor):** ดึงลิงก์รูปภาพ (`<img src>`) และลิงก์เว็บไซต์ (`<a href>`) จาก HTML
*   **จัดรูปแบบ JSON (JSON Formatter):** จัดระเบียบ JSON ให้อ่านง่าย หรือบีบอัดขนาด (Minify)

### ⏱️ เพิ่มประสิทธิภาพการทำงาน (Productivity)
*   **นาฬิกา Pomodoro:** จับเวลาทำงาน/พัก พร้อมการแจ้งเตือนบนเบราว์เซอร์
*   **สมุดโน้ตส่วนตัว (Secure Notepad):** บันทึกข้อความเก็บไว้ในฐานข้อมูล SQLite ภายในเครื่อง พร้อมระบบแชร์ลิงก์
*   **หน้า FAQ:** รวมคำถามที่พบบ่อยเกี่ยวกับการใช้งาน

## 🚀 เทคโนโลยีที่ใช้งาน (Tech Stack)

| เทคโนโลยี | รายละเอียด |
|---|---|
| **เฟรมเวิร์ก** | [Next.js 16.2](https://nextjs.org/) (App Router + Turbopack) |
| **ตกแต่ง UI** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **ไอคอน** | [Lucide React](https://lucide.dev/) |
| **ระบบหลายภาษา** | `next-intl` (รองรับ en/th) |
| **ฐานข้อมูลท้องถิ่น** | `better-sqlite3` (สมุดโน้ต, ย่อลิงก์) |
| **ฐานข้อมูลคลาวด์** | [Supabase](https://supabase.com/) (Content Planner) |
| **ธีม** | `next-themes` (โหมดมืด/สว่าง) |
| **ตัวจัดการรหัส 2FA** | `otplib` |
| **สร้าง ID สั้น** | `nanoid` |
| **Deploy** | Docker + Docker Compose |

## 📦 วิธีการติดตั้งและการเริ่มต้นใช้งาน

### สิ่งที่ต้องมีเบื้องต้น (Prerequisites)
*   Node.js เวอร์ชัน 18.x ขึ้นไป
*   npm หรือ yarn
*   Docker & Docker Compose (สำหรับ deploy ขึ้น production)

### ขั้นตอนการติดตั้ง

1.  **ดาวน์โหลดโปรเจกต์ (Clone repository)**
    ```bash
    git clone https://github.com/pakawatdmc-art/tool.maketing.git
    cd mt-content-planner
    ```

2.  **ติดตั้ง Dependencies**
    ```bash
    npm install
    ```

3.  **ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)**
    คัดลอกไฟล์ตัวอย่างและปรับเปลี่ยนค่าได้ตามต้องการ
    ```bash
    cp .env.example .env.local
    ```
    ค่าที่ต้องตั้ง:
    ```env
    NEXT_PUBLIC_APP_NAME="MT Content Planner"
    DATABASE_PATH="./data/notes.db"

    # Content Planner - Supabase (ถ้าต้องการใช้ Content Planner)
    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
    ```

4.  **รันเซิร์ฟเวอร์สำหรับพัฒนา (Development Server)**
    ```bash
    npm run dev
    ```
    เปิดเบราว์เซอร์และเข้าไปที่ [http://localhost:3005](http://localhost:3005) เพื่อดูผลลัพธ์

    ถ้าต้องการรัน API routes แยกพอร์ตสำหรับทดสอบ:
    ```bash
    npm run api
    ```
    API จะพร้อมใช้งานที่ [http://localhost:8005](http://localhost:8005)

### 🐳 Deploy ด้วย Docker

```bash
docker compose up -d --build
```

เว็บจะพร้อมใช้งานที่ [http://localhost:3005](http://localhost:3005)

## 🛠️ โครงสร้างของโปรเจกต์ (Project Structure)

```text
├── src/
│   ├── app/
│   │   ├── [locale]/            # ระบบจัดการภาษา (en, th)
│   │   │   ├── content-planner/ # ระบบวางแผนคอนเทนต์ (Planner, Calendar, Login)
│   │   │   ├── link-converter/  # แปลงลิงก์ข้ามบล็อก + ย่อลิงก์
│   │   │   ├── check-ip/       # ตรวจสอบ IP
│   │   │   ├── check-uid/      # ตรวจสอบ UID
│   │   │   ├── get-uid/        # ดึง UID
│   │   │   ├── notepad/        # สมุดโน้ต
│   │   │   ├── tool/           # รวมเครื่องมือ
│   │   │   └── faq/            # FAQ
│   │   ├── api/
│   │   │   ├── shorten/        # API ย่อลิงก์ (SQLite + nanoid)
│   │   │   ├── r/              # API redirect ข้ามบล็อก
│   │   │   ├── check-ip/       # API ตรวจ IP
│   │   │   ├── check-uid/      # API ตรวจ UID
│   │   │   ├── get-uid/        # API ดึง UID
│   │   │   ├── notepad/        # API สมุดโน้ต
│   │   │   └── content-planner/# API Content Planner
│   │   ├── s/[id]/             # Route redirect ลิงก์สั้น (/s/xxxxxx)
│   │   └── globals.css         # CSS พื้นฐานและตัวแปรสีของธีม
│   ├── components/
│   │   ├── Navbar.tsx           # แถบเมนูด้านบน
│   │   ├── content-planner/     # คอมโพเนนต์ Content Planner
│   │   └── tools/               # คอมโพเนนต์เครื่องมือแต่ละตัว
│   ├── i18n/                    # การตั้งค่า next-intl
│   └── lib/
│       ├── db.ts                # เชื่อมต่อ SQLite (notes + short_links)
│       └── content-planner/     # Logic และ i18n ของ Content Planner
├── messages/                    # ไฟล์แปลภาษา (en.json, th.json)
├── data/                        # ฐานข้อมูล SQLite (ไม่ถูกอัปขึ้น Git)
├── Dockerfile                   # สำหรับ build Docker image
└── docker-compose.yml           # สำหรับ deploy ด้วย Docker
```

## 🔒 นโยบายความเป็นส่วนตัว (Privacy First)

เราสร้างเครื่องมือนี้ขึ้นมาโดยให้ความสำคัญกับความเป็นส่วนตัวของคุณเป็นอันดับแรก:
*   **ระบบสร้างรหัส 2FA** ทำงานในฝั่งผู้ใช้ (Client-side) เท่านั้น รหัสลับของคุณจะไม่ถูกส่งไปยังเซิร์ฟเวอร์ใดๆ
*   การจัดการและแก้ไขข้อความต่างๆ ทำงานอยู่ภายในหน่วยความจำเบราว์เซอร์ทั้งหมด
*   **ข้อมูลสมุดโน้ต** และ **ลิงก์ที่ย่อ** จะถูกบันทึกในฐานข้อมูล SQLite ภายในเครื่องเซิร์ฟเวอร์ของคุณเอง
*   **ระบบย่อลิงก์** ใช้ SQLite ภายในเครื่อง ไม่ต้องพึ่งบริการภายนอก
*   **ลิงก์ Redirect** ไม่แสดงหน้าระหว่างทาง redirect ทันทีโดยผู้ใช้จะไม่เห็นอะไรเลย

## 🤝 การมีส่วนร่วม (Contributing)

ยินดีต้อนรับทุกท่านที่ต้องการร่วมพัฒนา แจ้งปัญหา (Issues) หรือเสนอแนะฟีเจอร์ใหม่ๆ! สามารถเข้าไปพูดคุยกันได้ที่ [หน้า Issues](https://github.com/pakawatdmc-art/tool.maketing/issues)

## 📄 ลิขสิทธิ์ (License)

โปรเจกต์นี้อยู่ภายใต้ใบอนุญาต MIT License - ดูรายละเอียดเพิ่มเติมได้ในไฟล์ LICENSE
