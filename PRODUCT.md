# Product

## Register

product

## Users

Content creators, managers, and page operators who plan, review, and track social content for Metaverse Resolution. They work across dashboard summaries, spreadsheet-like planning, calendar scheduling, and approval/review flows. Their job is to see what is due, understand status quickly, and move content from idea to approved post without confusion.

## Product Purpose

MT Content Planner centralizes content planning, production status, product coverage, review comments, and posting status in one operational interface. Success means the team can understand the current workload at a glance, find the right task quickly, and use the app comfortably on both desktop and mobile.

## Brand Personality

Professional, clear, and helpful. The interface should feel modern but not decorative, confident but not loud, and friendly enough for daily team use.

## Anti-references

Avoid generic AI-dashboard styling, excessive glassmorphism, decorative gradient blobs, oversized rounded cards, unreadable low-contrast text, and desktop-only tables that force mobile users to pinch and scroll sideways. Avoid sales-page styling inside the app.

## Design Principles

- Make status visible before detail: product, progress, approval, and post state should be scannable without opening every task.
- Keep production work calm: use color for state and priority, not decoration.
- Desktop can be dense; mobile must be focused: tables can stay on desktop, but phones need card and agenda views.
- Preserve familiar product UI patterns: side navigation on desktop, compact bottom navigation on mobile, standard form controls, clear focus states.
- Reduce ambiguity in review flows: tasks waiting for comments should be obvious to managers and easy to open.

## Accessibility & Inclusion

Target WCAG AA contrast for text and controls. Touch targets should be at least 44px on mobile. The UI should remain usable with reduced motion, keyboard navigation, and color-blind users by pairing status colors with text labels.

---

# Content Strategy (Metaverse Resolution)

ส่วนนี้อธิบาย "เนื้อหา" ที่วางแผนในแอป (คนละเรื่องกับตัวเครื่องมือด้านบน) เพื่อให้ทีมและผู้ช่วย AI เข้าใจตรงกันเวลาวางแผนรอบถัดไป แหล่งความจริงของแผนอยู่ที่ `scripts/generate-metaverse-content.mjs`

## Content Objectives (วัตถุประสงค์การทำคอนเทนต์)

แนวทางหลัก: **Education-first / Soft Sell** — ให้ความรู้และสร้างความน่าเชื่อถือก่อน แล้วให้ลูกค้าทักเข้ามาปรึกษาเอง โดยไม่ขายแข็ง

1. **สร้างความน่าเชื่อถือ / วางตัวเป็นที่ปรึกษาผู้เชี่ยวชาญ** ไม่ใช่ร้านขายของ
2. **ขายแบบนุ่มนวล (Soft Sell)** — CTA ทักแชทโผล่ช้า (ราวโพสต์ที่ 7 ของรอบ) ก่อนหน้านั้นใช้ "เซฟไว้ / คอมเมนต์ / แชร์"
3. **ปลูก Awareness ผ่านคอนเทนต์ที่ลูกค้า "อิน"** (Relatable painpoint) ให้คนจำแบรนด์ได้เอง
4. **ให้คุณค่าฟรีจริง ๆ** (checklist / วิธีเลือก / ข้อควรระวัง) เพื่อสร้างความไว้ใจก่อนเปลี่ยนเป็นลูกค้า
5. **Lead generation แบบ diagnosis** — เปิดช่องให้ลูกค้า "เล่าอาการ/ปัญหา" เข้ามา แล้วทีมช่วยชี้จุดเริ่ม
6. **ครอบคลุม 5 บริการหลัก** ให้ลูกค้ารู้ว่าเราช่วยอะไรได้บ้าง

## Products / Service Pillars (สินค้าที่ต้องดูแล)

5 บริการหลัก (pillars) + คอนเทนต์รวม เป้าหมายต่อเดือนใช้ถ่วงน้ำหนักการหมุนเวียนใน generator:

| Product | เป้า/เดือน | แก่นการสื่อสาร |
|---|---|---|
| **เพจ** (Facebook Page) — เรือธง | 3 | "หน้าร้านออนไลน์" เพจต้องน่าเชื่อถือก่อนยิงแอด |
| **VPS** | 2 | จัดระบบเครื่องทำงาน / หลายบัญชี / รัน 24 ชม. |
| **บัญชีเฟส** (Ad Account) | 2 | Daily limit, warm up, บัญชีถูกจำกัด |
| **บัญชี BM** (Business Manager) | 2 | โครงสร้าง BM, สิทธิ์ทีม, BM จำกัด vs ระงับ |
| **LINE OA** | 2 | ระบบเก็บลูกค้า / CRM ให้กลับมาซื้อซ้ำ |
| **ปั้มไลค์/ยอดฟอล** (Social Proof) | 1 | ยอดไลค์ต้องมาคู่กับ content + trust + chat |
| **content อิสระ / รวมสินค้า** | 1 | Brand awareness + soft diagnosis รวม 5 pillars |

> หมายเหตุ: ชื่อสินค้าในข้อมูลยังไม่ standardize เต็มที่ (มี alias เช่น `Social Proof`/`ยอดฟอล/ปั้มไลค์` → `ปั้มไลค์/ยอดฟอล`, `รวมสินค้า`/`ประจำเดือน` → `content อิสระ`) ดู `PRODUCT_ALIASES` ในสคริปต์

## Posting Cadence (ตารางการโพสต์ปัจจุบัน)

- **3 โพสต์ / สัปดาห์** (ปรับลดจากเดิม 6 วัน เพื่อให้สอดคล้องกับเวลาที่มี)
- **วันโพสต์: พุธ / ศุกร์ / อาทิตย์** — หยุดวันจันทร์และอังคาร (เว้นระยะสม่ำเสมอ 2-2-3 วัน)
- **เวลา 18:00 น.** แพลตฟอร์ม Facebook
- มีโพสต์ "รวมสินค้า" เป็น bookend ต้นเดือน (แนะนำ 5 pillars) และปลายเดือน (quiz สรุปอาการ A–E)
- Story (พื้นที่เสริม) ออกเฉพาะเมื่อรันด้วย `--include-stories` (ตั้งไว้วันเสาร์)
- ตั้งค่าในสคริปต์: `FEED_DAYS = {3,5,0}` (0=อา. ... 6=ส.), `STORY_DAYS = {6}`

## Content Format & Funnel

- **Format:** Single Image / Carousel / บทความ (No video / Static-first)
- **Type (funnel):** Educate → Relatable → Tips → Soft Sell, ปิดด้วย Brand awareness รวมสินค้า

## วิธีสร้าง/อัปเดตแผน

```bash
npm run content:metaverse                 # สร้างแผนเดือนปัจจุบัน (ไฟล์ลง ~/Downloads)
node scripts/generate-metaverse-content.mjs --start 2026-09-01 --end 2026-09-30
node scripts/generate-metaverse-content.mjs --insert   # ดันเข้า Supabase (เพิ่มใหม่ ข้ามที่ซ้ำ)
node scripts/generate-metaverse-content.mjs --sync     # อัปเดต/เพิ่มตามวันที่
node scripts/generate-metaverse-content.mjs --no-auto --start 2026-06-13 --end 2026-07-31  # แผนเขียนมือเดิม
```
