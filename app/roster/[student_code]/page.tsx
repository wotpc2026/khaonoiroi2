'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, Camera, Save, Shield } from 'lucide-react';
import { createClient } from '../../../lib/supabase/browser';
import { normalizeStudentCode } from '../../../lib/student-code';

type Student = { id: string; order_no: number; student_code: string; full_name: string; platoon: number; squad: number; phone: string | null; photo_url: string | null; profile_note: string | null; note_visibility: 'public' | 'members' | 'private'; show_height: boolean; show_weight: boolean };
type Bmi = { measured_date: string; height_cm: number; weight_kg: number; bmi: number; category: string | null };

export default function StudentProfile({ params }: { params: { student_code: string } }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [bmi, setBmi] = useState<Bmi[]>([]);
  const [role, setRole] = useState<'guest' | 'member' | 'staff'>('guest');
  const [message, setMessage] = useState('');
  useEffect(() => {
    const client = createClient();
    const requestedCode = normalizeStudentCode(decodeURIComponent(params.student_code));
    client.from('students').select('*').then(({ data }) => {
      const found = (data as Student[] | null)?.find((item) => normalizeStudentCode(item.student_code) === requestedCode) ?? null;
      setStudent(found);
      if (found) client.from('bmi_records').select('measured_date,height_cm,weight_kg,bmi,category').eq('student_id', found.id).order('measured_date', { ascending: false }).then(({ data: bmiData }) => setBmi((bmiData ?? []) as Bmi[]));
    });
    client.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profile } = await client.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
      setRole(profile?.role === 'staff' ? 'staff' : 'member');
    });
  }, [params.student_code]);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!student) return;
    const form = new FormData(event.currentTarget);
    const payload = { phone: String(form.get('phone') || ''), photo_url: String(form.get('photo_url') || ''), profile_note: String(form.get('profile_note') || ''), note_visibility: form.get('note_visibility'), show_height: form.get('show_height') === 'on', show_weight: form.get('show_weight') === 'on' };
    const { error } = await createClient().from('students').update(payload).eq('id', student.id);
    setMessage(error?.message || 'บันทึกโปรไฟล์แล้ว');
    if (!error) setStudent({ ...student, ...payload, note_visibility: payload.note_visibility as Student['note_visibility'] });
  }
  async function upload(event: FormEvent<HTMLInputElement>) {
    const image = event.currentTarget.files?.[0];
    if (!image || !student) return;
    const body = new FormData(); body.append('image', image);
    const response = await fetch('/api/upload', { method: 'POST', body }); const result = await response.json();
    if (result.url) setStudent({ ...student, photo_url: result.url }); else setMessage(result.error || 'อัปโหลดรูปไม่สำเร็จ');
  }
  if (!student) return <main className="mx-auto max-w-4xl px-4 py-10"><div className="panel p-8 text-center">ไม่พบข้อมูลสมาชิก</div></main>;
  const canEdit = role === 'staff' || role === 'member';
  return <main className="min-h-screen px-4 py-8 md:px-8"><div className="mx-auto max-w-4xl"><Link href="/roster" className="mb-5 inline-flex items-center gap-2 text-sm text-navy underline"><ArrowLeft size={16} /> กลับทำเนียบรุ่น</Link><section className="panel overflow-hidden"><div className="bg-navy p-6 text-white"><p className="text-sm text-gold">ลำดับ {student.order_no} · หมวด {student.platoon} / หมู่ {student.squad}</p><h1 className="mt-2 text-3xl font-bold">{student.full_name}</h1><p className="mt-1 text-white/70">รหัส นสต. {student.student_code}</p></div><div className="grid gap-6 p-6 md:grid-cols-[180px_1fr]"><div><div className="aspect-square overflow-hidden rounded-2xl border-4 border-gold/40 bg-cream">{student.photo_url ? <img src={student.photo_url} alt={student.full_name} className="h-full w-full object-cover" /> : <Shield className="m-auto mt-12 text-gold" size={55} />}</div>{canEdit && <label className="button-primary mt-3 w-full cursor-pointer"><Camera size={16} /> รูปโปรไฟล์<input type="file" accept="image/*" onChange={upload} className="sr-only" /></label>}</div><div><h2 className="section-title">ข้อมูลสุขภาพ</h2><div className="mt-3 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="p-2">วันที่</th><th className="p-2">ส่วนสูง</th><th className="p-2">น้ำหนัก</th><th className="p-2">BMI</th><th className="p-2">ประเมิน</th></tr></thead><tbody>{bmi.map((record) => <tr key={record.measured_date} className="border-b"><td className="p-2">{record.measured_date}</td><td className="p-2">{student.show_height ? `${record.height_cm} ซม.` : 'ซ่อน'}</td><td className="p-2">{student.show_weight ? `${record.weight_kg} กก.` : 'ซ่อน'}</td><td className="p-2 font-semibold">{Number(record.bmi).toFixed(2)}</td><td className="p-2">{record.category || '-'}</td></tr>)}</tbody></table>{!bmi.length && <p className="p-5 text-center text-sm text-navy/60">ยังไม่มีข้อมูลสุขภาพ</p>}</div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-lg bg-cream p-3"><span className="text-xs text-navy/60">โทรศัพท์</span><p className="font-semibold">{student.phone || 'ไม่ได้ระบุ'}</p></div><div className="rounded-lg bg-cream p-3"><span className="text-xs text-navy/60">บันทึก</span><p className="font-semibold">{student.note_visibility === 'private' && role === 'guest' ? 'ส่วนตัว' : student.profile_note || 'ไม่มีบันทึก'}</p></div></div></div></div></section>{canEdit && <form onSubmit={save} className="panel mt-6 grid gap-3 p-6"><h2 className="section-title">แก้ไขโปรไฟล์</h2><input name="phone" defaultValue={student.phone || ''} placeholder="เบอร์โทรศัพท์" className="control" /><input name="photo_url" value={student.photo_url || ''} onChange={(event) => setStudent({ ...student, photo_url: event.target.value })} placeholder="URL รูปโปรไฟล์" className="control" /><textarea name="profile_note" defaultValue={student.profile_note || ''} placeholder="โน้ตประจำตัว" className="control min-h-24" /><select name="note_visibility" defaultValue={student.note_visibility} className="control"><option value="private">โน้ตส่วนตัว</option><option value="members">เห็นเฉพาะสมาชิก</option><option value="public">เห็นแบบสาธารณะ</option></select><div className="flex gap-4 text-sm"><label><input type="checkbox" name="show_height" defaultChecked={student.show_height} /> แสดงส่วนสูง</label><label><input type="checkbox" name="show_weight" defaultChecked={student.show_weight} /> แสดงน้ำหนัก</label></div><button className="button-primary"><Save size={17} /> บันทึกโปรไฟล์</button>{message && <p className="text-sm text-pine">{message}</p>}</form>}</div></main>;
}
