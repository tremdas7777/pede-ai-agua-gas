import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/shop/ProductCard";
import { brand } from "@/lib/brand";
import {
  categories,
  brl,
  findCollection,
  getBundle,
  type CollectionBanner,
  type CollectionSection,
} from "@/lib/bundles";
import { titulo, type MaisVendidos } from "@/lib/mais-vendidos";
import { getMaisVendidos } from "@/lib/mais-vendidos.functions";
import { COLECAO_TEXTOS } from "@/lib/colecao-textos";
import { collectionJsonLd, seo } from "@/lib/seo";

/** "Mais vendidos" vem dos pedidos (servidor); as outras coleções saem do catálogo. */
const MAIS_VENDIDOS = "mais-vendidos";
const colecaoMaisVendidos = (m: MaisVendidos) => ({
  id: MAIS_VENDIDOS,
  name: titulo(m),
  desc: m.reais
    ? "Os produtos que os clientes da loja mais estão levando"
    : "Os produtos que a gente mais recomenda",
  img: getBundle(m.ids[0]).img,
  banner: undefined as CollectionBanner | undefined,
  secoes: undefined as readonly CollectionSection[] | undefined,
  items: m.ids.map((id) => getBundle(id)),
});

export const Route = createFileRoute("/colecao/$id")({
  loader: async ({ params }) => {
    if (params.id === MAIS_VENDIDOS)
      return { id: params.id, maisVendidos: await getMaisVendidos() };
    const c = findCollection(params.id);
    if (!c) throw notFound();
    return { id: c.id, maisVendidos: null };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.maisVendidos
      ? colecaoMaisVendidos(loaderData.maisVendidos)
      : loaderData
        ? findCollection(loaderData.id)
        : undefined;
    if (!c) return {};
    const t = COLECAO_TEXTOS[c.id];
    return seo({
      path: `/colecao/${c.id}`,
      title: `${t?.title ?? c.name} | ${brand.name}`,
      description: t?.description ?? `${c.name}: ${c.desc}. Pix ou cartão de crédito.`,
      image: c.img,
      imageAlt: c.name,
      jsonLd: collectionJsonLd(c, c.items),
    });
  },
  component: Page,
});

function Page() {
  const { id, maisVendidos } = Route.useLoaderData();
  const c = maisVendidos ? colecaoMaisVendidos(maisVendidos) : findCollection(id)!;
  const items = c.items;
  const texto = COLECAO_TEXTOS[c.id];
  const promoItems = id === "crocs" ? items.filter((p) => p.group === "crocs-promocao") : [];
  const kigurumiPromoItems =
    id === "kigurumi"
      ? [2, 4]
          .map((unidades) => items.find((p) => p.unidades === unidades))
          .filter((p): p is (typeof items)[number] => Boolean(p))
      : [];
  // Coleção com subdivisões (ex.: Crocs → Toy Story, Stitch...): atalhos no topo e um bloco por seção.
  const secoes = (c.secoes ?? [])
    .map((s) => ({ ...s, itens: items.filter((p) => p.secao === s.id) }))
    .filter((s) => s.itens.length > 0);
  const marcas = [...new Set(secoes.map((s) => s.marca).filter(Boolean))];
  const atalhos = [
    ...marcas.map((m) => ({ id: secoes.find((s) => s.marca === m)!.id, nome: m })),
    ...secoes.map((s) => ({ id: s.id, nome: s.nome })),
  ];
  const grade = "grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4";

  return (
    <SiteLayout>
      {c.banner && (
        <picture className="block">
          <source media="(min-width: 768px)" srcSet={c.banner.desktop} />
          <img
            src={c.banner.mobile}
            alt={c.banner.alt}
            fetchPriority="high"
            className="aspect-[3/2] w-full object-cover md:aspect-[8/3]"
          />
        </picture>
      )}
      <section className="bg-[var(--mint)]">
        <div className="container-edge py-8 text-center md:py-12">
          <nav
            aria-label="Navegação"
            className="mb-3 flex items-center justify-center gap-1 text-[13px] text-[var(--ink)]/55"
          >
            <Link to="/" className="hover:text-[var(--night)]">
              Início
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Coleções</span>
          </nav>
          <h1 className="text-[28px] font-bold leading-tight text-[var(--night)] md:text-4xl">
            {c.name}
          </h1>
          <p className="mt-2 text-[15px] text-[var(--ink)]/65">{c.desc}</p>
        </div>
      </section>

      <div className="container-edge py-8 md:py-12">
        <p className="mb-5 text-[13px] text-[var(--ink)]/55">
          {items.length} {items.length === 1 ? "produto" : "produtos"}
        </p>
        {promoItems.length > 0 && (
          <section className="mb-12 rounded-[24px] bg-[var(--mint)] p-5 md:p-8">
            <div className="mb-5 text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--ink)]/55">
                Oferta especial
              </p>
              <h2 className="mt-1 text-[24px] font-bold text-[var(--night)] md:text-[30px]">
                Crocs originais: 1 par por R$ 99 ou 2 pares por R$ 149
              </h2>
              <p className="mt-2 text-[14px] text-[var(--ink)]/70">
                Você escolhe qualquer modelo da loja para cada par e informa o tamanho de cada um.
              </p>
            </div>
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 md:gap-5">
              {promoItems.map((p) => (
                <div key={p.id}>
                  <ProductCard p={p} />
                  <p className="mt-2 text-center text-[12px] font-semibold text-[var(--ink)]/55">
                    Escolha o modelo e o tamanho{p.unidades === 2 ? " de cada par" : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        {kigurumiPromoItems.length > 0 && (
          <section className="mb-12 rounded-[24px] bg-[var(--mint)] p-5 md:p-8">
            <div className="mb-5 text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--ink)]/55">
                Oferta especial
              </p>
              <h2 className="mt-1 text-[24px] font-bold text-[var(--night)] md:text-[30px]">
                Kigurumi: 2 pijamas por R$ 79 ou 4 por R$ 129
              </h2>
              <p className="mt-2 text-[14px] text-[var(--ink)]/70">
                Escolha o personagem e o tamanho de cada pijama. No combo de 4, o ursinho é grátis.
              </p>
            </div>
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 md:gap-5">
              {kigurumiPromoItems.map((p) => {
                const quatro = p.unidades === 4;
                return (
                  <Link
                    key={p.id}
                    to="/produto"
                    search={{ plano: p.id }}
                    className="group block text-center"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-[20px] bg-[var(--tile)]">
                      <img
                        src={p.img}
                        alt={quatro ? "Combo com 4 pijamas Kigurumi" : "Combo com 2 pijamas Kigurumi"}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-[var(--primary-dark)] px-3 py-1.5 text-[13px] font-extrabold leading-none text-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.35)]">
                        {quatro ? "4 por R$ 129" : "2 por R$ 79"}
                      </span>
                    </div>
                    <h3 className="mt-3 px-1 text-[15px] font-semibold leading-snug text-[var(--ink)]">
                      {quatro ? "Combo de 4 + ursinho grátis" : "Combo de 2 pijamas"}
                    </h3>
                    <p className="mt-1 text-[13px] font-extrabold text-[var(--primary-dark)]">
                      {brl(p.price)}
                    </p>
                    <p className="mt-2 text-[12px] font-semibold text-[var(--ink)]/55">
                      Escolha cada personagem e tamanho
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
        {secoes.length > 0 ? (
          <>
            <nav
              aria-label="Seções da coleção"
              className="-mx-6 mb-8 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
            >
              {atalhos.map((a) => (
                <a
                  key={a.nome}
                  href={`#secao-${a.id}`}
                  className="shrink-0 rounded-full bg-[var(--mint)] px-4 py-2 text-[13.5px] font-semibold text-[var(--night)] transition hover:bg-[var(--mint-strong)]"
                >
                  {a.nome}
                </a>
              ))}
            </nav>
            <div className="space-y-12">
              {secoes.map((s) => (
                <section key={s.id} id={`secao-${s.id}`} className="scroll-mt-32">
                  {s.marca && (
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--ink)]/45">
                      {s.marca}
                    </p>
                  )}
                  <h2 className="mb-4 text-[22px] font-bold text-[var(--night)] md:text-[26px]">
                    {s.nome}
                  </h2>
                  <div className={grade}>
                    {s.itens.map((p) => (
                      <ProductCard key={p.id} p={p} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : (
          <div className={grade}>
            {items.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}

        {texto && (
          <section className="mx-auto mt-14 max-w-3xl">
            <h2 className="text-[20px] font-bold text-[var(--night)] md:text-[22px]">{texto.h2}</h2>
            {texto.paragrafos.map((p) => (
              <p key={p} className="mt-3 text-[15px] leading-relaxed text-[var(--ink)]/70">
                {p}
              </p>
            ))}
          </section>
        )}

        <div className="mt-14 border-t border-[var(--border)] pt-8 text-center">
          <h2 className="text-[20px] font-bold text-[var(--night)]">Outras coleções</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {categories
              .filter((x) => x.id !== c.id)
              .map((x) => (
                <Link
                  key={x.id}
                  to="/colecao/$id"
                  params={{ id: x.id }}
                  className="rounded-full bg-[var(--mint)] px-5 py-2.5 text-[14px] font-semibold text-[var(--night)] transition hover:bg-[var(--mint-strong)]"
                >
                  {x.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
