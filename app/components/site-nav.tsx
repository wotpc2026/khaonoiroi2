 'use client';

import Link from 'next/link';
import { LogIn, Moon, Shield, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/browser';

const links = [
  ['ทำเนียบรุ่น', '/roster'], ['สุขภาพ', '/bmi'], ['ค่ากรรมการ', '/fees'],
  ['ตารางเวร', '/duty'], ['นับถอยหลัง', '/countdown'], ['เตรียมการณ์', '/readiness'],
  ['ประกาศ', '/announcements'], ['แกลเลอรี่', '/gallery'], ['เกียรติยศ', '/wall-of-fame'],
  ['สุ่มรายชื่อ', '/raffle'],
];

export function SiteNav() {
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('roster-theme') === 'dark'; setDark(stored); document.documentElement.classList.toggle('dark', stored);
    createClient().from('site_settings').select('value').eq('key', 'navigation').maybeSingle().then(({ data }) => setVisible((data?.value as Record<string, boolean>) || {}));
  }, []);
  function toggleTheme() { const next = !dark; setDark(next); localStorage.setItem('roster-theme', next ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', next); }
  return (
    <nav className="border-b border-white/10 bg-navy text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4 py-3 md:px-8">
        <Link href="/" className="mr-2 flex shrink-0 items-center gap-2 font-bold text-gold"><Shield size={20} /> KHAONOI ROI2 63</Link>
        <div className="flex min-w-max gap-4 text-sm text-white/80">
          {links.filter(([, href]) => visible[href.slice(1)] !== false).map(([label, href]) => <Link key={href} href={href} className="transition hover:text-gold">{label}</Link>)}
        </div>
        <button type="button" onClick={toggleTheme} aria-label="สลับ dark mode" className="shrink-0 text-gold">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
        <Link href="/login" className="ml-auto flex shrink-0 items-center gap-1 text-sm text-gold"><LogIn size={16} /> เข้าสู่ระบบ</Link>
      </div>
    </nav>
  );
}