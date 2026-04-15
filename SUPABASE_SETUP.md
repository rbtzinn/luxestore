# Supabase Setup

Este projeto agora aceita dois modos:

- `demo`: sem credenciais, usando DummyJSON e admin visual
- `supabase`: com auth real e rota admin protegida

## 1. Criar projeto

No Supabase:

- crie um projeto novo
- ative `Authentication > Email`
- deixe `Storage` ativo
- abra o `SQL Editor`

## 2. Rodar schema

Execute:

`supabase/schema.sql`

Se o projeto Supabase ja existia antes deste upgrade, rode tambem:

`supabase/auth_profile_upgrade.sql`

Depois marque seu usuario como admin:

```sql
update public.user_profiles
set role = 'admin'
where email = 'SEU_EMAIL_AQUI';
```

## 3. Ajustar email com codigo

Se voce quiser confirmar por codigo no front:

- abra `Authentication > Email Templates`
- edite `Confirm signup`
- use o token do email no template, nao apenas o link

Sem isso, o Supabase costuma enviar confirmacao por link.

## 4. Variaveis

Preencha o `.env`:

```env
VITE_PRODUCTS_API_URL="https://dummyjson.com"
VITE_SUPABASE_URL="https://SEU-PROJETO.supabase.co"
VITE_SUPABASE_ANON_KEY="SUA_ANON_KEY"
VITE_SUPABASE_ADMIN_EMAIL="seu-email-admin@exemplo.com"
```

## 5. O que ja esta pronto

- client Supabase
- auth context
- guard de admin
- pagina `/auth` com cadastro, username e confirmacao por codigo
- schema SQL inicial com RLS
- bucket `catalog-assets`

## 6. O que eu ainda consigo ligar depois

Quando voce me mandar as credenciais finais, eu consigo fazer a fase 2:

- trocar admin demo por CRUD persistido
- carregar catalogo do Postgres
- salvar produtos, categorias, banners e cupons no banco
- subir imagens para o Storage
- criar fluxo real de pedidos e perfis
