/** CNPJ numérico ou alfanumérico (Receita, a partir de jul/2026): 12 caracteres [0-9A-Z] + 2 dígitos. */
export function limparCnpj(v: string): string {
  return v.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 14);
}

export function mascaraCnpj(v: string): string {
  const c = limparCnpj(v);
  const p = [c.slice(0, 2), c.slice(2, 5), c.slice(5, 8), c.slice(8, 12), c.slice(12, 14)];
  let out = p[0];
  if (p[1]) out += `.${p[1]}`;
  if (p[2]) out += `.${p[2]}`;
  if (p[3]) out += `/${p[3]}`;
  if (p[4]) out += `-${p[4]}`;
  return out;
}

const valor = (ch: string) => ch.charCodeAt(0) - 48;

function digito(base: string): number {
  const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const soma = pesos.reduce((acc, p, i) => acc + valor(base[i]) * p, 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function cnpjValido(v: string): boolean {
  const c = limparCnpj(v);
  if (!/^[0-9A-Z]{12}\d{2}$/.test(c)) return false;
  if (/^(.)\1+$/.test(c)) return false;
  const d1 = digito(c.slice(0, 12));
  const d2 = digito(c.slice(0, 12) + d1);
  return c.endsWith(`${d1}${d2}`);
}

/** CNAE 4784-9/00: comércio varejista de gás liquefeito de petróleo (GLP). */
export const CNAE_GLP = 4784900;
/** CNAEs que cobrem venda de água mineral (varejo de bebidas, atacado de água/bebidas). */
export const CNAES_AGUA = [4723700, 4635401, 4635499, 4639701, 4729699];

export type DadosCnpj = {
  razaoSocial: string;
  nomeFantasia: string;
  situacao: string;
  cnaes: number[];
  cnaePrincipal: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
};

/** Consulta pública na BrasilAPI (dados da Receita). null = CNPJ não encontrado. */
export async function consultarCnpj(v: string): Promise<DadosCnpj | null> {
  const c = limparCnpj(v);
  const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${c}`);
  if (r.status === 404 || r.status === 400) return null;
  if (!r.ok) throw new Error(`BrasilAPI ${r.status}`);
  const j = (await r.json()) as Record<string, unknown>;
  const secundarios = Array.isArray(j.cnaes_secundarios) ? (j.cnaes_secundarios as { codigo?: number }[]) : [];
  return {
    razaoSocial: String(j.razao_social ?? ""),
    nomeFantasia: String(j.nome_fantasia ?? ""),
    situacao: String(j.descricao_situacao_cadastral ?? ""),
    cnaes: [Number(j.cnae_fiscal), ...secundarios.map((s) => Number(s.codigo))].filter((n) => n > 0),
    cnaePrincipal: String(j.cnae_fiscal_descricao ?? ""),
    logradouro: [j.descricao_tipo_de_logradouro, j.logradouro].filter(Boolean).join(" "),
    numero: String(j.numero ?? ""),
    bairro: String(j.bairro ?? ""),
    municipio: String(j.municipio ?? ""),
    uf: String(j.uf ?? ""),
    cep: String(j.cep ?? ""),
  };
}

export const vendeGlp = (d: DadosCnpj) => d.cnaes.includes(CNAE_GLP);
export const vendeAgua = (d: DadosCnpj) => d.cnaes.some((c) => CNAES_AGUA.includes(c));
