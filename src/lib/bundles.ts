/**
 * Catálogo da Banguela Shop.
 * O checkout vende um produto por vez (`?plano=<id>&variante=<opções>`); o preço é
 * sempre recalculado no servidor a partir daqui — o cliente só exibe.
 */

import { BRINQUEDO_IDS, brinquedos } from "./brinquedos";
import { CROCS_IDS, CROCS_SECOES, crocs, crocsPromo } from "./crocs";
import { PRODUCT_COPY } from "./copy";

export const BUNDLE_IDS = [
  "mdpreto",
  "mdbranco",
  "mdverde",
  "mdgalaxia",
  "mdbrilha",
  "mdrosa",
  "mdfogo",
  "mdazul",
  "mdpretoi",
  "mdbrancoi",
  "mdverdei",
  "mdgalaxiai",
  "mdbrilhai",
  "mdrosai",
  "mdfogoi",
  "mdazuli",
  "kgsti2",
  "kgsti4",
  "kgang2",
  "kgang4",
  "kgban2",
  "kgban4",
  "kgfur2",
  "kgfur4",
  "kgdnot1",
  "kgdnot2",
  "kgdnev1",
  "kgdnev2",
  "pantufa2",
  "pantufa4",
  "ursinho",
  "pijama",
  "pijamai",
  "kitcasal",
  "kitshortf",
  "kitshortm",
  "kitshorti",
  "kitcalca",
  "kitcalcaf",
  "kitcalcam",
  "kitcalcai",
  "snuggy",
  "snuggyi",
  "pantufa",
  "pantufai",
  "chinelo",
  "chineloi",
  "luminaria",
  "umid1",
  "umid2",
  "umid3",
  "pelucia",
  "pelucia2",
  "lum3d",
  "mascara",
  "mascara2",
  "essencia3",
  "essencia10",
  "kitescola",
  ...BRINQUEDO_IDS,
  ...CROCS_IDS,
  "crocs1",
  "crocs2",
  "carro",
  "aneis",
  "colares",
] as const;
export type BundleId = (typeof BUNDLE_IDS)[number];
export const DEFAULT_BUNDLE_ID: BundleId = "pijama";

/** Valor mínimo (produtos, sem frete) para liberar o frete grátis. */
export const FREE_SHIPPING_MIN = 139;
export const FREE_SHIPPING_LABEL = `Frete grátis em compras acima de R$ ${FREE_SHIPPING_MIN}`;

export const isFreeShippingEligible = (subtotal: number) => subtotal >= FREE_SHIPPING_MIN;

/** Cupom que libera o frete grátis sem exigir o mínimo em produtos. */
export const FREE_SHIPPING_COUPON = "FRETEGRATIS";
export const isFreeShippingCoupon = (code?: string | null): boolean =>
  !!code && code.trim().toUpperCase() === FREE_SHIPPING_COUPON;

/** Selo de frete do produto: grátis quando ele sozinho já passa do mínimo. */
export const bundleShippingLabel = (b: { price: number }) =>
  isFreeShippingEligible(b.price) ? "Frete grátis para todo o Brasil" : FREE_SHIPPING_LABEL;

export type CategoryId =
  | "kigurumi"
  | "crocs"
  | "moletons"
  | "conforto"
  | "brinquedos"
  | "casa"
  | "escola"
  | "joias"
  | "auto";

/** Subdivisão dentro de uma coleção (ex.: Toy Story dentro de Crocs); "marca" agrupa (Disney). */
export type CollectionSection = { id: string; nome: string; marca: string };

/** Banner do topo da página da coleção (celular 1080×720 e PC 1920×720). */
export type CollectionBanner = { mobile: string; desktop: string; alt: string };

export const categories: readonly {
  id: CategoryId;
  name: string;
  desc: string;
  img: string;
  banner?: CollectionBanner;
  /** Coleção dividida em seções, na ordem da página (cada produto diz a sua em `secao`). */
  secoes?: readonly CollectionSection[];
}[] = [
  {
    id: "kigurumi",
    name: "Pijamas Kigurumi",
    desc: "Stitch, Angel, Banguela e Fúria da Luz: 2 por R$ 79 ou 4 por R$ 129 com ursinho de brinde",
    img: "/produtos/kg-grupo.jpg",
    banner: {
      mobile: "/banners/kigurumi-c.webp",
      desktop: "/banners/kigurumi-cd.webp",
      alt: "Pijamas Kigurumi: 2 por R$ 79 ou 4 por R$ 129 com ursinho de brinde",
    },
  },
  {
    id: "conforto",
    name: "Conforto & Dormir",
    desc: "Pijama, pantufas e o Snuggy",
    img: "/produtos/p2_snuggy.jpg",
  },
  {
    id: "crocs",
    name: "Crocs",
    desc: "Promoção: 1 Crocs por R$ 99 ou 2 por R$ 149. Modelos originais Disney, Pokémon, Bluey e Snoopy.",
    img: "/produtos/crocs/cr21a-1.jpg",
    banner: {
      mobile: "/banners/crocs-c.webp",
      desktop: "/banners/crocs-cd.webp",
      alt: "Promoção Crocs originais: 1 por R$ 99 ou 2 por R$ 149",
    },
    secoes: CROCS_SECOES,
  },
  {
    id: "moletons",
    name: "Sleepo Dragão",
    desc: "Cobertor vestível com capuz de dragão",
    img: "/produtos/sleepo-preto.jpg",
  },
  {
    id: "brinquedos",
    name: "Brinquedos",
    desc: "Bonecos, pelúcias, Funkos e playsets com 70% OFF",
    img: "/produtos/bq15-1.jpg",
  },
  {
    id: "casa",
    name: "Decoração de Dragão",
    desc: "Luminária e itens para o quarto",
    img: "/produtos/luminaria.jpg",
  },
  {
    id: "escola",
    name: "Volta às Aulas",
    desc: "Mochila, estojo e lancheira de dragão",
    img: "/produtos/kit-escolar.jpg",
  },
  {
    id: "joias",
    name: "Joias de Dragão",
    desc: "Anéis e colares para casais",
    img: "/produtos/p5_aneis.jpg",
  },
  {
    id: "auto",
    name: "Para o Carro",
    desc: "Mascotes para carro e moto",
    img: "/produtos/p4_carro.jpg",
  },
];

export type ProductOption = { name: string; values: readonly string[] };

/** Bloco da descrição: título, texto, lista de vantagens e uma foto ou GIF do produto ao lado. */
export type RichSection = {
  title: string;
  text: string;
  points?: readonly string[];
  media?: string;
};

/** Avaliação de cliente. Sem data quando a fonte não tem a data real. */
export type Review = {
  author: string;
  rating: number;
  text: string;
  date?: string;
  photos?: readonly string[];
  videos?: readonly string[];
};

export type Bundle = {
  id: BundleId;
  name: string;
  /** Frase curta do card. */
  tag: string;
  price: number;
  compareAtPrice?: number;
  img: string;
  images: readonly string[];
  /** Opções que o cliente escolhe (cor, tamanho...). Vazio = produto sem variação. */
  options: readonly ProductOption[];
  /** Foto mostrada ao escolher um valor de opção (ex.: a cor). */
  optionImages?: Readonly<Record<string, string>>;
  benefits: readonly string[];
  category: CategoryId;
  checkoutProductName: string;
  checkoutProductDescription: string;
  checkoutUrl: string;
  featured?: boolean;
  badge?: string;
  /** Nome curto da estampa (linha de moletons: "Preto", "Galáxia"...). */
  estampa?: string;
  /** Texto da aba "Descrição" (um parágrafo por item). */
  description?: readonly string[];
  /** Aba "Detalhes e medidas": pares rótulo/valor. */
  specs?: readonly (readonly [string, string])[];
  /** Produtos do mesmo grupo aparecem como opções na mesma página (ex.: combo casal / só feminino). */
  group?: string;
  /** Rótulo da opção dentro do grupo ("Combo casal", "Só feminino"...). */
  groupLabel?: string;
  /** Texto curto mostrado embaixo de uma opção (chave = nome da opção sem o "(1º/2º conjunto)"). */
  optionNotes?: Readonly<Record<string, string>>;
  /** Descrição em blocos abaixo do produto (texto + GIF/foto ao lado), como nas lojas grandes. */
  richSections?: readonly RichSection[];
  /** Avaliações selecionadas de clientes reais da loja internacional (traduzidas). */
  reviews?: readonly Review[];
  /** Quadro comparativo "Banguela Shop x Outras": cada linha é uma vantagem. */
  compare?: { title: string; rows: readonly string[] };
  /** false = não aparece nas vitrines (só pela página do grupo). */
  listed?: boolean;
  /** Produto que não é mais vendido sozinho: a página leva para este. */
  redirectTo?: BundleId;
  /** Título do seletor do grupo na página ("Escolha o combo"). */
  groupTitle?: string;
  /** Peças no combo: o seletor mostra o preço de cada uma e destaca o melhor valor. */
  unidades?: number;
  /** Combo maior do grupo anunciado no card da vitrine junto do preço de 1 ("ou 2 por R$ 89"). */
  comboVitrine?: BundleId;
  /**
   * Opção "Modelo" de valor único que mostra também os outros modelos (valor → produto): tocar num
   * deles leva para a página daquele produto. Ex.: kigurumi de dragão de 1 unidade, preto ou branco.
   */
  trocaModelo?: Readonly<Record<string, BundleId>>;
  /** Opções mostradas como cartões com foto (nome da opção sem o "(1º pijama)" → valor → foto). */
  optionCards?: Readonly<Record<string, Readonly<Record<string, string>>>>;
  /** Combo de pijamas: a página oferece ursinhos extras e, ao comprar, as pantufas. */
  comboExtras?: boolean;
  /** Subdivisão da coleção em que o produto aparece (ver `secoes` da categoria). */
  secao?: string;
  /** Fica fora da promoção de 50% (ofertas com preço fechado, como os combos). */
  semPromo?: boolean;
  /** Versão infantil: vira um produto irmão ("Adulto" / "Infantil") com preço e tamanhos próprios. */
  kids?: {
    id: BundleId;
    price: number;
    compareAtPrice?: number;
    options: readonly ProductOption[];
    /** Fotos próprias da versão infantil (senão usa as do adulto). */
    images?: readonly string[];
  };
};

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Preço sem os centavos quando é redondo: "R$ 79" em vez de "R$ 79,00". */
export const brlCurto = (n: number) => brl(n).replace(/,00$/, "");

/** Oferta de combo para o selo e o preço ("2 por R$ 79"); produto de 1 peça não tem. */
export const ofertaCombo = (b: Pick<Bundle, "price" | "unidades">) =>
  b.unidades && b.unidades > 1 ? `${b.unidades} por ${brlCurto(b.price)}` : undefined;

const img = (f: string) => `/produtos/${f}`;

/** Linha Sleepo Dragão (cobertor vestível): mesmo modelo, uma estampa por produto. */
const MOLETONS: { id: BundleId; estampa: string; slug: string }[] = [
  { id: "mdpreto", estampa: "Preto", slug: "preto" },
  { id: "mdbranco", estampa: "Branco", slug: "branco" },
  { id: "mdverde", estampa: "Verde", slug: "verde" },
  { id: "mdgalaxia", estampa: "Galáxia", slug: "galaxia" },
  { id: "mdbrilha", estampa: "Brilha no Escuro", slug: "brilha" },
  { id: "mdrosa", estampa: "Rosa", slug: "rosa" },
  { id: "mdfogo", estampa: "Fogo", slug: "fogo" },
  { id: "mdazul", estampa: "Azul", slug: "azul" },
];

const moletons: Bundle[] = MOLETONS.map(({ id, estampa, slug }) => ({
  id,
  kids: {
    id: `${id}i` as BundleId,
    price: 118.9,
    compareAtPrice: 167.9,
    options: [{ name: "Idade", values: ["4 a 8 anos", "9 a 14 anos"] }],
  },
  name: `Sleepo Dragão ${estampa}`,
  tag: "Cobertor vestível de dragão com sherpa por dentro",
  price: 139.9,
  compareAtPrice: 195.9,
  // Foto principal com a pessoa vestindo; a segunda só a peça.
  img: img(`sleepo-${slug}-uso.jpg`),
  images: [img(`sleepo-${slug}-uso.jpg`), img(`sleepo-${slug}.jpg`)],
  options: [],
  benefits: [
    "Flanela macia por fora e sherpa quentinha por dentro",
    "Capuz gigante com chifres e asinhas de dragão",
    "Bolso canguru e comprimento do pescoço aos joelhos",
  ],
  description: [
    `O Sleepo Dragão ${estampa} é o abraço quentinho que você veste: um cobertor de flanela macia com sherpa felpuda por dentro, em formato de moletom gigante que cobre do pescoço até os joelhos.`,
    "O capuz é de dragão, com chifrinhos, olhos bordados e espinhos macios, e nas costas tem asinhas de tecido. Mangas largas e bolso canguru deixam as mãos quentes, e o tamanho oversized serve para usar no sofá, na cama ou em casa o dia todo.",
    "Tem versão adulta e infantil, para a família inteira virar dragão junto.",
  ],
  specs: [
    ["Estampa", estampa],
    ["Tecido", "Flanela por fora e sherpa por dentro"],
    ["Comprimento", "Do pescoço até a altura dos joelhos"],
    ["Detalhes", "Capuz com chifres e olhos bordados, asinhas nas costas, bolso canguru"],
    ["Tamanhos", "Adulto: tamanho único oversized. Infantil: 4 a 8 anos e 9 a 14 anos"],
    [
      "Cuidados",
      "Lavar na máquina no ciclo delicado, com água fria, do avesso. Não usar secadora.",
    ],
  ],
  richSections: [
    {
      title: "Sair do cobertor nunca mais",
      text: `Sabe aquele frio que faz você desistir de levantar do sofá? Com o Sleepo Dragão ${estampa} o cobertor vai junto: você veste em segundos, fica quentinho do pescoço aos joelhos e continua com as mãos livres para o celular, o controle ou a pipoca.`,
      media: img(`sleepo-${slug}-uso.jpg`),
    },
    {
      title: "Macio por fora, felpudo por dentro",
      text: "É como vestir um abraço: a flanela macia por fora e a sherpa felpuda por dentro seguram o calor nas noites mais frias.",
      points: [
        "Flanela por fora e sherpa quentinha por dentro",
        "Capuz gigante com chifrinhos, olhos bordados e asinhas nas costas",
        "Bolso canguru para esquentar as mãos",
        "Tamanho único oversized: sem medo de errar o tamanho",
      ],
      media: img(`sleepo-${slug}.jpg`),
    },
    {
      title: "A família inteira de dragão",
      text: "Tem versão adulta e infantil (4 a 8 e 9 a 14 anos) e 8 estampas para cada um escolher a sua. Um presente que acerta em cheio no aniversário, no Natal ou no Dia das Crianças.",
    },
  ],
  category: "moletons",
  checkoutProductName: `Sleepo Dragão ${estampa}`,
  checkoutProductDescription:
    "Cobertor vestível de flanela com sherpa, capuz de dragão com chifres e asinhas.",
  checkoutUrl: `/checkout?plano=${id}`,
  estampa,
}));

/**
 * Kits de pijama de casal. Cada kit vira 4 produtos do mesmo grupo, escolhidos na página:
 * combo casal (com desconto), só feminino, só masculino e infantil. Cada um tem preço próprio,
 * calculado no servidor como qualquer produto.
 */
type KitModo = "casal" | "f" | "m" | "i";
type KitDef = {
  group: string;
  ids: Record<KitModo, BundleId>;
  title: string;
  peca: "short" | "calça";
  prices: Record<"casal" | "avulso" | "infantil", [number, number]>;
  imgs: string[];
  /** Cores/modelo de um conjunto, escolhidos antes do tamanho. */
  cores: (quem: "dela" | "dele" | "infantil") => ProductOption[];
  /** Texto do modelo/cores, usado na descrição. */
  coresTexto: string;
  material: string;
  clima: string;
  specsPeca: (readonly [string, string])[];
  /** Vantagens do conjunto, usadas na descrição em blocos. */
  pontos: string[];
  optionNotes?: Record<string, string>;
  /** Combo casal com o 1º conjunto sempre preto e o 2º sempre branco: o cliente só escolhe os tamanhos. */
  casalPretoBranco?: boolean;
};

const TAM_INF = ["2 anos", "4 anos", "6 anos", "8 anos", "10 anos", "12 anos", "14 anos"];
const TAM_ADULTO = ["P", "M", "G", "GG"];
const TAM_PLUS = ["G1", "G2", "G3"];
const TAM_F = [...TAM_ADULTO, ...TAM_PLUS];
const TAM_M = TAM_F;
/** Combo casal: cada peça do infantil 2 anos ao plus size G3. */
const TAM_COMBO = [...TAM_INF, ...TAM_ADULTO, ...TAM_PLUS];
/** "PP, P, M, G e GG" */
const listaTamanhos = (t: readonly string[]) => `${t.slice(0, -1).join(", ")} e ${t.at(-1)}`;
const CUIDADOS = "Lavar na máquina com água fria, do avesso. Não usar alvejante nem secadora.";

function kit(k: KitDef): Bundle[] {
  const pecas = k.peca === "short" ? "shorts" : "calças";
  const base = {
    img: img(k.imgs[0]!),
    images: k.imgs.map(img),
    category: "conforto" as const,
  };
  const label: Record<KitModo, string> = {
    casal: "Combo casal",
    f: "Só feminino",
    m: "Só masculino",
    i: "Infantil",
  };
  const conjunto: Record<KitModo, string> = {
    casal: "Combo casal",
    f: "Conjunto feminino",
    m: "Conjunto masculino",
    i: "Conjunto infantil",
  };
  // Camiseta e calça (ou short) com tamanhos separados, logo depois da cor de cada peça.
  // No combo, as peças de cada pessoa ficam sob "1º conjunto" / "2º conjunto".
  const pecaTam = k.peca === "short" ? "do short" : "da calça";
  const montar = (
    quem: "dela" | "dele" | "infantil",
    values: string[],
    n?: 1 | 2,
  ): ProductOption[] => {
    const suf = n ? ` (${n}º conjunto)` : "";
    const camiseta = { name: `Tamanho da camiseta${suf}`, values };
    const peca = { name: `Tamanho ${pecaTam}${suf}`, values };
    const cores = k
      .cores(quem)
      .map((o) => ({ ...o, name: `${o.name.replace(/ (dela|dele|infantil)$/, "")}${suf}` }));
    return cores.length === 2 ? [cores[0]!, camiseta, cores[1]!, peca] : [...cores, camiseta, peca];
  };
  // Modelo fixo: a opção fica com um valor só, que a página já deixa marcado.
  const fixo = (opts: ProductOption[], modelo: string) =>
    opts.map((o) => (o.name.startsWith("Modelo") ? { ...o, values: [modelo] } : o));
  const options: Record<KitModo, ProductOption[]> = {
    casal: k.casalPretoBranco
      ? [
          ...fixo(montar("dela", TAM_COMBO, 1), "Conjunto preto"),
          ...fixo(montar("dele", TAM_COMBO, 2), "Conjunto branco"),
        ]
      : [...montar("dela", TAM_COMBO, 1), ...montar("dele", TAM_COMBO, 2)],
    f: montar("dela", TAM_F),
    m: montar("dele", TAM_M),
    i: montar("infantil", TAM_INF),
  };
  const porPeca = [
    "Por peça",
    `Tamanho da camiseta e ${pecaTam} escolhidos separadamente`,
  ] as const;
  const tamanhos: Record<KitModo, (readonly [string, string])[]> = {
    casal: [
      ["Tamanhos infantis", listaTamanhos(TAM_INF)],
      ["Tamanhos adultos", listaTamanhos(TAM_ADULTO)],
      ["Plus size", listaTamanhos(TAM_PLUS)],
      porPeca,
    ],
    f: [["Tamanhos", listaTamanhos(TAM_F)], porPeca],
    m: [["Tamanhos", listaTamanhos(TAM_M)], porPeca],
    i: [["Tamanhos", listaTamanhos(TAM_INF)], porPeca],
  };
  const make = (modo: KitModo): Bundle => {
    const casal = modo === "casal";
    const pretoBranco = casal && !!k.casalPretoBranco;
    const [price, compareAtPrice] =
      modo === "casal" ? k.prices.casal : modo === "i" ? k.prices.infantil : k.prices.avulso;
    const quem = { casal: "", f: "feminino", m: "masculino", i: "infantil" }[modo];
    return {
      ...base,
      id: k.ids[modo],
      name: casal ? k.title : `${k.title} · ${conjunto[modo]}`,
      groupLabel: label[modo],
      tag: casal
        ? `2 camisetas + 2 ${pecas}, um conjunto para cada pessoa`
        : `1 camiseta + 1 ${k.peca}`,
      price,
      compareAtPrice,
      options: options[modo],
      ...(k.optionNotes && !pretoBranco ? { optionNotes: k.optionNotes } : {}),
      benefits: casal
        ? [
            pretoBranco
              ? `Combo completo: 1 conjunto preto e 1 conjunto branco (2 camisetas e 2 ${pecas})`
              : `Combo completo: 2 camisetas e 2 ${pecas}, um conjunto para cada um`,
            "Tamanhos do infantil 2 anos ao plus size G3",
            pretoBranco
              ? "Cada um escolhe o tamanho de cada peça"
              : "Cada um escolhe a cor e o tamanho de cada peça",
          ]
        : [
            `${conjunto[modo]}: 1 camiseta e 1 ${k.peca}`,
            "Camiseta de algodão jersey fio 24/1",
            `Tamanho da camiseta e ${pecaTam} escolhidos separadamente`,
            modo === "i"
              ? "Tamanhos de 2 a 14 anos"
              : "Quer para os dois? O combo casal sai com desconto",
          ],
      description: [
        casal
          ? `O pijama perfeito para usar junto com aquela pessoa especial: dois conjuntos de dragão, um para cada um. ${pretoBranco ? k.coresTexto.replace("São dois conjuntos:", "O combo vem com um de cada:") : k.coresTexto}`
          : `Conjunto ${quem} de camiseta e ${k.peca} com estampa de dragão. ${k.coresTexto}`,
        `${k.material} ${k.clima}`,
        casal
          ? `Cada peça tem o seu tamanho, do infantil 2 anos ao plus size G3: dá para montar o combo até com uma criança. Um presente lindo para namorados, aniversário de namoro ou casamento.`
          : "Também dá para levar o combo casal, com os dois conjuntos e desconto, ou o conjunto infantil para as crianças combinarem com os pais.",
      ],
      specs: [
        [
          "Vem no pedido",
          pretoBranco
            ? `1 conjunto preto + 1 conjunto branco (2 camisetas + 2 ${pecas})`
            : casal
              ? `2 camisetas + 2 ${pecas} (dois conjuntos)`
              : `1 camiseta + 1 ${k.peca}`,
        ],
        ...k.specsPeca,
        ...tamanhos[modo],
        ["Medidas", "Podem variar de 1 a 2 cm"],
        ["Cuidados", CUIDADOS],
      ],
      richSections: [
        {
          title: {
            casal: "Dormir combinando nunca foi tão fofo",
            f: "O pijama de dragão que você merece",
            m: "O pijama de dragão que você merece",
            i: "Pijama de dragão para os pequenos",
          }[modo],
          text: {
            casal:
              "Um conjunto para você, outro para o seu amor: dois pijamas de dragão que juntos formam o par perfeito. É aquele pijama que rende foto, risada e muito chamego no sofá.",
            f: `Camiseta e ${k.peca} de dragão para fechar o dia do jeito certo: confortável, fofo e com estampa que dá vontade de postar.`,
            m: `Camiseta e ${k.peca} de dragão para fechar o dia do jeito certo: confortável, fofo e com estampa que dá vontade de postar.`,
            i: `Camiseta e ${k.peca} com estampa de dragão para a criança dormir feliz e acordar pronta para a próxima aventura.`,
          }[modo],
          media: img(k.imgs[0]!),
        },
        {
          title: "Conforto de verdade a noite toda",
          text: `${k.material} ${k.clima}`,
          points: k.pontos,
          media: img(k.imgs[1] ?? k.imgs[0]!),
        },
        casal
          ? {
              title: "Cada peça no tamanho certo",
              text: pretoBranco
                ? `O 1º conjunto é o preto e o 2º é o branco. Cada um escolhe o tamanho da camiseta e ${pecaTam}, do infantil 2 anos ao plus size G3. Presente certeiro para o aniversário de namoro, o Dia dos Namorados ou o casamento.`
                : `No combo casal cada um escolhe o modelo e o tamanho da camiseta e ${pecaTam}, do infantil 2 anos ao plus size G3. Presente certeiro para o aniversário de namoro, o Dia dos Namorados ou o casamento.`,
              ...(k.imgs[2] ? { media: img(k.imgs[2]) } : {}),
            }
          : modo === "i"
            ? {
                title: "Combina com o pijama dos pais",
                text: "O conjunto infantil tem a mesma estampa dos conjuntos adultos, do 2 ao 14 anos. Monte a família inteira de dragão e garanta a foto do ano.",
              }
            : {
                title: "Quer combinar com alguém?",
                text: "Leve o combo casal, com os dois conjuntos e desconto, ou o conjunto infantil para as crianças combinarem com você.",
              },
      ],
      checkoutProductName: casal ? k.title : `${k.title} - ${conjunto[modo]}`,
      checkoutProductDescription: pretoBranco
        ? `Combo casal: 1 conjunto preto e 1 conjunto branco (2 camisetas de algodão e 2 ${pecas} de pijama).`
        : casal
          ? `Combo casal: 2 camisetas de algodão e 2 ${pecas} de pijama.`
          : `${conjunto[modo]} de pijama: 1 camiseta de algodão e 1 ${k.peca}.`,
      checkoutUrl: `/checkout?plano=${k.ids[modo]}`,
      // Só o combo casal está à venda; os conjuntos avulsos levam para ele.
      ...(casal
        ? { badge: "Kit casal", group: k.group, unidades: 2 }
        : { listed: false, redirectTo: k.ids.casal }),
    };
  };
  return (["casal", "f", "m", "i"] as const).map(make);
}

/** Os dois kits de pijama têm o mesmo par de conjuntos: preto (camiseta preta) e branco. */
const MODELOS = ["Conjunto preto", "Conjunto branco"];

const kits: Bundle[] = [
  ...kit({
    group: "kitshort",
    ids: { casal: "kitcasal", f: "kitshortf", m: "kitshortm", i: "kitshorti" },
    title: "Pijama Dragões Short + Camiseta",
    peca: "short",
    prices: { casal: [125.9, 174.9], avulso: [69.9, 90.9], infantil: [62.9, 83.9] },
    imgs: ["kit-casal.jpg", "kit-casal-b.jpg", "kit-casal-c.jpg"],
    optionNotes: {
      Modelo:
        "Conjunto preto: camiseta preta + short cinza · Conjunto branco: camiseta branca + short branco",
    },
    cores: (quem) => [
      {
        name: `Modelo ${quem}`,
        values: MODELOS,
      },
    ],
    coresTexto:
      "São dois conjuntos: o Conjunto preto, de camiseta preta com olhinhos verdes e short cinza estampado, e o Conjunto branco, de camiseta branca com olhinhos azuis e short branco estampado.",
    material:
      "A camiseta é de algodão jersey fio 24/1, macia e respirável, e o short é de algodão leve com elástico na cintura.",
    clima: "Perfeito para as noites quentes.",
    specsPeca: [
      ["Conjunto preto", "Camiseta preta com olhos verdes e short cinza estampado"],
      ["Conjunto branco", "Camiseta branca com olhos azuis e short branco estampado"],
      ["Camiseta", "Algodão jersey fio 24/1"],
      ["Short", "Algodão, com elástico na cintura"],
    ],
    pontos: [
      "Camiseta de algodão jersey fio 24/1, macia e respirável",
      "Short de algodão leve, com elástico na cintura",
      "Dois modelos: Conjunto preto e Conjunto branco",
      "Fresquinho para as noites quentes",
    ],
  }),
  ...kit({
    group: "kitcalca",
    ids: { casal: "kitcalca", f: "kitcalcaf", m: "kitcalcam", i: "kitcalcai" },
    title: "Pijama Dragões Calça + Camiseta",
    peca: "calça",
    // Combo casal a R$ 79 (abaixo de R$ 80, fica fora dos 50%), com o preço cheio de antes como "de".
    prices: { casal: [79, 132.9], avulso: [73.9, 94.9], infantil: [66.9, 87.9] },
    casalPretoBranco: true,
    imgs: ["kit-casal-calca.jpg", "kit-casal-calca-b.jpg"],
    optionNotes: {
      Modelo:
        "Conjunto preto: camiseta preta + calça cinza · Conjunto branco: camiseta branca + calça branca",
    },
    cores: (quem) => [
      {
        name: `Modelo ${quem}`,
        values: MODELOS,
      },
    ],
    coresTexto:
      "São dois conjuntos: o Conjunto preto, de camiseta preta com olhinhos verdes e calça cinza com dragões pretos, e o Conjunto branco, de camiseta branca com olhinhos azuis e calça branca com dragões brancos.",
    material:
      "A camiseta é de algodão jersey fio 24/1, macia e respirável, e a calça é de felpa antialérgica com elástico na cintura e corte reto.",
    clima: "Quentinho para as noites frias.",
    specsPeca: [
      ["Conjunto preto", "Camiseta preta com olhos verdes e calça cinza com dragões pretos"],
      ["Conjunto branco", "Camiseta branca com olhos azuis e calça branca com dragões brancos"],
      ["Camiseta", "Algodão jersey fio 24/1"],
      ["Calça", "Felpa antialérgica, elástico na cintura e corte reto"],
    ],
    pontos: [
      "Camiseta de algodão jersey fio 24/1, macia e respirável",
      "Calça de felpa antialérgica, com elástico na cintura e corte reto",
      "Dois modelos: Conjunto preto e Conjunto branco",
      "Quentinho para as noites frias",
    ],
  }),
];

/**
 * Pijamas kigurumi de personagem: um produto por personagem, vendido em combo de 2 ou 4 (só o de 4
 * ganha ursinho de brinde). O cliente escolhe o personagem de cada pijama do combo. Na
 * página o cliente também pode levar pantufas dos personagens e ursinhos extras (produtos abaixo,
 * que não aparecem sozinhos nas vitrines).
 */
export const PERSONAGENS = ["Stitch", "Angel", "Banguela", "Fúria da Luz"] as const;
type Personagem = (typeof PERSONAGENS)[number];
const SLUG: Record<Personagem, string> = {
  Stitch: "stitch",
  Angel: "angel",
  Banguela: "banguela",
  "Fúria da Luz": "furia",
};
const fotosPersonagem = (prefixo: string, sufixo = "") =>
  Object.fromEntries(PERSONAGENS.map((n) => [n, img(`${prefixo}-${SLUG[n]}${sufixo}.jpg`)]));
export const KIGURUMI_FOTOS = fotosPersonagem("kg");
export const URSINHO_FOTOS = fotosPersonagem("urso");
export const PANTUFA_P_FOTOS = fotosPersonagem("pantufa");
/** Numeração das pantufas de personagem: infantil do 22 ao 34, adulto do 35 ao 46. */
export const PANTUFA_NUMEROS = Array.from({ length: 25 }, (_, i) => String(22 + i));
const ate = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

/** Preço de cada combo (igual para todos os personagens). */
const KIGURUMI_COMBOS = { 2: 79, 4: 129 } as const;
const KIGURUMIS: { nome: Personagem; de: string; visual: string; ids: Record<2 | 4, BundleId> }[] =
  [
    {
      nome: "Stitch",
      de: "do",
      visual: "azul, com a barriga azul-clara e o capuz com as orelhas grandes do Stitch",
      ids: { 2: "kgsti2", 4: "kgsti4" },
    },
    {
      nome: "Angel",
      de: "da",
      visual: "rosa, com a barriga rosa-clara e o capuz com as anteninhas da Angel",
      ids: { 2: "kgang2", 4: "kgang4" },
    },
    {
      nome: "Banguela",
      de: "do",
      visual: "preto, com o capuz do dragão de olhos verdes, asinhas nas costas e cauda",
      ids: { 2: "kgban2", 4: "kgban4" },
    },
    {
      nome: "Fúria da Luz",
      de: "da",
      visual: "branco, com o capuz da dragoa de olhos azuis, asinhas nas costas e cauda",
      ids: { 2: "kgfur2", 4: "kgfur4" },
    },
  ];
/** Avaliações de clientes dos kigurumis (vindas da loja Combinadinhos, mesmo produto). */
const KIGURUMI_REVIEWS: readonly Review[] = [
  {
    author: "Juliana M.",
    rating: 5,
    text: "Filmei pra mostrar pra galera o quanto ficou bom, a modelagem é super confortável!",
    videos: [img("rev-kg-juliana.mp4")],
  },
  {
    author: "Ana & Gabriel",
    rating: 5,
    text: "Compramos o combo casal e amamos, super quentinho pra dormir junto no friozinho 💙",
    photos: [img("rev-kg-ana-gabriel.webp")],
  },
  {
    author: "Camila B.",
    rating: 5,
    text: "Meu filho ficou tão feliz que nem quis tirar o pijama do Stitch, olha o sorriso dele! 🥹",
    videos: [img("rev-kg-camila.mp4")],
  },
  {
    author: "Pedro H.",
    rating: 5,
    text: "Meu filho ficou pulando de alegria, foi a primeira coisa que ele vestiu quando chegou 😍",
    photos: [img("rev-kg-pedro.webp")],
  },
  {
    author: "Bia S.",
    rating: 5,
    text: "Larguei a vergonha e usei o dia todo em casa, ficou super estiloso e leve!",
    photos: [img("rev-kg-bia.webp")],
  },
];

export const KIGURUMI_IDS: readonly BundleId[] = KIGURUMIS.flatMap((k) => [k.ids[2], k.ids[4]]);

function kigurumi(k: (typeof KIGURUMIS)[number], n: 2 | 4): Bundle {
  const price = KIGURUMI_COMBOS[n];
  const foto = (sufixo = "") => img(`kg-${SLUG[k.nome]}${sufixo}.jpg`);
  // Ursinho de brinde só no combo de 4; no de 2 ele pode ser comprado à parte.
  const brinde = n === 4;
  return {
    id: k.ids[n],
    name: `Pijama Kigurumi ${k.nome}`,
    tag: brinde ? "Combo de 4 com ursinho de brinde" : "Combo de 2 pijamas",
    price,
    img: foto(),
    images: [foto(), foto("-capuz"), foto("-tecido"), foto("-ziper"), img("kg-grupo.jpg")],
    options: [
      ...ate(n).flatMap((i) => [
        { name: `Personagem (${i}º pijama)`, values: PERSONAGENS },
        { name: `Tamanho (${i}º pijama)`, values: TAM_COMBO },
      ]),
      ...(brinde ? [{ name: "Ursinho de brinde", values: PERSONAGENS }] : []),
    ],
    optionCards: { Personagem: KIGURUMI_FOTOS, "Ursinho de brinde": URSINHO_FOTOS },
    optionNotes: {
      "Ursinho de brinde":
        "No combo de 4 você ganha 1 ursinho. Quer mais? Escolha os extras abaixo.",
    },
    benefits: [
      `Combo de ${n} por ${brl(price)}: ${brl(price / n)} cada pijama`,
      "Você escolhe o personagem de cada pijama e pode repetir",
      "Do infantil 2 anos ao plus size G3",
      brinde
        ? "Ursinho de pelúcia de brinde no pedido"
        : "Levando o combo de 4, você ganha um ursinho de brinde",
    ],
    description: [
      `Pijama kigurumi de corpo inteiro ${k.visual}. O tecido é macio e peluciado, gostoso na pele e quentinho para os dias frios.`,
      `É vendido em combo: no combo de ${n} você escolhe o personagem de cada pijama (Stitch, Angel, Banguela ou Fúria da Luz) e pode repetir o mesmo quantas vezes quiser. Cada um tem o seu tamanho, do infantil 2 anos ao plus size G3, para montar o combo do casal, dos filhos ou dos amigos.`,
      brinde
        ? "No combo de 4 você ganha um ursinho de pelúcia de brinde, do personagem que escolher."
        : "Levando o combo de 4, você ganha também um ursinho de pelúcia de brinde.",
    ],
    specs: [
      ["Vem no pedido", `${n} pijamas kigurumi${brinde ? " + 1 ursinho de brinde" : ""}`],
      ["Personagens", "Stitch, Angel, Banguela e Fúria da Luz"],
      ["Tecido", "Pelúcia macia e peluciada"],
      ["Modelagem", "Macacão com capuz e zíper na frente, soltinho no corpo"],
      ["Tamanhos infantis", "2, 4, 6, 8, 10, 12 e 14"],
      ["Tamanhos adultos", listaTamanhos(TAM_ADULTO)],
      ["Plus size", listaTamanhos(TAM_PLUS)],
      ["Medidas", "Podem variar de 1 a 3 cm"],
      ["Cuidados", "Lavar com água fria, não usar alvejante e secar à sombra"],
    ],
    richSections: [
      {
        title: "Conforto, fofura e praticidade no mesmo pijama",
        text: "Feito para quem ama conforto e um visual divertido para usar em casa: no sofá, na cama ou na noite do pijama.",
        points: [
          "Tecido macio e peluciado, gostoso na pele",
          "Modelagem soltinha para dormir ou ficar no sofá",
          `Capuz com o rostinho ${k.de} ${k.nome}`,
          "Perfeito para combinar em casal, com os filhos ou com os amigos",
        ],
        media: foto("-tecido"),
      },
      {
        title: "Um tamanho para cada pessoa",
        text: "Cada pijama do combo tem o seu tamanho: dá para montar um combo com um adulto M, um plus size G2 e duas crianças. Confira a tabela de medidas antes de escolher e, se ficar entre dois tamanhos, escolha o maior.",
        media: img("kg-modelagem.jpg"),
      },
      {
        title: "Capricho em cada detalhe",
        text: "Capuz com orelhinhas e olhos do personagem, zíper na frente para vestir fácil e punhos com acabamento que seguram o calor.",
        media: foto("-capuz"),
      },
      {
        title: "Leve 4 e ganhe um ursinho",
        text: "No combo de 4 pijamas você escolhe o ursinho do seu personagem favorito e ele vai junto no pedido, sem pagar nada a mais. Quer outros, ou está levando o combo de 2? Cada ursinho sai por R$ 29,90.",
        media: URSINHO_FOTOS[k.nome]!,
      },
    ],
    reviews: KIGURUMI_REVIEWS,
    category: "kigurumi",
    checkoutProductName: `Combo ${n} Pijamas Kigurumi (${k.nome})`,
    checkoutProductDescription: `${n} pijamas kigurumi de personagem${brinde ? " e 1 ursinho de brinde" : ""}.`,
    checkoutUrl: `/checkout?plano=${k.ids[n]}`,
    group: `kg-${SLUG[k.nome]}`,
    groupLabel: brinde ? "Combo de 4 + ursinho" : "Combo de 2",
    groupTitle: "Escolha o combo",
    unidades: n,
    comboExtras: true,
    semPromo: true,
    // Nas vitrines aparece o combo de 2; o de 4 fica no seletor da página.
    ...(n === 4 ? { listed: false } : {}),
  };
}

/** Pantufas: uma preta (Banguela), uma branca (Fúria da Luz), Stitch e Angel, em combo de 2 ou 4 pares. */
const PANTUFA_ORDEM: readonly Personagem[] = ["Banguela", "Fúria da Luz", "Stitch", "Angel"];

function comboPantufas(id: BundleId, n: 2 | 4, price: number): Bundle {
  return {
    id,
    name: "Pantufas de Pelúcia",
    tag: "Banguela, Fúria da Luz, Stitch e Angel",
    price,
    img: PANTUFA_P_FOTOS.Banguela!,
    images: PANTUFA_ORDEM.map((p) => PANTUFA_P_FOTOS[p]!),
    options: ate(n).flatMap((i) => [
      { name: `Personagem (${i}º par)`, values: PANTUFA_ORDEM },
      { name: `Numeração (${i}º par)`, values: PANTUFA_NUMEROS },
    ]),
    optionCards: { Personagem: PANTUFA_P_FOTOS },
    benefits: [
      `${n} pares por ${brl(price)}: ${brl(price / n)} cada par`,
      "Você escolhe o personagem e a numeração de cada par",
      "Numeração infantil e adulta, do 22 ao 46",
    ],
    description: [
      "Pantufas de pelúcia fechadinhas e fofas, com o rostinho do personagem: o Banguela preto de olhos verdes, a Fúria da Luz branca de olhos azuis, o Stitch e a Angel.",
      `São vendidas em combo: ${n} pares por ${brl(price)}. Você escolhe o personagem e a numeração de cada par, pode repetir e misturar, e monta o kit da família inteira.`,
      "O forro de pelúcia segura o calor e deixa o pé quentinho do quarto até a cozinha. Combinam com os pijamas kigurumi e os pijamas de dragão da loja.",
    ],
    specs: [
      ["Vem no pedido", `${n} pares de pantufas`],
      ["Personagens", "Banguela, Fúria da Luz, Stitch e Angel"],
      ["Material", "Pelúcia macia, fechada na frente e atrás"],
      ["Numeração infantil", "Do 22 ao 34"],
      ["Numeração adulta", "Do 35 ao 46"],
      ["Dica", "Se estiver entre dois números, escolha o maior"],
      ["Cuidados", "Lavar à mão com água fria e secar à sombra"],
    ],
    category: "conforto",
    checkoutProductName: `${n} Pantufas de Pelúcia`,
    checkoutProductDescription: `${n} pares de pantufas de pelúcia de personagem.`,
    checkoutUrl: `/checkout?plano=${id}`,
    group: "pantufas",
    groupLabel: `${n} pares`,
    groupTitle: "Escolha o combo",
    unidades: n,
    badge: `${n} por ${brl(price)}`,
    // Nas vitrines aparece o combo de 2; o de 4 fica no seletor da página.
    ...(n === 4 ? { listed: false } : {}),
  };
}

const kigurumis: Bundle[] = [
  ...KIGURUMIS.flatMap((k) => [kigurumi(k, 2), kigurumi(k, 4)]),
  comboPantufas("pantufa2", 2, 49.9),
  comboPantufas("pantufa4", 4, 79.9),
  {
    id: "ursinho",
    name: "Ursinho de Pelúcia",
    tag: "Ursinho extra do personagem",
    price: 29.9,
    img: URSINHO_FOTOS.Stitch!,
    images: PERSONAGENS.map((p) => URSINHO_FOTOS[p]!),
    options: [{ name: "Personagem", values: PERSONAGENS }],
    optionCards: { Personagem: URSINHO_FOTOS },
    benefits: ["Ursinho de pelúcia do personagem"],
    category: "brinquedos",
    checkoutProductName: "Ursinho de Pelúcia Extra",
    checkoutProductDescription: "Ursinho de pelúcia de personagem.",
    checkoutUrl: "/checkout?plano=ursinho",
    listed: false,
    redirectTo: "kgban2",
  },
];

/**
 * Kigurumi felpudo de dragão com capuz de boquinha: Dragão Noturno (preto) e Dragão da Neve
 * (branco), um produto por cor, vendido em 1 unidade (R$ 99) ou 2 (R$ 149), do infantil 2 anos ao
 * adulto GG. No de 2 o cliente escolhe o modelo e o tamanho de cada um; nas vitrines aparece o de 1.
 */
const DRAGOES = ["Dragão Noturno", "Dragão da Neve"] as const;
type Dragao = (typeof DRAGOES)[number];
const DRAGAO_FOTOS: Record<Dragao, string> = {
  "Dragão Noturno": img("kgd-noturno.jpg"),
  "Dragão da Neve": img("kgd-neve.jpg"),
};
const DRAGAO_PRECOS = { 1: 99, 2: 149 } as const;
/** Do infantil 2 anos ao adulto GG (sem plus size). */
const TAM_DRAGAO = [...TAM_INF, ...TAM_ADULTO];
const KIGURUMIS_DRAGAO: {
  nome: Dragao;
  slug: string;
  visual: string;
  fotos: readonly string[];
  ids: Record<1 | 2, BundleId>;
}[] = [
  {
    nome: "Dragão Noturno",
    slug: "noturno",
    visual:
      "preto, com capuz de dragão de olhos amarelos e boquinha de dentinhos, e patinhas nas pernas",
    fotos: ["", "-capuz", "-cama", "-casal", "-casal2"],
    ids: { 1: "kgdnot1", 2: "kgdnot2" },
  },
  {
    nome: "Dragão da Neve",
    slug: "neve",
    visual: "branco, com capuz de dragão de olhos azuis e chifrinhos, e patinhas azuis nas pernas",
    fotos: ["", "-cama", "-casal"],
    ids: { 1: "kgdnev1", 2: "kgdnev2" },
  },
];

function kigurumiDragao(k: (typeof KIGURUMIS_DRAGAO)[number], n: 1 | 2): Bundle {
  const price = DRAGAO_PRECOS[n];
  const foto = (sufixo = "") => img(`kgd-${k.slug}${sufixo}.jpg`);
  const outro = DRAGOES.find((d) => d !== k.nome)!;
  return {
    id: k.ids[n],
    name: `Pijama Kigurumi ${k.nome}`,
    tag: "Macacão felpudo com capuz de dragão",
    price,
    img: foto(),
    images: [...k.fotos.map(foto), DRAGAO_FOTOS[outro]],
    options:
      n === 1
        ? [
            { name: "Modelo", values: [k.nome] },
            { name: "Tamanho", values: TAM_DRAGAO },
          ]
        : ate(2).flatMap((i) => [
            { name: `Modelo (${i}º pijama)`, values: DRAGOES },
            { name: `Tamanho (${i}º pijama)`, values: TAM_DRAGAO },
          ]),
    optionCards: { Modelo: DRAGAO_FOTOS },
    benefits: [
      n === 1
        ? `Leve 2 por ${brl(DRAGAO_PRECOS[2])}: sai ${brl(DRAGAO_PRECOS[2] / 2)} cada`
        : `2 por ${brl(price)}: ${brl(price / n)} cada pijama`,
      n === 1
        ? "Tecido felpudo e quentinho para o frio"
        : "Você escolhe o modelo e o tamanho de cada um",
      "Preto e branco para combinar em casal ou com os filhos",
      "Do infantil 2 anos ao adulto GG",
    ],
    description: [
      `Pijama kigurumi de corpo inteiro ${k.visual}. O tecido é felpudo e macio, gostoso na pele e quentinho para os dias frios.`,
      `Tem em dois modelos: o Dragão Noturno, preto, e o Dragão da Neve, branco. Sai 1 por ${brl(DRAGAO_PRECOS[1])} ou 2 por ${brl(DRAGAO_PRECOS[2])}, e levando 2 você escolhe o modelo e o tamanho de cada um: um de cada para o casal, para a família ou dois iguais. Tem do infantil 2 anos ao adulto GG.`,
    ],
    specs: [
      ["Vem no pedido", n === 1 ? "1 pijama kigurumi" : "2 pijamas kigurumi"],
      ["Modelos", "Dragão Noturno (preto) e Dragão da Neve (branco)"],
      ["Tecido", "Felpudo e macio"],
      ["Modelagem", "Macacão com capuz, soltinho no corpo"],
      ["Tamanhos infantis", "2, 4, 6, 8, 10, 12 e 14"],
      ["Tamanhos adultos", listaTamanhos(TAM_ADULTO)],
      ["Cuidados", "Lavar com água fria, não usar alvejante e secar à sombra"],
    ],
    richSections: [
      {
        title: "Felpudo do capuz até a barra",
        text: "Feito para quem ama conforto e um visual divertido para usar em casa: no sofá, na cama ou na noite do pijama.",
        points: [
          "Tecido felpudo, macio e quentinho",
          "Modelagem soltinha para dormir ou ficar no sofá",
          `Capuz com o rostinho do ${k.nome}`,
        ],
        media: foto("-cama"),
      },
      {
        title: "Um preto e um branco para o casal",
        text: `Levando 2 por ${brl(DRAGAO_PRECOS[2])}, você escolhe o modelo e o tamanho de cada pijama. Um Dragão Noturno e um Dragão da Neve fazem o par perfeito.`,
        media: foto("-casal"),
      },
    ],
    category: "kigurumi",
    checkoutProductName: n === 1 ? `Pijama Kigurumi ${k.nome}` : "2 Pijamas Kigurumi de Dragão",
    checkoutProductDescription:
      n === 1 ? "Pijama kigurumi felpudo de dragão." : "2 pijamas kigurumi felpudos de dragão.",
    checkoutUrl: `/checkout?plano=${k.ids[n]}`,
    group: `kgd-${k.slug}`,
    groupLabel: n === 1 ? "1 unidade" : "2 unidades",
    groupTitle: "Escolha a quantidade",
    unidades: n,
    semPromo: true,
    ...(n === 1
      ? {
          comboVitrine: k.ids[2],
          trocaModelo: Object.fromEntries(KIGURUMIS_DRAGAO.map((d) => [d.nome, d.ids[1]])),
        }
      : { listed: false }),
  };
}

const kigurumisDragao: Bundle[] = KIGURUMIS_DRAGAO.flatMap((k) => [
  kigurumiDragao(k, 1),
  kigurumiDragao(k, 2),
]);

/**
 * Umidificador de dragão: um produto só, preto ou branco, 1 por R$ 69 ou 2 por R$ 99 (o cliente
 * escolhe a cor de cada um). Cada quantidade é um produto do mesmo grupo (preço fechado, fora da
 * promoção de 50%); nas vitrines aparece o de 1 unidade, com a promoção "1 por R$ 69 / ou 2 por
 * R$ 99" no card. O de 3 por R$ 129 saiu: fica no catálogo para pedidos e carrinhos antigos, e a
 * página dele leva para o de 2. As fotos do branco foram editadas no Gemini a partir das do preto.
 */
const UMIDIFICADOR_CORES = ["Preto", "Branco"] as const;
const UMIDIFICADOR_FOTOS: Readonly<Record<string, string>> = {
  Preto: img("umidificador-1.jpg"),
  Branco: img("umidificador-branco-1.jpg"),
};
const UMIDIFICADOR_COMBOS: { id: BundleId; n: 1 | 2 | 3; price: number }[] = [
  { id: "umid1", n: 1, price: 69 },
  { id: "umid2", n: 2, price: 99 },
  { id: "umid3", n: 3, price: 129 },
];

const umidificadores: Bundle[] = UMIDIFICADOR_COMBOS.map(({ id, n, price }) => {
  const nome = "Umidificador de Dragão";
  const qtd = n === 1 ? "1 unidade" : `${n} unidades`;
  return {
    id,
    name: nome,
    tag: "Preto ou branco, solta névoa azul pela boca e os olhos acendem",
    price,
    img: img("umidificador-1.jpg"),
    images: [
      img("umidificador-1.jpg"),
      img("umidificador-branco-1.jpg"),
      img("umidificador-2.jpg"),
      img("umidificador-branco-2.jpg"),
      img("umidificador-3.jpg"),
      img("umidificador-branco-3.jpg"),
    ],
    options:
      n === 1
        ? [{ name: "Cor", values: UMIDIFICADOR_CORES }]
        : Array.from({ length: n }, (_, i) => ({
            name: `Cor (${i + 1}º umidificador)`,
            values: UMIDIFICADOR_CORES,
          })),
    optionCards: { Cor: UMIDIFICADOR_FOTOS },
    benefits: [
      "Dragão preto ou branco que solta névoa azul pela boca, como se cuspisse fogo",
      "Olhos e detalhes que acendem",
      "Névoa fria que ajuda a umidificar o ar seco do quarto",
    ],
    description: [
      "Um umidificador em forma de dragão: ele solta pela boca uma névoa azul iluminada, com efeito de fogo mágico, enquanto os olhos acendem.",
      "Tem em duas cores, preto ou branco, e levando mais de um você escolhe a cor de cada: um de cada ou todos iguais.",
      "A névoa é fria e ajuda a deixar o ar menos seco, criando um clima aconchegante no quarto, no setup gamer ou na escrivaninha. Mesmo desligado, é uma peça de decoração que chama atenção.",
    ],
    specs: [
      ["Vem no pedido", n === 1 ? "1 umidificador" : `${n} umidificadores`],
      ["Tipo", "Umidificador de névoa fria"],
      ["Efeito", "Névoa azul saindo da boca e olhos iluminados"],
      ["Cores", "Preto ou branco"],
      ["Ideal para", "Quarto, setup gamer, escrivaninha e quarto infantil"],
    ],
    richSections: [
      {
        title: "Um dragão que cospe névoa azul",
        text: "É só ligar: a névoa sai pela boca do dragão, iluminada de azul, e os olhos acendem. O efeito parece fogo de dragão, só que fresquinho.",
        media: img("umidificador.mp4"),
      },
      {
        title: "Preto ou branco, você escolhe",
        text: "Os dois soltam a mesma névoa azul pela boca. Levando 2 por R$ 99, você escolhe a cor de cada um.",
        points: [
          "Névoa fria, sem aquecer a água",
          "Luz azul suave na névoa",
          "Decoração de dragão que chama atenção",
        ],
        media: img("umidificador-branco-1.jpg"),
      },
      {
        title: "Ar mais úmido e um clima aconchegante",
        text: "A névoa fria ajuda a umidificar o ar seco, principalmente no inverno e com ar-condicionado ligado, e a luz azul deixa o ambiente calmo para relaxar ou dormir.",
        media: img("umidificador-1.jpg"),
      },
      {
        title: "Para o quarto, o setup e a escrivaninha",
        text: "Fica lindo na mesa do computador, na estante ou no quarto das crianças que amam dragões. Um presente certeiro para fãs de Como Treinar o Seu Dragão.",
        media: img("umidificador-branco-3.jpg"),
      },
    ],
    category: "casa",
    checkoutProductName: n === 1 ? nome : `${nome} (${qtd})`,
    checkoutProductDescription: `${qtd} do umidificador de dragão com névoa azul.`,
    checkoutUrl: `/checkout?plano=${id}`,
    badge: "Novo",
    // Fora do grupo, o de 3 some do seletor "Escolha a quantidade".
    ...(n < 3
      ? { group: "umidificador", groupLabel: qtd, groupTitle: "Escolha a quantidade" }
      : { redirectTo: "umid2" as BundleId }),
    unidades: n,
    semPromo: true,
    ...(n === 1 ? { comboVitrine: "umid2" as BundleId } : { listed: false }),
  };
});

/**
 * Máscara de dormir: um produto só, 1 por R$ 20,90 ou 2 por R$ 34,90 (o cliente escolhe a estampa de
 * cada uma). Cada quantidade é um produto do grupo; nas vitrines aparece o de 1, com a oferta de 2 no
 * card. As duas também são o order bump do checkout (MascaraBump).
 */
export const MASCARA_ESTAMPAS = [
  "Olhos azul e verde",
  "Olhos verdes",
  "Dragão dormindo",
  "Olhos amarelos",
  "Casal apaixonado",
  "Olhos azuis realistas",
  "Olhos verdes realistas",
] as const;
const MASCARA_FOTOS: Readonly<Record<string, string>> = {
  "Olhos azul e verde": img("mascara-olhos-azul-verde.jpg"),
  "Olhos verdes": img("mascara-olhos-verdes.jpg"),
  "Dragão dormindo": img("mascara-dormindo.jpg"),
  "Olhos amarelos": img("mascara-olhos-amarelos.jpg"),
  "Casal apaixonado": img("mascara-apaixonados.jpg"),
  "Olhos azuis realistas": img("mascara-olhos-azuis.jpg"),
  "Olhos verdes realistas": img("mascara-olhos-verdes-real.jpg"),
};
/** "de" de cada combo: o de 1 é o preço cheio da loja; o de 2 é o preço de duas avulsas. */
export const MASCARA_COMBOS: { id: BundleId; n: 1 | 2; price: number; de: number }[] = [
  { id: "mascara", n: 1, price: 20.9, de: 34.9 },
  { id: "mascara2", n: 2, price: 34.9, de: 41.8 },
];

const mascaras: Bundle[] = MASCARA_COMBOS.map(({ id, n, price, de }) => {
  const nome = "Máscara de Dormir Dragão";
  return {
    id,
    name: nome,
    tag: "7 estampas, bloqueia a luz para dormir melhor",
    price,
    compareAtPrice: de,
    img: img("mascara-todas.jpg"),
    images: [
      img("mascara-todas.jpg"),
      img("mascara-olhos-verdes.jpg"),
      img("mascara-dormindo.jpg"),
      img("mascara-apaixonados.jpg"),
    ],
    options:
      n === 1
        ? [{ name: "Estampa", values: MASCARA_ESTAMPAS }]
        : [
            { name: "Estampa (1ª máscara)", values: MASCARA_ESTAMPAS },
            { name: "Estampa (2ª máscara)", values: MASCARA_ESTAMPAS },
          ],
    optionImages: MASCARA_FOTOS,
    benefits: [
      n === 1
        ? "Leve 2 por R$ 34,90: sai R$ 17,45 cada"
        : `2 por ${brl(price)}: ${brl(price / n)} cada máscara`,
      "Bloqueia a luz para você dormir melhor e mais rápido",
      "7 estampas de dragão, das fofas às realistas",
      "Leve, com elástico que se ajusta à cabeça",
    ],
    description: [
      "Durma como um dragão depois de um dia de aventuras. A máscara de dormir bloqueia a claridade do quarto, da TV ou do celular e ajuda a pegar no sono mais rápido, em casa, na viagem ou naquele cochilo da tarde.",
      "São 7 estampas para escolher: olhos de dragão realistas que encaram quem estiver por perto, versões fofas em desenho e até o casal de dragões apaixonados, ótima para dar de presente em dupla. Sai 1 por R$ 20,90 ou 2 por R$ 34,90, e no combo você escolhe a estampa de cada uma.",
      "Leve e confortável, com elástico que se ajusta à cabeça sem apertar. Combina com os pijamas e o Sleepo Dragão da loja.",
    ],
    specs: [
      ["Vem no pedido", n === 1 ? "1 máscara" : "2 máscaras"],
      ["Estampas", "7 opções"],
      ["Ajuste", "Elástico que se ajusta à cabeça"],
      ["Indicado para", "Adultos e crianças"],
      ["Cuidados", "Lavar à mão com água fria e sabão neutro; secar à sombra"],
    ],
    category: "conforto",
    checkoutProductName: n === 1 ? nome : "2 Máscaras de Dormir Dragão",
    checkoutProductDescription:
      n === 1
        ? "Máscara de dormir com estampa de dragão e elástico ajustável."
        : "2 máscaras de dormir com estampa de dragão e elástico ajustável.",
    checkoutUrl: `/checkout?plano=${id}`,
    group: "mascara",
    groupLabel: n === 1 ? "1 máscara" : "2 máscaras",
    groupTitle: "Escolha a quantidade",
    unidades: n,
    semPromo: true,
    ...(n === 1 ? { badge: "Novo", comboVitrine: "mascara2" as BundleId } : { listed: false }),
  };
});

/**
 * Essências para o umidificador: order bump do checkout quando há umidificador no pedido
 * (EssenciaBump). 3 essências por R$ 34,90 (o cliente escolhe os 3 aromas, sem repetir) ou o kit com
 * as 10 por R$ 99,90. Frascos de 15 ml à base de água. Fora das vitrines: só aparecem no checkout.
 */
export const ESSENCIA_AROMAS = [
  "Lavanda",
  "Alfazema",
  "Jasmim",
  "Dama da Noite",
  "Flor de Lótus",
  "Gerânio",
  "Violeta",
  "Floral",
  "Mil Flores",
  "Natureza",
] as const;
export const ESSENCIA_FOTOS: Readonly<Record<string, string>> = {
  Lavanda: img("essencia-lavanda.jpg"),
  Alfazema: img("essencia-alfazema.jpg"),
  Jasmim: img("essencia-jasmim.jpg"),
  "Dama da Noite": img("essencia-dama-da-noite.jpg"),
  "Flor de Lótus": img("essencia-flor-de-lotus.jpg"),
  Gerânio: img("essencia-geranio.jpg"),
  Violeta: img("essencia-violeta.jpg"),
  Floral: img("essencia-floral.jpg"),
  "Mil Flores": img("essencia-mil-flores.jpg"),
  Natureza: img("essencia-natureza.jpg"),
};
export const UMIDIFICADOR_IDS: readonly BundleId[] = ["umid1", "umid2", "umid3"];
export const ESSENCIA_COMBOS: { id: BundleId; n: 3 | 10; price: number }[] = [
  { id: "essencia3", n: 3, price: 34.9 },
  { id: "essencia10", n: 10, price: 99.9 },
];

const essencias: Bundle[] = ESSENCIA_COMBOS.map(({ id, n, price }) => {
  const nome = n === 10 ? "Kit 10 Essências para Umidificador" : "3 Essências para Umidificador";
  return {
    id,
    name: nome,
    tag: n === 10 ? "Os 10 aromas, frascos de 15 ml" : "Você escolhe os 3 aromas, frascos de 15 ml",
    price,
    img: img("essencias-kit.jpg"),
    images: [img("essencias-kit.jpg")],
    options:
      n === 10
        ? []
        : [1, 2, 3].map((i) => ({ name: `Aroma (${i}ª essência)`, values: ESSENCIA_AROMAS })),
    optionImages: ESSENCIA_FOTOS,
    benefits: [
      n === 10 ? "Os 10 aromas, um frasco de cada" : "3 frascos, com os aromas que você escolher",
      "Frascos de 15 ml à base de água",
      "Para usar no umidificador de dragão",
    ],
    description: [
      "Essências à base de água para deixar o quarto perfumado enquanto o umidificador de dragão solta a névoa.",
      n === 10
        ? "O kit traz os 10 aromas, um frasco de 15 ml de cada: Lavanda, Alfazema, Jasmim, Dama da Noite, Flor de Lótus, Gerânio, Violeta, Floral, Mil Flores e Natureza."
        : "São 3 frascos de 15 ml, e você escolhe os aromas entre Lavanda, Alfazema, Jasmim, Dama da Noite, Flor de Lótus, Gerânio, Violeta, Floral, Mil Flores e Natureza.",
    ],
    specs: [
      ["Vem no pedido", n === 10 ? "10 frascos, um de cada aroma" : "3 frascos"],
      ["Volume", "15 ml cada"],
      ["Base", "Água"],
    ],
    category: "casa",
    checkoutProductName: nome,
    checkoutProductDescription:
      n === 10 ? "Kit com 10 essências de 15 ml à base de água." : "3 essências de 15 ml à base de água.",
    checkoutUrl: `/checkout?plano=${id}`,
    group: "essencia",
    groupLabel: n === 10 ? "Kit com as 10" : "3 essências",
    groupTitle: "Escolha o kit",
    unidades: n,
    semPromo: true,
    listed: false,
  };
});

/**
 * Pelúcia gigante: um produto só, preta ou branca, 1 por R$ 69 ou 2 por R$ 89 (o cliente escolhe a
 * cor de cada uma). Cada quantidade é um produto do grupo; nas vitrines aparece o de 1, com a oferta
 * de 2 no card.
 */
const PELUCIA_CORES = ["Preta", "Branca"] as const;
const PELUCIA_FOTOS: Readonly<Record<string, string>> = {
  Preta: img("pelucia-gigante.jpg"),
  Branca: img("pelucia-branca.jpg"),
};
const PELUCIA_COMBOS: { id: BundleId; n: 1 | 2; price: number }[] = [
  { id: "pelucia", n: 1, price: 69 },
  { id: "pelucia2", n: 2, price: 89 },
];

const pelucias: Bundle[] = PELUCIA_COMBOS.map(({ id, n, price }) => {
  const nome = "Pelúcia Gigante de Dragão 1,10 m";
  return {
    id,
    name: nome,
    tag: "Preta ou branca, travesseiro de abraço extra grande",
    price,
    img: img("pelucia-par.jpg"),
    images: [
      img("pelucia-par.jpg"),
      PELUCIA_FOTOS.Preta!,
      PELUCIA_FOTOS.Branca!,
      img("pelucia-branca-uso.jpg"),
      img("pelucia-gigante-b.jpg"),
      img("pelucia-gigante-c.jpg"),
      img("pelucia-gigante-d.jpg"),
    ],
    options:
      n === 1
        ? [{ name: "Cor", values: PELUCIA_CORES }]
        : [
            { name: "Cor (1ª pelúcia)", values: PELUCIA_CORES },
            { name: "Cor (2ª pelúcia)", values: PELUCIA_CORES },
          ],
    optionCards: { Cor: PELUCIA_FOTOS },
    benefits: [
      n === 1
        ? "Leve 2 por R$ 89: sai R$ 44,50 cada"
        : `2 por ${brl(price)}: ${brl(price / n)} cada pelúcia`,
      "Preta de olhos verdes ou branca de olhos azuis: você escolhe",
      "1,10 m de comprimento: dá para abraçar o corpo inteiro",
    ],
    description: [
      "Um dragão de pelúcia de 1,10 m, deitadinho e pronto para ser abraçado. É o travesseiro de abraço perfeito para dormir, assistir filme no sofá ou ler na cama, e ainda deixa o quarto muito mais fofo.",
      "Tem em duas cores: a preta, de olhos verdes e com a pontinha vermelha no rabo, e a branca, de olhos azuis. Sai 1 por R$ 69 ou 2 por R$ 89, e no combo você escolhe a cor de cada uma: uma de cada ou duas iguais.",
      "Um presente que crianças, adolescentes e adultos fãs de dragão amam receber.",
    ],
    specs: [
      ["Vem no pedido", n === 1 ? "1 pelúcia" : "2 pelúcias"],
      ["Comprimento", "Cerca de 1,10 m"],
      ["Cores", "Preta com olhos verdes ou branca com olhos azuis"],
      ["Material", "Pelúcia macia com enchimento de fibra"],
      ["Indicado para", "Todas as idades"],
      ["Cuidados", "Limpar com pano úmido e sabão neutro; secar à sombra"],
    ],
    richSections: [
      {
        title: "1,10 m de dragão para abraçar",
        text: "Imagine chegar em casa cansado e ter um dragão gigante esperando por um abraço. A pelúcia é tão grande que dá para abraçar o corpo inteiro, deitar a cabeça e dormir agarradinho.",
        media: img("pelucia-branca-uso.jpg"),
      },
      {
        title: "Preta ou branca, você escolhe",
        text: "A preta tem olhos verdes e a pontinha vermelha no rabo; a branca tem olhos azuis. Levando 2 por R$ 89, você escolhe a cor de cada uma.",
        points: [
          "Cerca de 1,10 m de comprimento",
          "Pelúcia macia com enchimento de fibra",
          "Travesseiro de abraço, apoio no sofá e decoração",
        ],
        media: img("pelucia-par.jpg"),
      },
      {
        title: "O presente que faz qualquer um gritar",
        text: "Crianças, adolescentes e adultos fãs de dragão: ninguém fica indiferente a um dragão desse tamanho. É o tipo de presente que vira o xodó do quarto.",
        media: img("pelucia-gigante-b.jpg"),
      },
    ],
    category: "conforto",
    checkoutProductName: n === 1 ? nome : `2 Pelúcias Gigantes de Dragão 1,10 m`,
    checkoutProductDescription:
      n === 1 ? "Pelúcia gigante de dragão de 1,10 m." : "2 pelúcias gigantes de dragão de 1,10 m.",
    checkoutUrl: `/checkout?plano=${id}`,
    group: "pelucia",
    groupLabel: n === 1 ? "1 pelúcia" : "2 pelúcias",
    groupTitle: "Escolha a quantidade",
    unidades: n,
    semPromo: true,
    ...(n === 1 ? { comboVitrine: "pelucia2" as BundleId } : { listed: false }),
  };
});

const baseBundles: Bundle[] = [
  ...brinquedos,
  ...moletons,
  ...kigurumis,
  ...kigurumisDragao,
  ...crocs,
  ...crocsPromo,
  {
    id: "pijama",
    kids: {
      id: "pijamai",
      price: 76.9,
      compareAtPrice: 104.9,
      options: [
        { name: "Modelo", values: ["Dragão Branco", "Dragão Preto"] },
        { name: "Idade", values: TAM_INF },
      ],
    },
    name: "Calça Pijama de Dragão",
    tag: "Do infantil 2 ao plus size G3",
    price: 90.9,
    compareAtPrice: 125.9,
    img: img("p1_pijama.jpg"),
    images: [img("p1_pijama.jpg"), img("p1_branco.jpg"), img("p1_preto.jpg"), img("p1_casal.jpg")],
    options: [
      { name: "Modelo", values: ["Dragão Branco", "Dragão Preto"] },
      { name: "Tamanho", values: [...TAM_ADULTO, ...TAM_PLUS] },
    ],
    optionImages: { "Dragão Branco": img("p1_branco.jpg"), "Dragão Preto": img("p1_preto.jpg") },
    benefits: [
      "Tamanhos do infantil 2 anos ao plus size G3",
      "Algodão felpudo, macio e durável",
      "Cós com elástico e cordão ajustável",
    ],
    description: [
      "A calça de pijama que dá vontade de ficar em casa. Estampa de dragão, tecido felpudo e macio por dentro e caimento solto, do jeito que um pijama tem que ser.",
      "O cós tem elástico e cordão para ajustar na cintura, e a modelagem relaxada não aperta nem para dormir nem para ficar no sofá. Tem versão adulta e infantil, para combinar com a família inteira.",
    ],
    specs: [
      ["Modelos", "Dragão Branco e Dragão Preto"],
      ["Tecido", "Algodão felpudo, macio por dentro"],
      ["Cintura", "Elástico com cordão de ajuste"],
      ["Tamanhos infantis", "2, 4, 6, 8, 10, 12 e 14 (idade aproximada em anos)"],
      ["Tamanhos adultos", listaTamanhos(TAM_ADULTO)],
      ["Plus size", listaTamanhos(TAM_PLUS)],
      [
        "Cuidados",
        "Lavar à mão ou na máquina no ciclo delicado, com água fria. Não usar secadora nem alvejante.",
      ],
    ],
    reviews: [
      {
        author: "Cliente",
        rating: 5,
        text: "Meu Deus, é a melhor coisa que já comprei. Essas calças são as melhores: confortáveis, no tamanho certo e ainda com folga, vieram exatamente como esperado. São lindas e já quero comprar o macacão também. As melhores calças de todos os tempos!",
        date: "25/02/2026",
        photos: [img("rev-pijama-1.jpg")],
      },
      {
        author: "Cliente",
        rating: 5,
        text: "Amei demais esse conjunto, não vejo a hora de dar o do meu namorado. É muito macio e felpudo por dentro. A comunicação foi ótima e a espera valeu a pena. O tamanho é certinho.",
        date: "15/12/2025",
        photos: [img("rev-pijama-2.jpg")],
      },
      {
        author: "Cliente",
        rating: 5,
        text: "Fiquei surpresa, estava desconfiada, mas a qualidade é ótima, super felpudo e muito fofo. Zero arrependimento! Com certeza vou comprar mais.",
        date: "23/12/2025",
        photos: [img("rev-pijama-3.jpg")],
      },
      {
        author: "Ben",
        rating: 5,
        text: "Qualidade incrível, valeu muito a pena. Estou muito feliz com o produto. Só recomendo pedir com antecedência se for presente para uma data especial.",
        date: "11/02/2026",
      },
      {
        author: "Anouk D.",
        rating: 5,
        text: "EU AMEEEEI as calças de pijama! Era presente de Natal para o meu namorado, mas eu amei demais. Recebi atualizações do pedido e adorei a qualidade, como é macia e quentinha. Recomendo muito! 🤍",
        date: "20/12/2025",
      },
    ],
    compare: {
      title: "Feita para o conforto, feita para fãs",
      rows: [
        "Tecido macio e felpudo",
        "Estampa exclusiva de dragão",
        "Veste no tamanho certo",
        "Troca de tamanho em 30 dias",
      ],
    },
    category: "conforto",
    checkoutProductName: "Calça Pijama de Dragão",
    checkoutProductDescription:
      "Calça de pijama com estampa de dragão, algodão felpudo e cós com elástico.",
    checkoutUrl: "/checkout?plano=pijama",
  },
  ...kits,
  {
    id: "snuggy",
    kids: {
      id: "snuggyi",
      price: 118.9,
      compareAtPrice: 167.9,
      options: [
        { name: "Cor", values: ["Preto", "Branco"] },
        { name: "Idade", values: ["4 a 8 anos", "9 a 14 anos"] },
      ],
    },
    name: "Snuggy Dragão",
    tag: "Cobertor vestível com capuz",
    price: 139.9,
    compareAtPrice: 195.9,
    img: img("p2_snuggy.jpg"),
    images: [img("p2_snuggy.jpg"), img("p2b.jpg"), img("p2c.jpg")],
    options: [
      { name: "Cor", values: ["Preto", "Branco"] },
      { name: "Tamanho", values: ["P", "Padrão", "G", "GG"] },
    ],
    benefits: [
      "Cobertor e moletom ao mesmo tempo",
      "Capuz amplo e mangas largas",
      "Tamanhos adulto e infantil (4 a 14 anos)",
    ],
    description: [
      "O Snuggy Dragão é cobertor e moletom ao mesmo tempo: você veste e fica quentinho do pescoço aos joelhos, com as mãos livres para o celular, o livro ou o controle.",
      "Capuz amplo de dragão, mangas largas e bolso canguru. É o presente certo para quem sente frio e ama dragões, em tamanho adulto e infantil.",
    ],
    specs: [
      ["Cores", "Preto e Branco"],
      ["Tecido", "Flanela ultramacia"],
      ["Detalhes", "Capuz de dragão, mangas largas e bolso canguru"],
      ["Tamanhos infantis", "4 a 8 anos e 9 a 14 anos"],
      ["Tamanhos adultos", "P, Padrão, G e GG"],
      [
        "Cuidados",
        "Lavar à mão ou na máquina no ciclo delicado, com água fria. Não usar secadora nem alvejante.",
      ],
    ],
    reviews: [
      {
        author: "Christofer G.",
        rating: 5,
        text: "EU AMEI, TEM MUITA QUALIDADE, É SUPER CONFORTÁVEL E LINDO, EU AMOOOO!! 😍",
        date: "06/11/2024",
      },
      {
        author: "Cliente",
        rating: 5,
        text: "É muito quentinho e confortável para dormir no inverno. E esse macacão é muito fofo 😁",
        date: "05/12/2024",
        photos: [img("rev-snuggy-1.jpg"), img("rev-snuggy-2.jpg")],
      },
      {
        author: "Salvatore C.",
        rating: 5,
        text: "Ótima qualidade, entrega rápida. Excelente!",
        date: "08/01/2026",
      },
    ],
    compare: {
      title: "Feito para o conforto, feito para fãs",
      rows: [
        "Flanela macia de qualidade",
        "Visual de dragão com capuz",
        "Veste no tamanho certo",
        "Troca de tamanho em 30 dias",
      ],
    },
    category: "conforto",
    checkoutProductName: "Snuggy Dragão",
    checkoutProductDescription:
      "Cobertor vestível com capuz de dragão, mangas largas e tecido ultramacio.",
    checkoutUrl: "/checkout?plano=snuggy",
    featured: true,
    badge: "Mais vendido",
  },
  {
    id: "pantufa",
    kids: {
      id: "pantufai",
      price: 62.9,
      compareAtPrice: 83.9,
      options: [
        { name: "Cor", values: ["Branco", "Preto"] },
        { name: "Tamanho", values: ["28-29", "30-31", "32-33", "34-35"] },
      ],
    },
    // Saiu das vitrines: a página leva para as Pantufas de Pelúcia. Continua no catálogo para
    // pedidos e carrinhos antigos.
    listed: false,
    redirectTo: "pantufa2",
    name: "Pantufas de Dragão",
    tag: "Quentinhas e antiderrapantes",
    price: 69.9,
    compareAtPrice: 97.9,
    img: img("p3_pantufas.jpg"),
    images: [img("p3_pantufas.jpg"), img("p3b.jpg"), img("p3c.jpg")],
    options: [
      { name: "Cor", values: ["Branco", "Preto"] },
      { name: "Tamanho", values: ["36-37", "38-39", "40-41", "42-43", "44-45"] },
    ],
    optionImages: { Branco: img("p3_pantufas.jpg"), Preto: img("p3c.jpg") },
    benefits: [
      "Solado antiderrapante para piso frio",
      "Forro em pelúcia que segura o calor",
      "Numeração infantil e adulta, do 28 ao 45",
    ],
    description: [
      "Pantufas de dragão fofinhas, com olhinhos bordados e forro de pelúcia que segura o calor nos dias frios.",
      "O solado é antiderrapante, então dá para andar tranquilo no piso frio da cozinha ou do banheiro. Tem numeração infantil e adulta, para a família toda andar de dragão pela casa.",
    ],
    specs: [
      ["Cores", "Branco e Preto"],
      ["Forro", "Pelúcia macia"],
      ["Solado", "Antiderrapante"],
      ["Numeração infantil", "28-29, 30-31, 32-33 e 34-35"],
      ["Numeração adulta", "36-37, 38-39, 40-41, 42-43 e 44-45"],
      ["Dica", "Se estiver entre dois números, escolha o maior"],
      ["Cuidados", "Lavar à mão com água fria e secar à sombra"],
    ],
    category: "conforto",
    checkoutProductName: "Pantufas de Dragão",
    checkoutProductDescription: "Pantufas de dragão com forro em pelúcia e solado antiderrapante.",
    checkoutUrl: "/checkout?plano=pantufa",
  },
  {
    id: "chinelo",
    kids: {
      id: "chineloi",
      price: 90.9,
      compareAtPrice: 118.9,
      options: [{ name: "Tamanho", values: ["P (26-28)", "M (29-31)"] }],
      images: [img("chinelo-inf-1.jpg"), img("chinelo-inf-2.jpg")],
    },
    name: "Chinelo Nuvem Dragão Noturno",
    tag: "Solado nuvem fofinho e dragão de pelúcia",
    price: 104.9,
    compareAtPrice: 139.9,
    img: img("chinelo-1.jpg"),
    images: [
      img("chinelo-1.jpg"),
      img("chinelo-2.jpg"),
      img("chinelo-3.jpg"),
      img("chinelo-4.jpg"),
    ],
    options: [{ name: "Tamanho", values: ["P (33-35)", "M (36-38)", "G (39-41)"] }],
    benefits: [
      "Solado nuvem alto e macio, que amortece cada passo",
      "Dragãozinho de pelúcia com olhos verdes na tira",
      "Sola de PVC com borracha antiderrapante",
    ],
    description: [
      "O chinelo mais fofo da casa: solado estilo nuvem, alto e macio, que deixa cada passo leve, e um dragãozinho preto de pelúcia com olhos verdes na tira, que parece estar abraçando o seu pé.",
      "A tira tem forro em poliéster macio e quentinho, e a sola é de PVC com borracha antiderrapante, para andar com segurança no piso da cozinha, do banheiro ou da varanda. Serve para o home office, para a maratona de séries ou para dar uma volta.",
      "Tem versão adulta e infantil, para a família inteira andar de dragão pela casa.",
    ],
    specs: [
      ["Tamanhos adultos", "P (33-35), M (36-38) e G (39-41)"],
      ["Tamanhos infantis", "P (26-28) e M (29-31)"],
      ["Medidas adulto", "P 24 cm, M 26 cm e G 28 cm de comprimento; 10 cm de largura e altura"],
      ["Material", "Tira com forro em poliéster"],
      ["Sola", "PVC com borracha antiderrapante"],
      ["Peso", "Cerca de 300 g"],
      ["Dica", "Se estiver entre dois números, escolha o maior"],
      [
        "Cuidados",
        "Lavar à mão com água fria. Não usar alvejante. Secar na sombra, na horizontal.",
      ],
    ],
    category: "conforto",
    checkoutProductName: "Chinelo Nuvem Dragão Noturno",
    checkoutProductDescription:
      "Chinelo com solado nuvem antiderrapante e dragão de pelúcia na tira.",
    checkoutUrl: "/checkout?plano=chinelo",
    badge: "Novo",
  },
  ...umidificadores,
  {
    id: "luminaria",
    name: "Luminária Dragão Noturno",
    tag: "Luz suave para o quarto, produto licenciado",
    price: 160.9,
    compareAtPrice: 195.9,
    img: img("luminaria.jpg"),
    images: [img("luminaria.jpg")],
    options: [],
    benefits: [
      "Os olhos grandes do dragão acendem com luz suave",
      "Bivolt (110/220V), cabo de 1,8 m com interruptor",
      "Produto licenciado, feito no Brasil",
    ],
    description: [
      "Uma luminária em forma de dragão noturno sentado, com os olhos grandes e expressivos que se iluminam e deixam o quarto com uma luz suave e aconchegante. Fica linda na mesa de cabeceira, na escrivaninha ou na estante.",
      "É feita em polietileno resistente no Brasil, é bivolt (110/220V) e tem cabo de 1,8 m com interruptor de mão. Usa lâmpada LED de até 15 W ou fluorescente compacta (a lâmpada não acompanha). Produto licenciado oficial.",
      "Ótima para quarto infantil, sala de jogos ou para quem quer um cantinho de leitura com clima de dragão.",
    ],
    specs: [
      ["Dimensões", "29 cm de altura x 20 cm de largura x 17 cm de profundidade"],
      ["Peso", "0,7 kg"],
      ["Material", "Polietileno e componentes eletrônicos"],
      ["Tensão", "Bivolt (110/220V)"],
      ["Cabo", "1,8 m com interruptor de mão"],
      ["Lâmpada", "LED até 15 W ou fluorescente compacta (não inclusa)"],
      ["Troca da lâmpada", "Precisa de uma chave Philips pequena"],
      ["Origem", "Fabricada no Brasil, produto licenciado"],
    ],
    category: "casa",
    checkoutProductName: "Luminária Dragão Noturno",
    checkoutProductDescription:
      "Luminária de dragão em polietileno, bivolt, com cabo e interruptor.",
    checkoutUrl: "/checkout?plano=luminaria",
    badge: "Novo",
  },
  ...pelucias,
  {
    id: "lum3d",
    name: "Luminária LED 3D Dragão Noturno",
    tag: "7 cores com um toque, USB ou pilhas",
    price: 62.9,
    compareAtPrice: 90.9,
    img: img("luminaria-3d.jpg"),
    images: [
      img("luminaria-3d.jpg"),
      img("luminaria-3d-b.jpg"),
      img("luminaria-3d-c.jpg"),
      img("luminaria-3d-d.jpg"),
      img("luminaria-3d-e.jpg"),
    ],
    options: [{ name: "Base", values: ["Preta", "Branca"] }],
    optionImages: { Preta: img("luminaria-3d.jpg"), Branca: img("luminaria-3d-c.jpg") },
    benefits: [
      "Efeito 3D: o desenho do dragão parece flutuar quando acende",
      "7 cores que você troca com um toque na base",
      "Funciona ligada no USB ou com pilhas",
    ],
    description: [
      "Uma luminária de LED com um dragãozinho noturno gravado em acrílico. Quando acende, o desenho ganha um efeito 3D e parece flutuar sobre a base, deixando o quarto com uma luz suave e cheia de personalidade.",
      "São 7 cores: é só tocar na base para ligar, desligar e trocar de cor. Funciona ligada no USB ou com pilhas, então dá para usar na mesa de cabeceira, na escrivaninha ou na estante, sem depender de tomada.",
      "Perfeita como luz de dormir para criança, decoração de quarto gamer ou presente para quem ama dragões. Você escolhe a base preta ou branca.",
    ],
    specs: [
      ["Cores", "7 cores, trocadas por toque"],
      ["Controle", "Botão de toque na base (liga, desliga e troca a cor)"],
      ["Alimentação", "USB ou pilhas"],
      ["Material", "Placa de acrílico gravada e base plástica"],
      ["Base", "Preta ou branca"],
      ["Luz", "LED, não esquenta"],
      ["Cuidados", "Limpar o acrílico com pano macio e seco"],
    ],
    category: "casa",
    checkoutProductName: "Luminária LED 3D Dragão Noturno",
    checkoutProductDescription:
      "Luminária LED 3D de acrílico com dragão, 7 cores por toque, USB ou pilhas.",
    checkoutUrl: "/checkout?plano=lum3d",
    badge: "Novo",
  },
  ...mascaras,
  ...essencias,
  {
    id: "kitescola",
    name: "Kit Escolar Dragão Noturno",
    tag: "Mochila + estojo + lancheira térmica",
    price: 132.9,
    compareAtPrice: 181.9,
    img: img("kit-escolar.jpg"),
    images: [img("kit-escolar.jpg")],
    options: [],
    benefits: [
      "Kit completo: mochila, estojo e lancheira térmica",
      "Estampa de dragão com olhos verdes nas três peças",
      "Lancheira térmica com alça de ombro e alça de mão",
    ],
    description: [
      "O kit para voltar às aulas no estilo dragão. São três peças que combinam: a mochila com o dragão sorridente, o estojo com os olhos verdes e a lancheira térmica com um olho de dragão bem de perto.",
      "A mochila tem alças acolchoadas para as costas, alça de mão e bolso lateral de tela para a garrafinha. O estojo fecha com zíper e cabe lápis, canetas e borracha. A lancheira é térmica, ajuda a manter o lanche na temperatura, e tem alça de ombro removível e alça de mão.",
      "Ótimo presente para a criança que ama dragões, e chama atenção no primeiro dia de aula.",
    ],
    specs: [
      ["Vem no kit", "1 mochila + 1 estojo + 1 lancheira térmica"],
      ["Mochila", "Alças de costas, alça de mão e bolso lateral de tela"],
      ["Estojo", "Fechamento com zíper"],
      ["Lancheira", "Térmica, com alça de ombro e alça de mão"],
      ["Estampa", "Dragão noturno com olhos verdes"],
      ["Cuidados", "Limpar com pano úmido e sabão neutro. Não lavar na máquina."],
    ],
    category: "escola",
    checkoutProductName: "Kit Escolar Dragão Noturno",
    checkoutProductDescription: "Kit escolar com mochila, estojo e lancheira térmica de dragão.",
    checkoutUrl: "/checkout?plano=kitescola",
    badge: "Kit 3 peças",
  },
  {
    id: "carro",
    name: "Dragão de Carro",
    tag: "Mascote para carro e moto",
    price: 62.9,
    compareAtPrice: 83.9,
    img: img("p4_carro.jpg"),
    images: [img("p4_carro.jpg"), img("p4b.jpg"), img("p4c.jpg")],
    options: [
      { name: "Cor", values: ["Preto", "Branco"] },
      { name: "Fixação", values: ["Adesivo 3M", "Ventosa", "Engate rápido"] },
    ],
    benefits: [
      "Pelúcia resistente para carro e moto",
      "Fixação por adesivo 3M, ventosa ou engate rápido",
      "Fácil de remover e de limpar",
    ],
    description: [
      "Um dragãozinho de pelúcia para acompanhar você no trânsito. Fica no painel, no retrovisor ou no guidão da moto e chama atenção por onde passa.",
      "Você escolhe a cor e o tipo de fixação: adesivo 3M para o painel, ventosa para o vidro ou engate rápido para tirar e colocar quando quiser.",
    ],
    specs: [
      ["Cores", "Preto e Branco"],
      ["Material", "Pelúcia resistente"],
      ["Fixação", "Adesivo 3M, ventosa ou engate rápido"],
      ["Uso", "Carro e moto"],
      ["Cuidados", "Limpar com pano úmido"],
    ],
    category: "auto",
    checkoutProductName: "Dragão de Carro",
    checkoutProductDescription:
      "Mascote de pelúcia de dragão para carro e moto, com fixação à escolha.",
    checkoutUrl: "/checkout?plano=carro",
  },
  {
    id: "aneis",
    name: "Anéis Promessa de Dragão",
    tag: "Par em prata 925",
    price: 97.9,
    compareAtPrice: 132.9,
    img: img("p5_aneis.jpg"),
    images: [img("p5_aneis.jpg"), img("p5b.jpg"), img("p5c.jpg")],
    options: [],
    benefits: [
      "Par de anéis em prata 925",
      "Ajuste livre, serve em qualquer dedo",
      "Acompanha estojo de presente",
    ],
    description: [
      "Um par de anéis de dragão para casais: um dragão escuro e um prateado, que formam par quando as mãos se encontram.",
      "São em prata 925 e têm ajuste livre, então servem em qualquer dedo sem precisar saber a medida. Chegam em estojo de presente, prontos para entregar.",
    ],
    specs: [
      ["Material", "Prata 925"],
      ["Tamanho", "Ajustável, serve em qualquer dedo"],
      ["Vem com", "2 anéis e estojo de presente"],
      ["Cuidados", "Evite contato com perfume e água do mar; guarde no estojo"],
    ],
    category: "joias",
    checkoutProductName: "Anéis Promessa de Dragão",
    checkoutProductDescription:
      "Par de anéis de dragão em prata 925, ajustáveis, com estojo de presente.",
    checkoutUrl: "/checkout?plano=aneis",
  },
  {
    id: "colares",
    name: "Kit Colares de Dragão",
    tag: "Par de colares + caixa",
    price: 90.9,
    compareAtPrice: 139.9,
    img: img("p6_colares.jpg"),
    images: [img("p6_colares.jpg"), img("p6b.jpg"), img("p6c.jpg")],
    options: [],
    benefits: [
      "Par de colares com pingentes que se encaixam",
      "Corrente banhada e antialérgica",
      "Caixa de presente inclusa",
    ],
    description: [
      "Kit com dois colares de dragão cujos pingentes se encaixam e formam um coração, um para cada pessoa do casal.",
      "A corrente é banhada e antialérgica, e o kit vem em caixa de presente.",
    ],
    specs: [
      ["Material", "Corrente banhada, antialérgica"],
      ["Vem com", "2 colares e caixa de presente"],
      ["Cuidados", "Evite contato com perfume, cremes e água"],
    ],
    category: "joias",
    checkoutProductName: "Kit Colares de Dragão",
    checkoutProductDescription:
      "Par de colares de dragão com pingentes que se encaixam e caixa de presente.",
    checkoutUrl: "/checkout?plano=colares",
  },
];

/**
 * Promoção: todo produto acima de R$ 80 sai pela metade. O preço cheio vira o "de" riscado
 * e a versão infantil acompanha a adulta. Para encerrar a promoção, é só zerar PROMO_DESCONTO.
 */
export const PROMO_MIN = 80;
export const PROMO_DESCONTO = 0.5;

const comDesconto = (p: number) => Math.round(p * (1 - PROMO_DESCONTO) * 100) / 100;
/** Troca o "70% OFF" de selos e títulos (ex.: brinquedos) pelo desconto da promoção. */
const promoOff = (txt: string) =>
  txt.replace(/\d+% OFF/, `${Math.round(PROMO_DESCONTO * 100)}% OFF`);

function promo(b: Bundle): Bundle {
  if (!PROMO_DESCONTO || b.semPromo || b.price <= PROMO_MIN) return b;
  return {
    ...b,
    price: comDesconto(b.price),
    compareAtPrice: b.price,
    badge: b.badge && promoOff(b.badge),
    richSections: b.richSections?.map((s) => ({ ...s, title: promoOff(s.title) })),
    ...(b.kids
      ? {
          kids: { ...b.kids, price: comDesconto(b.kids.price), compareAtPrice: b.kids.price },
        }
      : {}),
  };
}

export const bundles: Bundle[] = baseBundles.map((b) =>
  promo(PRODUCT_COPY[b.id] ? { ...b, richSections: PRODUCT_COPY[b.id] } : b),
);

/**
 * Produto com versão infantil vira dois irmãos do mesmo grupo: "Adulto" (aparece nas vitrines)
 * e "Infantil" (só pela página, no seletor de versão), cada um com preço e tamanhos próprios.
 */
function expandKids(list: Bundle[]): Bundle[] {
  return list.flatMap((b) => {
    if (!b.kids) return [b];
    const { kids, ...adult } = b;
    const group = b.group ?? `v-${b.id}`;
    return [
      { ...adult, group, groupLabel: "Adulto" },
      {
        ...adult,
        id: kids.id,
        name: `${b.name} Infantil`,
        group,
        groupLabel: "Infantil",
        price: kids.price,
        compareAtPrice: kids.compareAtPrice,
        options: kids.options,
        ...(kids.images?.length ? { img: kids.images[0]!, images: kids.images } : {}),
        checkoutProductName: `${b.checkoutProductName} Infantil`,
        checkoutUrl: `/checkout?plano=${kids.id}`,
        badge: undefined,
        listed: false,
      },
    ];
  });
}

/** Produtos visíveis na loja. */
export const availableBundles = expandKids(bundles);

export function parseBundleId(raw: string | undefined | null): BundleId | undefined {
  return (BUNDLE_IDS as readonly string[]).includes(raw ?? "") ? (raw as BundleId) : undefined;
}

export function getBundle(id: string | undefined | null): Bundle {
  const parsed = parseBundleId(id);
  return availableBundles.find((b) => b.id === parsed) ?? availableBundles[0];
}

export function getCheckoutUrl(id: string | undefined) {
  return getBundle(id).checkoutUrl;
}

/** Produtos que aparecem nas vitrines (sem os avulsos dos kits). */
export const listedBundles = availableBundles.filter((b) => b.listed !== false);

/** Produtos em destaque: primeiro card da home e da coleção deles. */
export const DESTAQUE_LOJA: readonly BundleId[] = ["kitcalca"];

const destaqueNaFrente = <T extends { id: BundleId }>(l: readonly T[]) => [
  ...l.filter((b) => DESTAQUE_LOJA.includes(b.id)),
  ...l.filter((b) => !DESTAQUE_LOJA.includes(b.id)),
];

export const bundlesByCategory = (cat: CategoryId) =>
  destaqueNaFrente(listedBundles.filter((b) => b.category === cat));

/** Páginas de coleção que juntam produtos escolhidos (ex.: todos os pijamas), além das categorias. */
export const extraCollections: readonly {
  id: string;
  name: string;
  desc: string;
  img: string;
  ids: readonly BundleId[];
}[] = [
  {
    id: "pijamas",
    name: "Pijamas",
    desc: "Calça de pijama e kits de casal, em versão adulta e infantil",
    img: "/produtos/kit-casal.jpg",
    ids: ["kitcalca", "pijama", "kitcasal"],
  },
  {
    id: "pantufas",
    name: "Pantufas e Chinelos",
    desc: "Pantufas de pelúcia e chinelos para a família toda",
    img: "/produtos/pantufa-furia.jpg",
    ids: ["pantufa2", "chinelo"],
  },
];

/** Encontra uma categoria ou coleção extra e devolve os produtos dela. */
export function findCollection(id: string) {
  const c = categories.find((x) => x.id === id);
  if (c)
    return {
      id: c.id as string,
      name: c.name,
      desc: c.desc,
      img: c.img,
      banner: c.banner,
      secoes: c.secoes,
      items: bundlesByCategory(c.id),
    };
  const e = extraCollections.find((x) => x.id === id);
  if (!e) return undefined;
  return {
    id: e.id,
    name: e.name,
    desc: e.desc,
    img: e.img,
    banner: undefined,
    secoes: undefined,
    items: e.ids.map((i) => getBundle(i)),
  };
}

/** Opções do mesmo grupo (combo casal / avulsos), na ordem do catálogo. */
export const groupBundles = (b: Bundle) =>
  b.category === "crocs"
    ? availableBundles.filter((x) => x.id === "crocs1" || x.id === "crocs2")
    : b.group
      ? availableBundles.filter((x) => x.group === b.group)
      : [];

export const discountPct = (b: Pick<Bundle, "price" | "compareAtPrice">) =>
  b.compareAtPrice ? Math.round((1 - b.price / b.compareAtPrice) * 100) : 0;

/** Variação escolhida na URL: valores na ordem das opções, separados por "|". */
export const encodeVariant = (values: readonly string[]) => values.join("|");

/**
 * Valida a variação contra as opções do produto.
 * Devolve os valores escolhidos (`[]` para produto sem variação) ou `null` se faltar/for inválida.
 */
export function parseVariant(b: Bundle, raw: string | undefined | null): string[] | null {
  if (!b.options.length) return [];
  if (!raw) return null;
  const values = raw.split("|");
  if (values.length !== b.options.length) return null;
  return b.options.every((o, i) => o.values.includes(values[i]!)) ? values : null;
}

/**
 * Variação legível. Com o produto, inclui o nome de cada opção ("Tamanho da calça (1º conjunto): M"),
 * para o pedido não ficar ambíguo em kits com várias opções do mesmo tipo.
 */
export const variantLabel = (values: readonly string[], b?: Bundle) =>
  values.map((v, i) => (b?.options[i] ? `${b.options[i]!.name}: ${v}` : v)).join(" · ");

/** Nome do item com a variação, como vai para o pedido no admin. */
export const productLabel = (b: Bundle, values: readonly string[]) =>
  values.length ? `${b.name} — ${variantLabel(values, b)}` : b.name;
