# Helo Modas

Este projeto roda em dois modos:

- `demo`: sem backend configurado, usando DummyJSON e painel admin visual.
- `backend`: com API propria em `backend/`, pronta para publicar na Vercel.

## Stack

- Vite + React + TypeScript
- Tailwind + shadcn/ui
- React Query
- Zustand
- i18next
- Vercel Functions no backend

## Como rodar

```bash
npm install
npm run dev
```

## Variaveis

```env
VITE_PRODUCTS_API_URL="https://dummyjson.com"
VITE_BACKEND_API_URL=""
```

## Modos do projeto

### Demo

Sem `VITE_BACKEND_API_URL`:

- catalogo via DummyJSON
- carrinho e wishlist locais
- admin visual/demo
- `/admin` liberado

### Backend

Com `VITE_BACKEND_API_URL` preenchida:

- login real em `/auth`
- cadastro com nome, username e senha
- rota `/admin` protegida
- perfil persistido via API

Veja as instrucoes em:

`backend/README.md`

## Estado atual

- auth real via backend proprio
- guard de admin conectado ao backend
- CRUD visual do admin pronto
- persistencia real depende das variaveis KV/Upstash no projeto backend da Vercel
