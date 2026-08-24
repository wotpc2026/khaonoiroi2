import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';

const input = process.argv[2];
if (!input) throw new Error('Usage: npm run import:excel -- ./xlsx/file.xlsx');
const workbook = XLSX.readFile(input);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
const text = (value) => String(value ?? '').trim();
const sql = (value) => `'${text(value).replace(/'/g, "''")}'`;
const thaiNumber = (value) => Number(text(value).replace(/[๐-๙]/g, (digit) => '๐๑๒๓๔๕๖๗๘๙'.indexOf(digit))) || 0;
let platoon = 1; let squad = 1; const output = [];
for (const row of rows) {
  const marker = text(row[0]).match(/หมู่\s*([๐-๙\d]+)\s*หมวด\s*([๐-๙\d]+)/);
  if (marker) { squad = thaiNumber(marker[1]); platoon = thaiNumber(marker[2]); continue; }
  const order = thaiNumber(row[0]);
  if (!order || !text(row[1]) || !text(row[2])) continue;
  const code = text(row[1]); const name = text(row[2]);
  output.push(`insert into students (order_no, student_code, full_name, platoon, squad) values (${order}, ${sql(code)}, ${sql(name)}, ${platoon}, ${squad}) on conflict (student_code) do update set order_no = excluded.order_no, full_name = excluded.full_name, platoon = excluded.platoon, squad = excluded.squad;`);
  for (const [date, height, weight, category] of [['2026-08-06', row[3], row[4], row[6]], ['2026-08-20', row[3], row[7], row[9]]) {
    if (Number(height) && Number(weight)) output.push(`insert into bmi_records (student_id, measured_date, height_cm, weight_kg, category, note) select id, ${sql(date)}, ${Number(height)}, ${Number(weight)}, ${sql(category)}, 'นำเข้าจาก Excel' from students where student_code = ${sql(code)} on conflict (student_id, measured_date) do update set height_cm = excluded.height_cm, weight_kg = excluded.weight_kg, category = excluded.category;`);
  }
}
const destination = path.resolve('supabase', 'imported-students.sql');
fs.writeFileSync(destination, `-- Generated from ${path.basename(input)}\nbegin;\n${output.join('\n')}\ncommit;\n`);
console.log(`Generated ${output.filter((line) => line.startsWith('insert into students')).length} students in ${destination}`);