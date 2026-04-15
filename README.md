# LUXE Store

Este projeto roda em dois modos:

- `demo`: sem backend configurado, usando DummyJSON e painel admin visual
- `supabase-ready`: com auth, guard e schema SQL preparados para plugar no Supabase

## Stack

- Vite + React + TypeScript
- Tailwind + shadcn/ui
- React Query
- Zustand
- i18next
- Supabase JS

## Como rodar

```bash
npm install
npm run dev
```

## Variaveis

```env
VITE_PRODUCTS_API_URL="https://dummyjson.com"
VITE_SUPABASE_URL=""
VITE_SUPABASE_ANON_KEY=""
VITE_SUPABASE_ADMIN_EMAIL=""
```

## Modos do projeto

### Demo

Sem credenciais Supabase:

- catalogo via DummyJSON
- carrinho e wishlist locais
- admin visual/demo
- `/admin` liberado

### Supabase

Com as variaveis preenchidas:

- login real em `/auth`
- cadastro com nome, username e senha
- confirmacao por codigo de email
- rota `/admin` protegida
- estrutura SQL e RLS pronta

Veja:

`SUPABASE_SETUP.md`

## Estado atual

- auth real preparado
- guard de admin preparado
- schema SQL pronto
- CRUD visual do admin pronto
- persistencia real ainda depende das credenciais do seu projeto Supabase
