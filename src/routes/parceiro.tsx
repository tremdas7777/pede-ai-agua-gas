import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AlertCircle, ArrowLeft, BadgeCheck, CircleAlert, Loader2, MessageCircle, Store, Wallet } from "lucide-react";
import { brand } from "@/lib/brand";
import { formatPreco, marcasAgua, marcasGas } from "@/lib/catalogo";
import { horariosTexto } from "@/lib/cidades";
import { cnpjValido, consultarCnpj, limparCnpj, mascaraCnpj, vendeGlp, type DadosCnpj } from "@/lib/cnpj";
import { linhaCsv, validarLinha, type LinhaCsv } from "@/lib/parceiros-csv";
import { mascaraTelefone, soDigitos } from "@/lib/local";
import { formatWhatsapp, whatsappLink } from "@/lib/whatsapp";
import { AppShell, Bloco, Campo, Chip } from "@/components/app/Partes";

export const Route = createFileRoute("/parceiro")({
  head: () => ({
    meta: [
      { title: `Seja parceiro | ${brand.name}` },
      {
        name: "description",
        content: "Cadastre sua revenda de gás ou água mineral e receba pedidos da sua cidade pelo WhatsApp.",
      },
    ],
  }),
  component: Page,
});

type Consulta =
  | { estado: "ocioso" }
  | { estado: "carregando" }
  | { estado: "ok"; dados: DadosCnpj }
  | { estado: "nao_encontrado" }
  | { estado: "falhou" };

const PRAZOS = ["20-40", "30-50", "40-60", "60-90"];

function Page() {
  const [link, setLink] = useState("");
  if (link) return <Enviado link={link} />;
  return <Formulario onEnviado={setLink} />;
}

function Formulario({ onEnviado }: { onEnviado: (link: string) => void }) {
  const [cnpj, setCnpj] = useState("");
  const [consulta, setConsulta] = useState<Consulta>({ estado: "ocioso" });
  const [f, setF] = useState({
    fantasia: "",
    anp: "",
    cidade: "",
    uf: "",
    endereco: "",
    dias: "seg-sab",
    abre: "07:00",
    fecha: "20:00",
    domingo: false,
    abreDom: "08:00",
    fechaDom: "12:00",
    prazo: "30-50",
    precoGas: "",
    precoCasco: "",
    precoAgua: "",
    precoVasilhame: "",
    taxa: "0",
    responsavel: "",
    whatsapp: "",
  });
  const [vende, setVende] = useState({ gas: true, agua: true });
  const [mGas, setMGas] = useState<string[]>([]);
  const [mAgua, setMAgua] = useState<string[]>([]);
  const [declara, setDeclara] = useState(false);
  const [tentou, setTentou] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((v) => ({ ...v, [k]: e.target.value }));
  const alternar = (setLista: React.Dispatch<React.SetStateAction<string[]>>, m: string) =>
    setLista((l) => (l.includes(m) ? l.filter((x) => x !== m) : [...l, m]));

  useEffect(() => {
    if (!cnpjValido(cnpj)) {
      setConsulta({ estado: "ocioso" });
      return;
    }
    let ativo = true;
    setConsulta({ estado: "carregando" });
    consultarCnpj(cnpj)
      .then((dados) => {
        if (!ativo) return;
        if (!dados) return setConsulta({ estado: "nao_encontrado" });
        setConsulta({ estado: "ok", dados });
        setF((v) => ({
          ...v,
          fantasia: v.fantasia || dados.nomeFantasia || dados.razaoSocial,
          cidade: v.cidade || titulo(dados.municipio),
          uf: v.uf || dados.uf,
          endereco:
            v.endereco ||
            [titulo(`${dados.logradouro}, ${dados.numero}`), titulo(dados.bairro)].filter(Boolean).join(" - "),
        }));
      })
      .catch(() => ativo && setConsulta({ estado: "falhou" }));
    return () => {
      ativo = false;
    };
  }, [cnpj]);

  const [prazoMin, prazoMax] = f.prazo.split("-");
  const linha: LinhaCsv = {
    cidade: f.cidade.trim(),
    uf: f.uf.trim().toUpperCase(),
    revenda: f.fantasia.trim(),
    cnpj: mascaraCnpj(cnpj),
    autorizacao_anp: vende.gas ? f.anp.trim() : "",
    endereco: f.endereco.trim(),
    whatsapp: soDigitos(f.whatsapp),
    dias_semana: f.dias,
    abre_semana: f.abre,
    fecha_semana: f.fecha,
    abre_domingo: f.domingo && f.dias !== "seg-dom" ? f.abreDom : "",
    fecha_domingo: f.domingo && f.dias !== "seg-dom" ? f.fechaDom : "",
    prazo_min: prazoMin,
    prazo_max: prazoMax,
    preco_gas: vende.gas ? f.precoGas : "",
    preco_casco_gas: vende.gas ? f.precoCasco : "",
    preco_agua: vende.agua ? f.precoAgua : "",
    preco_vasilhame_agua: vende.agua ? f.precoVasilhame : "",
    taxa_entrega: f.taxa,
    marcas_gas: vende.gas ? mGas.join("|") : "",
    marcas_agua: vende.agua ? mAgua.join("|") : "",
    descontos_combo: "",
  };
  const validacao = validarLinha(linha);

  const erro =
    (!cnpjValido(cnpj) && "Informe um CNPJ válido.") ||
    (consulta.estado === "carregando" && "Aguarde a consulta do CNPJ.") ||
    (consulta.estado === "nao_encontrado" && "CNPJ não encontrado na Receita.") ||
    (consulta.estado === "ok" && consulta.dados.situacao !== "ATIVA" && `CNPJ com situação ${consulta.dados.situacao}.`) ||
    (!vende.gas && !vende.agua && "Marque se vende gás, água ou os dois.") ||
    (vende.gas && !declara && "Confirme a declaração da autorização ANP.") ||
    (f.responsavel.trim().length < 3 && "Informe o nome do responsável.") ||
    (validacao.tipo === "erro" && primeiraLetra(validacao.erros[0])) ||
    "";

  function enviar() {
    setTentou(true);
    if (erro || validacao.tipo !== "ok") return;
    const r = validacao.cidade.revenda;
    const receita =
      consulta.estado === "ok"
        ? `${consulta.dados.razaoSocial} — ${consulta.dados.situacao} na Receita${
            vende.gas ? ` · CNAE de GLP: ${vendeGlp(consulta.dados) ? "sim" : "NÃO"}` : ""
          }`
        : "não deu pra consultar a Receita agora";
    const texto = [
      `*Cadastro de parceiro — ${brand.name}*`,
      "",
      `Revenda: ${r.nome}`,
      `CNPJ: ${r.cnpj} (${receita})`,
      vende.gas && `Autorização ANP: ${r.autorizacaoAnp}`,
      `Cidade: ${validacao.cidade.nome}/${validacao.cidade.uf}`,
      `Endereço: ${r.endereco}`,
      vende.gas && `Gás P13: ${formatPreco(r.precoGas)} · sem vazio ${formatPreco(r.precoCascoGas)} · ${r.marcasGas.join(", ")}`,
      vende.agua &&
        `Água 20 L: ${formatPreco(r.precoAgua)} · sem galão ${formatPreco(r.precoVasilhameAgua)} · ${r.marcasAgua.join(", ")}`,
      `Horário: ${horariosTexto(r)}`,
      `Prazo: ${r.prazoMin}–${r.prazoMax} min · Entrega: ${r.taxaEntrega > 0 ? formatPreco(r.taxaEntrega) : "grátis"}`,
      `Responsável: ${f.responsavel.trim()} · ${formatWhatsapp(r.whatsapp)}`,
      "",
      "Linha da planilha:",
      linhaCsv(linha),
    ].filter((l): l is string => typeof l === "string");
    const url = whatsappLink(brand.whatsapp.phoneE164, texto.join("\n"));
    window.open(url, "_blank", "noopener");
    onEnviado(url);
  }

  return (
    <AppShell>
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-linha bg-papel/95 px-4 py-3 backdrop-blur-md">
        <Link
          to="/"
          aria-label="Voltar"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-linha active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="titulo-largo text-[22px]">Seja parceiro</span>
      </header>

      <section className="px-4 pb-6 pt-7">
        <h1 className="titulo-largo text-[36px]">
          Sua revenda
          <br />
          no <span className="text-cobalto">Pede Aí.</span>
        </h1>
        <p className="mt-4 max-w-[320px] text-[15px] leading-relaxed text-apagado">
          Receba pedidos de gás e água mineral da sua cidade direto no seu WhatsApp.
        </p>
        <ul className="mt-5 space-y-3">
          <Vantagem icone={<MessageCircle className="h-5 w-5" />}>Pedido chega pronto, com endereço e marca</Vantagem>
          <Vantagem icone={<Store className="h-5 w-5" />}>Você define preço, horário e prazo</Vantagem>
          <Vantagem icone={<Wallet className="h-5 w-5" />}>O cliente paga direto pra você na entrega</Vantagem>
        </ul>
      </section>

      <Bloco titulo="Empresa" sub="Consultamos o CNPJ na Receita Federal.">
        <Campo
          rotulo="CNPJ"
          valor={mascaraCnpj(cnpj)}
          onChange={(e) => setCnpj(limparCnpj(e.target.value))}
          placeholder="00.000.000/0000-00"
        />
        <ResultadoCnpj consulta={consulta} vendeGas={vende.gas} />
        <div className="mt-2 space-y-2">
          <Campo rotulo="Nome que aparece no app" valor={f.fantasia} onChange={set("fantasia")} />
        </div>
      </Bloco>

      <Bloco titulo="O que você vende">
        <div className="flex gap-2">
          <Chip ativo={vende.gas} onClick={() => setVende((v) => ({ ...v, gas: !v.gas }))}>
            Gás P13
          </Chip>
          <Chip ativo={vende.agua} onClick={() => setVende((v) => ({ ...v, agua: !v.agua }))}>
            Água 20 L
          </Chip>
        </div>

        {vende.gas && (
          <div className="mt-5">
            <p className="text-[14px] font-bold">Gás de cozinha</p>
            <div className="mt-2 space-y-2">
              <Campo rotulo="Nº da autorização ANP (revenda de GLP)" valor={f.anp} onChange={set("anp")} />
              <div className="grid grid-cols-2 gap-2">
                <Campo rotulo="Preço na troca" valor={f.precoGas} onChange={set("precoGas")} inputMode="decimal" placeholder="R$" />
                <Campo rotulo="Preço sem vazio" valor={f.precoCasco} onChange={set("precoCasco")} inputMode="decimal" placeholder="R$" />
              </div>
            </div>
            <p className="mt-3 text-[12px] font-semibold text-apagado">Marcas</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {marcasGas.map((m) => (
                <Chip key={m} ativo={mGas.includes(m)} onClick={() => alternar(setMGas, m)}>
                  {m}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {vende.agua && (
          <div className="mt-5">
            <p className="text-[14px] font-bold">Água mineral</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Campo rotulo="Preço na troca" valor={f.precoAgua} onChange={set("precoAgua")} inputMode="decimal" placeholder="R$" />
              <Campo rotulo="Preço sem galão" valor={f.precoVasilhame} onChange={set("precoVasilhame")} inputMode="decimal" placeholder="R$" />
            </div>
            <p className="mt-3 text-[12px] font-semibold text-apagado">Marcas</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {marcasAgua.map((m) => (
                <Chip key={m} ativo={mAgua.includes(m)} onClick={() => alternar(setMAgua, m)}>
                  {m}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </Bloco>

      <Bloco titulo="Atendimento">
        <div className="grid grid-cols-[1fr_72px] gap-2">
          <Campo rotulo="Cidade" valor={f.cidade} onChange={set("cidade")} />
          <Campo rotulo="UF" valor={f.uf} onChange={(e) => setF((v) => ({ ...v, uf: e.target.value.toUpperCase().slice(0, 2) }))} />
        </div>
        <div className="mt-2">
          <Campo rotulo="Endereço da revenda" valor={f.endereco} onChange={set("endereco")} />
        </div>

        <p className="mt-4 text-[12px] font-semibold text-apagado">Dias de atendimento</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {[
            ["seg-sex", "Seg a Sex"],
            ["seg-sab", "Seg a Sáb"],
            ["seg-dom", "Todos os dias"],
          ].map(([id, rotulo]) => (
            <Chip key={id} ativo={f.dias === id} onClick={() => setF((v) => ({ ...v, dias: id }))}>
              {rotulo}
            </Chip>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Campo rotulo="Abre" type="time" valor={f.abre} onChange={set("abre")} />
          <Campo rotulo="Fecha" type="time" valor={f.fecha} onChange={set("fecha")} />
        </div>
        {f.dias !== "seg-dom" && (
          <>
            <label className="mt-4 flex cursor-pointer items-center justify-between gap-3">
              <span className="text-[14px] font-semibold">Abre no domingo</span>
              <input
                type="checkbox"
                checked={f.domingo}
                onChange={(e) => setF((v) => ({ ...v, domingo: e.target.checked }))}
                className="peer sr-only"
              />
              <span className="relative h-7 w-12 shrink-0 rounded-full bg-linha transition peer-checked:bg-tinta after:absolute after:left-0.5 after:top-0.5 after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-5" />
            </label>
            {f.domingo && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Campo rotulo="Abre domingo" type="time" valor={f.abreDom} onChange={set("abreDom")} />
                <Campo rotulo="Fecha domingo" type="time" valor={f.fechaDom} onChange={set("fechaDom")} />
              </div>
            )}
          </>
        )}

        <p className="mt-4 text-[12px] font-semibold text-apagado">Prazo médio de entrega</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {PRAZOS.map((p) => (
            <Chip key={p} ativo={f.prazo === p} onClick={() => setF((v) => ({ ...v, prazo: p }))}>
              {p.replace("-", "–")} min
            </Chip>
          ))}
        </div>
        <div className="mt-2">
          <Campo rotulo="Taxa de entrega (0 = grátis)" valor={f.taxa} onChange={set("taxa")} inputMode="decimal" />
        </div>
      </Bloco>

      <Bloco titulo="Contato">
        <div className="space-y-2">
          <Campo rotulo="Responsável" valor={f.responsavel} onChange={set("responsavel")} autoComplete="name" />
          <Campo
            rotulo="WhatsApp que recebe os pedidos"
            valor={f.whatsapp}
            onChange={(e) => setF((v) => ({ ...v, whatsapp: mascaraTelefone(e.target.value) }))}
            inputMode="tel"
            autoComplete="tel-national"
          />
        </div>
        {vende.gas && (
          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={declara}
              onChange={(e) => setDeclara(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-tinta"
            />
            <span className="text-[13px] leading-snug text-apagado">
              Declaro que a revenda tem autorização da ANP para revender GLP e que as informações acima são verdadeiras.
            </span>
          </label>
        )}
      </Bloco>

      <p className="px-4 pt-4 text-[12px] leading-relaxed text-apagado">
        A gente confere os dados e responde pelo WhatsApp. A cidade só entra no app depois da aprovação.
      </p>

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
          className="flex h-[58px] w-full items-center justify-center rounded-2xl bg-tinta text-[15px] font-bold text-white shadow-[0_14px_34px_-12px_rgba(16,17,20,0.7)] transition active:scale-[0.99]"
        >
          Enviar cadastro
        </button>
      </div>
    </AppShell>
  );
}

function ResultadoCnpj({ consulta, vendeGas }: { consulta: Consulta; vendeGas: boolean }) {
  if (consulta.estado === "ocioso") return null;
  if (consulta.estado === "carregando")
    return (
      <p className="mt-2 flex items-center gap-2 text-[13px] text-apagado">
        <Loader2 className="h-4 w-4 animate-spin" /> Consultando a Receita…
      </p>
    );
  if (consulta.estado === "nao_encontrado")
    return <p className="mt-2 text-[13px] font-semibold text-red-700">CNPJ não encontrado na Receita.</p>;
  if (consulta.estado === "falhou")
    return (
      <p className="mt-2 text-[13px] text-apagado">Não deu pra consultar a Receita agora. Pode seguir; conferimos depois.</p>
    );
  const d = consulta.dados;
  const ativa = d.situacao === "ATIVA";
  return (
    <div className="mt-2 rounded-xl bg-papel p-3">
      <p className="text-[14px] font-bold leading-snug">{d.razaoSocial}</p>
      <p className="mt-0.5 text-[12px] text-apagado">
        {titulo(d.municipio)}/{d.uf} · {d.cnaePrincipal}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Selo ok={ativa}>{ativa ? "CNPJ ativo" : `Situação: ${d.situacao}`}</Selo>
        {vendeGas && <Selo ok={vendeGlp(d)}>{vendeGlp(d) ? "Revenda de GLP na Receita" : "Sem CNAE de revenda de GLP"}</Selo>}
      </div>
    </div>
  );
}

function Selo({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        ok ? "bg-[#e3f4ea] text-ok" : "bg-[#fff4d6] text-[#7a5300]"
      }`}
    >
      {ok ? <BadgeCheck className="h-3.5 w-3.5" /> : <CircleAlert className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

function Vantagem({ icone, children }: { icone: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-linha">
        {icone}
      </span>
      <span className="text-[14px] font-semibold">{children}</span>
    </li>
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
          Cadastro
          <br />
          quase enviado.
        </h1>
        <p className="mt-4 max-w-[300px] text-[15px] leading-relaxed text-apagado">
          Abrimos o WhatsApp com seus dados prontos. Toque em enviar lá; a gente confere e responde por lá.
        </p>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-8 flex h-[54px] items-center justify-center rounded-2xl bg-tinta text-[15px] font-bold text-white"
        >
          Abrir o WhatsApp de novo
        </a>
        <Link
          to="/"
          className="mt-2.5 flex h-[54px] items-center justify-center rounded-2xl bg-white text-[15px] font-bold ring-1 ring-linha"
        >
          Voltar ao início
        </Link>
      </div>
    </AppShell>
  );
}

/** "VITORIA DA CONQUISTA" → "Vitoria Da Conquista" (preposições em minúsculas). */
function titulo(s: string) {
  return s
    .toLowerCase()
    .replace(/(^|\s)(\S)/g, (_, a, b) => a + b.toUpperCase())
    .replace(/\s(Da|De|Do|Das|Dos|E)\s/g, (m) => m.toLowerCase());
}

function primeiraLetra(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}
