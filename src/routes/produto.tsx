import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { GIFT } from "@/lib/gift";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Lock,
  Plus,
  RefreshCw,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { ComboExtras } from "@/components/shop/ComboExtras";
import { OfertaPantufas } from "@/components/shop/OfertaPantufas";
import { OptionCards } from "@/components/shop/OptionCards";
import { SizeSelect } from "@/components/shop/SizeSelect";
import { StoreSelect } from "@/components/shop/StoreSelect";
import { MedidasKigurumi, TabelaMedidas } from "@/components/shop/TabelaMedidas";
import { PijamaDestaques } from "@/components/shop/PijamaDestaques";
import { temDestaquesPijama } from "@/lib/pijama-destaques";
import { ProductCard } from "@/components/shop/ProductCard";
import { Shelf } from "@/components/shop/Shelf";
import { brand } from "@/lib/brand";
import { FAQ } from "@/lib/faq";
import { metaTrack } from "@/lib/meta-pixel";
import { trackCheckoutClick } from "@/lib/analytics";
import { pecasComTabela, usaMenuDeTamanho } from "@/lib/medidas";
import { addToCart, markCartCheckout, setCartOpen } from "@/lib/cart";
import { bundleIdFromSearch, planSearchSchema } from "@/lib/plan-search";
import {
  comboExtrasItens,
  itensTotal,
  pantufaItem,
  pantufasSugeridas,
  SEM_EXTRAS,
  type ComboExtras as Extras,
} from "@/lib/combo-extras";
import type { CartItem } from "@/lib/cart";
import { pijamaInfantil } from "@/lib/pantufa-oferta";
import { productJsonLd, productPath, seo } from "@/lib/seo";
import {
  availableBundles,
  groupBundles,
  listedBundles,
  brl,
  brlCurto,
  bundleShippingLabel,
  categories,
  discountPct,
  encodeVariant,
  getBundle,
  ofertaCombo,
  productLabel,
  type Bundle,
} from "@/lib/bundles";

/** Sufixo das opções de combo, que vira o título do grupo: "Camiseta (1º conjunto)", "Tamanho (2º pijama)". */
const CONJUNTO = / \((\d[ºª] (?:conjunto|pijama|par|pelúcia|umidificador))\)$/;

export const Route = createFileRoute("/produto")({
  validateSearch: planSearchSchema,
  // Conjuntos que não são mais vendidos sozinhos (ex.: kit avulso) abrem o combo.
  beforeLoad: ({ search, location }) => {
    const to = getBundle(bundleIdFromSearch(search)).redirectTo;
    if (!to) return;
    // Leva junto as UTMs e o fbclid do anúncio (sem elas a venda chega sem origem na UTMify).
    // As opções do produto antigo não valem no novo.
    const q = new URLSearchParams(location.searchStr);
    for (const k of ["plano", "variante", "pantufas", "itens"]) q.delete(k);
    q.set("plano", to);
    throw redirect({ href: `/produto?${q}`, replace: true });
  },
  loaderDeps: ({ search }) => ({ plano: search.plano }),
  loader: ({ deps }) => ({ id: bundleIdFromSearch({ plano: deps.plano }) }),
  head: ({ loaderData }) => {
    const p = getBundle(loaderData?.id);
    return seo({
      path: productPath(p),
      title: `${p.name} | ${brand.name}`,
      description: `${p.name} por ${brl(p.price)}. ${p.checkoutProductDescription} ${bundleShippingLabel(p)}.`,
      image: p.img,
      imageAlt: p.name,
      type: "product",
      jsonLd: productJsonLd(p),
    });
  },
  component: Page,
});

/** Bolinha de cor para valores como "Preto" / "Branco". */
function Swatch({ value }: { value: string }) {
  const color = /pret[oa]|noturno/i.test(value)
    ? "#151515"
    : /branc[oa]/i.test(value)
      ? "#f2f2f2"
      : /cinza/i.test(value)
        ? "#8a9097"
        : null;
  if (!color) return null;
  return (
    <i className="h-3.5 w-3.5 rounded-full border border-black/20" style={{ background: color }} />
  );
}

/** Opções com um valor só (ex.: modelo fixo de cada conjunto do combo) já vêm escolhidas. */
const fixas = (b: Bundle) =>
  Object.fromEntries(
    b.options.filter((o) => o.values.length === 1).map((o) => [o.name, o.values[0]!]),
  );

function Page() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const p = getBundle(bundleIdFromSearch(search));
  const category = categories.find((c) => c.id === p.category);
  const off = discountPct(p);

  const [sel, setSel] = useState<Record<string, string>>(() => fixas(p));
  const [img, setImg] = useState(p.img);
  const [nudge, setNudge] = useState(false);
  const [extras, setExtras] = useState<Extras>(SEM_EXTRAS);
  const [crocsOfferOpen, setCrocsOfferOpen] = useState(false);
  const [crocsOfferQty, setCrocsOfferQty] = useState<1 | 2>(1);
  const [crocsOfferSel, setCrocsOfferSel] = useState<Record<string, string>>({});
  const [crocsOfferAction, setCrocsOfferAction] = useState<"comprar" | "carrinho">("comprar");
  const optionsRef = useRef<HTMLDivElement>(null);

  // Troca de produto (ex.: pelos relacionados): zera as escolhas e a foto.
  // Os extras do combo continuam ao trocar entre combo de 2 e de 4.
  useEffect(() => {
    setSel(fixas(p));
    setImg(p.img);
    setNudge(false);
    setCrocsOfferOpen(false);
    setCrocsOfferSel({});
    if (!p.comboExtras) setExtras(SEM_EXTRAS);
  }, [p.id, p.img, p.comboExtras]);

  useEffect(() => {
    metaTrack("ViewContent", { value: p.price, contentName: p.name });
  }, [p.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const values = p.options.map((o) => sel[o.name]);
  const complete = values.every(Boolean);
  const missing = p.options.filter((o) => !sel[o.name]).map((o) => o.name.toLowerCase());
  // Pijamas kigurumi: ursinhos extras entram como itens a mais no pedido.
  const extra = p.comboExtras ? comboExtrasItens(extras) : null;
  const extraItens = extra?.itens ?? [];
  const extraTotal = extra?.total ?? 0;
  // Pijamas: pantufas que combinam com o que foi escolhido, oferecidas no popup ao comprar.
  const sugestao = pantufasSugeridas(p, sel);

  const choose = (name: string, value: string) => {
    setSel((s) => ({ ...s, [name]: value }));
    setNudge(false);
    const optionImg =
      p.optionCards?.[name.replace(CONJUNTO, "")]?.[value] ?? p.optionImages?.[value];
    if (optionImg) setImg(optionImg);
  };

  // Popup das pantufas: "comprar" vai direto ao checkout; "carrinho" adiciona e abre o carrinho.
  const [oferta, setOferta] = useState<null | "comprar" | "carrinho">(null);
  const goCheckout = (mais: CartItem[] = []) => {
    const chosen = values as string[];
    const itens = [...extraItens, ...mais];
    markCartCheckout(false);
    trackCheckoutClick({
      source: "product_page",
      bundleId: p.id,
      bundleName: productLabel(p, chosen),
      value: p.price + itensTotal(itens),
    });
    navigate({
      to: "/checkout",
      search: {
        plano: p.id,
        ...(chosen.length ? { variante: encodeVariant(chosen) } : {}),
        ...(itens.length ? { itens } : {}),
      },
    });
  };
  const goCart = (mais: CartItem[] = []) => {
    const chosen = values as string[];
    const itens = [...extraItens, ...mais];
    addToCart({ plano: p.id, ...(chosen.length ? { variante: encodeVariant(chosen) } : {}) });
    for (const it of itens) addToCart(it, it.qtd);
    metaTrack("AddToCart", { value: p.price + itensTotal(itens), contentName: p.name });
    setOferta(null);
    setCartOpen(true);
  };
  const ready = () => {
    if (complete) return true;
    setNudge(true);
    optionsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  };
  const buy = () => {
    if (!ready()) return;
    if (p.id === "crocs1") {
      setCrocsOfferAction("comprar");
      setCrocsOfferQty(1);
      setCrocsOfferSel({
        "Modelo do 1º Crocs": sel.Modelo ?? "",
        "Tamanho do 1º Crocs": sel.Tamanho ?? "",
      });
      setCrocsOfferOpen(true);
      return;
    }
    if (sugestao) setOferta("comprar");
    else goCheckout();
  };
  const crocs1 = getBundle("crocs1");
  const crocs2 = getBundle("crocs2");
  const crocsOfferOptions = crocsOfferQty === 1 ? crocs1.options : crocs2.options;
  const crocsOfferUnits =
    crocsOfferQty === 1
      ? [{ label: "Seu Crocs", model: "Modelo", size: "Tamanho" }]
      : [
          { label: "1º par", model: "Modelo do 1º Crocs", size: "Tamanho do 1º Crocs" },
          { label: "2º par", model: "Modelo do 2º Crocs", size: "Tamanho do 2º Crocs" },
        ];
  const crocsOfferValues = crocsOfferOptions.map((o) => crocsOfferSel[o.name]);
  const crocsOfferComplete = crocsOfferValues.every(Boolean);
  const openCrocsOffer = (action: "comprar" | "carrinho") => {
    setCrocsOfferAction(action);
    setCrocsOfferQty(1);
    setCrocsOfferSel({
      Modelo: sel.Modelo ?? "",
      Tamanho: sel.Tamanho ?? "",
      "Modelo do 1º Crocs": sel.Modelo ?? "",
      "Tamanho do 1º Crocs": sel.Tamanho ?? "",
    });
    setCrocsOfferOpen(true);
  };
  const continueCrocsOffer = () => {
    if (!crocsOfferComplete) return;
    const bundle = crocsOfferQty === 1 ? crocs1 : crocs2;
    const chosen = bundle.options.map((o) => crocsOfferSel[o.name]) as string[];
    const label = productLabel(bundle, chosen);
    if (crocsOfferAction === "carrinho") {
      addToCart({ plano: bundle.id, variante: encodeVariant(chosen) });
      metaTrack("AddToCart", { value: bundle.price, contentName: label });
      setCrocsOfferOpen(false);
      setCartOpen(true);
      return;
    }
    markCartCheckout(false);
    trackCheckoutClick({
      source: "product_page",
      bundleId: bundle.id,
      bundleName: label,
      value: bundle.price,
    });
    navigate({
      to: "/checkout",
      search: { plano: bundle.id, variante: encodeVariant(chosen) },
    });
  };
  const addCart = () => {
    if (!ready()) return;
    if (p.id === "crocs1") {
      openCrocsOffer("carrinho");
      return;
    }
    if (sugestao) setOferta("carrinho");
    else goCart();
  };

  const buyLabel = complete
    ? "Comprar agora"
    : missing.length === 1
      ? `Escolha ${missing[0]}`
      : "Escolha as opções";
  const related = listedBundles.filter((b) => b.id !== p.id && (!p.group || b.group !== p.group));
  const group = groupBundles(p);
  // Produto de 1 com combo maior (umidificador, pelúcia): "ou 2 por R$ 99" no selo da foto e no preço.
  const comboMaior = p.comboVitrine ? ofertaCombo(getBundle(p.comboVitrine)) : undefined;
  const seloOferta = ofertaCombo(p) ?? comboMaior;
  // Combos com nº de peças: o de menor preço por peça ganha o selo "Melhor valor".
  const porPeca = group.filter((g) => g.unidades);
  const melhorValor =
    porPeca.length > 1
      ? porPeca.reduce((a, b) => (b.price / b.unidades! < a.price / a.unidades! ? b : a))
      : undefined;
  // Estampas da mesma versão (adulto com adulto, infantil com infantil).
  const estampas = availableBundles.filter(
    (b) => b.category === p.category && b.estampa && b.groupLabel === p.groupLabel,
  );

  const info: { title: string; body: ReactNode }[] = [
    {
      title: "Descrição",
      body: p.description?.length ? (
        <span className="block space-y-3">
          {p.description.map((t) => (
            <span key={t} className="block">
              {t}
            </span>
          ))}
        </span>
      ) : (
        `${p.checkoutProductDescription} ${p.benefits.join(". ")}.`
      ),
    },
    ...(p.specs?.length
      ? [
          {
            title: "Detalhes e medidas",
            body: (
              <span className="block divide-y divide-[var(--border)]">
                {p.specs.map(([k, v]) => (
                  <span key={k} className="flex gap-4 py-2">
                    <b className="w-32 shrink-0 font-semibold text-[var(--night)]">{k}</b>
                    <span>{v}</span>
                  </span>
                ))}
              </span>
            ),
          },
        ]
      : []),
    { title: "Entrega e frete", body: `${FAQ[0]!.a} ${bundleShippingLabel(p)}.` },
    {
      title: "Trocas e devoluções",
      body: ["conforto", "moletons", "kigurumi", "crocs"].includes(p.category)
        ? "Você tem 7 dias para desistir da compra e até 30 dias para trocar por outro tamanho ou cor, sem uso e com a etiqueta."
        : "Você tem 7 dias após o recebimento para desistir da compra, com o produto sem uso e na embalagem original.",
    },
    { title: "Pagamento seguro", body: FAQ[2]!.a },
  ];

  return (
    <SiteLayout>
      {crocsOfferOpen && p.id === "crocs1" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="crocs-offer-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl md:p-8"
          >
            <div className="text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--ink)]/55">
                Escolha sua oferta
              </p>
              <h2 id="crocs-offer-title" className="mt-1 text-[25px] font-bold text-[var(--night)]">
                Quantos Crocs você quer?
              </h2>
              <p className="mt-2 text-[14px] text-[var(--ink)]/70">
                Escolha 1 par por {brl(crocs1.price)} ou aproveite 2 pares por {brl(crocs2.price)}.
                Você escolhe os modelos e tamanhos.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {([1, 2] as const).map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setCrocsOfferQty(qty)}
                  className={`rounded-2xl border-2 p-3 text-left transition ${
                    crocsOfferQty === qty
                      ? "border-[var(--night)] bg-[var(--mint)] shadow-sm"
                      : "border-[var(--ink)]/15 bg-white"
                  }`}
                >
                  <span className="block text-[15px] font-extrabold text-[var(--night)]">
                    {qty} {qty === 1 ? "par" : "pares"}
                  </span>
                  <span className="mt-1 block text-[13px] font-semibold text-[var(--ink)]/65">
                    {brl(qty === 1 ? crocs1.price : crocs2.price)}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {crocsOfferUnits.map((unit, index) => {
                const model = crocsOfferSel[unit.model];
                const size = crocsOfferSel[unit.size];
                const image = model ? crocs2.optionImages?.[model] : undefined;
                return (
                  <section
                    key={unit.model}
                    className={`rounded-2xl border-2 p-3 transition ${
                      model && size
                        ? "border-[var(--night)] bg-[var(--mint)]/45"
                        : "border-[var(--ink)]/12 bg-[var(--tile)]/45"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[14px] font-extrabold text-[var(--night)]">
                        {unit.label}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          model && size
                            ? "bg-[var(--night)] text-white"
                            : "bg-white text-[var(--ink)]/55"
                        }`}
                      >
                        {model && size ? "Pronto" : `Etapa ${index + 1}`}
                      </span>
                    </div>
                    <div className="mb-3 overflow-hidden rounded-xl bg-white">
                      <img
                        src={image ?? crocs2.img}
                        alt={model ? `Prévia: ${model}` : `Escolha o modelo do ${unit.label}`}
                        className="aspect-[1.35] w-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <span className="mb-1.5 block text-[12px] font-bold text-[var(--night)]">
                        Modelo
                      </span>
                      <StoreSelect
                        title={`Modelo do ${unit.label}`}
                        placeholder="Escolha o modelo"
                        layout="lista"
                        groups={[
                          {
                            nome: "",
                            itens: (
                              crocsOfferOptions.find((option) => option.name === unit.model)
                                ?.values ?? []
                            ).map((value) => ({
                              value,
                              label: value,
                              img: crocs2.optionImages?.[value],
                            })),
                          },
                        ]}
                        value={model}
                        onChange={(v) =>
                          setCrocsOfferSel((current) => ({ ...current, [unit.model]: v }))
                        }
                        className="h-12 rounded-xl border border-[var(--ink)]/20 bg-white px-3 text-[13px]"
                      />
                    </div>
                    <div className="mt-3 text-left">
                      <span className="mb-1.5 block text-[12px] font-bold text-[var(--night)]">
                        Tamanho (34 a 46)
                      </span>
                      <StoreSelect
                        title={`Tamanho do ${unit.label}`}
                        placeholder="Escolha o tamanho"
                        groups={[
                          {
                            nome: "Numeração",
                            itens: (
                              crocsOfferOptions.find((option) => option.name === unit.size)
                                ?.values ?? []
                            ).map((value) => ({ value, label: `Número ${value}`, short: value })),
                          },
                        ]}
                        value={size}
                        onChange={(v) =>
                          setCrocsOfferSel((current) => ({ ...current, [unit.size]: v }))
                        }
                        className="h-12 rounded-xl border border-[var(--ink)]/20 bg-white px-3 text-[13px]"
                      />
                    </div>
                  </section>
                );
              })}
            </div>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setCrocsOfferOpen(false)}
                className="rounded-full border border-[var(--ink)]/20 py-3.5 text-[13px] font-bold text-[var(--ink)]"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={!crocsOfferComplete}
                onClick={continueCrocsOffer}
                className="rounded-full bg-[var(--night)] py-3.5 text-[13px] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {crocsOfferAction === "carrinho"
                  ? `Adicionar ${crocsOfferQty} ${crocsOfferQty === 1 ? "par" : "pares"}`
                  : `Continuar com ${crocsOfferQty} ${crocsOfferQty === 1 ? "par" : "pares"}`}
              </button>
            </div>
          </div>
        </div>
      )}
      {sugestao && (
        <OfertaPantufas
          open={oferta !== null}
          personagens={sugestao.personagens}
          rotulos={sugestao.rotulos}
          descricao={sugestao.descricao}
          infantilPrimeiro={pijamaInfantil(p.id)}
          productPrice={p.price + extraTotal}
          onClose={() => setOferta(null)}
          onContinue={(pares) => {
            const item = pantufaItem(pares);
            const mais = item ? [item] : [];
            if (oferta === "carrinho") goCart(mais);
            else goCheckout(mais);
          }}
        />
      )}
      <div className="container-edge pb-28 pt-4 md:pb-20 md:pt-8">
        <nav
          aria-label="Navegação"
          className="mb-4 flex flex-wrap items-center gap-1 text-[12.5px] text-[var(--ink)]/50"
        >
          <Link to="/" className="hover:text-[var(--night)]">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/colecao/$id" params={{ id: p.category }} className="hover:text-[var(--night)]">
            {category?.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[var(--ink)]/80">{p.name}</span>
        </nav>

        <div className="grid gap-7 md:grid-cols-2 lg:gap-14">
          <div className="md:sticky md:top-[calc(var(--site-chrome-h,7rem)+1.5rem)] md:self-start">
            <div className="relative -mx-6 aspect-square overflow-hidden bg-[var(--tile)] md:mx-0 md:rounded-[24px]">
              <img src={img} alt={p.name} className="h-full w-full object-cover" />
              {seloOferta ? (
                <span className="absolute left-4 top-4 rounded-full bg-[var(--primary-dark)] px-3.5 py-1.5 text-[14px] font-extrabold leading-none text-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.35)]">
                  {seloOferta}
                </span>
              ) : (
                p.badge && (
                  <span className="absolute left-4 top-4 rounded-full bg-[var(--night)] px-3 py-1 text-[12px] font-bold text-white">
                    {p.badge}
                  </span>
                )
              )}
            </div>
            <div className="mt-3 flex gap-2.5 overflow-x-auto [scrollbar-width:none]">
              {p.images.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImg(src)}
                  aria-label="Ver foto"
                  aria-current={img === src}
                  className="shrink-0 pb-1.5"
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className={`h-16 w-16 rounded-xl object-cover transition md:h-[72px] md:w-[72px] ${
                      img === src ? "" : "opacity-60 hover:opacity-100"
                    }`}
                  />
                  <i
                    className={`mx-auto mt-1.5 block h-[3px] rounded-full transition-all ${
                      img === src ? "w-8 bg-[var(--night)]" : "w-0"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-[26px] font-bold leading-tight text-[var(--night)] md:text-[34px] text-balance">
              {p.name}
            </h1>
            <p className="mt-1 text-[15px] text-[var(--ink)]/60">{p.tag}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-[26px] font-extrabold leading-none text-[var(--night)]">
                {ofertaCombo(p) ?? (comboMaior ? `1 por ${brlCurto(p.price)}` : brl(p.price))}
              </span>
              {p.compareAtPrice && (
                <>
                  <s className="text-[15px] text-[var(--ink)]/45">{brl(p.compareAtPrice)}</s>
                  <span className="rounded-full bg-[var(--mint-strong)] px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.04em] text-[var(--night)]">
                    {off}% de desconto
                  </span>
                </>
              )}
              {comboMaior && (
                <span className="text-[18px] font-extrabold leading-none text-[var(--primary-dark)]">
                  ou {comboMaior}
                </span>
              )}
            </div>
            <p className="mt-2 text-[13.5px] text-[var(--ink)]/65">
              Pix com desconto ou cartão de crédito
            </p>

            <ul className="mt-5 space-y-2.5">
              {p.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[15px] text-[var(--ink)]/85">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--mint)] text-[var(--night)]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            {group.length > 1 && (
              <div className="mt-6">
                <div className="mb-2.5 text-[14px] font-bold text-[var(--night)]">
                  {group.find((g) => g.groupTitle)?.groupTitle ??
                    (group.some((g) => g.groupLabel === "Combo casal")
                      ? "Escolha o kit"
                      : "Versão")}
                </div>
                <div
                  className={`grid gap-2 ${group.length > 3 ? "grid-cols-2 sm:grid-cols-4" : group.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
                >
                  {group.map((g) => {
                    const on = g.id === p.id;
                    const combo = g.groupLabel === "Combo casal";
                    const avulsos = group.filter(
                      (x) => x.groupLabel === "Só feminino" || x.groupLabel === "Só masculino",
                    );
                    const saving = combo ? avulsos.reduce((s, x) => s + x.price, 0) - g.price : 0;
                    const melhor = g.unidades && g.id === melhorValor?.id;
                    return (
                      <Link
                        key={g.id}
                        to="/produto"
                        search={{ plano: g.id }}
                        replace
                        resetScroll={false}
                        aria-current={on}
                        className={`relative flex flex-col items-center rounded-2xl border-2 px-2 pb-2.5 pt-3 text-center transition ${
                          on
                            ? "border-[var(--night)] bg-[var(--mint)]"
                            : "border-[var(--ink)]/15 bg-white hover:border-[var(--night)]/50"
                        }`}
                      >
                        {combo && saving > 0 && (
                          <span className="absolute -top-2.5 rounded-full bg-[var(--night)] px-2 py-0.5 text-[10.5px] font-bold text-white">
                            Economize {brl(saving)}
                          </span>
                        )}
                        {melhor && (
                          <span className="absolute -top-2.5 rounded-full bg-[var(--night)] px-2 py-0.5 text-[10.5px] font-bold text-white">
                            Melhor valor
                          </span>
                        )}
                        <span className="text-[13px] font-bold leading-tight text-[var(--night)]">
                          {g.groupLabel}
                        </span>
                        <span className="mt-1 text-[14px] font-extrabold text-[var(--night)]">
                          {brl(g.price)}
                        </span>
                        {g.unidades && g.unidades > 1 && (
                          <span className="text-[11.5px] text-[var(--ink)]/60">
                            {brl(g.price / g.unidades)} cada
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {p.estampa && (
              <div className="mt-6">
                <div className="mb-2.5 text-[14px] font-bold text-[var(--night)]">
                  Estampa<span className="font-normal text-[var(--ink)]/70">: {p.estampa}</span>
                </div>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
                  {estampas.map((b) => (
                    <Link
                      key={b.id}
                      to="/produto"
                      search={{ plano: b.id }}
                      aria-label={b.estampa}
                      title={b.estampa}
                      className={`overflow-hidden rounded-xl border-2 bg-[var(--tile)] transition ${
                        b.id === p.id
                          ? "border-[var(--night)]"
                          : "border-transparent hover:border-[var(--ink)]/25"
                      }`}
                    >
                      <img
                        src={b.img}
                        alt=""
                        loading="lazy"
                        className="aspect-square w-full object-cover"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(() => {
              const pecas = pecasComTabela(p.id);
              return pecas ? (
                <div className="mt-6 flex justify-end">
                  <TabelaMedidas pecas={pecas} infantilPrimeiro={p.id === "pijamai"} />
                </div>
              ) : null;
            })()}

            {p.options.length > 0 && (
              <div
                ref={optionsRef}
                className={`mt-6 space-y-5 rounded-2xl transition ${nudge ? "bg-[var(--sale)]/5 p-4 ring-2 ring-[var(--sale)]/40" : ""}`}
              >
                {p.options.map((o, i) => {
                  // Combo casal: opções "... (1º conjunto)"/"... (2º conjunto)" agrupadas sob um título.
                  const quem = CONJUNTO.exec(o.name)?.[1];
                  const prev = i > 0 ? CONJUNTO.exec(p.options[i - 1]!.name)?.[1] : undefined;
                  const cards = p.optionCards?.[o.name.replace(CONJUNTO, "")];
                  const crocsModelSelector =
                    p.category === "crocs" && o.name.toLowerCase().startsWith("modelo");
                  return (
                    <div
                      key={o.name}
                      // Opção solta depois de um grupo (ex.: "Ursinho de brinde"): separa com uma linha.
                      className={!quem && prev ? "border-t border-[var(--border)] pt-5" : undefined}
                    >
                      {quem && quem !== prev && (
                        <div
                          className={`mb-3 border-b border-[var(--border)] pb-1.5 text-[15px] font-extrabold text-[var(--night)] ${i > 0 ? "pt-3" : ""}`}
                        >
                          {quem}
                        </div>
                      )}
                      <div className="mb-2.5 text-[14px] font-bold text-[var(--night)]">
                        {o.name.replace(CONJUNTO, "")}
                        {sel[o.name] && !usaMenuDeTamanho(o) && o.values.length > 1 && (
                          <span className="font-normal text-[var(--ink)]/70">: {sel[o.name]}</span>
                        )}
                      </div>
                      {p.optionNotes?.[o.name.replace(CONJUNTO, "")] && (
                        <p className="-mt-1.5 mb-2.5 text-[12.5px] text-[var(--ink)]/60">
                          {p.optionNotes[o.name.replace(CONJUNTO, "")]}
                        </p>
                      )}
                      {o.values.length === 1 && p.trocaModelo && cards ? (
                        // Um modelo por produto: os outros cartões levam para a página deles.
                        <OptionCards
                          values={Object.keys(p.trocaModelo)}
                          images={cards}
                          value={o.values[0]}
                          onPick={(v) => {
                            const to = p.trocaModelo?.[v];
                            if (to && to !== p.id)
                              navigate({
                                to: "/produto",
                                search: { plano: to },
                                replace: true,
                                resetScroll: false,
                              });
                          }}
                        />
                      ) : o.values.length === 1 ? (
                        <span className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--night)] bg-[var(--night)] px-4 text-[14px] font-semibold text-white">
                          <Swatch value={o.values[0]!} />
                          {o.values[0]}
                        </span>
                      ) : crocsModelSelector ? (
                        <StoreSelect
                          title="Escolha o modelo"
                          placeholder="Escolha o modelo"
                          label={o.name}
                          layout="lista"
                          groups={[
                            {
                              nome: "",
                              itens: o.values.map((v) => ({
                                value: v,
                                label: v,
                                img: p.optionImages?.[v],
                              })),
                            },
                          ]}
                          value={sel[o.name]}
                          onChange={(v) => choose(o.name, v)}
                          invalid={nudge}
                          className={`h-12 rounded-xl border-2 px-4 text-[14px] font-semibold ${
                            sel[o.name]
                              ? "border-[var(--night)] bg-white"
                              : "border-[var(--ink)]/20 bg-white"
                          }`}
                        />
                      ) : cards ? (
                        <OptionCards
                          values={o.values}
                          images={cards}
                          value={sel[o.name]}
                          onPick={(v) => choose(o.name, v)}
                          missing={nudge}
                        />
                      ) : usaMenuDeTamanho(o) ? (
                        <SizeSelect
                          option={o}
                          value={sel[o.name]}
                          onChange={(v) => choose(o.name, v)}
                          missing={nudge}
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {o.values.map((v) => {
                            const on = sel[o.name] === v;
                            return (
                              <button
                                key={v}
                                type="button"
                                onClick={() => choose(o.name, v)}
                                aria-pressed={on}
                                className={`inline-flex h-11 min-w-12 items-center justify-center gap-2 rounded-full border px-4 text-[14px] font-semibold transition ${
                                  on
                                    ? "border-[var(--night)] bg-[var(--night)] text-white"
                                    : "border-[var(--ink)]/20 bg-white text-[var(--night)] hover:border-[var(--night)]"
                                }`}
                              >
                                <Swatch value={v} />
                                {v}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {p.comboExtras && (
                  <ComboExtras
                    value={extras}
                    onChange={setExtras}
                    brinde={p.options.some((o) => o.name === "Ursinho de brinde")}
                  />
                )}
                {nudge && (
                  <p className="text-[13px] font-semibold text-[var(--sale)]">
                    Escolha {missing.join(" e ")} para continuar.
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={buy}
              className={`mt-7 hidden w-full rounded-full py-4 text-[14px] font-extrabold uppercase tracking-[0.08em] text-white transition md:block ${
                complete
                  ? "bg-[var(--night)] hover:opacity-90"
                  : "bg-[var(--night)]/75 hover:bg-[var(--night)]"
              }`}
            >
              {buyLabel}
            </button>
            <button
              type="button"
              onClick={addCart}
              className="mt-3 hidden w-full items-center justify-center gap-2 rounded-full border-2 border-[var(--night)] py-[14px] text-[14px] font-extrabold uppercase tracking-[0.08em] text-[var(--night)] transition hover:bg-[var(--mint)] md:flex"
            >
              <ShoppingBag className="h-4 w-4" /> Adicionar ao carrinho
            </button>

            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[var(--mint)] p-3">
              <img
                src={GIFT.img}
                alt=""
                className="h-12 w-12 shrink-0 rounded-xl bg-white object-cover"
              />
              <p className="text-[13.5px] leading-snug text-[var(--night)]">
                <b>Brinde em toda compra:</b> você ganha um {GIFT.short} junto com o pedido.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px] text-[var(--ink)]/65 md:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-[var(--night)]" /> Envio rastreado
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-[var(--night)]" /> Pagamento seguro
              </span>
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4 text-[var(--night)]" /> Troca fácil
              </span>
            </div>

            <div className="mt-7 border-t border-[var(--border)]">
              {info.map((it, i) => (
                <details
                  key={it.title}
                  open={i === 0}
                  className="group border-b border-[var(--border)] py-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold text-[var(--night)] [&::-webkit-details-marker]:hidden">
                    {it.title}
                    <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 text-[14px] leading-relaxed text-[var(--ink)]/70">
                    {it.body}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Pijamas de calça usam a descrição própria (PijamaDestaques) no lugar destes blocos. */}
        {!temDestaquesPijama(p.id) && p.richSections && p.richSections.length > 0 && (
          <section className="mt-14 space-y-10 md:space-y-14">
            {p.richSections.map((r, i) => {
              const points = r.points?.length ? (
                <ul
                  className={`mt-4 space-y-2 text-left text-[15px] text-[var(--ink)]/85 ${r.media ? "" : "mx-auto inline-block"}`}
                >
                  {r.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5">
                      <Check
                        className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]"
                        strokeWidth={3}
                      />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              ) : null;
              return r.media ? (
                <div key={r.title} className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
                  {/* Vídeo curto do produto em uso (mp4) toca sozinho, sem som, em loop. */}
                  {r.media.endsWith(".mp4") ? (
                    <video
                      src={r.media}
                      autoPlay
                      muted
                      loop
                      playsInline
                      aria-label={r.title}
                      className={`mx-auto max-h-[540px] w-full max-w-md rounded-[20px] bg-[var(--tile)] object-cover ${i % 2 ? "md:order-2" : ""}`}
                    />
                  ) : (
                    <img
                      src={r.media}
                      alt={r.title}
                      loading="lazy"
                      className={`mx-auto max-h-[540px] w-full max-w-md rounded-[20px] bg-[var(--tile)] object-cover ${i % 2 ? "md:order-2" : ""}`}
                    />
                  )}
                  <div className="text-center md:text-left">
                    <h2 className="text-[22px] font-bold text-[var(--night)] md:text-[28px]">
                      {r.title}
                    </h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink)]/75">
                      {r.text}
                    </p>
                    {points}
                  </div>
                </div>
              ) : (
                <div key={r.title} className="mx-auto max-w-2xl text-center">
                  <h2 className="text-[22px] font-bold text-[var(--night)] md:text-[28px]">
                    {r.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink)]/75">{r.text}</p>
                  {points}
                </div>
              );
            })}
          </section>
        )}

        {temDestaquesPijama(p.id) && <PijamaDestaques />}

        {pecasComTabela(p.id)?.includes("kigurumi") && <MedidasKigurumi />}

        {!temDestaquesPijama(p.id) && p.compare && (
          <section className="mx-auto mt-14 max-w-xl">
            <h2 className="mb-5 text-center text-[22px] font-bold text-[var(--night)] md:text-[28px]">
              {p.compare.title}
            </h2>
            <div className="overflow-hidden rounded-[20px] border border-[var(--border)]">
              <div className="grid grid-cols-[1fr_auto_auto] bg-[var(--mint)] text-[13px] font-bold text-[var(--night)]">
                <span className="px-4 py-3" />
                <span className="w-28 px-2 py-3 text-center">{brand.name}</span>
                <span className="w-20 px-2 py-3 text-center text-[var(--ink)]/55">Outras</span>
              </div>
              {p.compare.rows.map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-[1fr_auto_auto] items-center border-t border-[var(--border)] text-[14px]"
                >
                  <span className="px-4 py-3 text-[var(--ink)]/85">{row}</span>
                  <span className="grid w-28 place-items-center py-3">
                    <Check className="h-5 w-5 text-[var(--primary)]" strokeWidth={3} />
                  </span>
                  <span className="grid w-20 place-items-center py-3 text-[18px] font-bold text-[var(--sale)]">
                    ×
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {p.reviews && p.reviews.length > 0 && (
          <section className="mt-14">
            <h2 className="text-center text-[22px] font-bold text-[var(--night)] md:text-[28px]">
              O que dizem os clientes
            </h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {p.reviews.map((r) => (
                <article
                  key={r.author + (r.date ?? "")}
                  className="rounded-[20px] border border-[var(--border)] bg-white p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="text-[15px] tracking-[0.1em] text-[var(--star)]"
                      aria-label={`${r.rating} de 5 estrelas`}
                    >
                      {"★".repeat(r.rating)}
                      <span className="text-[var(--ink)]/15">{"★".repeat(5 - r.rating)}</span>
                    </span>
                    {r.date && <span className="text-[12px] text-[var(--ink)]/45">{r.date}</span>}
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-[var(--ink)]/80">{r.text}</p>
                  {(r.photos?.length || r.videos?.length) && (
                    <div className="mt-3 flex gap-2">
                      {r.photos?.map((src) => (
                        <img
                          key={src}
                          src={src}
                          alt="Foto enviada pelo cliente"
                          loading="lazy"
                          className="h-32 w-24 rounded-xl object-cover"
                        />
                      ))}
                      {/* Vídeo do cliente: o "#t" mostra um quadro como capa antes de tocar. */}
                      {r.videos?.map((src) => (
                        <video
                          key={src}
                          src={`${src}#t=0.5`}
                          controls
                          preload="metadata"
                          aria-label="Vídeo enviado pelo cliente"
                          className="h-32 w-24 rounded-xl bg-black object-cover"
                        />
                      ))}
                    </div>
                  )}
                  <p className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--night)]">
                    {r.author}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto mt-14 max-w-3xl rounded-[24px] bg-[var(--mint)] px-5 py-8 text-center md:px-10 md:py-10">
          <h2 className="text-[22px] font-bold text-[var(--night)] md:text-[28px]">
            Leve o seu para casa
          </h2>
          <p className="mt-2 text-[15px] text-[var(--ink)]/75">
            {p.name} por <b className="text-[var(--night)]">{brl(p.price)}</b>
            {p.compareAtPrice && (
              <>
                {" "}
                <s className="text-[var(--ink)]/45">{brl(p.compareAtPrice)}</s>
              </>
            )}
          </p>
          <ul className="mx-auto mt-5 grid max-w-xl gap-2.5 text-left text-[14px] text-[var(--night)] sm:grid-cols-2">
            {[
              `Brinde: ${GIFT.short} em toda compra`,
              bundleShippingLabel(p),
              ["conforto", "moletons", "kigurumi", "crocs"].includes(p.category)
                ? "Troca de tamanho em até 30 dias"
                : "7 dias para desistir da compra",
              "Pix ou cartão de crédito",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" strokeWidth={3} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={buy}
            className="mt-6 w-full max-w-sm rounded-full bg-[var(--night)] py-4 text-[14px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:opacity-90"
          >
            {complete ? "Comprar agora" : buyLabel}
          </button>
        </section>

        <section className="mt-14">
          <h2 className="mb-5 text-center text-[22px] font-bold text-[var(--night)] md:text-[28px]">
            Complete o visual
          </h2>
          <Shelf label="Relacionados">
            {related.map((b) => (
              <ProductCard key={b.id} p={b} />
            ))}
          </Shelf>
        </section>
      </div>

      {/* Barra de compra fixa no celular */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-white/95 px-4 py-3 backdrop-blur md:hidden [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <div className="leading-tight">
            <div className="text-[18px] font-extrabold text-[var(--night)]">
              {(!extraTotal && ofertaCombo(p)) || brl(p.price + extraTotal)}
            </div>
            {p.compareAtPrice && (
              <s className="text-[12px] text-[var(--ink)]/45">{brl(p.compareAtPrice)}</s>
            )}
          </div>
          <button
            type="button"
            onClick={addCart}
            aria-label="Adicionar ao carrinho"
            className="relative grid h-[50px] w-[50px] shrink-0 place-items-center rounded-full border-2 border-[var(--night)] text-[var(--night)]"
          >
            <ShoppingBag className="h-5 w-5" />
            <Plus
              className="absolute right-2 top-2 h-3.5 w-3.5 rounded-full bg-[var(--night)] p-0.5 text-white"
              strokeWidth={3}
            />
          </button>
          <button
            type="button"
            onClick={buy}
            className={`flex-1 rounded-full py-3.5 text-[13px] font-extrabold uppercase tracking-[0.06em] text-white ${
              complete ? "bg-[var(--night)]" : "bg-[var(--night)]/75"
            }`}
          >
            {complete ? "Comprar agora" : buyLabel}
          </button>
        </div>
      </div>
    </SiteLayout>
  );
}
