# Luxestore Backend

API independente para login, cadastro e perfil, pronta para publicar como um projeto separado na Vercel.

## Como funciona

- A Vercel roda esta API como Serverless Functions. Ela nao fica ligada 24h como um servidor VPS; cada rota acorda quando recebe uma requisicao.
- Para os usuarios continuarem existindo depois do deploy, configure um storage persistente. Este backend usa Vercel KV/Upstash Redis pelas variaveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`.
- Localmente, se o KV nao estiver configurado, ele cria `backend/.data/db.json` apenas para testes.

## Variaveis na Vercel

Configure no projeto backend:

```bash
JWT_SECRET=uma-chave-bem-grande-e-secreta
ALLOWED_ORIGINS=https://seu-frontend.vercel.app
ADMIN_EMAIL=admin@seudominio.com
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

## Rotas

Base URL local com `vercel dev`: `http://localhost:3000`

### `GET /api/health`

Confere se a API esta online.

### `POST /api/auth/signup`

Cria conta.

```json
{
  "email": "cliente@email.com",
  "password": "12345678",
  "username": "cliente",
  "fullName": "Cliente Luxo"
}
```

### `POST /api/auth/login`

Retorna `accessToken`, `user` e `profile`.

```json
{
  "email": "cliente@email.com",
  "password": "12345678"
}
```

### `GET /api/auth/me`

Precisa do header:

```http
Authorization: Bearer seu_accessToken
```

### `PATCH /api/profile`

Atualiza perfil do usuario autenticado.

```json
{
  "fullName": "Novo Nome",
  "username": "novo_usuario",
  "phone": "+55 11 99999-9999",
  "avatarUrl": "https://..."
}
```

### `POST /api/auth/logout`

Stateless logout. O frontend so precisa apagar o token salvo.

## Exemplo no frontend

```ts
const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

const response = await fetch(`${apiUrl}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

Guarde o `accessToken` no frontend e envie em `Authorization: Bearer ...` nas rotas protegidas.
