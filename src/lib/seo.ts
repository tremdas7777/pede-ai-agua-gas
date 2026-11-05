/**
 * SEO da loja: endereço oficial de cada página (canonical), tags de compartilhamento e os dados
 * estruturados (JSON-LD) que o Google lê para mostrar preço, frete, devolução e a trilha de
 * navegação nos resultados.
 */
import type { JSX } from "react";
import { brand } from "./brand";
import {
  FREE_SHIPPING_MIN,
  categories,
  extraCollections,
  groupBundles,
  listedBundles,
  type Bundle,
  type CategoryId,
} from "./bundles";

/**
 * Coleções de marcas de terceiros (Crocs e brinquedos licenciados): ficam na loja, mas fora do
 * sitemap e sem dados de produto para o Google.
 */
export const FORA_DO_SEO: readonly CategoryId[] = ["crocs", "brinquedos"];
export const noSeo = (b: Pick<Bundle, "category">) => FORA_DO_SEO.includes(b.category);

/** Endereço absoluto no domínio oficial (o Google ignora canonical e og:image relativos). */
export const absUrl = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${brand.siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;

type Meta = Record<string, unknown>;
type MetaTag = JSX.IntrinsicElements["meta"];

/** O TanStack Router vira { "script:ld+json": ... } numa tag JSON-LD, mas o tipo de meta não prevê a chave. */
const ldJson = (d: Meta) => ({ "script:ld+json": d }) as unknown as MetaTag;

/** Tags de uma página: título, descrição, canonical, Open Graph/Twitter e JSON-LD. */
export function seo(p: {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "product" | "article";
  jsonLd?: readonly Meta[];
}) {
  const url = absUrl(p.path);
  const image = absUrl(p.image ?? "/og-image.jpg");
  const meta: MetaTag[] = [
    { title: p.title },
    { name: "description", content: p.description },
    { property: "og:title", content: p.title },
    { property: "og:description", content: p.description },
    { property: "og:url", content: url },
    { property: "og:type", content: p.type ?? "website" },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: p.imageAlt ?? p.title },
    { name: "twitter:title", content: p.title },
    { name: "twitter:description", content: p.description },
    { name: "twitter:image", content: image },
    ...(p.jsonLd ?? []).map(ldJson),
  ];
  return { meta, links: [{ rel: "canonical", href: url }] };
}

const ORG_ID = `${brand.siteUrl}/#loja`;

/** Devolução: 7 dias de arrependimento (art. 49 do CDC), sem custo para o cliente. */
const RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "BR",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 7,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/FreeReturn",
  merchantReturnLink: absUrl("/politica-reembolso"),
};

const dias = (minValue: number, maxValue: number) => ({
  "@type": "QuantitativeValue",
  minValue,
  maxValue,
  unitCode: "DAY",
});

/** Frete do produto sozinho: grátis a partir do mínimo, senão o Frete Padrão (FRETES em pix.functions.ts). */
export const freteDoProduto = (price: number) =>
  price >= FREE_SHIPPING_MIN
    ? { nome: "Frete Grátis", valor: 0, prazo: [7, 10] as const }
    : { nome: "Frete Padrão", valor: 20, prazo: [5, 5] as const };

function shipping(price: number) {
  const frete = freteDoProduto(price);
  return {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: frete.valor, currency: "BRL" },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "BR" },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: dias(0, 1),
      transitTime: dias(frete.prazo[0], frete.prazo[1]),
    },
  };
}

/** A loja (home): nome, logo, contato e política de devolução. */
export function storeJsonLd(): Meta[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      "@id": ORG_ID,
      name: brand.name,
      url: `${brand.siteUrl}/`,
      logo: absUrl("/apple-touch-icon.png"),
      image: absUrl("/og-image.jpg"),
      description: brand.tagline,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: `+${brand.whatsapp.phoneE164}`,
        availableLanguage: "pt-BR",
        areaServed: "BR",
      },
      hasMerchantReturnPolicy: RETURN_POLICY,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${brand.siteUrl}/#site`,
      name: brand.name,
      alternateName: ["Banguela", "banguelashop.store"],
      url: `${brand.siteUrl}/`,
      inLanguage: "pt-BR",
      publisher: { "@id": ORG_ID },
    },
  ];
}

/**
 * Página que o Google deve indexar para um produto: as opções escondidas de um grupo (combo de 4,
 * versão infantil) apontam para a opção que aparece na vitrine.
 */
export function canonicalBundle(b: Bundle): Bundle {
  if (b.listed !== false || !b.group) return b;
  return groupBundles(b).find((x) => x.listed !== false) ?? b;
}

export const productPath = (b: Bundle) => `/produto?plano=${canonicalBundle(b).id}`;

const categoryOf = (b: Bundle) => categories.find((c) => c.id === b.category);

/** Fotos do produto, sem vídeos e GIFs. */
export const fotos = (b: Bundle) =>
  [...new Set([b.img, ...b.images])].filter((f) => !/\.(mp4|webm|gif)$/i.test(f));

const breadcrumb = (items: readonly { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absUrl(it.path),
  })),
});

/** Produto: preço, disponibilidade, frete e devolução, mais a trilha Início › Coleção › Produto. */
export function productJsonLd(b: Bundle): Meta[] {
  if (noSeo(b)) return [];
  const url = absUrl(productPath(b));
  const cat = categoryOf(b);
  const trilha = breadcrumb([
    { name: "Início", path: "/" },
    ...(cat ? [{ name: cat.name, path: `/colecao/${cat.id}` }] : []),
    { name: b.name, path: productPath(b) },
  ]);
  // Opção escondida (combo de 4, infantil): o preço dela não é o da página canônica.
  if (canonicalBundle(b).id !== b.id) return [trilha];
  const description = (
    b.description?.length ? b.description.join(" ") : b.checkoutProductDescription
  )
    .replace(/\s+/g, " ")
    .slice(0, 4900);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${url}#produto`,
      name: b.name,
      sku: b.id,
      url,
      image: fotos(b).slice(0, 8).map(absUrl),
      description,
      brand: { "@type": "Brand", name: brand.name },
      ...(cat ? { category: cat.name } : {}),
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "BRL",
        price: b.price.toFixed(2),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": ORG_ID },
        shippingDetails: shipping(b.price),
        hasMerchantReturnPolicy: RETURN_POLICY,
      },
    },
    trilha,
  ];
}

/** Coleção: lista dos produtos da página e a trilha Início › Coleção. */
export function collectionJsonLd(
  c: { id: string; name: string },
  items: readonly Bundle[],
): Meta[] {
  if ((FORA_DO_SEO as readonly string[]).includes(c.id)) return [];
  const produtos = items.filter((b) => !noSeo(b));
  return [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: c.name,
      numberOfItems: produtos.length,
      itemListElement: produtos.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absUrl(productPath(b)),
        name: b.name,
      })),
    },
    breadcrumb([
      { name: "Início", path: "/" },
      { name: c.name, path: `/colecao/${c.id}` },
    ]),
  ];
}

/** Perguntas frequentes (FAQPage). */
export const faqJsonLd = (faq: readonly { q: string; a: string }[]): Meta => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

/** Páginas do sitemap: coleções e produtos da vitrine (com as fotos), mais as institucionais. */
export function sitemapEntries(): { path: string; images: string[] }[] {
  const colecoes = [
    ...categories
      .map((c) => c.id as string)
      .filter((id) => !(FORA_DO_SEO as readonly string[]).includes(id)),
    ...extraCollections.map((c) => c.id),
    "mais-vendidos",
  ];
  const produtos = listedBundles.filter((b) => !noSeo(b) && !b.redirectTo);
  return [
    { path: "/", images: [] },
    ...colecoes.map((id) => ({ path: `/colecao/${id}`, images: [] })),
    ...produtos.map((b) => ({ path: productPath(b), images: fotos(b).slice(0, 10) })),
    ...[
      "/sobre",
      "/faq",
      "/contato",
      "/rastreio",
      "/politica-envio",
      "/politica-reembolso",
      "/politica-privacidade",
    ].map((path) => ({ path, images: [] })),
  ];
}
