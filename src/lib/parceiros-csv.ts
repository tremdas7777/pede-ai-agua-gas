import { COMBOS, type ComboId } from "./catalogo";
import { cnpjValido, mascaraCnpj } from "./cnpj";
import { normalizar, type Cidade, type Horario } from "./cidades";
import { normalizeWhatsapp } from "./whatsapp";

export const COLUNAS = [
  "cidade",
  "uf",
  "revenda",
  "cnpj",
  "autorizacao_anp",
  "endereco",
  "whatsapp",
  "dias_semana",
  "abre_semana",
  "fecha_semana",
  "abre_domingo",
  "fecha_domingo",
  "prazo_min",
  "prazo_max",
  "preco_gas",
  "preco_agua",
  "preco_casco_gas",
  "preco_vasilhame_agua",
  "taxa_entrega",
  "marcas_gas",
  "marcas_agua",
  "descontos_combo",
] as const;

export type Coluna = (typeof COLUNAS)[number];
export type LinhaCsv = Partial<Record<Coluna, string>>;

const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

/** Lê CSV com "," ou ";" (Excel em português) e campos entre aspas. */
export function lerCsv(texto: string): LinhaCsv[] {
  const limpo = texto.replace(/^﻿/, "");
  const primeira = limpo.split(/\r?\n/, 1)[0] ?? "";
  const sep = (primeira.match(/;/g)?.length ?? 0) > (primeira.match(/,/g)?.length ?? 0) ? ";" : ",";

  const linhas: string[][] = [];
  let campo = "";
  let linha: string[] = [];
  let aspas = false;
  for (let i = 0; i < limpo.length; i++) {
    const ch = limpo[i];
    if (aspas) {
      if (ch === '"' && limpo[i + 1] === '"') {
        campo += '"';
        i++;
      } else if (ch === '"') aspas = false;
      else campo += ch;
    } else if (ch === '"') aspas = true;
    else if (ch === sep) {
      linha.push(campo);
      campo = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && limpo[i + 1] === "\n") i++;
      linha.push(campo);
      linhas.push(linha);
      linha = [];
      campo = "";
    } else campo += ch;
  }
  if (campo !== "" || linha.length) {
    linha.push(campo);
    linhas.push(linha);
  }

  const [cabecalho, ...resto] = linhas.filter((l) => l.some((c) => c.trim() !== ""));
  if (!cabecalho) return [];
  const chaves = cabecalho.map((c) => normalizar(c).replace(/\s+/g, "_"));
  return resto.map((valores) => {
    const obj: LinhaCsv = {};
    chaves.forEach((k, i) => {
      if ((COLUNAS as readonly string[]).includes(k)) obj[k as Coluna] = (valores[i] ?? "").trim();
    });
    return obj;
  });
}

/** "115,00" / "115.00" / "R$ 1.150,00" → número. Vazio → 0. */
export function lerPreco(v = ""): number {
  let s = v.replace(/[R$\s]/g, "");
  if (!s) return 0;
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN;
}

const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
const DIAS: Record<string, number[]> = {
  "seg-sex": [1, 2, 3, 4, 5],
  "seg-sab": [1, 2, 3, 4, 5, 6],
  "seg-dom": [1, 2, 3, 4, 5, 6],
  todos: [1, 2, 3, 4, 5, 6],
};

function lerHorarios(l: LinhaCsv, erros: string[]): Horario[] {
  const chave = normalizar(l.dias_semana || "seg-sab").replace(/\s+/g, "");
  const dias = DIAS[chave];
  if (!dias) erros.push(`dias_semana "${l.dias_semana}" inválido (use seg-sex, seg-sab ou seg-dom)`);
  const horarios: Horario[] = [];
  const faixa = (abre = "", fecha = "", rotulo: string, d: number[]) => {
    if (!HORA.test(abre) || !HORA.test(fecha) || abre >= fecha) {
      erros.push(`horário de ${rotulo} inválido (${abre || "?"}–${fecha || "?"}), use HH:MM`);
      return;
    }
    horarios.push({ dias: d, abre, fecha });
  };
  faixa(l.abre_semana, l.fecha_semana, "semana", dias ?? []);
  if (l.abre_domingo || l.fecha_domingo) faixa(l.abre_domingo, l.fecha_domingo, "domingo", [0]);
  else if (chave === "seg-dom" || chave === "todos") horarios.push({ dias: [0], abre: l.abre_semana!, fecha: l.fecha_semana! });
  return horarios;
}

function lerDescontos(v = "", erros: string[]): Partial<Record<ComboId, number>> {
  const out: Partial<Record<ComboId, number>> = {};
  for (const par of v.split("|").map((s) => s.trim()).filter(Boolean)) {
    const [id, valor] = par.split("=").map((s) => s.trim());
    const n = lerPreco(valor);
    if (!COMBOS.some((c) => c.id === id) || !(n > 0)) {
      erros.push(`desconto "${par}" inválido (ex.: 1gas1agua=5|1gas2agua=8)`);
      continue;
    }
    out[id as ComboId] = n;
  }
  return out;
}

const lista = (v = "") => v.split("|").map((s) => s.trim()).filter(Boolean);

export type ResultadoLinha =
  | { tipo: "ok"; cidade: Cidade }
  | { tipo: "exemplo" }
  | { tipo: "erro"; erros: string[] };

export function validarLinha(l: LinhaCsv): ResultadoLinha {
  if (/^exemplo/i.test(l.cidade ?? "") || /^exemplo/i.test(l.revenda ?? "")) return { tipo: "exemplo" };
  const erros: string[] = [];
  const uf = (l.uf ?? "").toUpperCase();
  if (!l.cidade) erros.push("cidade vazia");
  if (!UFS.includes(uf)) erros.push(`UF "${l.uf ?? ""}" inválida`);
  if (!l.revenda) erros.push("nome da revenda vazio");
  if (!cnpjValido(l.cnpj ?? "")) erros.push(`CNPJ "${l.cnpj ?? ""}" inválido`);
  if (!l.endereco) erros.push("endereço vazio");
  const whatsapp = normalizeWhatsapp(l.whatsapp ?? "");
  if (!whatsapp) erros.push(`WhatsApp "${l.whatsapp ?? ""}" inválido (DDD + número)`);

  const precoGas = lerPreco(l.preco_gas);
  const precoAgua = lerPreco(l.preco_agua);
  const marcasGas = lista(l.marcas_gas);
  const marcasAgua = lista(l.marcas_agua);
  const vendeGas = precoGas > 0 || marcasGas.length > 0;
  const vendeAgua = precoAgua > 0 || marcasAgua.length > 0;
  if (!vendeGas && !vendeAgua) erros.push("sem gás nem água (preencha preço e marcas)");
  if (vendeGas) {
    if (!(precoGas > 0)) erros.push("preço do gás vazio ou inválido");
    if (!marcasGas.length) erros.push("marcas de gás vazias (separe com |)");
    if (!(l.autorizacao_anp ?? "").trim()) erros.push("autorização ANP obrigatória pra vender gás");
  }
  if (vendeAgua) {
    if (!(precoAgua > 0)) erros.push("preço da água vazio ou inválido");
    if (!marcasAgua.length) erros.push("marcas de água vazias (separe com |)");
  }

  const nums = {
    precoCascoGas: lerPreco(l.preco_casco_gas),
    precoVasilhameAgua: lerPreco(l.preco_vasilhame_agua),
    taxaEntrega: lerPreco(l.taxa_entrega),
  };
  for (const [k, n] of Object.entries(nums)) if (Number.isNaN(n) || n < 0) erros.push(`${k} inválido`);
  const prazoMin = Number(l.prazo_min);
  const prazoMax = Number(l.prazo_max);
  if (!(prazoMin > 0) || !(prazoMax >= prazoMin)) erros.push("prazo_min/prazo_max inválidos (em minutos)");

  const horarios = lerHorarios(l, erros);
  const descontoCombos = lerDescontos(l.descontos_combo, erros);

  if (erros.length) return { tipo: "erro", erros };
  return {
    tipo: "ok",
    cidade: {
      nome: l.cidade!,
      uf,
      revenda: {
        nome: l.revenda!,
        cnpj: mascaraCnpj(l.cnpj!),
        endereco: l.endereco!,
        autorizacaoAnp: (l.autorizacao_anp ?? "").trim(),
        whatsapp: whatsapp!,
        horarios,
        prazoMin,
        prazoMax,
        precoGas: vendeGas ? precoGas : 0,
        precoAgua: vendeAgua ? precoAgua : 0,
        ...nums,
        descontoCombos,
        marcasGas: vendeGas ? marcasGas : [],
        marcasAgua: vendeAgua ? marcasAgua : [],
        pixAtivo: true,
      },
    },
  };
}

export type Relatorio = { cidades: Cidade[]; erros: { linha: number; erros: string[] }[]; exemplos: number };

/** Valida a planilha inteira; linha = número da linha no arquivo (cabeçalho é a 1). */
export function importar(texto: string): Relatorio {
  const rel: Relatorio = { cidades: [], erros: [], exemplos: 0 };
  lerCsv(texto).forEach((l, i) => {
    const r = validarLinha(l);
    if (r.tipo === "exemplo") rel.exemplos++;
    else if (r.tipo === "erro") rel.erros.push({ linha: i + 2, erros: r.erros });
    else {
      const repetida = rel.cidades.some(
        (c) => normalizar(c.nome) === normalizar(r.cidade.nome) && c.uf === r.cidade.uf,
      );
      if (repetida) rel.erros.push({ linha: i + 2, erros: [`${r.cidade.nome}/${r.cidade.uf} já tem revenda na planilha`] });
      else rel.cidades.push(r.cidade);
    }
  });
  return rel;
}

/** Monta uma linha no formato da planilha (separador vírgula, aspas quando precisa). */
export function linhaCsv(valores: LinhaCsv): string {
  return COLUNAS.map((c) => {
    const v = valores[c] ?? "";
    return /[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  }).join(",");
}
