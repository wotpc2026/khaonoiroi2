import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.STAFF_PASSWORD;
const rawStudentCode = process.env.STAFF_STUDENT_CODE || '๒-๑๒๕';
const studentCode = rawStudentCode.replace(/[๐-๙]/g, (digit) => String('๐๑๒๓๔๕๖๗๘๙'.indexOf(digit))).replace(/\s/g, '');
if (!url || !serviceKey || !password) throw new Error('ต้องตั้ง NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY และ STAFF_PASSWORD');
const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
const email = `${studentCode.replace(/\s/g, '')}@roster.local`;
const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { student_code: studentCode } });
if (error && !error.message.toLowerCase().includes('already')) throw error;
const userId = data.user?.id;
if (userId) { const { error: profileError } = await supabase.from('profiles').upsert({ id: userId, role: 'staff' }, { onConflict: 'id' }); if (profileError) throw profileError; }
console.log(`Staff ready: ${email}`);