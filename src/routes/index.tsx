import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  MessageCircle,
  Plus,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { brand } from "@/lib/brand";
import { seo, storeJsonLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/whatsapp";
import { calcularTotal, formatPreco, ofertaDe, type Combo, type Oferta, type OfertaCombo } from "@/lib/catalogo";
import { CIDADES, encontrarCidade, statusFuncionamento, vitrine, type Cidade } from "@/lib/cidades";
import { useLocal, type Local } from "@/lib/local";
import { adicionarCombo, somar, useSacola } from "@/lib/sacola";
import { Foto, FotoCombo, Marca } from "@/components/app/Ilustracoes";
import { Banners, type BannerId } from "@/components/app/Banners";
import { AppShell, CepForm, CepSheet, Quantidade, TituloSecao } from "@/components/app/Partes";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      path: "/",
      title: `${brand.name} | Delivery de água mineral 20L e gás 13kg`,
      description:
        "Peça água mineral 20L e gás de cozinha 13kg da revenda da sua região. Veja preço e prazo pelo CEP e pague na entrega.",
      imageAlt: `${brand.name}: delivery de água e gás`,
      jsonLd: storeJsonLd(),
    }),
  component: Home,
});

type Filtro = "todos" | "gas" | "agua" | "combos";
type Tipo = "gas" | "agua";
/** Itens que o cliente tocou antes de informar o CEP; entram na sacola quando ele confirma. */
type Pendente = { gas: number; agua: number } | null;

const item = (t: Tipo): Pendente => (t === "gas" ? { gas: 1, agua: 0 } : { gas: 0, agua: 1 });

function Home() {
  const local = useLocal();
  const [cepAberto, setCepAberto] = useState(false);
  const [pendente, setPendente] = useState<Pendente>(null);
  const cidade = local.cidade ? encontrarCidade(local.cidade, local.uf) : undefined;

  const pedirCep = (p: Pendente) => {
    setPendente(p);
    setCepAberto(true);
  };
  const aoConfirmarCep = (l: Local) => {
    const c = encontrarCidade(l.cidade, l.uf);
    if (c && pendente) {
      const gas = c.revenda.marcasGas.length ? pendente.gas : 0;
      const agua = c.revenda.marcasAgua.length ? pendente.agua : 0;
      if (gas + agua > 0) adicionarCombo(gas, agua);
    }
    window.scrollTo({ top: 0 });
  };

  return (
    <AppShell>
      <BarraTopo local={local} onTrocar={() => pedirCep(null)} />
      {!local.cidade && <Vitrine onPedir={pedirCep} />}
      {local.cidade && !cidade && <NaoAtendida local={local} onTrocar={() => pedirCep(null)} />}
      {cidade && <Loja cidade={cidade} />}
      <Rodape />
      {cidade && <BarraSacola cidade={cidade} />}
      <CepSheet
        aberto={cepAberto}
        onFechar={() => {
          setCepAberto(false);
          setPendente(null);
        }}
        onOk={aoConfirmarCep}
        {...(pendente && {
          titulo: "Pra onde vai o pedido?",
          texto: "Informe o CEP: mostramos o preço da revenda da sua região e já colocamos o item na sacola.",
        })}
      />
    </AppShell>
  );
}

function BarraTopo({ local, onTrocar }: { local: Local; onTrocar: () => void }) {
  const endereco = local.cidade
    ? `${local.rua || local.bairro || local.cidade}${local.rua && local.bairro ? `, ${local.bairro}` : ""}`
    : "Informe seu CEP";
  return (
    <header className="sticky top-0 z-30 border-b border-linha bg-papel/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 pt-3">
        <Marca />
        <a
          href={whatsappLink(brand.whatsapp.phoneE164, brand.whatsapp.message)}
          target="_blank"
          rel="noreferrer"
          className="flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-semibold ring-1 ring-linha transition active:scale-95"
        >
          <MessageCircle className="h-4 w-4" />
          Ajuda
        </a>
      </div>
      <button type="button" onClick={onTrocar} className="flex w-full items-center gap-2 px-4 pb-3 pt-3 text-left">
        <MapPin className="h-[18px] w-[18px] shrink-0 text-cobalto" strokeWidth={2.25} />
        <span className="min-w-0 truncate text-[14px] font-semibold">{endereco}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-apagado" />
      </button>
    </header>
  );
}

/* ---------- sem CEP: vitrine com preço "a partir de" ---------- */

function Vitrine({ onPedir }: { onPedir: (p: Pendente) => void }) {
  const oferta = vitrine();
  const destaque = oferta?.combos.find((c) => c.combo.id === "1gas1agua") ?? oferta?.combos[0];
  const acaoBanner = (id: BannerId) =>
    onPedir(id === "combo" ? (destaque ? { gas: destaque.combo.gas, agua: destaque.combo.agua } : null) : item(id));

  return (
    <>
      <section className="px-4 pt-5">
        <h1 className="titulo-largo text-[26px]">Gás e água na sua porta.</h1>
        <p className="mt-2 text-[14px] text-apagado">Peça agora e pague só quando receber.</p>
      </section>

      <section className="pt-4">
        <Banners
          ordem={["gas", "agua", ...(destaque ? (["combo"] as const) : [])]}
          precos={{
            gas: oferta?.precoGas || undefined,
            agua: oferta?.precoAgua || undefined,
            combo: destaque,
          }}
          aPartirDe
          onAcao={acaoBanner}
        />
      </section>

      {oferta && (
        <Catalogo
          oferta={oferta}
          aPartirDe
          qtd={{ gas: 0, agua: 0 }}
          onMais={(t) => onPedir(item(t))}
          onMenos={() => {}}
          onCombo={(c) => onPedir({ gas: c.gas, agua: c.agua })}
        />
      )}

      <section className="px-4 pt-6">
        <div className="rounded-[22px] bg-white p-4 ring-1 ring-linha">
          <p className="titulo-largo text-[19px]">Veja o preço da sua região</p>
          <p className="mt-1.5 text-[13px] leading-snug text-apagado">
            Informe o CEP: mostramos a revenda que entrega aí, o prazo e o preço final.
          </p>
          <div className="mt-3">
            <CepForm onOk={() => window.scrollTo({ top: 0 })} />
          </div>
        </div>
      </section>

      <section className="mt-6 bg-white px-4 py-6">
        <TituloSecao titulo="Por que pedir aqui" />
        <ul className="divide-y divide-linha">
          <Motivo icone={<ShieldCheck className="h-5 w-5" />} titulo="Revenda identificada">
            Nome e CNPJ de quem entrega aparecem antes de você enviar o pedido.
          </Motivo>
          <Motivo icone={<Wallet className="h-5 w-5" />} titulo="Pague na entrega">
            Dinheiro, cartão na maquininha ou Pix na hora em que o pedido chega.
          </Motivo>
          <Motivo icone={<Clock className="h-5 w-5" />} titulo="Prazo de cada cidade">
            Mostramos o prazo médio e o horário real da revenda que atende você.
          </Motivo>
        </ul>
      </section>

      <section className="px-4 py-7">
        <TituloSecao titulo="Onde entregamos" />
        <ListaCidades />
      </section>
    </>
  );
}

function Motivo({ icone, titulo, children }: { icone: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <li className="flex gap-3.5 py-4 first:pt-1 last:pb-1">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-papel text-tinta">
        {icone}
      </span>
      <span>
        <span className="block text-[15px] font-bold">{titulo}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-apagado">{children}</span>
      </span>
    </li>
  );
}

function ListaCidades() {
  return (
    <ul className="divide-y divide-linha overflow-hidden rounded-2xl bg-white ring-1 ring-linha">
      {CIDADES.map((c) => (
        <li key={`${c.nome}-${c.uf}`} className="flex items-center gap-3 px-4 py-3.5">
          <MapPin className="h-4 w-4 text-cobalto" />
          <span className="flex-1 text-[14px] font-semibold">{c.nome}</span>
          <span className="text-[13px] text-apagado">{c.uf}</span>
        </li>
      ))}
    </ul>
  );
}

function NaoAtendida({ local, onTrocar }: { local: Local; onTrocar: () => void }) {
  return (
    <section className="px-4 pt-8">
      <p className="text-[13px] font-semibold text-apagado">
        {local.cidade} · {local.uf}
      </p>
      <h1 className="titulo-largo mt-2 text-[32px]">Ainda não chegamos aí.</h1>
      <p className="mt-3 max-w-[320px] text-[15px] leading-relaxed text-apagado">
        Estamos abrindo novas cidades. Por enquanto, entregamos em:
      </p>
      <div className="mt-5">
        <ListaCidades />
      </div>
      <button
        type="button"
        onClick={onTrocar}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-tinta text-[15px] font-bold text-white active:scale-[0.99]"
      >
        Usar outro CEP
      </button>
      <Link
        to="/parceiro"
        className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-linha"
      >
        <span>
          <span className="block text-[14px] font-bold">Tem revenda em {local.cidade}?</span>
          <span className="block text-[12px] text-apagado">Cadastre e receba pedidos da sua cidade</span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-apagado" />
      </Link>
    </section>
  );
}

/* ---------- loja da cidade ---------- */

function Loja({ cidade }: { cidade: Cidade }) {
  const r = cidade.revenda;
  const sacola = useSacola();
  const oferta = ofertaDe(r);
  const status = statusFuncionamento(r);
  const destaque = oferta.combos.find((c) => c.combo.id === "1gas1agua") ?? oferta.combos[0];

  const acaoBanner = (id: BannerId) => {
    if (id === "combo") {
      if (destaque) adicionarCombo(destaque.combo.gas, destaque.combo.agua);
    } else somar(id, 1);
  };

  return (
    <>
      <section className="px-4 pt-5">
        <p className="text-[13px] font-medium text-apagado">Entrega em {cidade.nome}</p>
        <h1 className="titulo-largo mt-1.5 truncate text-[24px]">{r.nome}</h1>
        <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-apagado">
          <span className={`inline-flex items-center gap-1.5 font-semibold ${status.aberto ? "text-ok" : "text-tinta"}`}>
            <span className={`h-2 w-2 rounded-full ${status.aberto ? "bg-ok" : "bg-apagado"}`} />
            {status.curto}
          </span>
          <span aria-hidden>·</span>
          <span>
            {r.prazoMin}–{r.prazoMax} min
          </span>
          <span aria-hidden>·</span>
          <span>{r.taxaEntrega > 0 ? `Entrega ${formatPreco(r.taxaEntrega)}` : "Entrega grátis"}</span>
        </p>
      </section>

      <section className="pt-5">
        <Banners
          ordem={["gas", "agua", ...(destaque ? (["combo"] as const) : [])]}
          precos={{ gas: r.precoGas || undefined, agua: r.precoAgua || undefined, combo: destaque }}
          onAcao={acaoBanner}
        />
      </section>

      <Catalogo
        oferta={oferta}
        qtd={sacola}
        onMais={(t) => somar(t, 1)}
        onMenos={(t) => somar(t, -1)}
        onCombo={(c) => adicionarCombo(c.gas, c.agua)}
      />

      <p className="px-4 pt-6 text-[12px] leading-relaxed text-apagado">
        Vendido e entregue por {r.nome}
        {r.cnpj && ` · CNPJ ${r.cnpj}`}
        {r.endereco && ` · ${r.endereco}`}.
      </p>
    </>
  );
}

/* ---------- catálogo (usado na vitrine e na loja) ---------- */

function Catalogo({
  oferta,
  aPartirDe = false,
  qtd,
  onMais,
  onMenos,
  onCombo,
}: {
  oferta: Oferta;
  aPartirDe?: boolean;
  qtd: { gas: number; agua: number };
  onMais: (t: Tipo) => void;
  onMenos: (t: Tipo) => void;
  onCombo: (c: Combo) => void;
}) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const listaRef = useRef<HTMLDivElement>(null);
  const vendeGas = oferta.marcasGas.length > 0 && oferta.precoGas > 0;
  const vendeAgua = oferta.marcasAgua.length > 0 && oferta.precoAgua > 0;
  const ver = (f: Filtro) => filtro === "todos" || filtro === f;
  const escolher = (f: Filtro) => {
    setFiltro((atual) => (atual === f ? "todos" : f));
    listaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const categorias: { id: Filtro; rotulo: string; foto: ReactNode; mostrar: boolean }[] = [
    { id: "gas", rotulo: "Gás", foto: <Foto tipo="gas" className="h-14 w-auto" />, mostrar: vendeGas },
    { id: "agua", rotulo: "Água", foto: <Foto tipo="agua" className="h-14 w-auto" />, mostrar: vendeAgua },
    { id: "combos", rotulo: "Combos", foto: <FotoCombo gas={1} agua={1} altura="h-12" />, mostrar: oferta.combos.length > 0 },
  ];

  return (
    <>
      <nav className="grid grid-cols-3 gap-2.5 px-4 pt-6" aria-label="Categorias">
        {categorias
          .filter((c) => c.mostrar)
          .map((c) => {
            const ativo = filtro === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => escolher(c.id)}
                aria-pressed={ativo}
                className={`flex flex-col items-center rounded-2xl bg-white pb-3 pt-3.5 transition active:scale-[0.98] ${
                  ativo ? "ring-2 ring-tinta" : "ring-1 ring-linha"
                }`}
              >
                <span className="flex h-14 items-end">{c.foto}</span>
                <span className="mt-2 text-[13px] font-bold">{c.rotulo}</span>
              </button>
            );
          })}
      </nav>

      <div ref={listaRef} className="scroll-mt-28" />

      {ver("gas") && vendeGas && (
        <Folha titulo="Gás de cozinha" filtrado={filtro !== "todos"} onVerTudo={() => setFiltro("todos")}>
          <Produto
            foto={<Foto tipo="gas" className="h-[92px] w-auto" />}
            nome="Botijão P13 · 13 kg"
            detalhe={`Lacrado, com troca do vazio. ${listaMarcas(oferta.marcasGas)}.`}
            preco={oferta.precoGas}
            aPartirDe={aPartirDe}
            acao={<Quantidade valor={qtd.gas} rotulo="gás" onMais={() => onMais("gas")} onMenos={() => onMenos("gas")} />}
          />
        </Folha>
      )}

      {ver("agua") && vendeAgua && (
        <Folha titulo="Água mineral" filtrado={filtro !== "todos"} onVerTudo={() => setFiltro("todos")}>
          <Produto
            foto={<Foto tipo="agua" className="h-[96px] w-auto" />}
            nome="Galão 20 litros"
            detalhe={`Lacrado, com troca do galão. ${listaMarcas(oferta.marcasAgua)}.`}
            preco={oferta.precoAgua}
            aPartirDe={aPartirDe}
            acao={<Quantidade valor={qtd.agua} rotulo="água" onMais={() => onMais("agua")} onMenos={() => onMenos("agua")} />}
          />
        </Folha>
      )}

      {ver("combos") && oferta.combos.length > 0 && (
        <Folha titulo="Combos" filtrado={filtro !== "todos"} onVerTudo={() => setFiltro("todos")}>
          <div className="divide-y divide-linha">
            {oferta.combos.map((c) => (
              <ComboLinha
                key={c.combo.id}
                oferta={c}
                aPartirDe={aPartirDe}
                confirmar={!aPartirDe}
                onAdicionar={() => onCombo(c.combo)}
              />
            ))}
          </div>
        </Folha>
      )}
    </>
  );
}

function listaMarcas(marcas: readonly string[]) {
  if (marcas.length <= 3) return marcas.join(", ");
  return `${marcas.slice(0, 3).join(", ")} e mais ${marcas.length - 3}`;
}

function Folha({
  titulo,
  filtrado,
  onVerTudo,
  children,
}: {
  titulo: string;
  filtrado: boolean;
  onVerTudo: () => void;
  children: ReactNode;
}) {
  return (
    <section className="mt-6 bg-white px-4 pb-3 pt-5">
      <TituloSecao
        titulo={titulo}
        acao={
          filtrado ? (
            <button type="button" onClick={onVerTudo} className="text-[13px] font-semibold text-cobalto">
              Ver tudo
            </button>
          ) : undefined
        }
      />
      {children}
    </section>
  );
}

function Produto({
  foto,
  nome,
  detalhe,
  preco,
  aPartirDe = false,
  antes,
  economia,
  acao,
}: {
  foto: ReactNode;
  nome: string;
  detalhe: string;
  preco: number;
  aPartirDe?: boolean;
  antes?: number;
  economia?: number;
  acao: ReactNode;
}) {
  return (
    <article className="flex gap-4 py-3">
      <div className="min-w-0 flex-1">
        <h3 className="text-[16px] font-bold leading-snug">{nome}</h3>
        <p className="mt-1 line-clamp-3 text-[13px] leading-snug text-apagado">{detalhe}</p>
        <p className="mt-2.5 flex flex-wrap items-baseline gap-x-2">
          {aPartirDe && <span className="w-full text-[11px] font-medium text-apagado">a partir de</span>}
          <span className="text-[16px] font-bold tabular-nums">{formatPreco(preco)}</span>
          {antes !== undefined && (
            <span className="text-[13px] tabular-nums text-apagado line-through">{formatPreco(antes)}</span>
          )}
          {economia !== undefined && (
            <span className="text-[12px] font-bold text-ok">economize {formatPreco(economia)}</span>
          )}
        </p>
      </div>
      <div className="relative h-[116px] w-[116px] shrink-0">
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-papel">{foto}</div>
        <div className="absolute -bottom-3 right-1">{acao}</div>
      </div>
    </article>
  );
}

function ComboLinha({
  oferta,
  aPartirDe,
  confirmar,
  onAdicionar,
}: {
  oferta: OfertaCombo;
  aPartirDe: boolean;
  confirmar: boolean;
  onAdicionar: () => void;
}) {
  const { combo } = oferta;
  const [ok, setOk] = useState(false);
  const partes = [
    combo.gas > 0 && `${combo.gas} botij${combo.gas > 1 ? "ões" : "ão"} P13`,
    combo.agua > 0 && `${combo.agua} ${combo.agua > 1 ? "galões" : "galão"} 20 L`,
  ].filter(Boolean);
  return (
    <Produto
      foto={<FotoCombo gas={combo.gas} agua={combo.agua} altura={combo.gas + combo.agua > 2 ? "h-[64px]" : "h-[78px]"} />}
      nome={combo.nome}
      detalhe={`${partes.join(" + ")}. O desconto entra sozinho na sacola.`}
      preco={oferta.total}
      aPartirDe={aPartirDe}
      antes={oferta.avulso}
      economia={oferta.economia}
      acao={
        <button
          type="button"
          onClick={() => {
            onAdicionar();
            if (!confirmar) return;
            setOk(true);
            window.setTimeout(() => setOk(false), 1300);
          }}
          aria-label={`Adicionar combo ${combo.nome}`}
          className={`flex h-11 w-11 items-center justify-center rounded-full shadow-[0_2px_10px_rgba(16,17,20,0.16)] ring-1 ring-black/5 transition active:scale-90 ${
            ok ? "bg-ok text-white" : "bg-white text-cobalto"
          }`}
        >
          {ok ? <Check className="h-5 w-5" strokeWidth={2.75} /> : <Plus className="h-5 w-5" strokeWidth={2.75} />}
        </button>
      }
    />
  );
}

function Rodape() {
  return (
    <footer className="px-4 pb-6 pt-10">
      <Marca />
      <p className="mt-3 max-w-[300px] text-[12px] leading-relaxed text-apagado">
        Os pedidos são atendidos e entregues pela revenda local identificada em cada cidade.
      </p>
      <div className="mt-4 flex gap-5 text-[12px] font-semibold text-tinta">
        <Link to="/parceiro">Seja parceiro</Link>
        <Link to="/politica-privacidade">Privacidade</Link>
        <a href={whatsappLink(brand.whatsapp.phoneE164, brand.whatsapp.message)} target="_blank" rel="noreferrer">
          Atendimento
        </a>
      </div>
      <p className="mt-4 text-[11px] text-apagado/70">
        © {new Date().getFullYear()} {brand.name}
      </p>
    </footer>
  );
}

function BarraSacola({ cidade }: { cidade: Cidade }) {
  const sacola = useSacola();
  const qtd = sacola.gas + sacola.agua;
  if (!qtd) return null;
  const t = calcularTotal(sacola, cidade.revenda);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3">
      <Link
        to="/sacola"
        className="flex h-[58px] items-center gap-3 rounded-2xl bg-tinta pl-2 pr-4 text-white shadow-[0_14px_34px_-12px_rgba(16,17,20,0.7)] transition animate-in slide-in-from-bottom-4 active:scale-[0.99]"
      >
        <span className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-sol px-2 text-[15px] font-extrabold tabular-nums text-tinta">
          {qtd}
        </span>
        <span className="flex-1 text-[15px] font-bold">Ver sacola</span>
        <span className="text-[15px] font-bold tabular-nums">{formatPreco(t.total)}</span>
        <ChevronRight className="-mr-1 h-4 w-4 text-white/60" />
      </Link>
    </div>
  );
}
