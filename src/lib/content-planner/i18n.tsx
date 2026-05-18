"use client";
import * as React from "react";
import type {
  ApprovalStatus,
  PostStatus,
  ProgressStatus,
} from "./types";

export type Lang = "th" | "en";

const STORAGE_KEY = "cp_lang";

type Dict = Record<string, string>;

const TRANSLATIONS: Record<Lang, Dict> = {
  th: {
    // common
    "common.welcome_back": "ยินดีต้อนรับกลับ,",
    "common.sign_out": "ออกจากระบบ",
    "common.guest": "ผู้เยี่ยมชม",
    "common.mock_store": "Mock store",
    "common.offline": "ออฟไลน์",
    "common.view_as": "ดูในมุมมองของ",
    "common.reset": "รีเซ็ต",
    "common.reset_confirm": "รีเซ็ตข้อมูลทั้งหมดเป็นค่าเริ่มต้น?",
    "common.cancel": "ยกเลิก",
    "common.send": "ส่ง",
    "common.open": "เปิด",
    "common.no_value": "—",
    "common.language": "ภาษา",

    // sidebar
    "sidebar.app_name": "Content Planner",
    "sidebar.tagline": "ระบบจัดการคอนเทนต์การตลาด",
    "sidebar.dashboard": "แดชบอร์ด",
    "sidebar.planner": "Content Planner",
    "sidebar.calendar": "ปฏิทิน",

    // dashboard
    "dashboard.title": "แดชบอร์ด",
    "dashboard.subtitle": "ภาพรวมการผลิตคอนเทนต์แบบเรียลไทม์",
    "dashboard.quick_add": "เพิ่มด่วน",
    "dashboard.total_tasks": "งานทั้งหมด",
    "dashboard.in_progress": "กำลังดำเนินการ",
    "dashboard.posted": "โพสต์แล้ว",
    "dashboard.pending_approval": "รออนุมัติ",
    "dashboard.upcoming_posts": "โพสต์ที่จะถึง",
    "dashboard.upcoming_subtitle": "งานที่กำหนดวันโพสต์ตั้งแต่วันนี้เป็นต้นไป",
    "dashboard.view_all": "ดูทั้งหมด →",
    "dashboard.nothing_scheduled": "ยังไม่มีงานในตาราง เพิ่มงานใหม่เพื่อเริ่มต้น",
    "dashboard.recent_activity": "กิจกรรมล่าสุด",
    "dashboard.recent_activity_subtitle": "ทีมของคุณกำลังทำอะไรอยู่",
    "dashboard.no_activity": "ยังไม่มีกิจกรรม",

    // planner
    "planner.title": "Content Planner",
    "planner.subtitle": "จัดการคอนเทนต์ของคุณเหมือนสเปรดชีต",
    "planner.new_task": "เพิ่มงานใหม่",
    "planner.search_topic": "ค้นหาหัวข้อ…",
    "planner.all_months": "ทุกเดือน",
    "planner.all_weeks": "ทุกสัปดาห์",
    "planner.all_platforms": "ทุกแพลตฟอร์ม",
    "planner.all_products": "ทุกสินค้า",
    "planner.all_owners": "ทุกผู้รับผิดชอบ",
    "planner.all_progress": "ทุกความคืบหน้า",
    "planner.all_post_status": "ทุกสถานะการโพสต์",
    "planner.no_match": "ไม่พบงานที่ตรงกับตัวกรอง",
    "planner.delete_confirm": "ลบงานนี้?",

    // export menu
    "export.button": "ดาวน์โหลด CSV",
    "export.last_7": "7 วันย้อนหลัง",
    "export.last_30": "30 วันย้อนหลัง",
    "export.last_90": "90 วันย้อนหลัง",
    "export.select_month": "เลือกเดือน",
    "export.download_month": "ดาวน์โหลดเดือนนี้",

    // table headers
    "table.week": "สัปดาห์",
    "table.date": "วันที่",
    "table.day": "วัน",
    "table.time": "เวลา",
    "table.workday": "วันทำงาน",
    "table.platform": "แพลตฟอร์ม",
    "table.product": "สินค้า",
    "table.topic": "หัวข้อ",
    "table.type": "ประเภท",
    "table.progress": "ความคืบหน้า",
    "table.post": "การโพสต์",
    "table.approval": "อนุมัติ",
    "table.owner": "ผู้รับผิดชอบ",
    "table.file": "ไฟล์",
    "table.note": "หมายเหตุ",
    "table.updated": "อัปเดต",

    // task modal
    "modal.new_task": "เพิ่มงานคอนเทนต์ใหม่",
    "modal.edit_task": "แก้ไขงานคอนเทนต์",
    "modal.topic_label": "หัวข้อคอนเทนต์ *",
    "modal.topic_placeholder": "เช่น ปัญหาบัญชีโฆษณาติดลิมิต",
    "modal.topic_required": "กรุณากรอกหัวข้อ",
    "modal.start_date": "กำหนดเริ่มงาน",
    "modal.due_date": "กำหนดส่งงาน (ไม่เกินวันที่)",
    "modal.due_before_start": "วันส่งต้องไม่ก่อนวันเริ่มงาน",
    "modal.scheduled_date": "วันที่โพสต์",
    "modal.post_time": "เวลาโพสต์",
    "modal.platform": "แพลตฟอร์ม",
    "modal.product": "สินค้า",
    "modal.content_type": "ประเภทคอนเทนต์",
    "modal.content_type_placeholder": "Reels, Carousel, Single Image…",
    "content_type.vdo": "วิดีโอ (vdo)",
    "content_type.image": "รูปภาพ (image)",
    "content_type.image_vdo": "รูปภาพ + วิดีโอ (image/vdo)",
    "content_type.article": "บทความ",
    "modal.owner": "ผู้รับผิดชอบ",
    "modal.progress_status": "ความคืบหน้า",
    "modal.post_status": "สถานะการโพสต์",
    "modal.workday": "ประเภทวัน",
    "modal.workday_workday": "วันทำงาน",
    "modal.workday_dayoff": "วันหยุด",
    "modal.workday_holiday": "วันหยุดนักขัตฤกษ์",
    "modal.file_url": "ลิงก์ไฟล์ / asset",
    "modal.posted_urls": "ลิงก์โพสต์ที่เผยแพร่แล้ว (สำหรับติดตามย้อนหลัง)",
    "modal.caption": "ร่างแคปชั่น",
    "modal.creative_brief": "บรีฟคอนเทนต์",
    "modal.note": "หมายเหตุ",
    "modal.create": "สร้างงาน",
    "modal.save": "บันทึกการแก้ไข",
    "modal.saving": "กำลังบันทึก…",

    // detail modal
    "detail.status": "สถานะ",
    "detail.progress": "ความคืบหน้า",
    "detail.post_status": "สถานะการโพสต์",
    "detail.no_permission_status": "คุณไม่มีสิทธิ์แก้ไขสถานะ",
    "detail.approval": "การอนุมัติ",
    "detail.approve": "อนุมัติ",
    "detail.request_edits": "ขอแก้ไข",
    "detail.reject": "ปฏิเสธ",
    "detail.no_permission_approval": "เฉพาะผู้จัดการเท่านั้นที่เปลี่ยนสถานะอนุมัติได้",
    "detail.activity": "กิจกรรม",
    "detail.no_activity": "ยังไม่มีกิจกรรม",
    "detail.comments": "ความคิดเห็น",
    "detail.write_comment": "เขียนความคิดเห็น…",
    "detail.be_first": "เป็นคนแรกที่แสดงความคิดเห็น",
    "detail.no_caption": "ยังไม่มีร่างแคปชั่น",
    "detail.no_brief": "ยังไม่มีบรีฟคอนเทนต์",
    "detail.field.date": "วันที่",
    "detail.field.day": "วัน",
    "detail.field.post_time": "เวลาโพสต์",
    "detail.field.week": "สัปดาห์",
    "detail.field.start_date": "เริ่มงาน",
    "detail.field.due_date": "กำหนดส่ง",
    "detail.field.owner": "ผู้รับผิดชอบ",
    "detail.field.workday": "ประเภทวัน",
    "detail.field.last_updated": "อัปเดตล่าสุด",
    "detail.field.file": "ไฟล์",
    "detail.section.caption": "ร่างแคปชั่น",
    "detail.section.brief": "บรีฟคอนเทนต์",
    "detail.section.note": "หมายเหตุ",
    "detail.section.posted_urls": "ลิงก์โพสต์ที่เผยแพร่",

    // calendar
    "calendar.title": "ปฏิทิน",
    "calendar.subtitle": "ดูภาพรวมว่าคอนเทนต์จะออนไลน์เมื่อไหร่",
    "calendar.today": "วันนี้",
    "calendar.day.mon": "จ.",
    "calendar.day.tue": "อ.",
    "calendar.day.wed": "พ.",
    "calendar.day.thu": "พฤ.",
    "calendar.day.fri": "ศ.",
    "calendar.day.sat": "ส.",
    "calendar.day.sun": "อา.",
    "calendar.more": "+{n} เพิ่มเติม",

    // roles
    "role.admin": "Admin",
    "role.manager": "ผู้จัดการ",
    "role.creator": "ครีเอเตอร์",
    "role.viewer": "ผู้ชม",
  },
  en: {
    "common.welcome_back": "Welcome back,",
    "common.sign_out": "Sign out",
    "common.guest": "Guest",
    "common.mock_store": "Mock store",
    "common.offline": "Offline",
    "common.view_as": "View as",
    "common.reset": "Reset",
    "common.reset_confirm": "Reset all data to seed?",
    "common.cancel": "Cancel",
    "common.send": "Send",
    "common.open": "Open",
    "common.no_value": "—",
    "common.language": "Language",

    "sidebar.app_name": "Content Planner",
    "sidebar.tagline": "Marketing workspace",
    "sidebar.dashboard": "Dashboard",
    "sidebar.planner": "Content Planner",
    "sidebar.calendar": "Calendar",

    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Realtime overview of your content production",
    "dashboard.quick_add": "Quick add",
    "dashboard.total_tasks": "Total tasks",
    "dashboard.in_progress": "In progress",
    "dashboard.posted": "Posted",
    "dashboard.pending_approval": "Pending approval",
    "dashboard.upcoming_posts": "Upcoming posts",
    "dashboard.upcoming_subtitle": "Tasks scheduled for today and beyond",
    "dashboard.view_all": "View all →",
    "dashboard.nothing_scheduled": "Nothing scheduled. Add a task to get started.",
    "dashboard.recent_activity": "Recent activity",
    "dashboard.recent_activity_subtitle": "What your team is doing",
    "dashboard.no_activity": "No activity yet.",

    "planner.title": "Content Planner",
    "planner.subtitle": "Manage your content pipeline like a pro spreadsheet",
    "planner.new_task": "New task",
    "planner.search_topic": "Search topic…",
    "planner.all_months": "All months",
    "planner.all_weeks": "All weeks",
    "planner.all_platforms": "All platforms",
    "planner.all_products": "All products",
    "planner.all_owners": "All owners",
    "planner.all_progress": "All progress",
    "planner.all_post_status": "All post status",
    "planner.no_match": "No tasks match your filters.",
    "planner.delete_confirm": "Delete this task?",

    "export.button": "Download CSV",
    "export.last_7": "Last 7 days",
    "export.last_30": "Last 30 days",
    "export.last_90": "Last 90 days",
    "export.select_month": "Select month",
    "export.download_month": "Download this month",

    "table.week": "Week",
    "table.date": "Date",
    "table.day": "Day",
    "table.time": "Time",
    "table.workday": "Workday",
    "table.platform": "Platform",
    "table.product": "Product",
    "table.topic": "Topic",
    "table.type": "Type",
    "table.progress": "Progress",
    "table.post": "Post",
    "table.approval": "Approval",
    "table.owner": "Owner",
    "table.file": "File",
    "table.note": "Note",
    "table.updated": "Updated",

    "modal.new_task": "New content task",
    "modal.edit_task": "Edit content task",
    "modal.topic_label": "Content topic *",
    "modal.topic_placeholder": "e.g. Ad account limit problem",
    "modal.topic_required": "Topic is required",
    "modal.start_date": "Start date",
    "modal.due_date": "Due date (no later than)",
    "modal.due_before_start": "Due date cannot be before start date",
    "modal.scheduled_date": "Scheduled date",
    "modal.post_time": "Post time",
    "modal.platform": "Platform",
    "modal.product": "Product",
    "modal.content_type": "Content type",
    "modal.content_type_placeholder": "Reels, Carousel, Single Image…",
    "content_type.vdo": "Video (vdo)",
    "content_type.image": "Image",
    "content_type.image_vdo": "Image + Video",
    "content_type.article": "Article",
    "modal.owner": "Owner",
    "modal.progress_status": "Progress status",
    "modal.post_status": "Post status",
    "modal.workday": "Workday",
    "modal.workday_workday": "Workday",
    "modal.workday_dayoff": "Day off",
    "modal.workday_holiday": "Holiday",
    "modal.file_url": "File / asset link",
    "modal.posted_urls": "Posted URLs (for tracking later)",
    "modal.caption": "Caption draft",
    "modal.creative_brief": "Creative brief",
    "modal.note": "Note",
    "modal.create": "Create task",
    "modal.save": "Save changes",
    "modal.saving": "Saving…",

    "detail.status": "Status",
    "detail.progress": "Progress",
    "detail.post_status": "Post status",
    "detail.no_permission_status": "You don't have permission to edit status.",
    "detail.approval": "Approval",
    "detail.approve": "Approve",
    "detail.request_edits": "Request edits",
    "detail.reject": "Reject",
    "detail.no_permission_approval": "Only managers can change approval status.",
    "detail.activity": "Activity",
    "detail.no_activity": "No activity yet.",
    "detail.comments": "Comments",
    "detail.write_comment": "Write a comment…",
    "detail.be_first": "Be the first to comment.",
    "detail.no_caption": "No caption yet.",
    "detail.no_brief": "No brief yet.",
    "detail.field.date": "Date",
    "detail.field.day": "Day",
    "detail.field.post_time": "Post time",
    "detail.field.week": "Week",
    "detail.field.start_date": "Start",
    "detail.field.due_date": "Due",
    "detail.field.owner": "Owner",
    "detail.field.workday": "Workday",
    "detail.field.last_updated": "Last updated",
    "detail.field.file": "File",
    "detail.section.caption": "Caption draft",
    "detail.section.brief": "Creative brief",
    "detail.section.note": "Note",
    "detail.section.posted_urls": "Posted URLs",

    "calendar.title": "Calendar",
    "calendar.subtitle": "Visualize when your content goes live",
    "calendar.today": "Today",
    "calendar.day.mon": "Mon",
    "calendar.day.tue": "Tue",
    "calendar.day.wed": "Wed",
    "calendar.day.thu": "Thu",
    "calendar.day.fri": "Fri",
    "calendar.day.sat": "Sat",
    "calendar.day.sun": "Sun",
    "calendar.more": "+{n} more",

    "role.admin": "Admin",
    "role.manager": "Manager",
    "role.creator": "Creator",
    "role.viewer": "Viewer",
  },
};

// Status labels per language (data-level translations)
export const PROGRESS_LABELS: Record<Lang, Record<ProgressStatus, string>> = {
  th: {
    none: "-",
    thinking_topic: "💡 กำลังคิดหัวข้อ",
    writing_script: "📝 เขียนสคริปต์",
    filming: "🎬 กำลังถ่ายทำ",
    editing: "✂️ กำลังตัดต่อ",
    ready_to_post: "✅ พร้อมโพสต์",
    waiting_comment: "💬 รอคอมเม้น",
  },
  en: {
    none: "-",
    thinking_topic: "💡 Brainstorming",
    writing_script: "📝 Writing script",
    filming: "🎬 Filming",
    editing: "✂️ Editing",
    ready_to_post: "✅ Ready to post",
    waiting_comment: "💬 Awaiting feedback",
  },
};

export const POST_LABELS: Record<Lang, Record<PostStatus, string>> = {
  th: {
    none: "-",
    posted: "✅ โพสต์แล้ว",
    not_posted: "❌ ยังไม่ได้โพสต์",
    auto_post: "🤖 ออโต้โพสต์",
  },
  en: {
    none: "-",
    posted: "✅ Posted",
    not_posted: "❌ Not posted",
    auto_post: "🤖 Auto-post",
  },
};

export const APPROVAL_LABELS: Record<Lang, Record<ApprovalStatus, string>> = {
  th: {
    pending: "รออนุมัติ",
    approved: "อนุมัติแล้ว",
    needs_edits: "ต้องแก้ไข",
    rejected: "ปฏิเสธ",
  },
  en: {
    pending: "Pending",
    approved: "Approved",
    needs_edits: "Needs edits",
    rejected: "Rejected",
  },
};

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LangContext = React.createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("th");

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "th" || saved === "en") setLangState(saved);
    } catch {
      // ignore
    }
  }, []);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const t = React.useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let s = TRANSLATIONS[lang][key] ?? TRANSLATIONS.th[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.replace(`{${k}}`, String(v));
        }
      }
      return s;
    },
    [lang]
  );

  const value = React.useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = React.useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

export function useT() {
  return useLang().t;
}

export function useProgressOptions() {
  const { lang } = useLang();
  return React.useMemo(
    () =>
      (Object.keys(PROGRESS_LABELS[lang]) as ProgressStatus[]).map((value) => ({
        value,
        label: PROGRESS_LABELS[lang][value],
      })),
    [lang]
  );
}

export function usePostOptions() {
  const { lang } = useLang();
  return React.useMemo(
    () =>
      (Object.keys(POST_LABELS[lang]) as PostStatus[]).map((value) => ({
        value,
        label: POST_LABELS[lang][value],
      })),
    [lang]
  );
}

export function useApprovalOptions() {
  const { lang } = useLang();
  return React.useMemo(
    () =>
      (Object.keys(APPROVAL_LABELS[lang]) as ApprovalStatus[]).map((value) => ({
        value,
        label: APPROVAL_LABELS[lang][value],
      })),
    [lang]
  );
}

export function useProgressLabel(value: ProgressStatus) {
  const { lang } = useLang();
  return PROGRESS_LABELS[lang][value] ?? value;
}

export function usePostLabel(value: PostStatus) {
  const { lang } = useLang();
  return POST_LABELS[lang][value] ?? value;
}

export function useApprovalLabel(value: ApprovalStatus) {
  const { lang } = useLang();
  return APPROVAL_LABELS[lang][value] ?? value;
}
