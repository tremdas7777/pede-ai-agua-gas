# Pede Aí Água e Gás

Rede nacional de delivery de água mineral 20L e gás de cozinha 13kg. O cliente
escolhe um dos 7 combos (gás, água, 2 gás, 2 água, 3 água, 1+1, 1+2),
seleciona marca (ex.: Copagaz, Ultragaz, Indaiá, Crystal), paga por Pix e
acompanha a entrega. Pensado como marketplace: a coluna `city` dos pedidos
define quem na rede atende.

## Fonte de preços

- Catálogo em `src/lib/catalogo.ts` (combos + preço base nacional).
- Preços por cidade (quando houver) em `cidade_precos` no Supabase; se vazio,
  vale o preço nacional do catálogo.
- `src/lib/catalogo.test.ts` roda com `bun test` e valida todos os packs.

## Base copiada de Banguela Shop

Este projeto nasceu copiando `~/banguela-s-shop` em 2026-11-04 e foi
rebrandeado. Muitos arquivos ainda têm vestígios ("crocs", "dragão", "pantufa",
"pijama") que vão sendo trocados conforme a página é refatorada. **Esta loja
não é Lovable** — commitar na main é commit limpo, sem sync externo.
