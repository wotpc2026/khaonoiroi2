'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { createClient } from '../../lib/supabase/browser';

type Profile = { id: string; full_name: string | null; role: 'member' | 'staff' };

export default function StaffPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]); const [message, setMessage] = useState('');
  async function load() { const { data, error } = await createClient().from('profiles').select('id,full_name,role').order('created_at'); if (error) setMessage(error.message); else setProfiles((data ?? []) as Profile[]); }
  useEffect(() => { load(); }, []);
  async function promote(id: string, role: Profile['role']) { const { error } = await createClient().from('profiles').update({ role }).eq('id', id); setMessage(error ? error.message : 'อัปเดตสิทธิ์แล้ว'); if (!error) load(); }
  return <main className="min-h-screen px-4 py-8 md:px-8"><div className="mx-auto max-w-5xl"><header className="mb-6 border-l-4 border-gold pl-4"><p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">STAFF CONSOLE</p><h1 className="mt-1 text-3xl font-bold text-navy">จัดการผู้ใช้</h1><p className="mt-1 text-navy/65">เฉพาะ staff ที่ผ่าน RLS เท่านั้นจึงจะเปลี่ยนสิทธิ์ได้</p></header><div className="panel overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-navy text-white"><tr><th className="p-3">ชื่อ</th><th className="p-3">สิทธิ์</th><th className="p-3">การจัดการ</th></tr></thead><tbody>{profiles.map((profile) => <tr key={profile.id} className="border-b"><td className="p-3 font-semibold">{profile.full_name || 'ไม่ระบุชื่อ'}</td><td className="p-3">{profile.role}</td><td className="p-3"><button onClick={() => promote(profile.id, profile.role === 'staff' ? 'member' : 'staff')} className="inline-flex items-center gap-2 text-navy underline"><ShieldCheck size={16} /> {profile.role === 'staff' ? 'ลดเป็น member' : 'เลื่อนเป็น staff'}</button></td></tr>)}</tbody></table></div>{message && <p className="mt-4 text-sm text-navy/70">{message}</p>}</div></main>;
}