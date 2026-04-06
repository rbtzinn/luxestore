# LUXE Store — DummyJSON build

Esta versão foi limpa para rodar **sem Supabase**.

## O que ela usa
- Vite + React + TypeScript
- Tailwind + shadcn/ui
- DummyJSON como fonte externa de produtos
- Zustand para carrinho e wishlist locais

## O que foi removido
- Supabase
- autenticação real
- rotas protegidas
- migrations e config de banco

## Como rodar
```bash
npm install
npm run dev
```

## Variável opcional
Se quiser trocar a base da API:
```bash
VITE_PRODUCTS_API_URL="https://dummyjson.com"
```

## Observações
- catálogo, categorias e página de produto usam a DummyJSON
- carrinho e wishlist ficam no navegador
- painel admin está em modo visual/demo
