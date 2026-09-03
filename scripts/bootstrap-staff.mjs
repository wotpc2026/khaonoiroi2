import { createClient } from '@supabase/supabase-js';

// ตรวจสอบค่า URL และ Key
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.STAFF_PASSWORD;
const rawStudentCode = process.env.STAFF_STUDENT_CODE || '๒-๑๒๕';

// บังคับหยุดทำงานทันทีพร้อมแจ้งเตือนถ้าตัวแปรแวดล้อมไม่ครบ
if (!url) {
  throw new Error('❌ ตรวจพบข้อผิดพลาด: ไม่พบตัวแปร NEXT_PUBLIC_SUPABASE_URL หรือ SUPABASE_URL ในระบบ');
}
if (!serviceKey) {
  throw new Error('❌ ตรวจพบข้อผิดพลาด: ไม่พบตัวแปร SUPABASE_SERVICE_ROLE_KEY (กรุณาใช้ Service Role Key ห้ามใช้ Anon Key)');
}
if (!password) {
  throw new Error('❌ ตรวจพบข้อผิดพลาด: ไม่พบตัวแปร STAFF_PASSWORD สำหรับกำหนดรหัสผ่านให้กับ Staff');
}
if (url === 'https://supabase.co') {
  throw new Error('❌ ตรวจพบข้อผิดพลาด: URL ที่ใช้เป็นหน้าแรกของเว็บ Supabase กรุณาเปลี่ยนเป็น URL ของโปรเจกต์คุณเอง (เช่น https://supabase.co)');
}

// แปลงเลขไทยเป็นอารบิก
const studentCode = rawStudentCode.replace(/[๐-๙]/g, (digit) => String('๐๑๒๓๔๕๖๗๘๙'.indexOf(digit))).replace(/\s+/g, '').trim();

const supabase = createClient(url, serviceKey, { 
  auth: { 
    autoRefreshToken: false, 
    persistSession: false 
  } 
});

const email = `${studentCode}@roster.com`;
const normalizeCode = (value) => String(value).replace(/[๐-๙]/g, (digit) => String('๐๑๒๓๔๕๖๗๘๙'.indexOf(digit))).replace(/\s+/g, '').trim();

console.log("==========================================");
console.log(`[DEBUG] Connection URL: "${url}"`);
console.log(`[DEBUG] Raw Student Code จากระบบ: "${rawStudentCode}"`);
console.log(`[DEBUG] ค่า Email ที่กำลังส่งให้ Supabase: "${email}"`);
console.log("==========================================");

try {
  // สร้าง User ในระบบ Auth (ฝั่ง Admin)
  const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const existingUser = usersData?.users?.find((user) => user.email === email);
  const { data, error } = existingUser
    ? await supabase.auth.admin.updateUserById(existingUser.id, { password, email_confirm: true, user_metadata: { student_code: studentCode } })
    : await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { student_code: studentCode } });

  if (error) {
    // ถ้าอีเมลนี้เคยลงทะเบียนไว้แล้ว ให้ข้ามไปขั้นตอนอัปเดต Profile ได้เลย ไม่ต้องสั่งพังโปรแกรม
    if (error.message.toLowerCase().includes('already')) {
      console.log(`[INFO] Email ${email} มีอยู่ในระบบ Auth แล้ว กำลังดำเนินการตรวจสอบตาราง Profiles...`);
    } else {
      throw error;
    }
  }

  // ดึง User ID มาใช้ (รองรับทั้งกรณีสร้างใหม่ และกรณีที่ระบบแจ้งว่าเคยสร้างไปแล้ว)
  const userId = data?.user?.id || existingUser?.id;

  // ทำการผูกสิทธิ์สตาฟลงในตาราง profiles
  if (userId) { 
    const { data: students } = await supabase.from('students').select('id,student_code');
    const student = students?.find((item) => normalizeCode(item.student_code) === studentCode);
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: userId, student_id: student?.id, role: 'staff' }, { onConflict: 'id' }); 
      
    if (profileError) throw profileError; 
    console.log(`✅ Staff ready: ${email} (Role: staff)`);
  } else {
    console.log(`⚠️ ไม่สามารถดึง User ID เพื่อเชื่อมโยงไปยังตาราง Profiles ได้`);
  }

} catch (err) {
  console.error("🔴 เกิดข้อผิดพลาดระหว่างรันสคริปต์:");
  console.error(err);
  process.exit(1);
}
