/**
 * Produtos, combos e cálculo do total. Não há preço nacional: cada cidade usa
 * os preços da revenda que entrega lá (src/lib/cidades.ts).
 */

export const marcasGas = [
  "Copagaz",
  "Ultragaz",
  "Liquigás",
  "Nacional Gás",
  "Supergasbras",
] as const;

export const marcasAgua = [
  "Indaiá",
  "Crystal",
  "Santa Joana",
  "Serra Negra",
  "Ouro Fino",
  "Ibirá",
  "Lindoya",
  "Cristal",
  "Attiva",
  "Vale dos Prata",
] as const;

export type MarcaGas = (typeof marcasGas)[number];
export type MarcaAgua = (typeof marcasAgua)[number];

export type ComboId = "1gas1agua" | "1gas2agua" | "2gas" | "2agua" | "3agua";

export type Combo = { id: ComboId; nome: string; gas: number; agua: number };

export const COMBOS: readonly Combo[] = [
  { id: "1gas1agua", nome: "Gás + Água", gas: 1, agua: 1 },
  { id: "1gas2agua", nome: "Gás + 2 Águas", gas: 1, agua: 2 },
  { id: "2gas", nome: "2 Gás", gas: 2, agua: 0 },
  { id: "2agua", nome: "2 Águas", gas: 0, agua: 2 },
  { id: "3agua", nome: "3 Águas", gas: 0, agua: 3 },
];

export type Precos = {
  precoGas: number;
  precoAgua: number;
  /** Cobrado por botijão quando o cliente não tem o vazio para troca. */
  precoCascoGas: number;
  /** Cobrado por galão quando o cliente não tem o vazio para troca. */
  precoVasilhameAgua: number;
  /** 0 = entrega grátis. */
  taxaEntrega: number;
  /** Só os combos listados aqui aparecem e dão desconto. */
  descontoCombos: Partial<Record<ComboId, number>>;
};

export type Pedido = {
  gas: number;
  agua: number;
  temVazioGas: boolean;
  temVazioAgua: boolean;
};

const centavos = (v: number) => Math.round(v * 100) / 100;

/** Maior desconto possível combinando os combos ativos dentro das quantidades pedidas. */
export function melhorDesconto(
  gas: number,
  agua: number,
  descontos: Precos["descontoCombos"],
): number {
  const ativos = COMBOS.filter((c) => (descontos[c.id] ?? 0) > 0);
  const memo = new Map<string, number>();
  const melhor = (g: number, a: number): number => {
    const chave = `${g},${a}`;
    const salvo = memo.get(chave);
    if (salvo !== undefined) return salvo;
    let r = 0;
    for (const c of ativos) {
      if (c.gas <= g && c.agua <= a) {
        r = Math.max(r, (descontos[c.id] ?? 0) + melhor(g - c.gas, a - c.agua));
      }
    }
    memo.set(chave, r);
    return r;
  };
  return centavos(melhor(gas, agua));
}

export function combosAtivos(precos: Precos): Combo[] {
  return COMBOS.filter((c) => (precos.descontoCombos[c.id] ?? 0) > 0);
}

export function precoCombo(combo: Combo, precos: Precos) {
  const avulso = combo.gas * precos.precoGas + combo.agua * precos.precoAgua;
  const economia = precos.descontoCombos[combo.id] ?? 0;
  return { total: centavos(avulso - economia), avulso: centavos(avulso), economia };
}

export function calcularTotal(pedido: Pedido, precos: Precos) {
  const itens = centavos(pedido.gas * precos.precoGas + pedido.agua * precos.precoAgua);
  const vasilhames = centavos(
    (pedido.temVazioGas ? 0 : pedido.gas * precos.precoCascoGas) +
      (pedido.temVazioAgua ? 0 : pedido.agua * precos.precoVasilhameAgua),
  );
  const desconto = melhorDesconto(pedido.gas, pedido.agua, precos.descontoCombos);
  const vazio = pedido.gas + pedido.agua === 0;
  const entrega = vazio ? 0 : precos.taxaEntrega;
  const total = centavos(itens + vasilhames - desconto + entrega);
  return { itens, vasilhames, desconto, entrega, total };
}

export function formatPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
