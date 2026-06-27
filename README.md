# EcoJuy — Portal de Noticias Ambientales

React + Vite + Supabase. Mismo setup que el portal anterior.

## SQL para crear la tabla `articulos`

Ejecutá esto en el SQL Editor de Supabase:

```sql
create table articulos (
  id         bigint generated always as identity primary key,
  created_at timestamptz default now() not null,
  categoria  text not null check (categoria in ('ambiente','residuos','agua','educacion','opinion')),
  titulo     text not null,
  bajada     text,
  cuerpo     text,
  autor      text default 'Redacción EcoJuy',
  media_url  text
);

alter table articulos enable row level security;

create policy "Lectura pública"   on articulos for select using (true);
create policy "Inserción pública" on articulos for insert with check (true);
create policy "Borrado público"   on articulos for delete using (true);
```

## Bucket Storage

Creá el bucket `media` (público) igual que en el portal anterior.

## Variables de entorno

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon
```

## Correr el proyecto

```bash
npm install
npm run dev
```

## URLs

- `/`                  → Portal público
- `/categoria/ambiente` → Filtro por categoría
- `/admin/login`       → Login
- `/admin`             → Panel admin (requiere login)
