"use client";
import * as React from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import type {
  ApprovalStatus,
  PostStatus,
  ProgressStatus,
} from "./types";

export type Lang = "th" | "en";



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
    "common.download": "ดาวน์โหลด",
    "common.downloading": "กำลังดาวน์โหลด…",
    "common.edit": "แก้ไข",
    "common.delete": "ลบ",
    "common.no_value": "—",
    "common.language": "ภาษา",
    "common.preview_unavailable": "ยังดูตัวอย่างไม่ได้",
    "dev.role": "Dev role",
    "dev.role_switch": "สลับ role เฉพาะโหมด Dev",
    "dev.real_role": "จริง: {role}",

    // sidebar
    "sidebar.app_name": "Content Planner",
    "sidebar.tagline": "ระบบจัดการคอนเทนต์การตลาด",
    "sidebar.dashboard": "แดชบอร์ด",
    "sidebar.planner": "Content Planner",
    "sidebar.review": "ตรวจงาน",
    "sidebar.calendar": "ปฏิทิน",

    // dashboard
    "dashboard.title": "แดชบอร์ด",
    "dashboard.subtitle": "ภาพรวมการผลิตคอนเทนต์แบบเรียลไทม์",
    "dashboard.quick_add": "เพิ่มด่วน",
    "dashboard.total_tasks": "งานทั้งหมด",
    "dashboard.in_progress": "กำลังดำเนินการ",
    "dashboard.posted": "โพสต์แล้ว",
    "dashboard.pending_approval": "รออนุมัติ",
    "dashboard.range_today": "วันนี้",
    "dashboard.range_week": "1 สัปดาห์",
    "dashboard.range_month": "30 วัน",
    "dashboard.range_showing": "กำลังแสดง",
    "dashboard.upcoming_posts": "โพสต์ที่จะถึง",
    "dashboard.upcoming_subtitle": "งานที่กำหนดวันโพสต์ในช่วงที่เลือก",
    "dashboard.view_all": "ดูทั้งหมด →",
    "dashboard.nothing_scheduled": "ยังไม่มีงานในตาราง เพิ่มงานใหม่เพื่อเริ่มต้น",
    "dashboard.recent_activity": "กิจกรรมล่าสุด",
    "dashboard.recent_activity_subtitle": "ทีมของคุณกำลังทำอะไรอยู่",
    "dashboard.no_activity": "ยังไม่มีกิจกรรม",
    "dashboard.sort_by_due_date": "ตามกำหนดเวลา 📅",
    "dashboard.sort_by_smart": "จัดลำดับด่วน/เสร็จไว 🧠",
    "priority.critical": "🔥 ด่วนที่สุด",
    "priority.quick_urgent": "⚡ งานด่วนเสร็จไว",
    "priority.quick_win": "💡 ทำง่ายเสร็จไว",
    "priority.scheduled": "📅 ตามกำหนดการ",

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
    "planner.select_month": "เลือกเดือน",
    "planner.previous_month": "เดือนก่อนหน้า",
    "planner.next_month": "เดือนถัดไป",
    "planner.current_month": "เดือนนี้",
    "planner.no_match": "ไม่พบงานที่ตรงกับตัวกรอง",
    "planner.delete_confirm": "ลบงานนี้?",
    "planner.delete_failed": "ลบไม่สำเร็จ",
    "planner.update_failed": "อัปเดตไม่สำเร็จ",

    // review queue
    "review.title": "ตรวจงาน",
    "review.subtitle": "รวมงานที่ส่งตรวจ ขอแก้ไข อนุมัติแล้ว และพร้อมให้ทีมรับไม้ต่อ",
    "review.pending": "รอตรวจ",
    "review.needs_edits": "ขอแก้ไข",
    "review.approved": "อนุมัติแล้ว",
    "review.ready_post": "พร้อมโพสต์",
    "review.all": "ทั้งหมด",
    "review.empty": "ยังไม่มีงานในคิวนี้",
    "review.no_assets": "ยังไม่มีรูปหรือไฟล์ผลงาน",
    "review.assets": "ผลงาน",
    "review.latest_submission": "หลักฐานส่งตรวจล่าสุด",
    "review.no_submission": "ยังไม่มีหลักฐานส่งตรวจ",
    "review.open_detail": "เปิดรายละเอียด",
    "review.round": "รอบที่ {n}",
    "review.submitted_by": "ส่งโดย {name}",
    "review.waiting_handoff": "รอคนรับไม้ต่อ",
    "review.manager_queue": "คิวผู้จัดการ",
    "review.manager_decision": "ตรวจและตัดสินใจ",
    "review.manager_decision_hint": "อนุมัติได้ทันที หรือระบุสิ่งที่ต้องแก้ก่อนส่งกลับ",
    "review.manager_only": "ผู้จัดการ",
    "review.confirm_request_edits": "ยืนยันขอแก้ไข",
    "review.request_edits_title": "ขอแก้ไขงานนี้",
    "review.request_edits_description": "ใส่คอมเมนต์ให้ทีมเห็นหลักฐานได้ หรือเว้นว่างไว้ถ้าคุยกันเรียบร้อยแล้ว",
    "review.optional_feedback": "คอมเมนต์สำหรับทีม (ไม่บังคับ)",
    "review.optional_feedback_hint": "เว้นว่างแล้วกดยืนยันได้ หากแจ้งรายละเอียดกันทางอื่นแล้ว",

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
    "modal.file_url": "ลิงก์ไฟล์ / asset (ใส่หลายลิงก์ได้)",
    "modal.upload_assets_title": "อัปโหลดรูปเข้าระบบ",
    "modal.upload_assets_hint": "ระบบจะแปลงรูปเป็น WebP เติมลิงก์ให้อัตโนมัติ และเก็บไฟล์ไว้ 3 เดือนก่อนลบเพื่อประหยัดพื้นที่",
    "modal.upload_images": "อัปโหลดรูป",
    "modal.uploading": "กำลังอัปโหลด…",
    "modal.upload_converting": "กำลังแปลงรูปเป็น WebP…",
    "modal.upload_progress": "กำลังอัปโหลด {current}/{total}",
    "modal.upload_success": "อัปโหลดสำเร็จ {n} รูป",
    "modal.upload_failed": "อัปโหลดรูปไม่สำเร็จ",
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
    "detail.saving_status": "กำลังบันทึกสถานะ…",
    "detail.no_permission_status": "คุณไม่มีสิทธิ์แก้ไขสถานะ",
    "detail.approval": "การอนุมัติ",
    "detail.approve": "อนุมัติ",
    "detail.request_edits": "ขอแก้ไข",
    "detail.reject": "ปฏิเสธ",
    "detail.approving": "กำลังดำเนินการ…",
    "detail.approved_success": "✅ อนุมัติเรียบร้อยแล้ว!",
    "detail.needs_edits_success": "📝 ส่งคำขอแก้ไขเรียบร้อยแล้ว!",
    "detail.rejected_success": "❌ ปฏิเสธงานเรียบร้อยแล้ว",
    "detail.no_permission_approval": "เฉพาะผู้จัดการเท่านั้นที่เปลี่ยนสถานะอนุมัติได้",
    "detail.review_workflow": "ส่งตรวจ",
    "detail.submit_review": "ส่งตรวจงาน",
    "detail.sending_review": "กำลังส่งตรวจ…",
    "detail.review_submitted_success": "ส่งตรวจและบันทึกหลักฐานแล้ว",
    "detail.submit_review_hint": "ระบบจะบันทึก snapshot ของแคปชั่น บรีฟ ไฟล์ และหมายเหตุ ณ ตอนส่งตรวจ",
    "detail.review_evidence": "หลักฐานการส่งตรวจ",
    "detail.asset_preview": "ผลงานสำหรับตรวจ",
    "detail.no_review_evidence": "ยังไม่มีหลักฐานส่งตรวจในระบบ",
    "detail.review_round": "ส่งตรวจรอบที่ {n}",
    "detail.review_feedback": "ฟีดแบ็กการตรวจ",
    "detail.review_feedback_placeholder": "เขียนเหตุผลหรือสิ่งที่ต้องแก้ เพื่อให้คนรับไม้ต่อเห็นหลักฐานครบ",
    "detail.feedback_required": "กรุณาเขียนฟีดแบ็กก่อนขอแก้ไขหรือปฏิเสธ",
    "detail.handoff": "รับไม้ต่อ",
    "detail.claim_edit": "รับไปแก้ไข",
    "detail.claim_post": "รับไปโพสต์",
    "detail.claiming": "กำลังบันทึก…",
    "detail.claimed_success": "บันทึกการรับไม้ต่อแล้ว",
    "detail.activity": "กิจกรรม",
    "detail.no_activity": "ยังไม่มีกิจกรรม",
    "activity.task_created": "สร้างงานใหม่",
    "activity.task_updated": "อัปเดตข้อมูลงาน",
    "activity.task_deleted": "ลบงาน",
    "activity.comment_added": "เพิ่มความคิดเห็น",
    "activity.review_submitted": "ส่งงานเข้าตรวจ",
    "activity.handoff_claimed": "รับไม้ต่องานนี้",
    "activity.approval_pending": "ตั้งสถานะเป็นรออนุมัติ",
    "activity.approval_approved": "อนุมัติงาน",
    "activity.approval_needs_edits": "ส่งคำขอแก้ไขงาน",
    "activity.approval_rejected": "ปฏิเสธงาน",
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
    "calendar.day.mon": "จันทร์",
    "calendar.day.tue": "อังคาร",
    "calendar.day.wed": "พุธ",
    "calendar.day.thu": "พฤหัสบดี",
    "calendar.day.fri": "ศุกร์",
    "calendar.day.sat": "เสาร์",
    "calendar.day.sun": "อาทิตย์",
    "calendar.more": "+{n} เพิ่มเติม",
    "calendar.no_tasks_month": "ยังไม่มีคอนเทนต์ในเดือนนี้",
    "calendar.tasks_count": "{n} งาน",

    // roles
    "role.admin": "Admin",
    "role.manager": "ผู้จัดการ",
    "role.creator": "ครีเอเตอร์",
    "role.viewer": "ผู้ชม",

    // login
    "login.welcome_back": "ยินดีต้อนรับกลับ",
    "login.create_account": "สร้างบัญชีใหม่",
    "login.signin_subtitle": "เข้าสู่ระบบเพื่อจัดการแผนงานคอนเทนต์ของคุณ",
    "login.signup_subtitle": "เริ่มต้นวางแผนงานคอนเทนต์ร่วมกับทีมของคุณ",
    "login.full_name": "ชื่อ-นามสกุล",
    "login.email": "อีเมล",
    "login.password": "รหัสผ่าน",
    "login.signin": "เข้าสู่ระบบ",
    "login.new_here": "ผู้ใช้ใหม่ใช่ไหม?",
    "login.already_have_account": "มีบัญชีอยู่แล้ว?",
    "login.please_wait": "โปรดรอสักครู่…",
    "login.auth_failed": "การตรวจสอบสิทธิ์ล้มเหลว",
    "login.check_email": "ตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี จากนั้นเข้าสู่ระบบ",
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
    "common.download": "Download",
    "common.downloading": "Downloading…",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.no_value": "—",
    "common.language": "Language",
    "common.preview_unavailable": "Preview unavailable",
    "dev.role": "Dev role",
    "dev.role_switch": "Switch role in development only",
    "dev.real_role": "Real: {role}",

    "sidebar.app_name": "Content Planner",
    "sidebar.tagline": "Marketing workspace",
    "sidebar.dashboard": "Dashboard",
    "sidebar.planner": "Content Planner",
    "sidebar.review": "Review",
    "sidebar.calendar": "Calendar",

    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Realtime overview of your content production",
    "dashboard.quick_add": "Quick add",
    "dashboard.total_tasks": "Total tasks",
    "dashboard.in_progress": "In progress",
    "dashboard.posted": "Posted",
    "dashboard.pending_approval": "Pending approval",
    "dashboard.range_today": "Today",
    "dashboard.range_week": "1 week",
    "dashboard.range_month": "30 days",
    "dashboard.range_showing": "Showing",
    "dashboard.upcoming_posts": "Upcoming posts",
    "dashboard.upcoming_subtitle": "Tasks scheduled in the selected range",
    "dashboard.view_all": "View all →",
    "dashboard.nothing_scheduled": "Nothing scheduled. Add a task to get started.",
    "dashboard.recent_activity": "Recent activity",
    "dashboard.recent_activity_subtitle": "What your team is doing",
    "dashboard.no_activity": "No activity yet.",
    "dashboard.sort_by_due_date": "By Due Date 📅",
    "dashboard.sort_by_smart": "Smart Priority 🧠",
    "priority.critical": "🔥 Critical Urgent",
    "priority.quick_urgent": "⚡ Quick Urgent Win",
    "priority.quick_win": "💡 Quick Win",
    "priority.scheduled": "📅 Scheduled",

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
    "planner.select_month": "Select month",
    "planner.previous_month": "Previous month",
    "planner.next_month": "Next month",
    "planner.current_month": "This month",
    "planner.no_match": "No tasks match your filters.",
    "planner.delete_confirm": "Delete this task?",
    "planner.delete_failed": "Delete failed",
    "planner.update_failed": "Update failed",

    "review.title": "Review",
    "review.subtitle": "Work waiting for review, edits, approval, and posting handoff",
    "review.pending": "Pending review",
    "review.needs_edits": "Needs edits",
    "review.approved": "Approved",
    "review.ready_post": "Ready to post",
    "review.all": "All",
    "review.empty": "No tasks in this queue yet.",
    "review.no_assets": "No creative assets yet.",
    "review.assets": "Creative assets",
    "review.latest_submission": "Latest review evidence",
    "review.no_submission": "No review evidence yet.",
    "review.open_detail": "Open details",
    "review.round": "Round {n}",
    "review.submitted_by": "Submitted by {name}",
    "review.waiting_handoff": "Waiting for handoff",
    "review.manager_queue": "Manager queue",
    "review.manager_decision": "Review decision",
    "review.manager_decision_hint": "Approve now or leave clear feedback before sending it back.",
    "review.manager_only": "Manager",
    "review.confirm_request_edits": "Confirm edit request",
    "review.request_edits_title": "Request edits",
    "review.request_edits_description": "Add a comment for the team, or leave it blank if the feedback was already shared.",
    "review.optional_feedback": "Team comment (optional)",
    "review.optional_feedback_hint": "You can leave this blank and confirm if the details were shared elsewhere.",

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
    "modal.file_url": "File / asset links",
    "modal.upload_assets_title": "Upload images to this system",
    "modal.upload_assets_hint": "Images are converted to WebP, asset links are added automatically, and files are kept for 3 months before cleanup.",
    "modal.upload_images": "Upload images",
    "modal.uploading": "Uploading…",
    "modal.upload_converting": "Converting images to WebP…",
    "modal.upload_progress": "Uploading {current}/{total}",
    "modal.upload_success": "Uploaded {n} images",
    "modal.upload_failed": "Image upload failed",
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
    "detail.saving_status": "Saving status…",
    "detail.no_permission_status": "You don't have permission to edit status.",
    "detail.approval": "Approval",
    "detail.approve": "Approve",
    "detail.request_edits": "Request edits",
    "detail.reject": "Reject",
    "detail.approving": "Processing…",
    "detail.approved_success": "✅ Approved successfully!",
    "detail.needs_edits_success": "📝 Edit request sent!",
    "detail.rejected_success": "❌ Task rejected",
    "detail.no_permission_approval": "Only managers can change approval status.",
    "detail.review_workflow": "Review submission",
    "detail.submit_review": "Submit for review",
    "detail.sending_review": "Submitting…",
    "detail.review_submitted_success": "Submitted and evidence saved.",
    "detail.submit_review_hint": "The system saves a snapshot of the caption, brief, file, and note at submission time.",
    "detail.review_evidence": "Review evidence",
    "detail.asset_preview": "Review assets",
    "detail.no_review_evidence": "No review evidence saved yet.",
    "detail.review_round": "Review round {n}",
    "detail.review_feedback": "Review feedback",
    "detail.review_feedback_placeholder": "Write the reason or requested change so the next owner has clear evidence.",
    "detail.feedback_required": "Please write feedback before requesting edits or rejecting.",
    "detail.handoff": "Handoff",
    "detail.claim_edit": "Take for edits",
    "detail.claim_post": "Take for posting",
    "detail.claiming": "Saving…",
    "detail.claimed_success": "Handoff saved.",
    "detail.activity": "Activity",
    "detail.no_activity": "No activity yet.",
    "activity.task_created": "Created task",
    "activity.task_updated": "Updated task",
    "activity.task_deleted": "Deleted task",
    "activity.comment_added": "Added a comment",
    "activity.review_submitted": "Submitted for review",
    "activity.handoff_claimed": "Claimed handoff",
    "activity.approval_pending": "Changed approval to pending",
    "activity.approval_approved": "Approved the task",
    "activity.approval_needs_edits": "Requested edits",
    "activity.approval_rejected": "Rejected the task",
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
    "calendar.day.mon": "Monday",
    "calendar.day.tue": "Tuesday",
    "calendar.day.wed": "Wednesday",
    "calendar.day.thu": "Thursday",
    "calendar.day.fri": "Friday",
    "calendar.day.sat": "Saturday",
    "calendar.day.sun": "Sunday",
    "calendar.more": "+{n} more",
    "calendar.no_tasks_month": "No content scheduled this month.",
    "calendar.tasks_count": "{n} tasks",

    "role.admin": "Admin",
    "role.manager": "Manager",
    "role.creator": "Creator",
    "role.viewer": "Viewer",

    // login
    "login.welcome_back": "Welcome back",
    "login.create_account": "Create account",
    "login.signin_subtitle": "Sign in to manage your content plans",
    "login.signup_subtitle": "Start planning content with your team",
    "login.full_name": "Full name",
    "login.email": "Email",
    "login.password": "Password",
    "login.signin": "Sign in",
    "login.new_here": "New here?",
    "login.already_have_account": "Already have an account?",
    "login.please_wait": "Please wait…",
    "login.auth_failed": "Authentication failed",
    "login.check_email": "Check your email to confirm your account, then sign in.",
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
    waiting_comment: "💬 รอคอมเมนต์",
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
  const nextLocale = useLocale();
  const lang = (nextLocale === "en" ? "en" : "th") as Lang;
  const router = useRouter();
  const pathname = usePathname();

  const setLang = React.useCallback((l: Lang) => {
    if (l === lang) return;
    router.replace(pathname, { locale: l });
  }, [lang, pathname, router]);

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
  const ctx = React.useContext(LangContext);
  if (!ctx) throw new Error("useT must be used within LanguageProvider");
  return ctx.t;
}

export function useActivityAction() {
  const t = useT();
  return React.useCallback(
    (action: string) => {
      // e.g. "task_created" -> "activity.task_created"
      const key = `activity.${action}`;
      const translated = t(key);
      return translated !== key ? translated : action.replace(/_/g, " ");
    },
    [t]
  );
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
