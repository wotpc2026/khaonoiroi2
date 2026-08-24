import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="panel max-w-md p-8 text-center">
        <p className="badge mb-4">404</p>
        <h1 className="text-3xl font-bold text-navy">ไม่พบหน้า</h1>
        <p className="mt-3 text-navy/75">หน้านี้อาจยังไม่พร้อมใช้งานในเวอร์ชันร่างนี้</p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-navy px-4 py-2 font-semibold text-white">
          กลับหน้าแรก
        </Link>
      </div>
    </main>
  );
}
