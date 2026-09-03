import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import './globals.css';
import { SiteNav } from './components/site-nav';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-noto-thai',
});

export const metadata: Metadata = {
  title: 'KHAONOI ROI2 63 | เขาน้อยร้อย 2 รุ่น 63 นสต',
  description: 'ข้อมูลกองร้อยที่ 2 อาคาร 4 รุ่น 63',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${notoSansThai.variable}`}>
        <SiteNav />
        <div className="lg:pl-64">{children}</div>
      </body>
    </html>
  );
}
