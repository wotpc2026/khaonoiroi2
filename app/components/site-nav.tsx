import Link from 'next/link';
import { LogIn, Shield } from 'lucide-react';

const links = [
  ['ทำเนียบรุ่น', '/roster'], ['สุขภาพ', '/bmi'], ['ค่ากรรมการ', '/fees'],
  ['ตารางเวร', '/duty'], ['นับถอยหลัง', '/countdown'], ['เตรียมการณ์', '/readiness'],
  ['ประกาศ', '/announcements'], ['แกลเลอรี่', '/gallery'], ['เกียรติยศ', '/wall-of-fame'],
  ['สุ่มรายชื่อ', '/raffle'],
];

export function SiteNav() {
  return (
    <nav className="border-b border-white/10 bg-navy text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4 py-3 md:px-8">
        <Link href="/" className="mr-2 flex shrink-0 items-center gap-2 font-bold text-gold"><Shield size={20} /> ร้อย ๒ รุ่น ๖๓</Link>
        <div className="flex min-w-max gap-4 text-sm text-white/80">
          {links.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-gold">{label}</Link>)}
        </div>
        <Link href="/login" className="ml-auto flex shrink-0 items-center gap-1 text-sm text-gold"><LogIn size={16} /> เข้าสู่ระบบ</Link>
      </div>
    </nav>
  );
}