# Parche

A local event discovery app built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

---

## Getting Started

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials
3. Install dependencies: `npm install`
4. Run the dev server: `npm run dev`

---

## Database Security (RLS)

This app uses Supabase with **Row Level Security (RLS) enabled on all tables**. RLS ensures that users can only read or modify data they are authorized to access — even if someone obtains the public anon key, they cannot access or manipulate data belonging to other users.

> **RLS must be configured in your Supabase project before deploying.** The frontend relies entirely on these policies for authorization. There is no separate backend enforcing access control.

---

### `users`

| Policy | Operation | Rule |
|--------|-----------|------|
| Users can read their own row | `SELECT` | `auth.uid() = id` |
| Users can update their own row | `UPDATE` | `auth.uid() = id` |
| Users can insert their own row | `INSERT` | `auth.uid() = id` |

```sql
-- SELECT
create policy "Users can read their own row"
on public.users for select
using (auth.uid() = id);

-- UPDATE
create policy "Users can update their own row"
on public.users for update
using (auth.uid() = id);

-- INSERT
create policy "Users can insert their own row"
on public.users for insert
with check (auth.uid() = id);
```

---

### `events`

| Policy | Operation | Rule |
|--------|-----------|------|
| Anyone can read events | `SELECT` | `true` |
| Authenticated users can create events | `INSERT` | `auth.uid() = host_id` |
| Hosts can update their own events | `UPDATE` | `auth.uid() = host_id` |
| Hosts can delete their own events | `DELETE` | `auth.uid() = host_id` |

```sql
-- SELECT (public)
create policy "Anyone can read events"
on public.events for select
using (true);

-- INSERT
create policy "Authenticated users can create events"
on public.events for insert
with check (auth.uid() = host_id);

-- UPDATE
create policy "Hosts can update their own events"
on public.events for update
using (auth.uid() = host_id);

-- DELETE
create policy "Hosts can delete their own events"
on public.events for delete
using (auth.uid() = host_id);
```

---

### `rsvps`

| Policy | Operation | Rule |
|--------|-----------|------|
| Users can read their own RSVPs | `SELECT` | `auth.uid() = user_id` |
| Users can create their own RSVPs | `INSERT` | `auth.uid() = user_id` |
| Users can update their own RSVPs | `UPDATE` | `auth.uid() = user_id` |
| Users can delete their own RSVPs | `DELETE` | `auth.uid() = user_id` |

```sql
-- SELECT
create policy "Users can read their own RSVPs"
on public.rsvps for select
using (auth.uid() = user_id);

-- INSERT
create policy "Users can create their own RSVPs"
on public.rsvps for insert
with check (auth.uid() = user_id);

-- UPDATE
create policy "Users can update their own RSVPs"
on public.rsvps for update
using (auth.uid() = user_id);

-- DELETE
create policy "Users can delete their own RSVPs"
on public.rsvps for delete
using (auth.uid() = user_id);
```

---

### `event_images`

| Policy | Operation | Rule |
|--------|-----------|------|
| Anyone can read event images | `SELECT` | `true` |
| Event host can add images | `INSERT` | `auth.uid() = (select host_id from events where id = event_id)` |
| Event host can delete images | `DELETE` | `auth.uid() = (select host_id from events where id = event_id)` |

```sql
-- SELECT (public)
create policy "Anyone can read event images"
on public.event_images for select
using (true);

-- INSERT
create policy "Event host can add images"
on public.event_images for insert
with check (
  auth.uid() = (select host_id from public.events where id = event_id)
);

-- DELETE
create policy "Event host can delete images"
on public.event_images for delete
using (
  auth.uid() = (select host_id from public.events where id = event_id)
);
```

---

### Enabling RLS

Make sure RLS is enabled on each table. Run this once per table in the Supabase SQL editor:

```sql
alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.rsvps enable row level security;
alter table public.event_images enable row level security;
```
