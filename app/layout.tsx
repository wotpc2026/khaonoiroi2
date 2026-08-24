import type { Metadata } from 'next';
import { Mali } from 'next/font/google';
import './globals.css';
import { SiteNav } from './components/site-nav';

const mali = Mali({
  subsets: ['thai', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-mali',
});

export const metadata: Metadata = {
  title: 'KHAONOI ROI2 63 | เขาน้อยร้อย 2 รุ่น 63 นสต',
  description: 'ข้อมูลกองร้อยที่ 2 อาคาร 4 รุ่น 63',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${mali.variable}`}>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
