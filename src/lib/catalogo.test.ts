import { expect, test } from "bun:test";
import { calcularTotal, formatPreco, melhorDesconto, precoCombo, COMBOS, type Precos } from "./catalogo";
import { camposFaltando, CIDADE_EXEMPLO, encontrarCidade, horariosTexto, statusFuncionamento } from "./cidades";

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

test("revenda sem CNPJ/ANP aparece como incompleta", () => {
  const faltando = camposFaltando(CIDADE_EXEMPLO[0].revenda);
  expect(faltando).toContain("CNPJ");
  expect(faltando).toContain("autorização ANP");
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
