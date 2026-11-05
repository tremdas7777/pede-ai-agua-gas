import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Banknote,
  CreditCard,
  MapPin,
  MessageCircle,
  Plus,
  QrCode,
  ShoppingBag,
} from "lucide-react";
import { brand } from "@/lib/brand";
import {
  calcularTotal,
  COMBOS,
  formatPreco,
  melhorCombinacao,
  sugestaoCombo,
  type Combo,
  type ComboId,
  type Precos,
} from "@/lib/catalogo";
import { encontrarCidade, statusFuncionamento, type Cidade } from "@/lib/cidades";
import { mascaraCep, mascaraTelefone, soDigitos, useLocal, type Local } from "@/lib/local";
import { atualizarSacola, esvaziarSacola, MAX_ITENS, somar, useSacola, type Sacola } from "@/lib/sacola";
import { whatsappLink } from "@/lib/whatsapp";
import { Foto } from "@/components/app/Ilustracoes";
import { AppShell, Bloco, Campo, Chip, Quantidade } from "@/components/app/Partes";

export const Route = createFileRoute("/sacola")({
  head: () => ({
    meta: [{ title: `Sacola | ${brand.name}` }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

type Pagamento = "dinheiro" | "cartao" | "pix_entrega";

const PAGAMENTOS: { id: Pagamento; titulo: string; sub: string; icone: ReactNode }[] = [
  { id: "dinheiro", titulo: "Dinheiro", sub: "Pague ao entregador", icone: <Banknote className="h-5 w-5" /> },
  { id: "cartao", titulo: "Cartão", sub: "Débito ou crédito na maquininha", icone: <CreditCard className="h-5 w-5" /> },
  { id: "pix_entrega", titulo: "Pix na entrega", sub: "Chave da revenda na hora", icone: <QrCode className="h-5 w-5" /> },
];

function Page() {
  const local = useLocal();
  const sacola = useSacola();
  const [linkEnviado, setLinkEnviado] = useState("");
  const cidade = local.cidade ? encontrarCidade(local.cidade, local.uf) : undefined;

  if (linkEnviado) return <Enviado link={linkEnviado} />;
  if (!cidade || sacola.gas + sacola.agua === 0) {
    return (
      <AppShell>
        <Cabecalho />
        <div className="px-6 pt-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white ring-1 ring-linha">
            <ShoppingBag className="h-7 w-7 text-apagado" />
          </div>
          <h1 className="titulo-largo mt-5 text-[26px]">Sacola vazia</h1>
          <p className="mt-2 text-[15px] text-apagado">
            {cidade ? "Escolha gás, água ou um combo." : "Informe um CEP atendido para começar."}
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex h-12 items-center rounded-2xl bg-tinta px-7 text-[15px] font-bold text-white"
          >
            Ver produtos
          </Link>
        </div>
      </AppShell>
    );
  }
  return <Checkout cidade={cidade} local={local} sacola={sacola} onEnviado={setLinkEnviado} />;
}

/** ["1gas1agua","1gas1agua"] → [{ combo: Gás + Água, vezes: 2, desconto: 10 }] */
function aplicados(ids: ComboId[], descontos: Precos["descontoCombos"]) {
  const out: { combo: Combo; vezes: number; desconto: number }[] = [];
  for (const id of ids) {
    const valor = descontos[id] ?? 0;
    const item = out.find((x) => x.combo.id === id);
    if (item) {
      item.vezes++;
      item.desconto = Math.round((item.desconto + valor) * 100) / 100;
    } else out.push({ combo: COMBOS.find((c) => c.id === id)!, vezes: 1, desconto: valor });
  }
  return out;
}

function Cabecalho() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-linha bg-papel/95 px-4 py-3 backdrop-blur-md">
      <Link
        to="/"
        aria-label="Voltar"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-linha active:scale-95"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <h1 className="titulo-largo text-[22px]">Sacola</h1>
    </header>
  );
}

function Checkout({
  cidade,
  local,
  sacola,
  onEnviado,
}: {
  cidade: Cidade;
  local: Local;
  sacola: Sacola;
  onEnviado: (link: string) => void;
}) {
  const r = cidade.revenda;
  const status = statusFuncionamento(r);
  const t = calcularTotal(sacola, r);
  const [f, setF] = useState({
    nome: "",
    whatsapp: "",
    rua: local.rua,
    numero: "",
    complemento: "",
    bairro: local.bairro,
    referencia: "",
    pagamento: "dinheiro" as Pagamento,
    troco: "",
  });
  const [tentou, setTentou] = useState(false);
  const campo = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((v) => ({ ...v, [k]: e.target.value }));

  // Marca escolhida em outra cidade não vale se a revenda daqui não tem.
  const marcaGas = r.marcasGas.includes(sacola.marcaGas) ? sacola.marcaGas : "";
  const marcaAgua = r.marcasAgua.includes(sacola.marcaAgua) ? sacola.marcaAgua : "";

  const combos = aplicados(melhorCombinacao(sacola.gas, sacola.agua, r.descontoCombos).combos, r.descontoCombos);
  const sugestao = sugestaoCombo(sacola, r);
  const podeSugerir = sugestao && sacola[sugestao.tipo] < MAX_ITENS;

  const regras = [
    { id: "marca-gas", falha: sacola.gas > 0 && !marcaGas, msg: "Escolha a marca do gás." },
    { id: "marca-agua", falha: sacola.agua > 0 && !marcaAgua, msg: "Escolha a marca da água." },
    { id: "campo-rua", falha: !f.rua.trim(), msg: "Informe a rua." },
    { id: "campo-numero", falha: !f.numero.trim(), msg: "Informe o número." },
    { id: "campo-bairro", falha: !f.bairro.trim(), msg: "Informe o bairro." },
    { id: "campo-nome", falha: f.nome.trim().length < 3, msg: "Informe seu nome." },
    { id: "campo-whatsapp", falha: ![10, 11].includes(soDigitos(f.whatsapp).length), msg: "Informe um WhatsApp com DDD." },
  ];
  const primeira = regras.find((x) => x.falha);
  const erro = primeira?.msg ?? "";
  const invalido = (id: string) => tentou && regras.some((x) => x.id === id && x.falha);

  function enviar() {
    setTentou(true);
    if (primeira) {
      const alvo = document.getElementById(primeira.id);
      alvo?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (alvo instanceof HTMLInputElement) alvo.focus({ preventScroll: true });
      return;
    }
    const pagamento = PAGAMENTOS.find((p) => p.id === f.pagamento)!.titulo;
    const linhas = [
      `*Novo pedido — ${brand.name}*`,
      "",
      sacola.gas > 0 &&
        `${sacola.gas}x Gás P13 (${marcaGas}) — ${sacola.temVazioGas ? "troca do vazio" : "sem vazio, botijão novo"}`,
      sacola.agua > 0 &&
        `${sacola.agua}x Água 20 L (${marcaAgua}) — ${sacola.temVazioAgua ? "troca do galão" : "sem galão, vasilhame novo"}`,
      ...combos.map((c) => `Combo ${c.vezes > 1 ? `${c.vezes}x ` : ""}${c.combo.nome}: -${formatPreco(c.desconto)}`),
      `Entrega: ${t.entrega > 0 ? formatPreco(t.entrega) : "grátis"}`,
      `*Total: ${formatPreco(t.total)}*`,
      `Pagamento: ${pagamento}${f.pagamento === "dinheiro" && f.troco ? ` (troco para ${f.troco})` : ""}`,
      "",
      `Nome: ${f.nome.trim()}`,
      `WhatsApp: ${f.whatsapp}`,
      `Endereço: ${f.rua.trim()}, ${f.numero.trim()}${f.complemento.trim() ? ` — ${f.complemento.trim()}` : ""}`,
      `${f.bairro.trim()}, ${cidade.nome}/${cidade.uf} — CEP ${mascaraCep(local.cep)}`,
      f.referencia.trim() !== "" && `Referência: ${f.referencia.trim()}`,
    ].filter((l): l is string => typeof l === "string");
    const link = whatsappLink(r.whatsapp || brand.whatsapp.phoneE164, linhas.join("\n"));
    window.open(link, "_blank", "noopener");
    onEnviado(link);
  }

  return (
    <AppShell>
      <Cabecalho />

      {!status.aberto && (
        <div className="mx-4 mt-4 flex gap-2.5 rounded-xl bg-[#fff4d6] px-3 py-2.5 text-[13px] text-[#7a5300]">
          <AlertCircle className="mt-px h-4 w-4 shrink-0" />
          <span>
            Revenda fechada agora. {status.curto}; seu pedido entra na fila e sai assim que abrir.
          </span>
        </div>
      )}

      <Bloco titulo="Itens">
        <div className="divide-y divide-linha">
          {sacola.gas > 0 && (
            <Item
              foto={<Foto tipo="gas" className="h-14 w-auto" />}
              nome="Botijão P13"
              preco={r.precoGas}
              qtd={sacola.gas}
              rotulo="gás"
              onMais={() => somar("gas", 1)}
              onMenos={() => somar("gas", -1)}
              marcas={r.marcasGas}
              marca={marcaGas}
              idMarca="marca-gas"
              marcaInvalida={invalido("marca-gas")}
              onMarca={(m) => atualizarSacola((s) => ({ ...s, marcaGas: m }))}
              temVazio={sacola.temVazioGas}
              onVazio={(v) => atualizarSacola((s) => ({ ...s, temVazioGas: v }))}
              textoVazio="Tenho botijão vazio pra troca"
              extraSemVazio={r.precoCascoGas}
            />
          )}
          {sacola.agua > 0 && (
            <Item
              foto={<Foto tipo="agua" className="h-14 w-auto" />}
              nome="Galão 20 litros"
              preco={r.precoAgua}
              qtd={sacola.agua}
              rotulo="água"
              onMais={() => somar("agua", 1)}
              onMenos={() => somar("agua", -1)}
              marcas={r.marcasAgua}
              marca={marcaAgua}
              idMarca="marca-agua"
              marcaInvalida={invalido("marca-agua")}
              onMarca={(m) => atualizarSacola((s) => ({ ...s, marcaAgua: m }))}
              temVazio={sacola.temVazioAgua}
              onVazio={(v) => atualizarSacola((s) => ({ ...s, temVazioAgua: v }))}
              textoVazio="Tenho galão vazio pra troca"
              extraSemVazio={r.precoVasilhameAgua}
            />
          )}
        </div>

        {combos.length > 0 && (
          <ul className="mt-1 space-y-1.5">
            {combos.map((c) => (
              <li
                key={c.combo.id}
                className="flex items-center gap-2.5 rounded-xl bg-[#e3f4ea] px-3 py-2.5 text-[13px] text-ok"
              >
                <BadgeCheck className="h-4 w-4 shrink-0" />
                <span className="flex-1 font-semibold">
                  Combo {c.vezes > 1 ? `${c.vezes}× ` : ""}
                  {c.combo.nome} aplicado
                </span>
                <span className="font-bold tabular-nums">−{formatPreco(c.desconto)}</span>
              </li>
            ))}
          </ul>
        )}

        {podeSugerir && sugestao && (
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-cobalto-claro p-3">
            <span className="flex h-12 w-10 shrink-0 items-center justify-center">
              <Foto tipo={sugestao.tipo} className="h-12 w-auto" />
            </span>
            <p className="flex-1 text-[13px] leading-snug">
              <span className="font-bold">
                Falta 1 {sugestao.tipo === "agua" ? "água" : "gás"} pro combo {sugestao.combo.nome}.
              </span>{" "}
              Adicione por {formatPreco(sugestao.tipo === "agua" ? r.precoAgua : r.precoGas)} e economize{" "}
              {formatPreco(sugestao.ganho)}.
            </p>
            <button
              type="button"
              onClick={() => somar(sugestao.tipo, 1)}
              className="h-11 shrink-0 rounded-full bg-cobalto px-4 text-[13px] font-bold text-white transition active:scale-95"
            >
              Adicionar
            </button>
          </div>
        )}

        <Link to="/" className="mt-1 flex h-11 items-center gap-2 text-[14px] font-semibold text-cobalto">
          <Plus className="h-4 w-4" strokeWidth={2.75} /> Adicionar mais itens
        </Link>
      </Bloco>

      <Bloco titulo="Entrega">
        <div className="mb-3 flex items-center gap-2.5">
          <MapPin className="h-4 w-4 shrink-0 text-cobalto" />
          <span className="flex-1 text-[13px] font-semibold">
            {cidade.nome} – {cidade.uf} · {mascaraCep(local.cep)}
          </span>
          <Link to="/" className="text-[13px] font-semibold text-cobalto">
            Trocar
          </Link>
        </div>
        <div className="grid grid-cols-[1fr_92px] gap-2">
          <Campo
            id="campo-rua"
            invalido={invalido("campo-rua")}
            rotulo="Rua"
            valor={f.rua}
            onChange={campo("rua")}
            autoComplete="address-line1"
          />
          <Campo
            id="campo-numero"
            invalido={invalido("campo-numero")}
            rotulo="Número"
            valor={f.numero}
            onChange={campo("numero")}
            inputMode="numeric"
          />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Campo id="campo-bairro" invalido={invalido("campo-bairro")} rotulo="Bairro" valor={f.bairro} onChange={campo("bairro")} />
          <Campo rotulo="Complemento" valor={f.complemento} onChange={campo("complemento")} opcional />
        </div>
        <div className="mt-2">
          <Campo rotulo="Ponto de referência" valor={f.referencia} onChange={campo("referencia")} opcional />
        </div>
      </Bloco>

      <Bloco titulo="Seus dados">
        <div className="space-y-2">
          <Campo
            id="campo-nome"
            invalido={invalido("campo-nome")}
            rotulo="Nome"
            valor={f.nome}
            onChange={campo("nome")}
            autoComplete="name"
          />
          <Campo
            id="campo-whatsapp"
            invalido={invalido("campo-whatsapp")}
            rotulo="WhatsApp com DDD"
            valor={f.whatsapp}
            onChange={(e) => setF((v) => ({ ...v, whatsapp: mascaraTelefone(e.target.value) }))}
            inputMode="tel"
            autoComplete="tel-national"
          />
        </div>
      </Bloco>

      <Bloco titulo="Pagamento na entrega">
        <div className="divide-y divide-linha" role="radiogroup">
          {PAGAMENTOS.map((p) => {
            const ativo = f.pagamento === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={ativo}
                onClick={() => setF((v) => ({ ...v, pagamento: p.id }))}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-papel">{p.icone}</span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold">{p.titulo}</span>
                  <span className="block text-[12px] text-apagado">{p.sub}</span>
                </span>
                <span
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 transition ${
                    ativo ? "border-tinta" : "border-linha"
                  }`}
                >
                  {ativo && <span className="h-2.5 w-2.5 rounded-full bg-tinta" />}
                </span>
              </button>
            );
          })}
        </div>
        {f.pagamento === "dinheiro" && (
          <div className="mt-2">
            <Campo rotulo="Troco para quanto?" valor={f.troco} onChange={campo("troco")} inputMode="decimal" opcional />
          </div>
        )}
      </Bloco>

      <Bloco titulo="Resumo">
        <dl className="space-y-2.5 text-[14px]">
          <LinhaValor rotulo="Itens" valor={formatPreco(t.itens)} />
          {t.vasilhames > 0 && <LinhaValor rotulo="Vasilhames novos" valor={formatPreco(t.vasilhames)} />}
          {t.desconto > 0 && <LinhaValor rotulo="Desconto de combo" valor={`−${formatPreco(t.desconto)}`} verde />}
          <LinhaValor
            rotulo="Entrega"
            valor={t.entrega > 0 ? formatPreco(t.entrega) : "Grátis"}
            verde={t.entrega === 0}
          />
          <div className="flex items-baseline justify-between border-t border-linha pt-3">
            <dt className="text-[15px] font-bold">Total</dt>
            <dd className="titulo-largo text-[24px] tabular-nums">{formatPreco(t.total)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-[12px] leading-relaxed text-apagado">
          Vendido e entregue por {r.nome}
          {r.cnpj && ` (CNPJ ${r.cnpj})`}. Você paga só quando receber.
        </p>
      </Bloco>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-linha bg-papel/95 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
        {tentou && erro && (
          <p role="alert" className="mb-2.5 flex items-center gap-2 text-[13px] font-semibold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {erro}
          </p>
        )}
        <button
          type="button"
          onClick={enviar}
          className="flex h-[58px] w-full items-center gap-3 rounded-2xl bg-tinta px-4 text-white shadow-[0_14px_34px_-12px_rgba(16,17,20,0.7)] transition active:scale-[0.99]"
        >
          <span className="flex-1 text-left text-[15px] font-bold">Enviar pedido</span>
          <span className="text-[15px] font-bold tabular-nums">{formatPreco(t.total)}</span>
        </button>
      </div>
    </AppShell>
  );
}

function Item(p: {
  foto: ReactNode;
  nome: string;
  preco: number;
  qtd: number;
  rotulo: string;
  onMais: () => void;
  onMenos: () => void;
  marcas: readonly string[];
  marca: string;
  idMarca: string;
  marcaInvalida: boolean;
  onMarca: (m: string) => void;
  temVazio: boolean;
  onVazio: (v: boolean) => void;
  textoVazio: string;
  extraSemVazio: number;
}) {
  return (
    <div className="py-4 first:pt-0">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-papel">{p.foto}</div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold">{p.nome}</p>
          <p className="text-[13px] text-apagado">{formatPreco(p.preco)} cada</p>
        </div>
        <Quantidade valor={p.qtd} rotulo={p.rotulo} onMais={p.onMais} onMenos={p.onMenos} />
      </div>

      <div
        id={p.idMarca}
        className={`mt-3 scroll-mt-28 rounded-xl transition ${p.marcaInvalida ? "bg-red-50 p-2.5 ring-1 ring-red-500" : "pt-1"}`}
      >
        <p className={`text-[13px] font-semibold ${p.marcaInvalida ? "text-red-700" : ""}`}>
          Marca{" "}
          <span className={`font-normal ${p.marcaInvalida ? "text-red-700" : "text-apagado"}`}>
            · {p.marcaInvalida ? "escolha uma pra continuar" : "escolha uma"}
          </span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {p.marcas.map((m) => (
            <Chip key={m} ativo={p.marca === m} onClick={() => p.onMarca(m)}>
              {m}
            </Chip>
          ))}
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-center justify-between gap-3">
        <span>
          <span className="block text-[14px] font-semibold">{p.textoVazio}</span>
          <span className="block text-[12px] text-apagado">
            {p.temVazio ? "Trocamos pelo cheio na entrega" : `Sem vazio: + ${formatPreco(p.extraSemVazio)} por unidade`}
          </span>
        </span>
        <input
          type="checkbox"
          checked={p.temVazio}
          onChange={(e) => p.onVazio(e.target.checked)}
          className="peer sr-only"
        />
        <span className="relative h-7 w-12 shrink-0 rounded-full bg-linha transition peer-checked:bg-tinta after:absolute after:left-0.5 after:top-0.5 after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-cobalto/40" />
      </label>
    </div>
  );
}

function LinhaValor({ rotulo, valor, verde }: { rotulo: string; valor: string; verde?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-apagado">{rotulo}</dt>
      <dd className={`font-semibold tabular-nums ${verde ? "text-ok" : "text-tinta"}`}>{valor}</dd>
    </div>
  );
}

function Enviado({ link }: { link: string }) {
  return (
    <AppShell>
      <div className="px-6 pt-24">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white">
          <MessageCircle className="h-7 w-7" />
        </div>
        <h1 className="titulo-largo mt-6 text-[34px]">
          Falta só
          <br />
          um toque.
        </h1>
        <p className="mt-4 max-w-[300px] text-[15px] leading-relaxed text-apagado">
          Abrimos o WhatsApp da revenda com o pedido pronto. Toque em enviar lá pra confirmar.
        </p>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-8 flex h-[54px] items-center justify-center gap-2 rounded-2xl bg-tinta text-[15px] font-bold text-white"
        >
          Abrir o WhatsApp de novo
        </a>
        <Link
          to="/"
          onClick={() => esvaziarSacola()}
          className="mt-2.5 flex h-[54px] items-center justify-center rounded-2xl bg-white text-[15px] font-bold ring-1 ring-linha"
        >
          Fazer outro pedido
        </Link>
      </div>
    </AppShell>
  );
}
