# Project Space Admin

Painel de administração para criar e gerir projetos da plataforma Project Space.

## Stack

- Next.js 16 (App Router)
- Supabase (Auth + Database) com Google OAuth
- Tailwind CSS 4 + shadcn/ui
- TypeScript

## Configuração

1. Use o **mesmo projeto Supabase** do `project-space`.
2. O SQL da tabela `projects` e as policies já devem estar criados (veja o README do project-space).
3. Ative o provider **Google** em Authentication → Providers no Supabase.
4. Em Authentication → URL Configuration adicione:
   - Site URL: `http://localhost:3001`
   - Redirect URLs: `http://localhost:3001/**` e `http://localhost:3000/**`
5. No Google Cloud Console, crie um OAuth Client ID (Web) e adicione os origins/redirects correspondentes.
6. Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

7. Instale e rode (porta 3001):

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3001](http://localhost:3001).

## Funcionalidades

- Login com Google
- Criar projeto (título + descrição)
- Listar projetos
- Apagar projetos

## Notas

- Qualquer utilizador autenticado pode gerir projetos (pode restringir depois com roles).
- A visualização pública fica no repositório `project-space`.
