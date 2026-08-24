import Link from 'next/link';

const stats = [
  { label: 'สมาชิกทั้งหมด', value: '207', sub: 'คน', tone: 'bg-navy text-white' },
  { label: 'รายได้เดือนนี้', value: '82%', sub: 'จ่ายครบ', tone: 'bg-amber-100 text-amber-900' },
  { label: 'BMI ปกติ', value: '71%', sub: 'ของกองร้อย', tone: 'bg-emerald-100 text-emerald-900' },
  { label: 'Countdown', value: '03', sub: 'เหตุการณ์รอ', tone: 'bg-red-100 text-red-900' },
];

const announcements = [
  { title: 'ประชุมพล.ร.ท. ขอให้นักเรียนเตรียมตัว', pinned: true, date: '24 ส.ค. 2569' },
  { title: 'ประกาศเรื่องสวมเสื้อคอกลมเข้ารับการตรวจสุขภาพ', pinned: false, date: '20 ส.ค. 2569' },
  { title: 'กำหนดการฝึกภาคสนามประจำสัปดาห์', pinned: false, date: '18 ส.ค. 2569' },
];

const schedule = [
  { day: 'วันนี้', title: 'เวรประจำวัน', detail: 'หมวด 2 · หมู่ 3 · จุดยาม 08:00-12:00' },
  { day: 'พรุ่งนี้', title: 'เวรยามเช้า', detail: 'หมวด 1 · หมู่ 5 · จุดตรวจความเรียบร้อย' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="panel mb-6 overflow-hidden border-navy/10 bg-gradient-to-r from-navy via-navy to-[#234d72] text-white">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-amber-200">
                POLICE CADET BATCH 63
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">กองร้อยนักเรียนนายสิบตำรวจ</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-200 md:text-base">
                กองร้อยที่ 2 อาคาร 4 รุ่น 63 • ประวัติ • BMI • เวร • ค่ากรรมการ • กิจกรรม
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/roster" className="rounded-xl bg-gold px-4 py-2 font-semibold text-navy transition hover:opacity-90">ทำเนียบรุ่น</Link>
              <Link href="/login" className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 font-semibold text-white transition hover:bg-white/10">เข้าสู่ระบบ</Link>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className={`panel p-4 ${item.tone}`}>
              <p className="text-sm font-medium opacity-80">{item.label}</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-3xl font-bold">{item.value}</span>
                <span className="pb-1 text-sm opacity-80">{item.sub}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-title">Countdown สำคัญ</h2>
              <span className="badge">live</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {['วันจบการศึกษา', 'สอบภาคกลาง', 'ฝึกภาคสนาม'].map((event, idx) => (
                <div key={event} className="rounded-2xl border border-dashed border-navy/20 bg-amber-50 p-4">
                  <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-navy/70">
                    <span>Event {idx + 1}</span>
                    <span>LIVE</span>
                  </div>
                  <h3 className="text-lg font-bold">{event}</h3>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
                    <div className="rounded-lg bg-white p-2"><div className="text-xl font-bold">12</div><div className="text-[10px]">วัน</div></div>
                    <div className="rounded-lg bg-white p-2"><div className="text-xl font-bold">08</div><div className="text-[10px]">ชม.</div></div>
                    <div className="rounded-lg bg-white p-2"><div className="text-xl font-bold">15</div><div className="text-[10px]">นาที</div></div>
                    <div className="rounded-lg bg-white p-2"><div className="text-xl font-bold">30</div><div className="text-[10px]">วิ</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <h2 className="section-title">ประกาศล่าสุด</h2>
            <div className="mt-4 space-y-3">
              {announcements.map((item) => (
                <div key={item.title} className="flex items-start justify-between rounded-xl border border-navy/10 bg-slate-50 p-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {item.pinned && <span className="badge bg-amber-100 text-amber-900">ปักหมุด</span>}
                      <h3 className="font-semibold text-navy">{item.title}</h3>
                    </div>
                    <p className="mt-1 text-xs text-navy/60">{item.date}</p>
                  </div>
                  <span className="text-xl text-gold">•</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="panel p-5">
            <h2 className="section-title">ปฏิทิน/เวรวันนี้</h2>
            <div className="mt-4 space-y-3">
              {schedule.map((item) => (
                <div key={item.day} className="rounded-xl border border-navy/10 bg-cream p-3">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-navy/60">{item.day}</div>
                  <div className="text-lg font-bold text-navy">{item.title}</div>
                  <p className="mt-1 text-sm text-navy/70">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <h2 className="section-title">เมนูหลัก</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['ทำเนียบรุ่น', '/roster'],
                ['BMI & สุขภาพ', '/bmi'],
                ['ค่ากรรมการรุ่น', '/fees'],
                ['สุ่มรายชื่อ', '/raffle'],
                ['ตารางเวร', '/duty'],
                ['Countdown', '/countdown'],
                ['รายชื่อเตรียมการณ์', '/readiness'],
                ['Wall of Fame', '/wall-of-fame'],
              ].map(([label, href]) => (
                <Link key={label} href={href} className="rounded-2xl border border-navy/10 bg-gradient-to-br from-white to-slate-50 p-4 font-semibold text-navy transition hover:-translate-y-0.5 hover:shadow-md">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
