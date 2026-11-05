import { encodeVariant, getBundle, PERSONAGENS, type Bundle, type BundleId } from "@/lib/bundles";
import type { CartItem } from "@/lib/cart";
import { temOfertaPantufas } from "@/lib/pantufa-oferta";

/**
 * Extras dos pijamas: ursinhos além do de brinde (na página do kigurumi) e as pantufas que combinam
 * com os pijamas (popup ao comprar). Viram itens comuns do checkout; o preço de cada um vem do
 * catálogo, no servidor.
 */
export type ComboExtras = { ursinhos: Readonly<Record<string, number>> };
export const SEM_EXTRAS: ComboExtras = { ursinhos: {} };
export const MAX_URSINHOS = 10;

const precoItens = (itens: readonly CartItem[]) =>
  Math.round(itens.reduce((s, it) => s + getBundle(it.plano).price * it.qtd * 100, 0)) / 100;

/** Ursinhos extras como itens do pedido, e o total deles. */
export function comboExtrasItens(e: ComboExtras) {
  const itens: CartItem[] = PERSONAGENS.flatMap((nome) => {
    const qtd = e.ursinhos[nome] ?? 0;
    return qtd > 0 ? [{ plano: "ursinho" as const, variante: nome, qtd }] : [];
  });
  return { itens, total: precoItens(itens) };
}

/** Pantufas vendidas em pacote: 2 ou 4 pares, cada pacote com o seu preço no catálogo. */
export const PANTUFA_PACOTES: readonly { pares: 2 | 4; id: BundleId }[] = [
  { pares: 2, id: "pantufa2" },
  { pares: 4, id: "pantufa4" },
];
export const pacotePantufas = (pares: number) => PANTUFA_PACOTES.find((p) => p.pares === pares);

export type ParPantufa = { personagem: string; numero: string };

/** Pares escolhidos no popup → item do pedido (ou nada, se a quantidade não fecha um pacote). */
export function pantufaItem(pares: readonly ParPantufa[]): CartItem | null {
  const pacote = pacotePantufas(pares.length);
  if (!pacote) return null;
  const values = pares.flatMap((p) => [p.personagem, p.numero]);
  return { plano: pacote.id, variante: encodeVariant(values), qtd: 1 };
}

export const itensTotal = precoItens;

/** Pantufa da cor do pijama de dragão: preto vira Banguela e branco vira Fúria da Luz. */
const pantufaDaCor = (v: string) =>
  /pret/i.test(v) ? "Banguela" : /branc/i.test(v) ? "Fúria da Luz" : null;

/**
 * Pantufas oferecidas ao comprar um pijama, já combinando com o que foi escolhido: no kigurumi, o
 * mesmo personagem de cada pijama; nos pijamas de dragão, a cor de cada conjunto. Sempre ao menos
 * 2 (o pacote mínimo): com um pijama só, entra também a da outra cor.
 */
export function pantufasSugeridas(
  b: Bundle,
  sel: Readonly<Record<string, string>>,
): { personagens: string[]; rotulos: string[]; descricao: string } | null {
  if (b.comboExtras) {
    const opcoes = b.options.filter((o) => o.name.startsWith("Personagem ("));
    return {
      personagens: opcoes.map((o) => sel[o.name] ?? ""),
      rotulos: opcoes.map((_, i) => `do ${i + 1}º pijama`),
      descricao: "dos mesmos personagens que você escolheu",
    };
  }
  if (!temOfertaPantufas(b.id)) return null;
  const sugestoes = b.options
    .filter((o) => o.name.startsWith("Modelo"))
    .flatMap((o) => {
      const p = pantufaDaCor(sel[o.name] ?? "");
      const grupo = / \((\dº conjunto)\)$/.exec(o.name)?.[1];
      return p ? [{ p, r: grupo ? `do ${grupo}` : "da cor do seu pijama" }] : [];
    });
  if (sugestoes.length === 1) {
    const outra = sugestoes[0]!.p === "Banguela" ? "Fúria da Luz" : "Banguela";
    sugestoes.push({ p: outra, r: "para combinar" });
  }
  return {
    personagens: sugestoes.map((s) => s.p),
    rotulos: sugestoes.map((s) => s.r),
    descricao: "nas cores do seu pijama",
  };
}
