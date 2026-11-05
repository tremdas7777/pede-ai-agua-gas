# Banguela's Shop

Banguela Shop — produtos de dragão (pijamas, pantufas, Snuggy, joias e mascotes para carro),
com checkout próprio (Pix + cartão), painel admin e integrações de rastreio e marketing.

This project was built with [Lovable](https://lovable.dev).
Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a1e6ad06-2da1-4499-a50b-878ca11a11ff).
Push to `main` on GitHub and your changes sync back into Lovable.

## O que tem na loja

- **Vitrine**: home com prateleiras por coleção, banners e página de produto com cor/tamanho (`src/routes/index.tsx`, `src/routes/produto.tsx`).
- **Checkout** (`/checkout`): 3 etapas, Pix (PixGate, Umbrella ou SagacePay) e cartão em até 12x (HyperCash), order bumps, upsell pós-compra, envio expresso. O preço é sempre recalculado no servidor.
- **Painel admin** (`/admin`): funil em tempo real, pedidos, checkouts abandonados e configuração dos gateways, do Meta Pixel e da UTMify.
- **Rastreio** (`/rastreio`) e páginas de política, FAQ, sobre e contato.

## Antes de vender — o que configurar

1. **Supabase**: crie um projeto, rode os arquivos de `supabase/migrations/` (ou conecte o Lovable Cloud) e preencha o `.env` com a URL, o ID e a chave **pública** do projeto. Ajuste o `project_id` em `supabase/config.toml`.
2. **Segredos do servidor** (nas variáveis secretas do Lovable/Cloudflare — **nunca** no `.env`):
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD` — a senha do `/admin`
   - chaves dos gateways que for usar (`PIXGATE_API_KEY`, `UMBRELLA_API_KEY`, `SAGACEPAY_API_KEY`, `HYPERCASH_SECRET_KEY`, `HYPERCASH_PUBLIC_KEY`) e de rastreio (`RASTROCODE_API_KEY`, `RASTREIO_API_KEY`, `RASTREIO_API_URL`). As chaves de gateway, Meta e UTMify também podem ser cadastradas pelo `/admin`.
3. **Dados da empresa**: CNPJ, e-mail e WhatsApp em `src/lib/brand.ts` (hoje estão como exemplo).
4. **Produtos e preços**: `src/lib/bundles.ts` (nome, preço, preço "de", fotos, cores e tamanhos). Order bumps em `src/lib/order-bump.ts` e upsell em `src/lib/upsell.ts`. Fotos em `public/produtos/`.
5. **Pixels**: o Meta Pixel é cadastrado no `/admin`. TikTok e UTMify (navegador) vão em `src/lib/pixels.ts`.
6. **Webhook**: registre `https://SEU-DOMINIO/api/public/pix-webhook` em cada gateway.
7. **Imagem de compartilhamento**: troque `og:image` em `src/routes/__root.tsx` por uma URL absoluta quando tiver o domínio.

## Rodar localmente

```sh
bun install
bun run dev
```
