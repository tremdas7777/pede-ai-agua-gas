import type { Precos } from "./catalogo";
import parceiros from "./parceiros.json";

/** dias: 0 = domingo … 6 = sábado. Horas em "HH:MM", horário de Brasília. */
export type Horario = { dias: number[]; abre: string; fecha: string };

export type Revenda = Precos & {
  nome: string;
  cnpj: string;
  endereco: string;
  /** Número da autorização da ANP para revenda de GLP. */
  autorizacaoAnp: string;
  /** E.164 sem símbolos (55 + DDD + número). Recebe os pedidos. */
  whatsapp: string;
  horarios: Horario[];
  prazoMin: number;
  prazoMax: number;
  marcasGas: string[];
  marcasAgua: string[];
  /** Mostra a opção "Pix agora" no checkout (precisa do gateway configurado). */
  pixAtivo: boolean;
};

export type Cidade = { nome: string; uf: string; revenda: Revenda };

/** Só para ver o app rodando em desenvolvimento; nunca vai para o site publicado. */
export const CIDADE_EXEMPLO: Cidade[] = [
  {
    nome: "Vitória da Conquista",
    uf: "BA",
    revenda: {
      nome: "Revenda parceira (preencher)",
      cnpj: "",
      endereco: "",
      autorizacaoAnp: "",
      whatsapp: "",
      horarios: [
        { dias: [1, 2, 3, 4, 5, 6], abre: "07:00", fecha: "20:00" },
        { dias: [0], abre: "08:00", fecha: "13:00" },
      ],
      prazoMin: 20,
      prazoMax: 20,
      // Preços de exemplo (nível de mercado) — trocar pelos da revenda.
      precoGas: 86.9,
      precoAgua: 16,
      precoCascoGas: 180,
      precoVasilhameAgua: 30,
      taxaEntrega: 0,
      descontoCombos: { "1gas1agua": 5, "1gas2agua": 8, "2gas": 18.9, "2agua": 2, "3agua": 4 },
      marcasGas: [
        "Ultragaz",
        "Supergasbras",
        "Copagaz",
        "Liquigás",
        "Nacional Gás",
        "Consigaz",
        "Fogás",
        "Amazongás",
        "Gasball",
        "Bahiana",
        "Minasgás",
      ],
      marcasAgua: [
        "Indaiá",
        "Minalba",
        "Crystal",
        "Bonafont",
        "Nestlé Pureza Vital",
        "São Lourenço",
        "Bioleve",
        "Fresca",
        "Santa Joana",
        "Cristalina",
        "Serrambi",
        "Lindóia",
      ],
      pixAtivo: true,
    },
  },
];

/**
 * Cidades atendidas: geradas da planilha de parceiros por `bun run parceiros <arquivo.csv>`.
 * Sem parceiro cadastrado, o site publicado mostra "Ainda não chegamos aí" para todo CEP.
 */
export const CIDADES: Cidade[] =
  (parceiros as Cidade[]).length > 0
    ? (parceiros as Cidade[])
    : import.meta.env?.DEV
      ? CIDADE_EXEMPLO
      : [];

export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function encontrarCidade(nome: string, uf: string, lista = CIDADES): Cidade | undefined {
  const n = normalizar(nome);
  const u = normalizar(uf);
  return lista.find((c) => normalizar(c.nome) === n && normalizar(c.uf) === u);
}

/** Campos que ainda faltam para a revenda poder aparecer no ar. */
export function camposFaltando(r: Revenda): string[] {
  const faltando: string[] = [];
  if (!r.cnpj) faltando.push("CNPJ");
  if (!r.endereco) faltando.push("endereço");
  if (!r.autorizacaoAnp) faltando.push("autorização ANP");
  if (!r.whatsapp) faltando.push("WhatsApp");
  if (!(r.precoGas > 0) && r.marcasGas.length) faltando.push("preço do gás");
  if (!(r.precoAgua > 0) && r.marcasAgua.length) faltando.push("preço da água");
  return faltando;
}

const DIAS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DIAS_PT = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const DIAS_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** [{dias:[1..6], 07:00–20:00}] → "Seg a Sáb 07:00–20:00". */
export function horariosTexto(r: Revenda): string {
  return r.horarios
    .map((h) => {
      const d = [...h.dias].sort((a, b) => a - b);
      const seguidos = d.every((x, i) => i === 0 || x === d[i - 1] + 1);
      const dias =
        seguidos && d.length > 2
          ? `${DIAS_CURTOS[d[0]]} a ${DIAS_CURTOS[d[d.length - 1]]}`
          : d.map((x) => DIAS_CURTOS[x]).join(", ");
      return `${dias} ${h.abre}–${h.fecha}`;
    })
    .join(" · ");
}

function agoraBrasilia(agora: Date) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(agora);
  const p = Object.fromEntries(partes.map((x) => [x.type, x.value]));
  return { dia: DIAS_EN.indexOf(p.weekday), minutos: Number(p.hour) * 60 + Number(p.minute) };
}

const emMinutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function statusFuncionamento(r: Revenda, agora = new Date()) {
  const { dia, minutos } = agoraBrasilia(agora);
  const hoje = r.horarios.find((h) => h.dias.includes(dia));
  if (hoje && minutos >= emMinutos(hoje.abre) && minutos < emMinutos(hoje.fecha)) {
    return {
      aberto: true,
      texto: `Aberto agora · fecha às ${hoje.fecha}`,
      curto: `Aberto até ${hoje.fecha}`,
    };
  }
  for (let i = 0; i < 8; i++) {
    const d = (dia + i) % 7;
    const h = r.horarios.find((x) => x.dias.includes(d));
    if (!h) continue;
    if (i === 0 && minutos >= emMinutos(h.abre)) continue;
    const quando = i === 0 ? "hoje" : i === 1 ? "amanhã" : DIAS_PT[d];
    return {
      aberto: false,
      texto: `Fechado · abre ${quando} às ${h.abre}`,
      curto: `Abre ${quando} às ${h.abre}`,
    };
  }
  return { aberto: false, texto: "Fechado", curto: "Fechado" };
}
