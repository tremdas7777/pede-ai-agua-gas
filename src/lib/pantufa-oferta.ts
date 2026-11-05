import { brand } from "@/lib/brand";
import { getBundle, type BundleId } from "@/lib/bundles";

/**
 * Oferta das pantufas que abre ao clicar em "Comprar" nos pijamas: 1 par (escolhe a cor) ou as duas
 * cores com desconto. Preço de cada par = o da loja (adulto ou infantil). Usado no servidor; o
 * cliente só exibe.
 */
export const PANTUFA_CORES = ["Branco", "Preto"] as const;
export const PANTUFA_TAMANHOS_INFANTIL = ["28-29", "30-31", "32-33", "34-35"] as const;
export const PANTUFA_TAMANHOS_ADULTO = ["36-37", "38-39", "40-41", "42-43", "44-45"] as const;
export const PANTUFA_TAMANHOS = [...PANTUFA_TAMANHOS_INFANTIL, ...PANTUFA_TAMANHOS_ADULTO] as const;
export type PantufaCor = (typeof PANTUFA_CORES)[number];
export type PantufaTamanho = (typeof PANTUFA_TAMANHOS)[number];
export type PantufaPar = { cor: PantufaCor; tamanho: PantufaTamanho };

/** Desconto ao levar as duas cores (dividido entre os dois pares). Ajuste aqui. */
export const DESCONTO_DOIS_PARES = 19.9;

/** Produtos que mostram a oferta ao clicar em comprar. */
const PIJAMAS: readonly BundleId[] = [
  "pijama",
  "pijamai",
  "kitcasal",
  "kitshortf",
  "kitshortm",
  "kitshorti",
  "kitcalca",
  "kitcalcaf",
  "kitcalcam",
  "kitcalcai",
];
export const temOfertaPantufas = (id: BundleId) => PIJAMAS.includes(id);
/** Pijama infantil: o popup mostra primeiro a numeração infantil. */
export const pijamaInfantil = (id: BundleId) =>
  (["pijamai", "kitshorti", "kitcalcai"] as BundleId[]).includes(id);

/** Uma foto por cor (só o par daquela cor). */
export const PANTUFA_IMG: Record<PantufaCor, string> = {
  Branco: "/produtos/p3b.jpg",
  Preto: "/produtos/p3c.jpg",
};

const isInfantil = (t: PantufaTamanho) =>
  (PANTUFA_TAMANHOS_INFANTIL as readonly string[]).includes(t);

/** Preço de um par, igual ao da página das pantufas. */
export const parPrice = (t: PantufaTamanho) =>
  getBundle(isInfantil(t) ? "pantufai" : "pantufa").price;

/** Até 2 pares e, com 2, um de cada cor. */
export const paresOk = (pares: readonly PantufaPar[]) =>
  pares.length <= 2 && (pares.length < 2 || pares[0]?.cor !== pares[1]?.cor);

/** Itens do pedido, no formato dos order bumps. */
export function pantufaItems(pares: readonly PantufaPar[]) {
  const desconto = pares.length === 2 ? DESCONTO_DOIS_PARES / 2 : 0;
  return pares.map((p) => ({
    id: "pantufa" as const,
    name: `Pantufas ${p.cor} ${p.tamanho}`,
    fullName: `Pantufas de Dragão ${p.cor} (${p.tamanho})`,
    gatewayName: `${brand.gatewayName} Pantufas`,
    price: Math.round((parPrice(p.tamanho) - desconto) * 100) / 100,
    img: PANTUFA_IMG[p.cor],
  }));
}

export const pantufasTotal = (pares: readonly PantufaPar[]) =>
  Math.round(pantufaItems(pares).reduce((s, x) => s + x.price * 100, 0)) / 100;

/** Na URL do checkout: "Branco_38-39,Preto_40-41". */
export const encodePantufas = (pares: readonly PantufaPar[]) =>
  pares.map((p) => `${p.cor}_${p.tamanho}`).join(",");

export function parsePantufas(v: string | undefined): PantufaPar[] {
  if (!v) return [];
  const pares: PantufaPar[] = [];
  for (const part of v.split(",")) {
    const [cor, tamanho] = part.split("_");
    if (
      !(PANTUFA_CORES as readonly string[]).includes(cor ?? "") ||
      !(PANTUFA_TAMANHOS as readonly string[]).includes(tamanho ?? "")
    )
      return [];
    pares.push({ cor: cor as PantufaCor, tamanho: tamanho as PantufaTamanho });
  }
  return paresOk(pares) ? pares : [];
}
