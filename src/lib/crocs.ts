/** Coleção "Crocs": clogs originais montados a partir de crocs-dados.ts (gerado do site oficial). */
import type { Bundle } from "./bundles";
import { CROCS_MODELOS, CROCS_SECOES } from "./crocs-dados";

export { CROCS_IDS, CROCS_SECOES } from "./crocs-dados";

const img = (f: string) => `/produtos/${f}`;
const nomeSecao = (id: string) => CROCS_SECOES.find((s) => s.id === id)?.nome ?? "";
const TAMANHOS_CROCS = [
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
];

/** A loja trabalha apenas com a grade adulta: prefere a foto adulta e não exibe Infantil/Juvenil. */
const versaoExibida = (m: (typeof CROCS_MODELOS)[number]) =>
  m.versoes.find((v) => v.linha === "Adulto") ??
  m.versoes.find((v) => v.linha === "Juvenil") ??
  m.versoes[0]!;

export const crocs: Bundle[] = CROCS_MODELOS.map((m): Bundle => {
    const v = versaoExibida(m);
    const nome = m.nome;
    return {
      id: v.id,
      name: nome,
      tag: "Crocs original · Adulto",
      price: 99,
      compareAtPrice: v.preco,
      img: img(v.imgs[0]!),
      images: v.imgs.map(img),
      options: [{ name: "Tamanho", values: TAMANHOS_CROCS }],
      benefits: m.pontos.length
        ? m.pontos.slice(0, 3)
        : ["Crocs original", "Leve e confortável", "Fácil de limpar"],
      description: [m.descricao, "Produto original Crocs."].filter(Boolean),
      specs: [
        ["Marca", "Crocs (original)"],
        ["Coleção", nomeSecao(m.secao)],
        ["Numeração", "Do 34 ao 46"],
        ...(v.ref ? ([["Referência", v.ref]] as [string, string][]) : []),
        ["Dica", "Se estiver entre dois números, escolha o maior"],
      ],
      category: "crocs",
      secao: m.secao,
      checkoutProductName: nome,
      checkoutProductDescription: `${nome}, Crocs original.`,
      checkoutUrl: `/checkout?plano=${v.id}`,
      badge: "1 por R$ 99",
      group: "crocs-promocao",
      groupTitle: "Escolha sua promoção",
      semPromo: true,
    };
  });

const promoModelos = Array.from(
  new Set(
    CROCS_MODELOS.map((m) => m.nome),
  ),
);
const promoTamanhos = Array.from(
  new Set(TAMANHOS_CROCS),
).sort((a, b) => Number(a) - Number(b));
const promoOpcoes = [
  { name: "Modelo", values: promoModelos },
  { name: "Tamanho", values: promoTamanhos },
];
const promoOpcoesDuas = [
  { name: "Modelo do 1º Crocs", values: promoModelos },
  { name: "Tamanho do 1º Crocs", values: promoTamanhos },
  { name: "Modelo do 2º Crocs", values: promoModelos },
  { name: "Tamanho do 2º Crocs", values: promoTamanhos },
];
const promoModelImages = Object.fromEntries(
  CROCS_MODELOS.map((m) => [m.nome, img(versaoExibida(m).imgs[0]!)]),
);

const promoBase = {
  name: "Promoção Crocs",
  tag: "Escolha seu modelo e tamanho do 34 ao 46",
  img: img("crocs/cr21a-1.jpg"),
  images: [img("crocs/cr21a-1.jpg")],
  options: promoOpcoes,
  optionImages: promoModelImages,
  benefits: [
    "Crocs originais",
    "Leves e confortáveis",
    "Numeração do 34 ao 46",
    "Escolha entre vários modelos e tamanhos",
  ],
  category: "crocs" as const,
  checkoutProductDescription: "Promoção de Crocs originais.",
  semPromo: true,
  group: "crocs-promocao",
  groupTitle: "Escolha sua promoção",
  secao: "promocao",
};

export const crocsPromo: Bundle[] = [
  {
    ...promoBase,
    id: "crocs1",
    groupLabel: "1 Crocs",
     price: 99,
    unidades: 1,
     badge: "1 por R$ 99",
    checkoutProductName: "Promoção Crocs — 1 unidade",
    checkoutUrl: "/checkout?plano=crocs1",
  },
  {
    ...promoBase,
    id: "crocs2",
    groupLabel: "2 Crocs",
    options: promoOpcoesDuas,
     price: 149,
    unidades: 2,
     badge: "2 por R$ 149",
    checkoutProductName: "Promoção Crocs — 2 unidades",
    checkoutUrl: "/checkout?plano=crocs2",
  },
];
