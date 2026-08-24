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
  title: 'กองร้อย นสต. รุ่น 63',
  description: 'ระบบสารสนเทศและทำเนียบรุ่น กองร้อยนักเรียนนายสิบตำรวจ กองร้อยที่ 2 อาคาร 4 รุ่น 63',
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
