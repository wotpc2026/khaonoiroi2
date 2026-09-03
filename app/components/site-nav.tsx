 'use client';

import Link from 'next/link';
import { Bell, Home, LogIn, Menu, Moon, Shield, Sun, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/browser';

const links = [
  ['ทำเนียบรุ่น', '/roster'], ['สุขภาพ', '/bmi'], ['ค่ากรรมการ', '/fees'],
  ['ตารางเวร', '/duty'], ['นับถอยหลัง', '/countdown'], ['เตรียมการณ์', '/readiness'],
  ['ประกาศ', '/announcements'], ['แกลเลอรี่', '/gallery'], ['เกียรติยศ', '/wall-of-fame'],
  ['สุ่มรายชื่อ', '/raffle'],
];

const mobileLinks = [['หน้าแรก', '/', Home], ['สมาชิก', '/roster', Users], ['ประกาศ', '/announcements', Bell], ['งาน', '/duty', Menu]] as const;

export function SiteNav() {
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('roster-theme') === 'dark'; setDark(stored); document.documentElement.classList.toggle('dark', stored);
    createClient().from('site_settings').select('value').eq('key', 'navigation').maybeSingle().then(({ data }) => setVisible((data?.value as Record<string, boolean>) || {}));
  }, []);
  function toggleTheme() { const next = !dark; setDark(next); localStorage.setItem('roster-theme', next ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', next); }
  return (
    <nav className="desktop-sidebar border-white/10 bg-navy text-white">
      <div className="desktop-sidebar-inner">
        <Link href="/" className="flex shrink-0 items-center gap-2 border-b border-white/10 pb-5 font-bold text-gold"><Shield size={20} /> KHAONOI ROI2 63</Link>
        <div className="hidden min-w-max flex-col gap-1 text-sm text-white/80 lg:flex">
          {links.filter(([, href]) => visible[href.slice(1)] !== false).map(([label, href]) => <Link key={href} href={href} className="transition hover:text-gold">{label}</Link>)}
        </div>
        <div className="mt-auto hidden items-center justify-between lg:flex"><Link href="/login" className="flex items-center gap-1 text-sm text-gold"><LogIn size={16} /> เข้าสู่ระบบ</Link><button type="button" onClick={toggleTheme} aria-label="สลับ dark mode" className="text-gold">{dark ? <Sun size={17} /> : <Moon size={17} />}</button></div>
      </div>
      <div className="mobile-topbar lg:hidden"><Link href="/" className="flex items-center gap-2 font-bold text-gold"><Shield size={20} /> KHAONOI ROI2 63</Link><div className="flex items-center gap-4"><button type="button" onClick={toggleTheme} aria-label="สลับ dark mode" className="text-gold">{dark ? <Sun size={18} /> : <Moon size={18} />}</button><Link href="/login" aria-label="เข้าสู่ระบบ" className="text-gold"><LogIn size={18} /></Link></div></div>
      <div className="mobile-bottom-nav lg:hidden">
        {mobileLinks.map(([label, href, Icon]) => <Link key={href} href={href} className="mobile-nav-item"><Icon size={18} /><span>{label}</span></Link>)}
        <Link href="/login" className="mobile-nav-item"><LogIn size={18} /><span>โปรไฟล์</span></Link>
      </div>
    </nav>
  );
}