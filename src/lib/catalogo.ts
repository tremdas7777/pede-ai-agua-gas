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

export type Combinacao = { desconto: number; combos: ComboId[] };

/** Combos que dão o maior desconto dentro das quantidades pedidas (um combo pode repetir). */
export function melhorCombinacao(
  gas: number,
  agua: number,
  descontos: Precos["descontoCombos"],
): Combinacao {
  const ativos = COMBOS.filter((c) => (descontos[c.id] ?? 0) > 0);
  const memo = new Map<string, Combinacao>();
  const melhor = (g: number, a: number): Combinacao => {
    const chave = `${g},${a}`;
    const salvo = memo.get(chave);
    if (salvo) return salvo;
    let r: Combinacao = { desconto: 0, combos: [] };
    for (const c of ativos) {
      if (c.gas <= g && c.agua <= a) {
        const resto = melhor(g - c.gas, a - c.agua);
        const desconto = (descontos[c.id] ?? 0) + resto.desconto;
        if (desconto > r.desconto) r = { desconto, combos: [c.id, ...resto.combos] };
      }
    }
    memo.set(chave, r);
    return r;
  };
  const r = melhor(gas, agua);
  return { desconto: centavos(r.desconto), combos: r.combos };
}

export function melhorDesconto(gas: number, agua: number, descontos: Precos["descontoCombos"]): number {
  return melhorCombinacao(gas, agua, descontos).desconto;
}

export type Sugestao = { tipo: "gas" | "agua"; ganho: number; combo: Combo };

/**
 * Mais 1 gás ou 1 água que transforma a sacola inteira em exatamente um combo
 * (ex.: 1 gás → "Gás + Água"). Sacola maior que qualquer combo não recebe sugestão.
 * Entre gás e água, fica a que custa menos ao cliente (preço do item − desconto ganho).
 */
export function sugestaoCombo(pedido: { gas: number; agua: number }, precos: Precos): Sugestao | null {
  if (pedido.gas + pedido.agua === 0) return null;
  const atual = melhorCombinacao(pedido.gas, pedido.agua, precos.descontoCombos);
  let melhor: Sugestao | null = null;
  let menorCusto = Infinity;
  for (const tipo of ["agua", "gas"] as const) {
    const preco = tipo === "gas" ? precos.precoGas : precos.precoAgua;
    if (!(preco > 0)) continue;
    const gas = pedido.gas + (tipo === "gas" ? 1 : 0);
    const agua = pedido.agua + (tipo === "agua" ? 1 : 0);
    const novo = melhorCombinacao(gas, agua, precos.descontoCombos);
    if (novo.combos.length !== 1) continue;
    const combo = COMBOS.find((c) => c.id === novo.combos[0])!;
    if (combo.gas !== gas || combo.agua !== agua) continue;
    const ganho = centavos(novo.desconto - atual.desconto);
    if (ganho <= 0 || preco - ganho >= menorCusto) continue;
    menorCusto = preco - ganho;
    melhor = { tipo, ganho, combo };
  }
  return melhor;
}

export function combosAtivos(precos: Precos): Combo[] {
  return COMBOS.filter((c) => (precos.descontoCombos[c.id] ?? 0) > 0);
}

export function precoCombo(combo: Combo, precos: Precos) {
  const avulso = combo.gas * precos.precoGas + combo.agua * precos.precoAgua;
  const economia = precos.descontoCombos[combo.id] ?? 0;
  return { total: centavos(avulso - economia), avulso: centavos(avulso), economia };
}

export type OfertaCombo = { combo: Combo; total: number; avulso: number; economia: number };

/** O que a tela mostra: preços, marcas e combos (de uma revenda ou da vitrine "a partir de"). */
export type Oferta = {
  precoGas: number;
  precoAgua: number;
  marcasGas: readonly string[];
  marcasAgua: readonly string[];
  combos: OfertaCombo[];
};

export function ofertaDe(r: Precos & { marcasGas: readonly string[]; marcasAgua: readonly string[] }): Oferta {
  return {
    precoGas: r.precoGas,
    precoAgua: r.precoAgua,
    marcasGas: r.marcasGas,
    marcasAgua: r.marcasAgua,
    combos: combosAtivos(r).map((combo) => ({ combo, ...precoCombo(combo, r) })),
  };
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
