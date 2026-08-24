-- Seed นี้ไม่ใส่ชื่อสมมติ ข้อมูลนักเรียนต้อง import จากไฟล์ต้นฉบับจริง
-- Mapping ที่รองรับ: ลำดับ, รหัส นสต., ยศ ชื่อ-สกุล, หมวด, หมู่,
-- ส่วนสูง, น้ำหนัก, BMI, การประเมิน

insert into fee_months (label, month_order, due_year)
values
  ('ก.ค. 69', 1, 2026),
  ('ส.ค. 69', 2, 2026),
  ('ก.ย. 69', 3, 2026),
  ('ต.ค. 69', 4, 2026),
  ('พ.ย. 69', 5, 2026),
  ('ธ.ค. 69', 6, 2026),
  ('ม.ค. 70', 7, 2026),
  ('ก.พ. 70', 8, 2026),
  ('มี.ค. 70', 9, 2026),
  ('เม.ย. 70', 10, 2026),
  ('พ.ค. 70', 11, 2026),
  ('มิ.ย. 70', 12, 2026)
on conflict (due_year, month_order) do update
set label = excluded.label;

-- หลัง import students แล้ว จึงค่อย import bmi_records และ fee_payments
-- โดยเชื่อมด้วย students.student_code และ fee_months.(due_year, month_order)
