create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'staff')),
  student_id uuid,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  order_no int not null unique,
  student_code text not null unique,
  full_name text not null,
  platoon int not null check (platoon between 1 and 4),
  squad int not null check (squad between 1 and 5),
  phone text,
  photo_url text,
  hometown text,
  created_at timestamptz default now()
);

alter table students add column if not exists profile_note text;
alter table students add column if not exists note_visibility text not null default 'private' check (note_visibility in ('public', 'members', 'private'));
alter table students add column if not exists show_height boolean not null default true;
alter table students add column if not exists show_weight boolean not null default true;

create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table profiles
  drop constraint if exists profiles_student_id_fkey;

alter table profiles
  add constraint profiles_student_id_fkey
  foreign key (student_id) references students(id) on delete set null;

create table if not exists bmi_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  measured_date date not null,
  height_cm numeric(5,1) not null,
  weight_kg numeric(5,1) not null,
  bmi numeric(5,2) generated always as (weight_kg / ((height_cm/100) * (height_cm/100))) stored,
  category text,
  note text,
  created_at timestamptz default now(),
  unique (student_id, measured_date)
);

create table if not exists fee_months (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  month_order int not null,
  due_year int,
  unique (due_year, month_order)
);

create table if not exists fee_payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  fee_month_id uuid references fee_months(id) on delete cascade,
  paid boolean default false,
  paid_at timestamptz,
  note text,
  unique(student_id, fee_month_id)
);

create table if not exists duty_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text
);

create table if not exists duty_schedule (
  id uuid primary key default gen_random_uuid(),
  duty_type_id uuid references duty_types(id),
  duty_date date not null,
  time_range text,
  location text,
  note text,
  created_by uuid references profiles(id)
);

create table if not exists duty_assignments (
  id uuid primary key default gen_random_uuid(),
  duty_schedule_id uuid references duty_schedule(id) on delete cascade,
  student_id uuid references students(id) on delete cascade
);

create table if not exists countdown_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date timestamptz not null,
  description text,
  is_active boolean default true
);

create table if not exists readiness_lists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists readiness_members (
  id uuid primary key default gen_random_uuid(),
  readiness_list_id uuid references readiness_lists(id) on delete cascade,
  student_id uuid references students(id) on delete cascade,
  status text default 'รอยืนยัน' check (status in ('รอยืนยัน','พร้อม','ไม่พร้อม'))
);

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_pinned boolean default false,
  posted_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date,
  cover_image_url text
);

create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references gallery_albums(id) on delete cascade,
  image_url text not null,
  caption text,
  uploaded_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists wall_of_fame (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  title text not null,
  description text,
  awarded_date date,
  photo_url text,
  created_at timestamptz default now()
);

create table if not exists raffle_draws (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  filter_platoon int,
  filter_squad int,
  drawn_student_ids uuid[],
  drawn_by uuid references profiles(id),
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, student_id, full_name)
  values (
    new.id,
    (select id from public.students where translate(student_code, '๐๑๒๓๔๕๖๗๘๙', '0123456789') = translate(new.raw_user_meta_data->>'student_code', '๐๑๒๓๔๕๖๗๘๙', '0123456789')),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'student_code', new.email)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table profiles enable row level security;
alter table students enable row level security;
alter table bmi_records enable row level security;
alter table fee_months enable row level security;
alter table fee_payments enable row level security;
alter table duty_types enable row level security;
alter table duty_schedule enable row level security;
alter table duty_assignments enable row level security;
alter table countdown_events enable row level security;
alter table readiness_lists enable row level security;
alter table readiness_members enable row level security;
alter table announcements enable row level security;
alter table gallery_albums enable row level security;
alter table gallery_photos enable row level security;
alter table wall_of_fame enable row level security;
alter table raffle_draws enable row level security;
alter table site_settings enable row level security;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename = any (array[
        'profiles', 'students', 'bmi_records', 'fee_months', 'fee_payments',
        'duty_types', 'duty_schedule', 'duty_assignments', 'countdown_events',
        'readiness_lists', 'readiness_members', 'announcements',
        'gallery_albums', 'gallery_photos', 'wall_of_fame', 'raffle_draws', 'site_settings'
      ])
  loop
    execute format('drop policy if exists %I on public.%I', policy_record.policyname, policy_record.tablename);
  end loop;
end;
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'staff'
  );
$$;

revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated;

create policy "Public read access for profiles" on profiles for select using (true);
create policy "Staff can manage profiles" on profiles for insert with check (public.is_staff());
create policy "Staff can update profiles" on profiles for update using (public.is_staff());
create policy "Staff can delete profiles" on profiles for delete using (public.is_staff());

create policy "Public read access" on students for select using (true);
create policy "Staff write access" on students for all using (public.is_staff()) with check (public.is_staff());
create policy "Members update own phone" on students for update
  using (id = (select student_id from public.profiles where id = auth.uid()))
  with check (id = (select student_id from public.profiles where id = auth.uid()));

create policy "Public read site settings" on site_settings for select using (true);
create policy "Staff manage site settings" on site_settings for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on bmi_records for select using (true);
create policy "Staff write access" on bmi_records for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on fee_months for select using (true);
create policy "Staff write access" on fee_months for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on fee_payments for select using (true);
create policy "Staff write access" on fee_payments for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on duty_types for select using (true);
create policy "Staff write access" on duty_types for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on duty_schedule for select using (true);
create policy "Staff write access" on duty_schedule for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on duty_assignments for select using (true);
create policy "Staff write access" on duty_assignments for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on countdown_events for select using (true);
create policy "Staff write access" on countdown_events for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on readiness_lists for select using (true);
create policy "Staff write access" on readiness_lists for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on readiness_members for select using (true);
create policy "Staff write access" on readiness_members for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on announcements for select using (true);
create policy "Staff write access" on announcements for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on gallery_albums for select using (true);
create policy "Staff write access" on gallery_albums for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on gallery_photos for select using (true);
create policy "Staff write access" on gallery_photos for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on wall_of_fame for select using (true);
create policy "Staff write access" on wall_of_fame for all using (public.is_staff()) with check (public.is_staff());

create policy "Public read access" on raffle_draws for select using (true);
create policy "Staff write access" on raffle_draws for all using (public.is_staff()) with check (public.is_staff());
