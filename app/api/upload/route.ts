import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const form = await request.formData();
  const image = form.get('image');
  const apiKey = process.env.IMGBB_API_KEY;
  if (!(image instanceof File) || !apiKey) return NextResponse.json({ error: 'ตั้งค่าไฟล์หรือ IMGBB_API_KEY ไม่ครบ' }, { status: 400 });
  const body = new FormData(); body.append('image', image);
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body });
  const result = await response.json();
  if (!response.ok || !result.success) return NextResponse.json({ error: 'อัปโหลดรูปไม่สำเร็จ' }, { status: 502 });
  return NextResponse.json({ url: result.data.url, displayUrl: result.data.display_url });
}