'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { LogIn, Shield } from 'lucide-react';
import { createClient } from '../../lib/supabase/browser';
import { normalizeStudentCode } from '../../lib/student-code';

export default function LoginPage() {
  const [studentCode, setStudentCode] = useState(''); const [password, setPassword] = useState(''); const [message, setMessage] = useState(''); const [signup, setSignup] = useState(false);
  const authEmail = `${normalizeStudentCode(studentCode)}@roster.local`;
  async function submit(event: FormEvent) { event.preventDefault(); setMessage('กำลังตรวจสอบบัญชี...'); const supabase = createClient(); const result = signup ? await supabase.auth.signUp({ email: authEmail, password, options: { data: { student_code: studentCode } } }) : await supabase.auth.signInWithPassword({ email: authEmail, password }); setMessage(result.error ? result.error.message : signup ? 'สมัครสำเร็จ กรุณายืนยันบัญชีตามการตั้งค่า Supabase' : 'เข้าสู่ระบบสำเร็จ'); }
  return <main className="flex min-h-[calc(100vh-49px)] items-center justify-center px-4 py-10"><div className="panel w-full max-w-md p-7"><div className="mb-6 text-center"><Shield className="mx-auto text-gold" size={42} /><h1 className="mt-3 text-2xl font-bold text-navy">{signup ? 'สมัครสมาชิก' : 'เข้าสู่ระบบกองร้อย'}</h1><p className="mt-1 text-sm text-navy/60">ใช้รหัส นสต. เป็น username เช่น ๒-๑๒๕</p></div><form onSubmit={submit} className="space-y-4"><input required value={studentCode} onChange={(event) => setStudentCode(event.target.value)} placeholder="รหัส นสต." className="control" /><input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="รหัสผ่านอย่างน้อย 6 ตัว" className="control" /><button className="button-primary w-full"><LogIn size={17} /> {signup ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</button></form>{message && <p className="mt-4 text-center text-sm text-navy/70">{message}</p>}<button onClick={() => setSignup(!signup)} className="mt-4 w-full text-sm text-navy underline">{signup ? 'มีบัญชีแล้ว เข้าสู่ระบบ' : 'ยังไม่มีบัญชี สมัครสมาชิก'}</button><Link href="/" className="mt-5 block text-center text-sm text-navy underline">กลับหน้าหลัก</Link></div></main>;
}