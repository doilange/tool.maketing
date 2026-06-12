import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_START = "2026-06-13";
const DEFAULT_END = "2026-06-30";
const DEFAULT_OWNER = "nine.doy";
const DEFAULT_OUT_DIR = path.join(os.homedir(), "Downloads");

const THAI_DAYS = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัส",
  "ศุกร์",
  "เสาร์",
];

const CSV_HEADERS = [
  "Week",
  "Start date",
  "Due date",
  "Date",
  "Day",
  "Time",
  "Workday",
  "Platform",
  "Product",
  "Topic",
  "Type",
  "Progress",
  "Post status",
  "Approval",
  "Owner",
  "Caption",
  "Creative brief",
  "Note",
  "File URL",
  "Created at",
  "Updated at",
];

const PRODUCT_ALIASES = {
  "รวมสินค้า": "content อิสระ",
  "ประจำเดือน": "content อิสระ",
  "Social Proof": "ปั้มไลค์/ยอดฟอล",
  "VPS": "Vps",
  "LINE OA": "line oa",
  "เฟส/บัญชีโฆษณา": "บัญชีเฟส",
  "BM": "บัญชี BM",
  "ยอดฟอล/ปั้มไลค์": "ปั้มไลค์/ยอดฟอล",
};

const MONTHLY_INTRO_TASK = {
  time: "18:00",
  platform: "Facebook",
  product: "รวมสินค้า",
  contentType: "Carousel",
  type: "Brand awareness",
  topic: "เดือนนี้ Metaverse Resolution ช่วยอะไรได้บ้าง",
  creativeBrief:
    "Carousel 7 slides: เปิดด้วยคำถามธุรกิจติดตรงไหน, แล้วไล่ 5 product pillars, ปิดด้วย CTA ส่งอาการให้ทีมช่วยดู",
  caption: `เดือนใหม่ เริ่มจากเช็กก่อนว่าธุรกิจคุณติดปัญหาตรงไหน

Metaverse Resolution ช่วยดูได้ 5 จุดหลัก:

1. เพจ
ถ้าเพจดูไม่น่าเชื่อถือ ลูกค้าไม่กล้าโอน หรือเพจยังไม่พร้อมยิงแอด

2. VPS
ถ้าทำงานหลายบัญชี หลายทีม เครื่องช้า หรืออยากจัดระบบหลังบ้านให้ทำงานนิ่งขึ้น

3. ยอดฟอล / ไลค์
ถ้าเพจดูเงียบ ภาพลักษณ์ยังไม่แข็งแรง หรืออยากเพิ่ม social proof ให้เพจดูน่าเชื่อถือขึ้น

4. เฟสโฆษณา / BM
ถ้าบัญชีแอดติดปัญหา BM ไม่เป็นระบบ เพิ่มงบไม่ได้ หรือยังไม่รู้ว่าควรจัดโครงสร้างยังไง

5. LINE OA
ถ้าลูกค้าทักแล้วหาย ไม่มีระบบเก็บลูกค้า หรืออยากดูแลลูกค้าให้กลับมาซื้อซ้ำ

ไม่แน่ใจว่าควรเริ่มแก้จากตรงไหน
ส่งอาการที่เจออยู่ตอนนี้มาให้ทีมช่วยดูเบื้องต้นได้ครับ`,
  note: "โพสต์รวมโปรดักต์ต้นเดือน ให้ลูกค้ารู้ว่าเราช่วยอะไรได้บ้าง โดยไม่ขายแข็ง",
};

const BASE_PLAN = [
  {
    date: "2026-06-13",
    time: "18:00",
    platform: "Facebook",
    product: "เพจ",
    contentType: "Single Image",
    type: "Educate",
    topic: "เริ่มต้นเดือนนี้: ก่อนยิงแอด เช็กเพจก่อน",
    creativeBrief:
      'ภาพข้อความใหญ่ "ก่อนยิงแอด เช็กเพจก่อน" พร้อม checklist 4 ข้อด้านล่าง',
    caption: `ก่อนเอางบไปลงแอด ลองเช็กหน้าเพจก่อนว่า "พร้อมให้ลูกค้าตัดสินใจ" หรือยัง

หลายครั้งแอดไม่ได้แย่
แต่คนคลิกเข้ามาแล้วเพจยังไม่ทำให้เขามั่นใจพอ

เช็กง่าย ๆ 4 จุด:
1. รูปโปรไฟล์และหน้าปกดูเป็นธุรกิจจริงไหม
2. ข้อมูลติดต่อครบไหม
3. มีโพสต์ที่บอกชัดไหมว่าเราช่วยแก้ปัญหาอะไร
4. หน้าเพจดูมีความเคลื่อนไหวหรือเปล่า

ถ้าไม่แน่ใจว่าเพจพร้อมยิงแอดหรือยัง
ส่งลิงก์เพจมาให้ทีมช่วยดูเบื้องต้นได้ครับ`,
    note: "เปิด positioning เพจให้เป็นผู้ช่วยวินิจฉัยปัญหา ไม่ใช่ร้านขายของตรง ๆ",
  },
  {
    date: "2026-06-14",
    time: "11:00",
    platform: "Facebook Story",
    product: "Social Proof",
    contentType: "Story poll",
    type: "Engage",
    topic: "ก่อนโอน คุณดูอะไรก่อน",
    creativeBrief: "ทำ story 2 หน้า: คำถามใหญ่ 1 หน้า และ poll 4 ตัวเลือก 1 หน้า",
    caption: `หน้า 1:
ก่อนซื้อของออนไลน์ คุณดูอะไรก่อนโอน?

หน้า 2 Poll:
- ยอดติดตาม
- รีวิว
- หน้าเพจ
- แชทตอบไว

CTA:
โหวตไว้ได้เลย เดี๋ยวทีมเอาผลมาสรุปให้ดู`,
    note: "เก็บ insight เพื่อนำไปต่อยอดเป็นโพสต์ trust/social proof",
  },
  {
    date: "2026-06-15",
    time: "18:00",
    platform: "Facebook",
    product: "เพจ",
    contentType: "Carousel",
    type: "Educate",
    topic: "เช็กลิสต์ 7 จุดก่อนเอาเพจใหม่ไปยิงแอด",
    creativeBrief: "7 slides, slide แรกเป็น hook, slide สุดท้ายเป็น CTA",
    caption: `เพจใหม่ไม่ใช่ว่ายิงแอดไม่ได้
แต่ก่อนเอางบไปลง ควรเช็กให้ครบก่อนว่าเพจพร้อมพอหรือยัง

7 จุดที่ควรดู:
1. รูปโปรไฟล์และปกดูน่าเชื่อถือ
2. ข้อมูลเพจครบ
3. มีโพสต์พื้นฐานก่อนยิงแอด
4. มีช่องทางติดต่อชัดเจน
5. มี social proof เบื้องต้น
6. หน้าเพจไม่ดูร้าง
7. ข้อความตอบลูกค้าพร้อม

เพจที่พร้อม ช่วยให้ลูกค้าตัดสินใจง่ายขึ้น

คอมเมนต์ "เช็กเพจ" ถ้าอยากได้ checklist ไว้ตรวจเพจตัวเอง`,
    note: "CTA แบบให้ checklist ลดความขายตรง",
  },
  {
    date: "2026-06-16",
    time: "18:00",
    platform: "Facebook",
    product: "เพจ",
    contentType: "บทความ",
    type: "Educate",
    topic: "เพจดูไม่น่าเชื่อถือ ลูกค้าเลยไม่กล้าโอนจริงไหม",
    creativeBrief: 'ภาพ static จำลองสถานการณ์ "ลูกค้ากำลังตัดสินใจก่อนโอน"',
    caption: `บางร้านไม่ได้ขายไม่ดี
แต่ลูกค้ายังไม่มั่นใจพอที่จะโอน

สิ่งที่ลูกค้ามักดูแบบไม่บอกเรา:
- เพจมีรูปโปรไฟล์ชัดไหม
- มีโพสต์จริงหรือเปล่า
- มีคนติดตามหรือมีความเคลื่อนไหวไหม
- ข้อมูลติดต่อดูน่าเชื่อถือไหม
- แชทตอบไวและตอบเป็นระบบไหม

ถ้าเพจดูเงียบเกินไป ลูกค้าอาจลังเล แม้เขาจะสนใจสินค้าแล้วก็ตาม

ใครอยากให้ทีมช่วยดูหน้าเพจเบื้องต้น
ส่งลิงก์เพจมาในแชทได้ครับ`,
    note: "เล่าปัญหาจากมุมลูกค้า",
  },
  {
    date: "2026-06-17",
    time: "12:00",
    platform: "Facebook Story",
    product: "รวมสินค้า",
    contentType: "Story Q&A",
    type: "Engage",
    topic: "ตอนนี้คุณติดปัญหาอะไร: เพจ / แอด / BM / LINE OA",
    creativeBrief: "ใช้ question sticker ให้คนพิมพ์อาการที่เจอ",
    caption: `ตอนนี้ธุรกิจคุณติดปัญหาอะไรมากที่สุด?

- เพจดูไม่น่าเชื่อถือ
- แอดไม่วิ่ง
- BM มีปัญหา
- เครื่องทำงานไม่เป็นระบบ
- เก็บลูกค้าไม่อยู่

CTA:
พิมพ์อาการไว้ได้ เดี๋ยวทีมเอาไปทำโพสต์ตอบ`,
    note: "ใช้คำตอบจาก story เป็น seed content รอบต่อไป",
  },
  {
    date: "2026-06-18",
    time: "18:00",
    platform: "Facebook",
    product: "เพจ",
    contentType: "Carousel",
    type: "Educate",
    topic: "3 สัญญาณว่าเพจยังไม่พร้อมยิงแอด",
    creativeBrief: "4 slides: hook + 3 สัญญาณ + CTA",
    caption: `ก่อนเพิ่มงบแอด ลองเช็ก 3 สัญญาณนี้ก่อน

1. เพจมีโพสต์น้อยเกินไป
ลูกค้าเข้ามาดูแล้วไม่เห็นความเคลื่อนไหว

2. ข้อมูลเพจยังไม่ครบ
ไม่มีช่องทางติดต่อหรือรายละเอียดที่ช่วยให้มั่นใจ

3. ภาพรวมเพจยังไม่สื่อว่าเป็นธุรกิจจริง
รูปปก, รูปโปรไฟล์, โพสต์ และข้อความยังไม่ไปทางเดียวกัน

ถ้าเพจยังไม่พร้อม งบแอดอาจเสียไปกับการพาคนเข้ามาดูเพจที่ยังปิดการขายไม่ได้

ส่งลิงก์เพจมาให้ทีมช่วยดูจุดที่ควรปรับก่อนได้ครับ`,
    note: "โยงไปสู่บริการเพจแบบ soft diagnosis",
  },
  {
    date: "2026-06-19",
    time: "18:00",
    platform: "Facebook",
    product: "VPS",
    contentType: "Carousel",
    type: "Educate",
    topic: "VPS คืออะไร ทำไมทีมทำการตลาดถึงใช้",
    creativeBrief: "อธิบาย VPS แบบ beginner ด้วยภาพเครื่องกลาง/ระบบทำงาน",
    caption: `VPS ไม่ใช่เรื่องไกลตัวสำหรับคนทำการตลาด

ถ้าอธิบายง่าย ๆ
VPS คือเครื่องทำงานกลางที่เปิดใช้งานได้ตลอด
ช่วยให้ทีมจัดระบบงานได้เป็นระเบียบขึ้น

เหมาะกับคนที่:
- ทำงานหลายบัญชี
- มีหลายคนช่วยดูงาน
- ต้องการเครื่องที่พร้อมใช้งานตลอด
- ไม่อยากให้เครื่องส่วนตัวเป็นคอขวด

ถ้าไม่แน่ใจว่าควรใช้สเปกไหน
พิมพ์ "VPS" หรือทักแชทมาให้ทีมช่วยประเมินได้ครับ`,
    note: "อธิบายเป็นระบบทำงาน ไม่ใช้ภาษาหลบระบบ",
  },
  {
    date: "2026-06-20",
    time: "11:00",
    platform: "Facebook Story",
    product: "เพจ",
    contentType: "Story",
    type: "Relatable",
    topic: "ลูกค้ากำลังจะโอน แต่เข้าเพจแล้วเงียบ",
    creativeBrief: "Story 2 หน้า แนว relatable",
    caption: `หน้า 1:
ลูกค้า: สนใจค่ะ ขอเลขบัญชีหน่อย

หน้า 2:
ลูกค้าเข้าไปดูเพจแล้วเจอโพสต์ล่าสุดเมื่อ 3 เดือนก่อน

CTA:
เพจที่ดูมีความเคลื่อนไหว ช่วยให้ลูกค้าตัดสินใจง่ายขึ้น`,
    note: "ทำให้ painpoint เบาขึ้น ไม่แข็งเกินไป",
  },
  {
    date: "2026-06-21",
    time: "",
    platform: "-",
    product: "-",
    contentType: "พัก",
    type: "Rest",
    topic: "ไม่ลง feed",
    creativeBrief: "พักการลง feed เพื่อไม่ให้เพจถี่เกินไป",
    caption: "",
    note: "ไม่ต้องสร้างงานใน planner ถ้าไม่อยากเห็นวันพัก",
    skipInsert: true,
  },
  {
    date: "2026-06-22",
    time: "18:00",
    platform: "Facebook",
    product: "เฟส/บัญชีโฆษณา",
    contentType: "Carousel",
    type: "Educate",
    topic: "บัญชีโฆษณาโดนจำกัด อย่าเพิ่งแก้แบบสุ่ม",
    creativeBrief: "5 slides, ใช้โทนเตือนแต่ไม่ขู่",
    caption: `บัญชีโฆษณาติดจำกัด อย่าเพิ่งกดแก้แบบสุ่ม

สิ่งที่ควรทำก่อน:
1. อ่านสถานะที่ระบบแจ้งให้ครบ
2. แยกว่าเป็นปัญหาบัญชี, เพจ, BM หรือวิธีชำระเงิน
3. เช็กประวัติการใช้งานล่าสุด
4. ให้คนที่เข้าใจระบบช่วยดูภาพรวม

บางเคสแก้ผิดจุดอาจทำให้เสียเวลามากกว่าเดิม

ถ้าบัญชีคุณมีอาการผิดปกติ
ส่งอาการมาให้ทีมช่วยดูเบื้องต้นได้ครับ`,
    note: "เลี่ยงการสอน bypass เน้นแยกอาการ",
  },
  {
    date: "2026-06-23",
    time: "18:00",
    platform: "Facebook",
    product: "BM",
    contentType: "Carousel",
    type: "Soft sell",
    topic: "BM 3 กับ BM 5 ต่างกันยังไง",
    creativeBrief: "ตารางเปรียบเทียบ BM 3 / BM 5 แบบไม่ hard sell",
    caption: `BM 3 หรือ BM 5 ไม่ได้เลือกจากตัวเลขอย่างเดียว

ควรดูจาก:
- ขนาดทีม
- จำนวนเพจที่ต้องจัดการ
- โครงสร้างบัญชีโฆษณา
- แผนการเพิ่มงบ
- ความพร้อมของธุรกิจ

บางธุรกิจใช้ BM ขนาดเล็กก็พอ
บางธุรกิจต้องวางโครงสร้างให้รองรับการสเกล

ถ้าไม่แน่ใจว่าควรเลือกแบบไหน
ทักมาเล่าโจทย์ได้ครับ ทีมช่วยแนะนำตามเคส`,
    note: "ขายแบบช่วยเลือก ไม่ใช่ดันแพ็กแพง",
  },
  {
    date: "2026-06-24",
    time: "12:00",
    platform: "Facebook Story",
    product: "รวมสินค้า",
    contentType: "Story poll",
    type: "Engage",
    topic: "ปัญหาไหนเจอบ่อยสุดในธุรกิจคุณ",
    creativeBrief: "ทำ story poll 1-2 หน้า",
    caption: `ธุรกิจคุณเจอปัญหาไหนบ่อยสุด?

- เพจดูไม่น่าเชื่อถือ
- ยิงแอดแล้วไม่วิ่ง
- BM / บัญชีแอดมีปัญหา
- ลูกค้าทักแล้วหาย

CTA:
โหวตไว้ เดี๋ยวทีมทำโพสต์แนะนำวิธีเริ่มแก้ให้`,
    note: "ใช้เป็นข้อมูลสำหรับโพสต์สรุป 28 มิ.ย.",
  },
  {
    date: "2026-06-25",
    time: "18:00",
    platform: "Facebook",
    product: "LINE OA",
    contentType: "Carousel",
    type: "Educate",
    topic: "LINE OA ไม่ใช่แค่แชท แต่คือระบบเก็บลูกค้า",
    creativeBrief: "Flow จาก Ads -> Inbox -> LINE OA -> ซื้อซ้ำ",
    caption: `คนทักเพจวันนี้ ถ้าไม่เก็บเข้าระบบ
พรุ่งนี้เขาอาจหายไปเลย

LINE OA ช่วยให้ธุรกิจ:
- เก็บลูกค้าที่เคยสนใจ
- ส่งข่าวสารได้เป็นระบบ
- ทำบรอดแคสต์ได้
- พาลูกค้ากลับมาซื้อซ้ำ
- ลดการพึ่งพา inbox ช่องทางเดียว

แอดช่วยพาคนเข้ามา
แต่ LINE OA ช่วยให้เราดูแลเขาต่อได้

พิมพ์ "LINE OA" ถ้าอยากให้ทีมช่วยวาง flow เบื้องต้น`,
    note: "สอนบทบาท LINE OA เป็น retention ไม่ใช่แค่แชท",
  },
  {
    date: "2026-06-26",
    time: "18:00",
    platform: "Facebook",
    product: "ยอดฟอล/ปั้มไลค์",
    contentType: "Carousel",
    type: "Educate",
    topic: "ยอดไลค์เยอะอย่างเดียวไม่พอ ต้องมี 3 อย่างนี้ด้วย",
    creativeBrief: "3 pillar cards: Content, Trust, Chat",
    caption: `ยอดไลค์ช่วยให้เพจดูมีน้ำหนักขึ้น
แต่ถ้ามีแค่ตัวเลขอย่างเดียว อาจยังปิดการขายไม่ได้

ต้องมี 3 อย่างนี้คู่กัน:

1. Content
โพสต์ต้องบอกให้ลูกค้ารู้ว่าเราช่วยแก้ปัญหาอะไร

2. Trust
หน้าเพจต้องดูเป็นธุรกิจจริง

3. Chat
ข้อความตอบลูกค้าต้องชัดและพาไปสู่การตัดสินใจ

ตัวเลขช่วยเปิดประตู
แต่ระบบเพจและแชทคือสิ่งที่ช่วยปิดการขาย`,
    note: "ทำให้สินค้า social proof ไม่ดูขายตัวเลขอย่างเดียว",
  },
  {
    date: "2026-06-27",
    time: "11:00",
    platform: "Facebook Story",
    product: "BM",
    contentType: "Story Q&A",
    type: "Trust",
    topic: "บัญชีแอด/BM มีปัญหา เริ่มดูตรงไหนดี",
    creativeBrief: "ใช้ question sticker",
    caption: `บัญชีแอดหรือ BM มีปัญหา
ควรเริ่มดูตรงไหนดี?

ส่งอาการที่เจอมาได้ เช่น:
- ยิงแอดไม่ได้
- เพิ่มงบไม่ได้
- บัญชีติดจำกัด
- BM ตั้งค่าไม่ครบ

CTA:
ทีมจะเอาคำถามที่เจอบ่อยไปตอบเป็นโพสต์`,
    note: "เปิดให้คนเล่าอาการแบบไม่ต้องซื้อทันที",
  },
  {
    date: "2026-06-28",
    time: "11:00",
    platform: "Facebook Story",
    product: "รวมสินค้า",
    contentType: "Story recap",
    type: "Trust",
    topic: "สรุปผลโพล + ชวนส่งเคสให้ทีมดู",
    creativeBrief: "สรุป insight จาก poll วันที่ 24",
    caption: `จากโพลที่ผ่านมา หลายคนติดปัญหาเรื่องเพจ/แอด/BM

ถ้าไม่แน่ใจว่าควรเริ่มแก้ตรงไหนก่อน
ส่งอาการมาให้ทีมช่วยดูเบื้องต้นได้ครับ

CTA:
ทักแชทเล่าอาการที่เจออยู่ตอนนี้`,
    note: "ใช้เป็นสะพานไป soft conversion",
  },
  {
    date: "2026-06-29",
    time: "18:00",
    platform: "Facebook",
    product: "รวมสินค้า",
    contentType: "Carousel",
    type: "Soft sell",
    topic: "แพ็กไหนเหมาะกับธุรกิจคุณ",
    creativeBrief: "Quiz 5 อาการ -> แนะนำหมวดสินค้า",
    caption: `มีปัญหาเหมือนกัน แต่ทางแก้อาจไม่ใช่สินค้าเดียวกัน

ลองเลือกอาการที่ใกล้กับธุรกิจคุณที่สุด:

A: เพจดูไม่น่าเชื่อถือ
เริ่มจาก Page Trust

B: ทำงานหลายบัญชีแล้วระบบสะดุด
เริ่มจาก VPS

C: อยากให้เพจดูมีน้ำหนักขึ้น
เริ่มจาก Social Proof

D: แอดหรือ BM มีปัญหา
เริ่มจาก Ads Stability

E: ลูกค้าทักแล้วหาย เก็บลูกค้าไม่เป็นระบบ
เริ่มจาก LINE OA

ทักคำตอบ A-E มาได้ครับ ทีมช่วยแนะนำทางเริ่มที่เหมาะกับเคสคุณ`,
    note: "โพสต์ขายแบบ quiz/diagnosis",
  },
  {
    date: "2026-06-30",
    time: "18:00",
    platform: "Facebook",
    product: "รวมสินค้า",
    contentType: "บทความ",
    type: "Trust",
    topic: "10 อาการที่เจอบ่อยในเพจ/แอด/LINE OA และควรแก้อะไรก่อน",
    creativeBrief: "ภาพ checklist 10 อาการ แล้วใช้ caption อธิบาย",
    caption: `ถ้าธุรกิจคุณกำลังเจอปัญหาเหล่านี้
อาจไม่ต้องแก้ทุกอย่างพร้อมกัน แต่ควรเริ่มจากจุดที่กระทบยอดขายที่สุด

10 อาการที่เจอบ่อย:
1. เพจดูเงียบ
2. ลูกค้าไม่กล้าโอน
3. ยิงแอดแล้วไม่วิ่ง
4. บัญชีโฆษณาติดจำกัด
5. BM ไม่เป็นระบบ
6. เครื่องทำงานช้า
7. ทีมทำงานหลายคนแล้วสับสน
8. ลูกค้าทักแล้วหาย
9. ไม่มีช่องทางเก็บลูกค้า
10. คอนเทนต์ขายบ่อยแต่ยอดทักไม่เพิ่ม

ถ้าไม่แน่ใจว่าควรเริ่มแก้ตรงไหนก่อน
เล่าอาการมาในแชทได้ครับ ทีมช่วยชี้จุดเริ่มให้`,
    note: "ปิดรอบด้วย content รวมสินค้าแบบ trust",
  },
];

const EXTRA_FEED_TEMPLATES = [
  {
    time: "18:00",
    platform: "Facebook",
    product: "เพจ",
    contentType: "Carousel",
    type: "Educate",
    topic: "เพจโปรไฟล์ vs เพจเดี่ยว ต่างกันตรงไหน ใช้แบบไหนดี",
    creativeBrief: "Carousel ตารางเปรียบเทียบ 2 คอลัมน์: เหมาะกับใคร / จุดเด่น / ควรใช้เมื่อไหร่",
    caption: `เลือกเพจให้เหมาะตั้งแต่แรก ช่วยลดปัญหาทีหลังได้เยอะ

เพจโปรไฟล์เหมาะกับ:
- งานที่ต้องการภาพลักษณ์เหมือนมีตัวตน
- ธุรกิจที่อยากสร้างความคุ้นเคย
- คนเริ่มต้นที่อยากให้เพจดูเข้าถึงง่าย

เพจเดี่ยวเหมาะกับ:
- ธุรกิจที่ต้องการแยกแบรนด์ชัดเจน
- ใช้ทำคอนเทนต์หรือยิงแอดเป็นระบบ
- ต้องการจัดการเพจแบบจริงจัง

ไม่มีแบบไหนดีที่สุดสำหรับทุกคน
มีแต่แบบที่เหมาะกับโจทย์ของธุรกิจคุณมากที่สุด

ทักมาบอกโจทย์ได้ครับ เดี๋ยวทีมช่วยแนะนำประเภทที่เหมาะ`,
    note: "ช่วยให้ลูกค้าเข้าใจหมวดสินค้าเพจโดยไม่ขายตรง",
  },
  {
    time: "18:00",
    platform: "Facebook",
    product: "VPS",
    contentType: "Carousel",
    type: "Soft sell",
    topic: "เลือก VPS ยังไงไม่ให้เล็กไปหรือจ่ายเกินจำเป็น",
    creativeBrief: "Carousel 5 slides: เริ่มต้น / ใช้งานกลาง / ใช้งานหนัก / สิ่งที่ต้องบอกทีมก่อนเลือก / CTA",
    caption: `VPS ไม่จำเป็นต้องเริ่มจากแพ็กสูงสุดเสมอไป
ควรเลือกจากลักษณะงานจริง

ก่อนเลือก ให้เช็ก 4 เรื่องนี้:
1. ใช้งานกี่คน
2. ใช้งานหนักแค่ไหน
3. ต้องเปิดใช้งานต่อเนื่องหรือไม่
4. ต้องให้ทีมช่วยดูแลหลังบ้านแค่ไหน

ถ้าเลือกเล็กไป งานอาจสะดุด
ถ้าเลือกใหญ่ไป ก็อาจจ่ายเกินจำเป็น

ทักมาบอกลักษณะงานได้ครับ ทีมช่วยแนะนำแพ็กที่พอดีให้`,
    note: "ขายแบบช่วยเลือกแพ็ก ไม่ hard sell",
  },
  {
    time: "18:00",
    platform: "Facebook",
    product: "เฟส/บัญชีโฆษณา",
    contentType: "บทความ",
    type: "Educate",
    topic: "Daily Limit คืออะไร และทำไมเพิ่มงบแอดไม่ได้ทันที",
    creativeBrief: "Single image หรือ cover บทความ: อยากเพิ่มงบ แต่ติดเพดาน ต้องเช็กอะไร",
    caption: `อยากเพิ่มงบแอด แต่ติด daily limit
ปัญหานี้ทำให้หลายธุรกิจสเกลไม่ทันจังหวะ

สิ่งที่ควรดูไม่ใช่วงเงินอย่างเดียว แต่ต้องดูทั้งระบบ:
- บัญชีโฆษณาพร้อมไหม
- BM จัดถูกไหม
- วิธีชำระเงินมีปัญหาหรือเปล่า
- เพจและแอดมีประวัติเป็นอย่างไร
- แผนเพิ่มงบค่อยเป็นค่อยไปหรือเร็วเกินไป

การสเกลแอดที่ดีควรเริ่มจากโครงสร้างที่นิ่ง

ถ้าตอนนี้ติดเพดานหรือเพิ่มงบไม่ได้
ทักมาให้ทีมช่วยดูภาพรวมได้ครับ`,
    note: "ความรู้เชิงระบบ สำหรับลูกค้าที่อยากสเกล",
  },
  {
    time: "18:00",
    platform: "Facebook",
    product: "LINE OA",
    contentType: "Carousel",
    type: "Educate",
    topic: "บรอดแคสต์ยังไงไม่ให้ลูกค้ารำคาญ",
    creativeBrief: "Carousel 5 slides: 3 สูตรข้อความ + ตัวอย่าง CTA + สัดส่วนส่งข้อความ",
    caption: `บรอดแคสต์ไม่จำเป็นต้องขายทุกครั้ง

ถ้าส่งแต่โปรโมชัน ลูกค้าอาจเริ่มเลื่อนผ่าน
ลองแบ่งข้อความเป็น 3 แบบ:

1. ให้ประโยชน์
เช่น checklist, วิธีเลือก, ข้อควรระวัง

2. แจ้งข่าว
เช่น อัปเดตบริการ, เวลาให้บริการ, ขั้นตอนใหม่

3. ข้อเสนอ
เช่น โปรโมชันหรือแพ็กที่เหมาะกับปัญหาลูกค้า

สัดส่วนที่แนะนำ: ให้ประโยชน์มากกว่าขาย

ใครอยากได้ template บรอดแคสต์ ทักมาขอได้ครับ`,
    note: "เสริม LINE OA ด้วยมุม CRM/retention",
  },
  {
    time: "18:00",
    platform: "Facebook",
    product: "เพจ",
    contentType: "Carousel",
    type: "Educate",
    topic: "5 เหตุผลที่เพจมีคนเห็นน้อย แม้ลงโพสต์ทุกวัน",
    creativeBrief: "Carousel 6 slides: hook + 5 เหตุผล + CTA เซฟไว้เช็ก",
    caption: `ลงโพสต์ทุกวัน แต่เพจยังเงียบ
อาจไม่ใช่เพราะคุณขยันไม่พอ

ลองเช็ก 5 เหตุผลนี้:
1. หัวข้อยังไม่ตรง painpoint ลูกค้า
2. Hook ยังไม่ทำให้คนหยุดอ่าน
3. เพจยังดูไม่น่าเชื่อถือ
4. CTA ไม่ชัดว่าต้องทำอะไรต่อ
5. คอนเทนต์ขายบ่อยเกินไปจนคนเลื่อนผ่าน

โพสต์ที่ดีไม่ใช่แค่โพสต์ถี่
แต่ต้องช่วยให้ลูกค้าเข้าใจว่าเราช่วยแก้ปัญหาอะไร

เซฟโพสต์นี้ไว้เช็กคอนเทนต์รอบหน้าได้เลย`,
    note: "สอดคล้องกับ positioning เพจที่ปรึกษา",
  },
  {
    time: "18:00",
    platform: "Facebook",
    product: "BM",
    contentType: "Carousel",
    type: "Educate",
    topic: "Checklist ตั้งค่า Business Manager ก่อนยิงจริง",
    creativeBrief: "Carousel checklist 6 ข้อ ใช้ไอคอน check ง่าย ๆ",
    caption: `ก่อนยิงแอดจริง ลองเช็ก BM ให้ครบก่อน

Checklist เบื้องต้น:
- มีผู้ดูแลหลักชัดเจน
- ตั้งค่าสิทธิ์ทีมเรียบร้อย
- ผูกเพจถูกต้อง
- บัญชีโฆษณาพร้อมใช้งาน
- วิธีชำระเงินพร้อม
- มีแผนสำรองถ้าเกิดปัญหา

การตั้งค่าดีตั้งแต่ต้น ช่วยลดปัญหาตอนต้องเร่งยอด

พิมพ์ "BM CHECK" ถ้าอยากได้ checklist ไว้เช็กเอง`,
    note: "Lead magnet แบบ checklist",
  },
  {
    time: "18:00",
    platform: "Facebook",
    product: "เพจ",
    contentType: "Single Image",
    type: "Trust",
    topic: "Before/After โครงหน้าเพจที่ดูพร้อมขายมากขึ้น",
    creativeBrief: "ภาพเดียวแบ่งครึ่ง ก่อน/หลัง: รูปปก, ข้อมูลเพจ, โพสต์, CTA",
    caption: `บางครั้งไม่ต้องเปลี่ยนทั้งเพจ
แค่จัดโครงให้ชัดขึ้น เพจก็ดูน่าเชื่อถือขึ้นได้

ก่อน:
- รูปปกไม่ชัด
- ข้อมูลเพจไม่ครบ
- โพสต์ไม่สื่อว่าเพจขายอะไร
- ไม่มี CTA ให้ลูกค้าทัก

หลัง:
- ภาพรวมเพจสื่อสารชัด
- ลูกค้ารู้ว่าต้องทักเรื่องอะไร
- หน้าเพจดูพร้อมขายมากขึ้น

ถ้าอยากรู้ว่าเพจคุณควรปรับตรงไหนก่อน
ส่งลิงก์เพจมาให้ทีมช่วยดูได้ครับ`,
    note: "ทำภาพ mockup ไม่ใช้ข้อมูลลูกค้าจริง",
  },
  {
    time: "18:00",
    platform: "Facebook",
    product: "รวมสินค้า",
    contentType: "บทความ",
    type: "Trust",
    topic: "สรุปท้ายเดือน: เดือนนี้ควรเช็กอะไรในเพจ แอด และ LINE OA",
    creativeBrief: "Cover บทความ checklist 3 หมวด: เพจ / แอด-BM / LINE OA",
    caption: `ก่อนจบเดือน ลองเช็ก 3 ระบบนี้

1. เพจ
เพจยังดูมีความเคลื่อนไหวไหม ข้อมูลครบไหม CTA ชัดไหม

2. แอด / BM
บัญชีโฆษณาและ BM ยังพร้อมใช้งานไหม มีจุดเสี่ยงอะไรที่ควรแก้ก่อนเพิ่มงบไหม

3. LINE OA
ลูกค้าที่ทักเข้ามา ถูกเก็บเข้าระบบแล้วหรือยัง มีแผนดูแลต่อไหม

ธุรกิจที่โตต่อได้ มักไม่ได้พึ่งแค่แอดอย่างเดียว
แต่มีระบบหลังบ้านที่ค่อย ๆ แข็งแรงขึ้นทุกเดือน

ถ้าอยากให้ทีมช่วยดูว่าควรเริ่มเช็กตรงไหนก่อน ทักมาได้ครับ`,
    note: "ปิดเดือนแบบ trust และชวนประเมินเคส",
  },
];

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error(`Invalid date: ${dateString}. Use YYYY-MM-DD.`);
  }
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function dateRange(startString, endString) {
  const start = parseDate(startString);
  const end = parseDate(endString);
  if (end < start) throw new Error("--end must be on or after --start");

  const dates = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

function dayName(dateString) {
  return THAI_DAYS[parseDate(dateString).getUTCDay()];
}

function weekGroup(dateString) {
  const d = parseDate(dateString);
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const week = Math.ceil(day / 7);
  return `สัปดาห์ ${week}/${month}`;
}

function withDate(template, dateString) {
  return {
    ...template,
    date: dateString,
    day: dayName(dateString),
    week: weekGroup(dateString),
    workday: ["อาทิตย์", "เสาร์"].includes(dayName(dateString)) ? "dayoff" : "workday",
  };
}

function isStoryTask(task) {
  return task.platform === "Facebook Story" || task.contentType.startsWith("Story");
}

function normalizeProduct(product) {
  return PRODUCT_ALIASES[product] ?? product;
}

function stripProductPrefix(topic) {
  return String(topic || "").replace(/^\[[^\]]+\]\s*/, "").trim();
}

function withProductPrefix(topic, product) {
  const normalizedProduct = normalizeProduct(product);
  const cleanTopic = stripProductPrefix(topic);
  if (!normalizedProduct || normalizedProduct === "-") return cleanTopic;
  return `[${normalizedProduct}] ${cleanTopic}`;
}

function normalizeTask(task) {
  const isMonthlyRoundup =
    stripProductPrefix(task.topic) === MONTHLY_INTRO_TASK.topic;
  const product = isMonthlyRoundup ? "ประจำเดือน" : normalizeProduct(task.product);
  return {
    ...task,
    product,
    topic: withProductPrefix(task.topic, product),
  };
}

function buildDefaultPlan(start, end, includeStories) {
  return BASE_PLAN
    .filter((item) => item.date >= start && item.date <= end)
    .filter((item) => includeStories || !isStoryTask(item))
    .map((item) => withDate(item, item.date));
}

function buildAutoPlan(start, end, includeStories) {
  const feedTemplates = [
    ...BASE_PLAN.filter(
      (item) => !item.skipInsert && item.platform === "Facebook" && !item.topic.startsWith("เริ่มต้นเดือนนี้")
    ),
    ...EXTRA_FEED_TEMPLATES,
  ];
  const storyTemplates = BASE_PLAN.filter(
    (item) => !item.skipInsert && item.platform === "Facebook Story"
  );

  let feedIndex = 0;
  let storyIndex = 0;
  return dateRange(start, end)
    .map((date) => {
      const dow = date.getUTCDay();
      const dateString = formatDate(date);
      const dayOfMonth = date.getUTCDate();
      if (dayOfMonth === 1) {
        return withDate(MONTHLY_INTRO_TASK, dateString);
      }
      if ([1, 2, 4, 5].includes(dow)) {
        const task = feedTemplates[feedIndex % feedTemplates.length];
        feedIndex += 1;
        return withDate(task, dateString);
      }
      if (includeStories && [3, 6].includes(dow)) {
        const task = storyTemplates[storyIndex % storyTemplates.length];
        storyIndex += 1;
        return withDate(task, dateString);
      }
      return null;
    })
    .filter(Boolean);
}

function buildTasks({ start, end, auto, includeStories }) {
  const tasks = auto || start !== DEFAULT_START || end !== DEFAULT_END
    ? buildAutoPlan(start, end, includeStories)
    : buildDefaultPlan(start, end, includeStories);

  return tasks.filter((task) => !task.skipInsert).map(normalizeTask);
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(tasks, owner) {
  const rows = tasks.map((task) => [
    task.week,
    task.date,
    task.date,
    task.date,
    task.day,
    task.time,
    task.workday,
    task.platform,
    task.product,
    task.topic,
    task.contentType,
    "เขียนสคริปต์",
    "ยังไม่ได้โพสต์",
    "Pending",
    owner,
    task.caption,
    task.creativeBrief,
    task.note,
    "",
    "",
    "",
  ]);

  return [
    CSV_HEADERS.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ].join("\r\n");
}

function toMarkdown(tasks, { start, end, owner }) {
  const rows = tasks.map((task) => (
    `| ${task.date} | ${task.day} | ${task.time} | ${task.contentType} | ${task.product} | ${task.topic} | ${task.type} |`
  ));

  const details = tasks.map((task, index) => `### ${index + 1}. ${task.date} — ${task.topic}

- Platform: ${task.platform}
- Product: ${task.product}
- Content type: ${task.contentType}
- Owner: ${owner}
- Progress: เขียนสคริปต์
- Post status: ยังไม่ได้โพสต์
- Creative brief: ${task.creativeBrief}
- Note: ${task.note}
- Caption draft:

${task.caption || "-"}
`).join("\n");

  return `# Content Calendar — Metaverse Resolution

ช่วงเวลา: ${start} ถึง ${end}
แนวทาง: No video / Soft sell / Static-first
ผู้รับผิดชอบเริ่มต้น: ${owner}

## ตารางภาพรวม

| วันที่ | วัน | เวลา | Format | Product | หัวข้อ | Type |
|---|---|---:|---|---|---|---|
${rows.join("\n")}

## รายละเอียดพร้อมกรอก

${details}
`;
}

function toJson(tasks, owner) {
  return JSON.stringify(
    tasks.map((task) => ({
      week_group: task.week,
      start_date: task.date,
      due_date: task.date,
      scheduled_date: task.date,
      day_name: task.day,
      post_time: task.time || null,
      workday_status: task.workday,
      platform: task.platform,
      product: task.product,
      topic: task.topic,
      content_type: task.contentType,
      progress_status: "writing_script",
      post_status: "not_posted",
      owner: owner,
      caption: task.caption || null,
      creative_brief: task.creativeBrief,
      file_url: null,
      note: task.note,
      approval_status: "pending",
    })),
    null,
    2
  );
}

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  const env = {};
  if (!fs.existsSync(envPath)) return env;

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2] || "";
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value.trim();
  }
  return env;
}

async function insertTasks(tasks, ownerName) {
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: owner } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("full_name", ownerName)
    .maybeSingle();

  let inserted = 0;
  let skipped = 0;

  for (const task of tasks) {
    const { data: sameDateTasks, error: findError } = await supabase
      .from("content_tasks")
      .select("id, topic")
      .eq("scheduled_date", task.date)
      .order("created_at", { ascending: true });

    if (findError) throw findError;
    const existing = sameDateTasks?.find((row) => (
      stripProductPrefix(row.topic) === stripProductPrefix(task.topic)
    ));
    if (existing) {
      skipped += 1;
      continue;
    }

    const insert = {
      week_group: task.week,
      start_date: task.date,
      due_date: task.date,
      scheduled_date: task.date,
      day_name: task.day,
      post_time: task.time || null,
      workday_status: task.workday,
      platform: task.platform,
      product: task.product,
      topic: task.topic,
      content_type: task.contentType,
      progress_status: "writing_script",
      post_status: "not_posted",
      owner_id: owner?.id ?? null,
      caption: task.caption || null,
      creative_brief: task.creativeBrief,
      file_url: null,
      posted_url_tiktok: null,
      posted_url_youtube: null,
      posted_url_ig: null,
      posted_url_fb: null,
      note: task.note,
      approval_status: "pending",
      created_by: owner?.id ?? null,
    };

    const { error: insertError } = await supabase
      .from("content_tasks")
      .insert(insert);

    if (insertError) throw insertError;
    inserted += 1;
  }

  return { inserted, skipped, ownerFound: Boolean(owner) };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const start = String(args.start || DEFAULT_START);
  const end = String(args.end || DEFAULT_END);
  const owner = String(args.owner || DEFAULT_OWNER);
  const outDir = path.resolve(String(args.out || DEFAULT_OUT_DIR));
  const prefix = String(args.prefix || `metaverse-content-${start}-to-${end}`);
  const auto = Boolean(args.auto);
  const includeStories = Boolean(args["include-stories"]);

  const tasks = buildTasks({ start, end, auto, includeStories });
  fs.mkdirSync(outDir, { recursive: true });

  const mdPath = path.join(outDir, `${prefix}.md`);
  const csvPath = path.join(outDir, `${prefix}.csv`);
  const jsonPath = path.join(outDir, `${prefix}.json`);

  fs.writeFileSync(mdPath, toMarkdown(tasks, { start, end, owner }), "utf8");
  fs.writeFileSync(csvPath, `\uFEFF${toCsv(tasks, owner)}`, "utf8");
  fs.writeFileSync(jsonPath, toJson(tasks, owner), "utf8");

  console.log(`Generated ${tasks.length} content tasks`);
  console.log(`Markdown: ${mdPath}`);
  console.log(`CSV:      ${csvPath}`);
  console.log(`JSON:     ${jsonPath}`);

  if (args.insert) {
    const result = await insertTasks(tasks, owner);
    console.log(`Supabase insert: ${result.inserted} inserted, ${result.skipped} skipped`);
    if (!result.ownerFound) {
      console.log(`Owner "${owner}" was not found in profiles, so owner_id was left empty.`);
    }
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
