import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { brand } from "@/lib/brand";
import { categories, listedBundles, type Bundle } from "@/lib/bundles";
import { absUrl, fotos, freteDoProduto, noSeo, productPath } from "@/lib/seo";

/**
 * Feed de produtos do Google Merchant Center (listagens gratuitas do Google Shopping).
 * Entram os produtos da vitrine que estão no SEO. Ficam de fora Crocs e brinquedos (FORA_DO_SEO),
 * as opções escondidas dos grupos (combo de 4, infantil), os que redirecionam e os de personagem
 * de filme ou desenho (opção "Personagem"), que o Google trata como produto licenciado.
 * Um item por cor e tamanho, porque o Google pede cor, tamanho, gênero e idade em roupa vendida
 * no Brasil. Todos levam o preço do catálogo e o link da página do produto.
 * O Merchant Center busca este endereço uma vez por dia.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const tag = (name: string, value: string | number) =>
  `<g:${name}>${esc(String(value))}</g:${name}>`;

/** Opções que viram atributo do Google. As outras (ex.: fixação) o cliente escolhe na página. */
const COR = /^(cor|modelo|base)$/i;
const ESTAMPA = /^estampa$/i;
const TAMANHO = /^(tamanho|numeração)/i;

const temPersonagem = (b: Bundle) => b.options.some((o) => /^personagem/i.test(o.name));

/** "Preta", "Dragão Noturno" → "Preto"; "Branca", "Dragão da Neve" → "Branco". */
const corDe = (v: string) =>
  /pret[oa]|noturno/i.test(v) ? "Preto" : /branc[oa]|neve/i.test(v) ? "Branco" : v;

/** "2 anos" → toddler, "8 anos" → kids, P a G3 → adult. */
const idadeDe = (tamanho: string | undefined) => {
  const anos = Number(/^(\d+) anos?$/.exec(tamanho ?? "")?.[1]);
  return !anos ? "adult" : anos < 5 ? "toddler" : "kids";
};

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Roupa, calçado ou joia: leva gênero e idade. */
const vestivel = (b: Bundle) =>
  b.options.some((o) => TAMANHO.test(o.name)) || ["moletons", "joias"].includes(b.category);

/** Texto do produto sem as frases de preço e promoção (o Google recusa preço na descrição). */
function descricao(b: Bundle) {
  const texto = (b.description?.length ? b.description.join(" ") : b.checkoutProductDescription)
    .replace(/\s+/g, " ")
    .trim();
  return texto
    .split(/(?<=[.!?])\s+/)
    .filter((frase) => !/R\$|% OFF/i.test(frase))
    .join(" ")
    .slice(0, 5000);
}

type Variacao = {
  cor?: string;
  estampa?: string;
  tamanho?: string;
  foto?: string;
  partes: string[];
};

/** Cada combinação de cor/estampa e tamanho do produto (opções de um valor só não multiplicam). */
function variacoes(b: Bundle): Variacao[] {
  const cor = b.options.find((o) => COR.test(o.name));
  const estampa = b.options.find((o) => ESTAMPA.test(o.name));
  const tamanho = b.options.find((o) => /^(tamanho|numeração)$/i.test(o.name));
  const visual = cor ?? estampa;
  const lista: Variacao[] = [];
  for (const v of visual?.values ?? [undefined]) {
    for (const t of tamanho?.values ?? [undefined]) {
      lista.push({
        cor: cor && v ? corDe(v) : b.estampa,
        estampa: estampa && v ? v : undefined,
        tamanho: t,
        foto: v ? (b.optionImages?.[v] ?? b.optionCards?.[visual!.name]?.[v]) : undefined,
        partes: [
          ...(v && visual!.values.length > 1 ? [v] : []),
          ...(t && tamanho!.values.length > 1 ? [t] : []),
        ],
      });
    }
  }
  return lista;
}

function item(b: Bundle, v: Variacao, varias: boolean) {
  const imagens = fotos(b).map(absUrl);
  const foto = v.foto ? absUrl(v.foto) : imagens[0]!;
  const extras = imagens.filter((i) => i !== foto).slice(0, 10);
  const combo = b.unidades && b.unidades > 1 ? ` (${b.groupLabel ?? `kit com ${b.unidades}`})` : "";
  const title = `${b.name}${combo}${v.partes.length ? ` - ${v.partes.join(" / ")}` : ""}`;
  const frete = freteDoProduto(b.price);
  const categoria = categories.find((c) => c.id === b.category)?.name;
  const fields = [
    tag("id", v.partes.length ? `${b.id}-${slug(v.partes.join(" "))}` : b.id),
    ...(varias ? [tag("item_group_id", b.id)] : []),
    tag("title", title.slice(0, 150)),
    tag("description", descricao(b)),
    tag("link", absUrl(productPath(b))),
    tag("image_link", foto),
    ...extras.map((i) => tag("additional_image_link", i)),
    tag("availability", "in_stock"),
    tag("price", `${b.price.toFixed(2)} BRL`),
    tag("condition", "new"),
    tag("brand", brand.name),
    tag("identifier_exists", "no"),
    ...(categoria ? [tag("product_type", categoria)] : []),
    ...(v.cor ? [tag("color", v.cor)] : []),
    ...(v.estampa ? [tag("pattern", v.estampa)] : []),
    ...(v.tamanho
      ? [tag("size", v.tamanho)]
      : b.category === "moletons"
        ? [tag("size", "Único")]
        : []),
    ...(vestivel(b) ? [tag("gender", "unisex"), tag("age_group", idadeDe(v.tamanho))] : []),
    `<g:shipping>${tag("country", "BR")}${tag("service", frete.nome)}${tag("price", `${frete.valor.toFixed(2)} BRL`)}${tag("min_handling_time", 0)}${tag("max_handling_time", 1)}${tag("min_transit_time", frete.prazo[0])}${tag("max_transit_time", frete.prazo[1])}</g:shipping>`,
  ];
  return ["    <item>", ...fields.map((f) => `      ${f}`), "    </item>"].join("\n");
}

export const Route = createFileRoute("/feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        const items = listedBundles
          .filter((b) => !noSeo(b) && !b.redirectTo && !temPersonagem(b) && b.price > 0)
          .flatMap((b) => {
            const lista = variacoes(b);
            return lista.map((v) => item(b, v, lista.length > 1));
          });
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">`,
          `  <channel>`,
          `    <title>${esc(brand.name)}</title>`,
          `    <link>${esc(`${brand.siteUrl}/`)}</link>`,
          `    <description>${esc(brand.tagline)}</description>`,
          ...items,
          `  </channel>`,
          `</rss>`,
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
