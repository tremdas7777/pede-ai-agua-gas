import {
  availableBundles,
  DESTAQUE_LOJA,
  getBundle,
  parseBundleId,
  type BundleId,
} from "@/lib/bundles";

/**
 * "Mais vendidos": ranking feito com os pedidos da loja, pagos e pendentes (mais-vendidos.functions.ts),
 * com os pijamas kigurumi sempre na frente. Enquanto houver poucos produtos pedidos, a seção vira
 * "Destaques da loja" com a lista abaixo.
 */
export type MaisVendidos = { ids: BundleId[]; reais: boolean };

/** Produtos vendidos diferentes necessários para mostrar o ranking real. */
export const MIN_VENDIDOS = 4;
export const MAX_MAIS_VENDIDOS = 12;

/**
 * Sempre aparecem primeiro, antes do ranking (escolha da loja): o destaque, os kigurumis, a
 * pelúcia gigante (1 por R$ 69 / 2 por R$ 89) e o umidificador de dragão (1 por R$ 69 / 2 por R$ 99).
 */
export const FIXOS: readonly BundleId[] = [
  ...DESTAQUE_LOJA,
  "kgban2",
  "kgsti2",
  "kgang2",
  "kgfur2",
  "pelucia",
  "umid1",
];

/** Fixos na frente e o resto sem repetir, até o limite. */
export const comFixos = (ids: readonly BundleId[]) =>
  [...FIXOS, ...ids.filter((id) => !FIXOS.includes(id))].slice(0, MAX_MAIS_VENDIDOS);
/** Escolhidos à mão, usados até a loja ter vendas suficientes. */
export const DESTAQUES: readonly BundleId[] = [
  "pantufa2",
  "aneis",
  "colares",
  "snuggy",
  "kitcasal",
  "kitcalca",
  "mdpreto",
  "pijama",
];

export const titulo = (m: MaisVendidos) => (m.reais ? "Mais vendidos" : "Destaques da loja");

/**
 * Produto da vitrine que representa um item vendido: a versão infantil conta para a adulta, o
 * combo de 4 para o de 2 e o conjunto avulso para o kit. Itens que só existem como adicional
 * (pantufas e ursinhos do kigurumi) não entram.
 */
export function produtoDaVitrine(raw: string): BundleId | null {
  const id = parseBundleId(raw);
  if (!id) return null;
  const b = getBundle(id);
  if (b.listed !== false) return b.id;
  const doGrupo = b.group
    ? availableBundles.find((x) => x.group === b.group && x.listed !== false)
    : undefined;
  if (doGrupo) return doGrupo.id;
  const destino = b.redirectTo ? getBundle(b.redirectTo) : undefined;
  return destino && destino.category === b.category ? destino.id : null;
}
