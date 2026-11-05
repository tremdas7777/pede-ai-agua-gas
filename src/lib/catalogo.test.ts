import { expect, test } from "bun:test";
import {
  calcularTotal,
  formatPreco,
  melhorCombinacao,
  melhorDesconto,
  precoCombo,
  sugestaoCombo,
  COMBOS,
  type Precos,
} from "./catalogo";
import { CIDADE_EXEMPLO, encontrarCidade, horariosTexto, statusFuncionamento, vitrine, type Cidade } from "./cidades";

test("vitrine mostra o menor preço real entre as cidades", () => {
  const base = CIDADE_EXEMPLO[0];
  const cara: Cidade = {
    nome: "Itapetinga",
    uf: "BA",
    revenda: { ...base.revenda, precoGas: 125, precoAgua: 14, marcasAgua: ["Lindoya"], descontoCombos: { "1gas1agua": 3 } },
  };
  const v = vitrine([base, cara])!;
  expect(v.precoGas).toBe(115);
  expect(v.precoAgua).toBe(14);
  expect(v.marcasAgua).toContain("Lindoya");
  expect(v.marcasAgua).toContain("Indaiá");
  // Gás + Água: 115 + 16 − 5 = 126 (base) contra 125 + 14 − 3 = 136 → fica 126
  expect(v.combos.find((c) => c.combo.id === "1gas1agua")?.total).toBe(126);
  expect(vitrine([])).toBeNull();
});

const precos: Precos = {
  precoGas: 110,
  precoAgua: 15,
  precoCascoGas: 180,
  precoVasilhameAgua: 30,
  taxaEntrega: 0,
  descontoCombos: { "1gas1agua": 5, "1gas2agua": 8, "3agua": 4 },
};

test("combos têm ids únicos e pelo menos 1 item", () => {
  expect(new Set(COMBOS.map((c) => c.id)).size).toBe(COMBOS.length);
  for (const c of COMBOS) expect(c.gas + c.agua).toBeGreaterThan(0);
});

test("melhor desconto combina os combos ativos", () => {
  expect(melhorDesconto(0, 0, precos.descontoCombos)).toBe(0);
  expect(melhorDesconto(1, 1, precos.descontoCombos)).toBe(5);
  expect(melhorDesconto(1, 2, precos.descontoCombos)).toBe(8);
  // 2 gás + 2 águas: dois "1gas1agua" (10) vale mais que "1gas2agua" (8)
  expect(melhorDesconto(2, 2, precos.descontoCombos)).toBe(10);
  // combo "2gas" sem desconto cadastrado não conta
  expect(melhorDesconto(2, 0, precos.descontoCombos)).toBe(0);
});

test("melhor combinação diz quais combos foram aplicados", () => {
  expect(melhorCombinacao(2, 2, precos.descontoCombos)).toEqual({
    desconto: 10,
    combos: ["1gas1agua", "1gas1agua"],
  });
  expect(melhorCombinacao(1, 2, precos.descontoCombos).combos).toEqual(["1gas2agua"]);
  expect(melhorCombinacao(2, 0, precos.descontoCombos).combos).toEqual([]);
});

test("sugere o item que fecha um combo e quanto economiza a mais", () => {
  expect(sugestaoCombo({ gas: 0, agua: 0 }, precos)).toBeNull();
  // só 1 gás: +1 água fecha "Gás + Água" (R$ 5)
  const s1 = sugestaoCombo({ gas: 1, agua: 0 }, precos);
  expect(s1?.tipo).toBe("agua");
  expect(s1?.ganho).toBe(5);
  expect(s1?.combo.id).toBe("1gas1agua");
  // gás + água: +1 água troca pra "Gás + 2 Águas" (8 − 5 = R$ 3 a mais)
  const s2 = sugestaoCombo({ gas: 1, agua: 1 }, precos);
  expect(s2).toEqual({ tipo: "agua", ganho: 3, combo: COMBOS.find((c) => c.id === "1gas2agua")! });
  // revenda que não vende água não sugere água
  expect(sugestaoCombo({ gas: 1, agua: 0 }, { ...precos, precoAgua: 0 })).toBeNull();
  // já é "Gás + 2 Águas": +1 gás viraria 2 combos (não é "falta 1 pro combo"), então não sugere
  expect(sugestaoCombo({ gas: 1, agua: 2 }, precos)).toBeNull();
  // 2 águas: +1 fecha "3 Águas"
  expect(sugestaoCombo({ gas: 0, agua: 2 }, precos)?.combo.id).toBe("3agua");
});

test("total soma itens, vasilhames, desconto e entrega", () => {
  const t = calcularTotal({ gas: 1, agua: 2, temVazioGas: true, temVazioAgua: false }, precos);
  expect(t.itens).toBe(140);
  expect(t.vasilhames).toBe(60);
  expect(t.desconto).toBe(8);
  expect(t.total).toBe(192);
});

test("sacola vazia não cobra entrega", () => {
  const t = calcularTotal({ gas: 0, agua: 0, temVazioGas: true, temVazioAgua: true }, { ...precos, taxaEntrega: 7 });
  expect(t.total).toBe(0);
});

test("preço do combo mostra a economia real sobre o avulso", () => {
  const combo = COMBOS.find((c) => c.id === "1gas1agua")!;
  expect(precoCombo(combo, precos)).toEqual({ total: 120, avulso: 125, economia: 5 });
});

test("formatPreco usa real brasileiro", () => {
  expect(formatPreco(98.89)).toContain("98,89");
  expect(formatPreco(98.89)).toContain("R$");
});

test("encontra cidade ignorando acento e caixa", () => {
  expect(encontrarCidade("vitoria da conquista", "ba", CIDADE_EXEMPLO)?.uf).toBe("BA");
  expect(encontrarCidade("Salvador", "BA", CIDADE_EXEMPLO)).toBeUndefined();
});


test("horário de funcionamento em Brasília", () => {
  const r = { ...CIDADE_EXEMPLO[0].revenda, horarios: [{ dias: [1, 2, 3, 4, 5, 6], abre: "07:00", fecha: "20:00" }] };
  // quarta 2026-11-04 10:00 em Brasília = 13:00 UTC
  expect(statusFuncionamento(r, new Date("2026-11-04T13:00:00Z")).aberto).toBe(true);
  // quarta 21:00 Brasília → abre amanhã
  expect(statusFuncionamento(r, new Date("2026-11-05T00:00:00Z")).texto).toBe("Fechado · abre amanhã às 07:00");
  // sábado 21:00 Brasília → domingo fechado → abre segunda
  expect(statusFuncionamento(r, new Date("2026-11-08T00:00:00Z")).texto).toBe("Fechado · abre segunda às 07:00");
  expect(horariosTexto(r)).toBe("Seg a Sáb 07:00–20:00");
});
