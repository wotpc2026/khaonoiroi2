'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Shuffle, Plus, Download, LockKeyhole } from 'lucide-react';
import { createClient } from '../../lib/supabase/browser';

type Student = { order_no: number; student_code: string; full_name: string; platoon: number; squad: number; phone?: string | null };

const titles: Record<string, [string, string]> = {
  roster: ['ทำเนียบรุ่น', 'รายชื่อสมาชิก 207 นาย แบ่งตามหมวดและหมู่'], bmi: ['BMI & สุขภาพ', 'บันทึกและติดตามผลการชั่งวัดหลายรอบ'],
  fees: ['ค่ากรรมการรุ่น', 'ตารางสถานะการชำระรายเดือน'], duty: ['ปฏิทินและตารางเวร', 'ตรวจเวรประจำวันและการมอบหมายกำลังพล'],
  countdown: ['Countdown', 'เหตุการณ์สำคัญของกองร้อย'], readiness: ['รายชื่อเตรียมการณ์', 'ลิสต์กำลังพลสำหรับภารกิจ'],
  announcements: ['บอร์ดประกาศ', 'ข่าวสารและคำสั่งประจำกองร้อย'], gallery: ['แกลเลอรี่กิจกรรม', 'ภาพความทรงจำของรุ่น 63'],
  'wall-of-fame': ['Wall of Fame', 'ผลงานและเกียรติบัตรของสมาชิก'], raffle: ['สุ่มรายชื่อ', 'เครื่องมือจับฉลากสำหรับ staff'],
};

const rows: Student[] = Array.from({ length: 12 }, (_, index) => ({ order_no: index + 1, student_code: `๒-${String(index + 1).padStart(3, '๐')}`, full_name: 'รอ import รายชื่อจริง', platoon: Math.floor(index / 3) + 1, squad: (index % 5) + 1 }));

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return <header className="mb-6 border-l-4 border-gold pl-4"><p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">POLICE CADET BATCH 63</p><h1 className="mt-1 text-3xl font-bold text-navy">{title}</h1><p className="mt-1 text-navy/65">{subtitle}</p></header>;
}

function Roster() {
  const [query, setQuery] = useState(''); const [platoon, setPlatoon] = useState('ทั้งหมด'); const [students, setStudents] = useState(rows);
  useEffect(() => { createClient().from('students').select('order_no,student_code,full_name,platoon,squad,phone').order('order_no').then(({ data }) => { if (data?.length) setStudents(data as Student[]); }); }, []);
  const filtered = useMemo(() => students.filter((row) => (platoon === 'ทั้งหมด' || row.platoon === Number(platoon)) && `${row.full_name} ${row.student_code}`.includes(query)), [query, platoon, students]);
  return <><div className="mb-4 flex flex-col gap-3 md:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-3 text-navy/40" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อหรือรหัส" className="control pl-10" /></label><select value={platoon} onChange={(event) => setPlatoon(event.target.value)} className="control md:max-w-48"><option>ทั้งหมด</option>{[1, 2, 3, 4].map((item) => <option key={item} value={item}>หมวด {item}</option>)}</select><button className="button-primary"><Download size={17} /> Export</button></div><div className="overflow-x-auto panel"><table className="w-full text-left text-sm"><thead><tr className="border-b bg-navy text-white"><th className="p-3">ลำดับ</th><th className="p-3">รหัส</th><th className="p-3">ยศ ชื่อ - สกุล</th><th className="p-3">หมวด / หมู่</th><th className="p-3">จัดการ</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.order_no} className="border-b last:border-0 hover:bg-gold/5"><td className="p-3 font-semibold">{row.order_no}</td><td className="p-3">{row.student_code}</td><td className="p-3 font-semibold">{row.full_name}</td><td className="p-3">หมวด {row.platoon} / หมู่ {row.squad}</td><td className="p-3"><button className="text-navy underline">ดูโปรไฟล์</button></td></tr>)}</tbody></table></div></>;
}

function Generic({ section }: { section: string }) {
  const [message, setMessage] = useState(''); const [drawn, setDrawn] = useState<string[]>([]);
  const isStaff = ['fees', 'duty', 'countdown', 'readiness', 'announcements', 'gallery', 'wall-of-fame', 'raffle', 'bmi'].includes(section);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const title = String(form.get('title') ?? ''); const detail = String(form.get('detail') ?? '');
    const table = section === 'announcements' ? 'announcements' : section === 'countdown' ? 'countdown_events' : section === 'readiness' ? 'readiness_lists' : section === 'gallery' ? 'gallery_albums' : section === 'wall-of-fame' ? 'wall_of_fame' : section === 'duty' ? 'duty_schedule' : null;
    if (!table) { setMessage('ฟีเจอร์นี้ต้องใช้เครื่องมือเฉพาะของ staff'); return; }
    const payload = table === 'announcements' ? { title, content: detail } : table === 'countdown_events' ? { title, description: detail, event_date: form.get('date') } : table === 'readiness_lists' ? { title, description: detail, event_date: form.get('date') || null } : table === 'gallery_albums' ? { title, event_date: form.get('date') || null } : table === 'wall_of_fame' ? { title, description: detail, awarded_date: form.get('date') || null } : { location: title, note: detail, duty_date: form.get('date') || new Date().toISOString().slice(0, 10) };
    const { error } = await createClient().from(table).insert(payload); setMessage(error ? error.message : 'บันทึกข้อมูลสำเร็จ'); if (!error) event.currentTarget.reset();
  }
  function draw() { setDrawn(['ผู้ถูกสุ่มลำดับที่ ๑', 'ผู้ถูกสุ่มลำดับที่ ๒', 'ผู้ถูกสุ่มลำดับที่ ๓']); }
  return <div className="grid gap-6 lg:grid-cols-[1.45fr_0.8fr]"><section className="panel p-5"><div className="mb-5 flex items-center justify-between"><span className="badge">Public view</span>{section === 'raffle' && <button onClick={draw} className="button-primary"><Shuffle size={17} /> สุ่มเลย</button>}</div>{section === 'raffle' && drawn.length > 0 ? <div className="space-y-3">{drawn.map((item, index) => <div key={item} className="rounded-lg border-l-4 border-gold bg-cream p-4 text-lg font-bold">{index + 1}. {item}</div>)}</div> : <div className="space-y-3">{['ข้อมูลจะแสดงจาก Supabase เมื่อมีการ import และบันทึกจริง', 'ผู้ชมทั่วไปดูข้อมูลได้ ส่วนการแก้ไขต้องเข้าสู่ระบบ staff'].map((item) => <div key={item} className="border-b border-navy/10 py-3 text-navy/70">{item}</div>)}</div>}</section>{isStaff && <aside className="panel h-fit p-5"><div className="mb-4 flex items-center gap-2 font-bold text-navy"><LockKeyhole size={18} /> เครื่องมือ staff</div><form onSubmit={submit} className="space-y-3"><input name="title" required className="control" placeholder={section === 'raffle' ? 'ชื่อกิจกรรม' : 'หัวข้อ / ชื่อรายการ'} />{['countdown', 'readiness', 'gallery', 'wall-of-fame', 'duty'].includes(section) && <input name="date" type="date" className="control" />}{!['gallery', 'wall-of-fame'].includes(section) && <textarea name="detail" className="control min-h-28" placeholder="รายละเอียด หรือหมายเหตุ" />}<button className="button-primary w-full"><Plus size={17} /> บันทึกข้อมูล</button></form>{message && <p className="mt-3 text-sm text-pine">{message}</p>}<Link href="/login" className="mt-4 block text-center text-sm text-navy underline">เข้าสู่ระบบเพื่อจัดการข้อมูล</Link></aside>}</div>;
}

export function SectionPage({ section }: { section: string }) {
  const [title, subtitle] = titles[section] ?? ['ไม่พบหน้า', ''];
  return <main className="min-h-screen px-4 py-8 md:px-8"><div className="mx-auto max-w-7xl"><Header title={title} subtitle={subtitle} />{section === 'roster' ? <Roster /> : <Generic section={section} />}</div></main>;
}