-- HDP Academy backend: hisoblar, kirish sessiyalari va dars progressi.

create table if not exists users (
  id text primary key,                -- 'tg:<telegram id>'
  telegram_id integer not null unique,
  name text not null,
  username text not null default '',
  created_at integer not null,
  last_seen_at integer not null
);

create table if not exists sessions (
  token_hash text primary key,        -- token bazada ochiq saqlanmaydi
  user_id text not null references users(id) on delete cascade,
  created_at integer not null,
  expires_at integer not null
);

create index if not exists sessions_user on sessions(user_id);

create table if not exists progress (
  user_id text not null references users(id) on delete cascade,
  lesson_id text not null,            -- 'mavzu-1/1.1' ko'rinishida
  state text not null check (state in ('started', 'completed')),
  score integer,
  updated_at integer not null,
  primary key (user_id, lesson_id)
);

create index if not exists progress_user_updated on progress(user_id, updated_at);
