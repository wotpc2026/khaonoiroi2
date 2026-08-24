import Link from 'next/link';
import { CalendarDays, ChevronRight, Megaphone, Shield, Users } from 'lucide-react';
import { createClient } from '../lib/supabase/server';

export const dynamic = 'force-dynamic';

function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="border border-dashed border-navy/20 p-6 text-center text-sm text-navy/55">{children}</div>;
}

export default async function HomePage() {
  const supabase = createClient();
  const [students, bmi, announcements, countdown, duty] = await Promise.all([
    supabase.from('students').select('id', { count: 'exact', head: true }),
    supabase.from('bmi_records').select('bmi,category').order('measured_date', { ascending: false }).limit(207),
    supabase.from('announcements').select('id,title,content,is_pinned,created_at').order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(4),
    supabase.from('countdown_events').select('id,title,event_date,description').eq('is_active', true).gte('event_date', new Date().toISOString()).order('event_date').limit(3),
    supabase.from('duty_schedule').select('id,duty_date,time_range,location,note').gte('duty_date', new Date().toISOString().slice(0, 10)).order('duty_date').limit(4),
  ]);
  const bmiRows = bmi.data ?? [];
  const normalBmi = bmiRows.filter((row) => row.category?.includes('สมส่วน')).length;
  const stats = [
    { label: 'สมาชิกทั้งหมด', value: students.count ?? 0, sub: 'คน', icon: Users },
    { label: 'BMI รอบล่าสุด', value: bmiRows.length ? `${Math.round((normalBmi / bmiRows.length) * 100)}%` : '-', sub: 'อยู่ในเกณฑ์ปกติ', icon: Shield },
    { label: 'ประกาศล่าสุด', value: announcements.data?.length ?? 0, sub: 'รายการ', icon: Megaphone },
    { label: 'เวรที่กำลังจะถึง', value: duty.data?.length ?? 0, sub: 'รายการ', icon: CalendarDays },
  ];
  return <main className="min-h-screen px-4 py-8 md:px-8"><div className="mx-auto max-w-7xl">
    <header className="hero-panel panel mb-6 overflow-hidden border-navy/10 bg-gradient-to-r from-navy via-navy to-pine text-white"><div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between"><div><div className="mb-2 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-gold">KHAONOI ROI2 63</div><h1 className="text-3xl font-bold md:text-4xl">เขาน้อยร้อย 2 รุ่น 63 นสต</h1><p className="mt-2 max-w-xl text-sm text-white/75 md:text-base">ข้อมูลกองร้อยที่ 2 อาคาร 4 รุ่น 63</p></div><div className="flex gap-3"><Link href="/roster" className="rounded-xl bg-gold px-4 py-2 font-semibold text-navy transition hover:opacity-90">ทำเนียบรุ่น</Link><Link href="/login" className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 font-semibold text-white transition hover:bg-white/10">สมาชิก</Link></div></div></header>
    <section className="grid gap-4 md:grid-cols-4">{stats.map((item) => <div key={item.label} className="panel reveal-card p-4"><item.icon className="text-gold" size={20} /><p className="mt-3 text-sm text-navy/65">{item.label}</p><div className="mt-2 flex items-end gap-2"><span className="text-3xl font-bold text-navy">{item.value}</span><span className="pb-1 text-sm text-navy/60">{item.sub}</span></div></div>)}</section>
    <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]"><div className="panel p-5"><div className="mb-4 flex items-center justify-between"><h2 className="section-title">เหตุการณ์สำคัญ</h2><Link href="/countdown" className="text-sm text-navy underline">ดูทั้งหมด</Link></div><div className="grid gap-4 md:grid-cols-3">{countdown.data?.length ? countdown.data.map((event) => <article key={event.id} className="reveal-card rounded-2xl border border-dashed border-navy/20 bg-cream p-4"><p className="text-xs font-semibold text-navy/60">{new Date(event.event_date).toLocaleDateString('th-TH')}</p><h3 className="mt-2 text-lg font-bold">{event.title}</h3><p className="mt-2 text-sm text-navy/65">{event.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</p></article>) : <EmptyState>ยังไม่มีเหตุการณ์ในฐานข้อมูล</EmptyState>}</div></div><div className="panel p-5"><div className="mb-4 flex items-center justify-between"><h2 className="section-title">ประกาศล่าสุด</h2><Megaphone size={20} className="text-gold" /></div><div className="space-y-3">{announcements.data?.length ? announcements.data.map((item) => <article key={item.id} className="reveal-card rounded-xl border border-navy/10 bg-white/60 p-3"><div className="flex items-center gap-2">{item.is_pinned && <span className="badge bg-gold/20">ปักหมุด</span>}<h3 className="font-semibold text-navy">{item.title}</h3></div><p className="mt-1 line-clamp-2 text-xs text-navy/60">{item.content}</p></article>) : <EmptyState>ยังไม่มีประกาศในฐานข้อมูล</EmptyState>}</div></div></section>
    <section className="mt-6 grid gap-6 lg:grid-cols-2"><div className="panel p-5"><h2 className="section-title">เวรที่กำลังจะถึง</h2><div className="mt-4 space-y-3">{duty.data?.length ? duty.data.map((item) => <article key={item.id} className="reveal-card rounded-xl border border-navy/10 bg-cream p-3"><p className="text-xs font-semibold text-navy/60">{item.duty_date}</p><h3 className="mt-1 text-lg font-bold text-navy">{item.location || 'ไม่ระบุสถานที่'}</h3><p className="mt-1 text-sm text-navy/70">{item.time_range || item.note || 'ไม่มีรายละเอียดเพิ่มเติม'}</p></article>) : <EmptyState>ยังไม่มีตารางเวรในฐานข้อมูล</EmptyState>}</div></div><div className="panel p-5"><h2 className="section-title">ส่วนงาน</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{[['ทำเนียบรุ่น','/roster'],['BMI & สุขภาพ','/bmi'],['ค่ากรรมการรุ่น','/fees'],['แกลเลอรี่','/gallery'],['ประกาศ','/announcements'],['Wall of Fame','/wall-of-fame']].map(([label, href]) => <Link key={href} href={href} className="reveal-card flex items-center justify-between border-b border-navy/10 p-3 font-semibold text-navy transition hover:bg-gold/10">{label}<ChevronRight size={17} /></Link>)}</div></div></section>
  </div></main>;
}
