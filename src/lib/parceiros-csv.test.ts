import { expect, test } from "bun:test";
import { cnpjValido, mascaraCnpj } from "./cnpj";
import { importar, lerCsv, lerPreco, linhaCsv, validarLinha, COLUNAS, type LinhaCsv } from "./parceiros-csv";

const CAB = COLUNAS.join(",");
const boa: LinhaCsv = {
  cidade: "Vitória da Conquista",
  uf: "ba",
  revenda: "Gás Bom Ltda",
  cnpj: "33000167000101",
  autorizacao_anp: "123456",
  endereco: "Rua A, 10 - Centro",
  whatsapp: "(77) 99999-0000",
  dias_semana: "seg-sab",
  abre_semana: "07:00",
  fecha_semana: "20:00",
  abre_domingo: "08:00",
  fecha_domingo: "12:00",
  prazo_min: "30",
  prazo_max: "50",
  preco_gas: "115,00",
  preco_agua: "16",
  preco_casco_gas: "180",
  preco_vasilhame_agua: "30",
  taxa_entrega: "0",
  marcas_gas: "Copagaz|Ultragaz",
  marcas_agua: "Indaiá",
  descontos_combo: "1gas1agua=5",
};

test("CNPJ numérico e alfanumérico", () => {
  expect(cnpjValido("33.000.167/0001-01")).toBe(true);
  expect(cnpjValido("12.ABC.345/01DE-35")).toBe(true);
  expect(cnpjValido("33.000.167/0001-02")).toBe(false);
  expect(cnpjValido("00.000.000/0001-00")).toBe(false);
  expect(mascaraCnpj("12abc34501de35")).toBe("12.ABC.345/01DE-35");
});

test("preço aceita vírgula, ponto e R$", () => {
  expect(lerPreco("115,00")).toBe(115);
  expect(lerPreco("R$ 1.150,50")).toBe(1150.5);
  expect(lerPreco("16.9")).toBe(16.9);
  expect(lerPreco("")).toBe(0);
});

test("lê CSV do Excel com ponto e vírgula e aspas", () => {
  const texto = "﻿cidade;uf;endereco\r\n\"Itapetinga\";BA;\"Rua X; 10\"\r\n";
  expect(lerCsv(texto)).toEqual([{ cidade: "Itapetinga", uf: "BA", endereco: "Rua X; 10" }]);
});

test("linha válida vira cidade com revenda completa", () => {
  const r = validarLinha(boa);
  expect(r.tipo).toBe("ok");
  if (r.tipo !== "ok") return;
  expect(r.cidade.uf).toBe("BA");
  expect(r.cidade.revenda.cnpj).toBe("33.000.167/0001-01");
  expect(r.cidade.revenda.whatsapp).toBe("5577999990000");
  expect(r.cidade.revenda.precoGas).toBe(115);
  expect(r.cidade.revenda.horarios).toEqual([
    { dias: [1, 2, 3, 4, 5, 6], abre: "07:00", fecha: "20:00" },
    { dias: [0], abre: "08:00", fecha: "12:00" },
  ]);
  expect(r.cidade.revenda.descontoCombos).toEqual({ "1gas1agua": 5 });
});

test("gás sem autorização ANP é recusado", () => {
  const r = validarLinha({ ...boa, autorizacao_anp: "" });
  expect(r.tipo).toBe("erro");
  if (r.tipo === "erro") expect(r.erros.join()).toContain("ANP");
});

test("só água não exige ANP", () => {
  const r = validarLinha({ ...boa, autorizacao_anp: "", preco_gas: "", marcas_gas: "" });
  expect(r.tipo).toBe("ok");
});

test("CNPJ, UF, WhatsApp e horário inválidos aparecem nos erros", () => {
  const r = validarLinha({ ...boa, cnpj: "123", uf: "XX", whatsapp: "999", fecha_semana: "06:00" });
  expect(r.tipo).toBe("erro");
  if (r.tipo !== "erro") return;
  const t = r.erros.join(" | ");
  expect(t).toContain("CNPJ");
  expect(t).toContain("UF");
  expect(t).toContain("WhatsApp");
  expect(t).toContain("horário");
});

test("importar ignora exemplo, acusa cidade repetida e numera linhas", () => {
  const texto = [
    CAB,
    linhaCsv({ ...boa, cidade: "EXEMPLO Cidade" }),
    linhaCsv(boa),
    linhaCsv({ ...boa, revenda: "Outra" }),
    linhaCsv({ ...boa, cidade: "Itapetinga", cnpj: "1" }),
  ].join("\n");
  const rel = importar(texto);
  expect(rel.exemplos).toBe(1);
  expect(rel.cidades.map((c) => c.nome)).toEqual(["Vitória da Conquista"]);
  expect(rel.erros.map((e) => e.linha)).toEqual([4, 5]);
});

test("linhaCsv faz ida e volta pelo leitor", () => {
  const texto = `${CAB}\n${linhaCsv(boa)}`;
  expect(lerCsv(texto)[0]).toEqual(boa);
});
