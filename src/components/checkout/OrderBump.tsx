import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { ESSENCIA_AROMAS, ESSENCIA_FOTOS, getBundle } from "@/lib/bundles";
import type { BumpId, OrderBumpItem } from "@/lib/order-bump";
import { cn } from "@/lib/utils";
import { brl } from "./parts";

/** Texto de venda de cada order bump. */
const COPY: Record<
  BumpId,
  { question: string; body: ReactNode; benefits: string[]; cta: (price: string) => string }
> = {
  aneis: {
    question: "Que tal levar um presente para quem divide a jornada com você?",
    body: (
      <>
        O par de <b className="text-foreground">Anéis Promessa de Dragão</b> é feito em{" "}
        <b className="text-foreground">prata 925</b>, com ajuste livre. Um para você, outro para
        quem você ama — e já vem no estojo, pronto para presentear.
      </>
    ),
    benefits: [
      "Par de anéis em prata 925",
      "Ajuste livre: serve em qualquer dedo, sem medir",
      "Estojo de presente incluso",
      "Desconto que só aparece nesta tela",
    ],
    cta: (p) => `Sim! Quero o par de anéis por + ${p}`,
  },
  colares: {
    question: "Complete o pedido com um presente que combina?",
    body: (
      <>
        O <b className="text-foreground">Kit Colares de Dragão</b> traz dois pingentes que{" "}
        <b className="text-foreground">se encaixam</b> — um para cada pessoa. Chega na caixa de
        presente, junto com o seu pedido.
      </>
    ),
    benefits: [
      "Par de colares com pingentes que se encaixam",
      "Corrente banhada e antialérgica",
      "Caixa de presente inclusa",
      "Desconto que só aparece nesta tela",
    ],
    cta: (p) => `Sim! Quero o kit de colares por + ${p}`,
  },
};

/** Surge (aparece e sobe) quando o cliente rola até o elemento. Sem suporte, já fica visível. */
function useReveal(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(!enabled);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof IntersectionObserver === "undefined") return setShown(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);
  return { ref, shown };
}

type BumpCardProps = {
  img: string;
  alt: string;
  /** Nome curto, usado no "Adicionado!". */
  name: string;
  price: number;
  compareAt?: number | undefined;
  /** Faixa do topo. */
  tag?: string;
  question: string;
  body: ReactNode;
  benefits: readonly string[];
  cta: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  /** Surge com animação quando o cliente rola até ele (usado do segundo bump em diante). */
  reveal?: boolean;
  /** Conteúdo extra antes do preço (ex.: escolha de estampa). */
  children?: ReactNode;
  /** Linha abaixo do preço (envio). */
  nota?: string;
};

/** Cartão do order bump, logo acima do botão de finalizar. */
function BumpCard({
  img,
  alt,
  name,
  price,
  compareAt,
  tag = "Oferta exclusiva — só aparece nesta tela",
  question,
  body,
  benefits,
  cta,
  checked,
  onChange,
  reveal = false,
  children,
  nota = "Vai na mesma caixa do seu pedido — sem frete extra.",
}: BumpCardProps) {
  const { ref, shown } = useReveal(reveal);
  const off = compareAt ? Math.round((1 - price / compareAt) * 100) : 0;
  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-lg border-2 border-dashed transition-[border-color,background-color,opacity,translate] duration-700 ease-out motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        checked
          ? "border-[var(--ck-ok)] bg-[var(--ck-ok)]/[0.04]"
          : "border-amber-400 bg-amber-50/60",
      )}
    >
      <div className="bg-amber-400 px-4 py-1.5 text-center text-[12px] font-bold uppercase tracking-wide text-amber-950">
        {tag}
      </div>

      <div className="p-4">
        <p className="text-[14px] font-semibold leading-snug">{question}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{body}</p>

        <div className="mt-4 flex gap-4">
          <img
            src={img}
            alt={alt}
            width={88}
            height={88}
            loading="lazy"
            className="h-[88px] w-[88px] shrink-0 rounded-md border border-border bg-white object-contain"
          />
          <ul className="space-y-1.5 text-[12.5px] leading-snug">
            {benefits.map((b) => (
              <li key={b} className="flex gap-1.5">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--ck-ok)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {children}

        <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {compareAt && (
            <span className="text-[13px] text-muted-foreground line-through">{brl(compareAt)}</span>
          )}
          <span className="text-[20px] font-bold text-[var(--ck-ok)]">{brl(price)}</span>
          {off > 0 && (
            <span className="rounded bg-[var(--ck-badge)] px-1.5 py-0.5 text-[11px] font-bold text-[var(--ck-ok)]">
              {off}% OFF
            </span>
          )}
          <span className="w-full text-[12px] text-muted-foreground">{nota}</span>
        </div>

        <label
          className={cn(
            "mt-4 flex cursor-pointer items-center gap-3 rounded-md border-2 px-3 py-3 transition-colors",
            checked
              ? "border-[var(--ck-ok)] bg-white"
              : "border-amber-400 bg-white animate-pulse [animation-duration:2.5s]",
          )}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="h-5 w-5 shrink-0 accent-[var(--ck-ok)]"
          />
          <span className="text-[13.5px] font-semibold leading-snug">
            {checked ? `Adicionado ao seu pedido: ${name}.` : cta}
          </span>
        </label>
      </div>
    </div>
  );
}

/** Oferta adicional (order bump) de produto sem variação, logo acima do botão de finalizar. */
export function OrderBump({
  bump,
  checked,
  onChange,
  reveal = false,
}: {
  bump: OrderBumpItem;
  checked: boolean;
  onChange: (v: boolean) => void;
  reveal?: boolean;
}) {
  const copy = COPY[bump.id];
  return (
    <BumpCard
      img={bump.img}
      alt={bump.fullName}
      name={bump.name}
      price={bump.price}
      compareAt={bump.compareAt}
      question={copy.question}
      body={copy.body}
      benefits={copy.benefits}
      cta={copy.cta(brl(bump.price))}
      checked={checked}
      onChange={onChange}
      reveal={reveal}
    />
  );
}

/**
 * Order bump da máscara de dormir: uma oferta só, 1 por R$ 20,90 ou 2 por R$ 34,90, com a estampa de
 * cada máscara. Vai para o pedido como item comum ("mascara" ou "mascara2" + estampas), com o preço
 * do catálogo, validado no servidor.
 */
export function MascaraBump({
  estampas,
  onChange,
  reveal = false,
}: {
  /** Estampa de cada máscara escolhida: 0 = fora do pedido, 1 ou 2 máscaras. */
  estampas: readonly string[];
  onChange: (estampas: string[]) => void;
  reveal?: boolean;
}) {
  const [qtd, setQtd] = useState<1 | 2>(estampas.length === 2 ? 2 : 1);
  const um = getBundle("mascara");
  const dois = getBundle("mascara2");
  const opcoes = um.options[0]?.values ?? [];
  const fotos = um.optionImages ?? {};
  const atual = qtd === 2 ? dois : um;
  const checked = estampas.length > 0;
  // Ao escolher a quantidade, mantém o que já foi escolhido e completa com uma estampa diferente.
  const preencher = (n: 1 | 2) =>
    Array.from({ length: n }, (_, i) => estampas[i] ?? opcoes[i] ?? opcoes[0] ?? "");
  const escolherQtd = (n: 1 | 2) => {
    setQtd(n);
    onChange(preencher(n));
  };
  const escolherEstampa = (i: number, e: string) => {
    const novas = preencher(qtd);
    novas[i] = e;
    onChange(novas);
  };
  return (
    <BumpCard
      img={(estampas[0] && fotos[estampas[0]]) || um.img}
      alt={um.name}
      name={qtd === 2 ? "2 máscaras de dormir" : "Máscara de dormir"}
      price={atual.price}
      compareAt={atual.compareAtPrice}
      tag="Combina com o seu pijama"
      question="Que tal dormir ainda melhor?"
      body={
        <>
          A <b className="text-foreground">Máscara de Dormir Dragão</b> bloqueia a luz da janela, da
          TV e do celular para você pegar no sono mais rápido. Leve 1 ou 2 e escolha a estampa de
          cada uma:
        </>
      }
      benefits={[
        "Bloqueia a luz para dormir melhor",
        "7 estampas de dragão, das fofas às realistas",
        "Leve, com elástico que se ajusta à cabeça",
      ]}
      cta={
        qtd === 2
          ? `Sim! Quero 2 máscaras por + ${brl(dois.price)}`
          : `Sim! Quero a máscara por + ${brl(um.price)}`
      }
      checked={checked}
      onChange={(on) => onChange(on ? preencher(qtd) : [])}
      reveal={reveal}
    >
      <div className="mt-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Quantidade">
        {([1, 2] as const).map((n) => {
          const b = n === 2 ? dois : um;
          const on = qtd === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => escolherQtd(n)}
              className={cn(
                "rounded-md border-2 bg-white px-2 py-2 text-center leading-tight transition",
                on ? "border-[var(--ck-ok)]" : "border-border hover:border-amber-400",
              )}
            >
              <span className="block text-[13.5px] font-bold">
                {n} por {brl(b.price)}
              </span>
              <span className="block text-[11.5px] text-muted-foreground">
                {n === 1 ? "1 máscara" : `${brl(b.price / 2)} cada`}
              </span>
            </button>
          );
        })}
      </div>

      {Array.from({ length: qtd }, (_, i) => (
        <div key={i} className="mt-3">
          <p className="text-[12.5px] text-muted-foreground">
            {qtd === 2 ? `${i + 1}ª máscara` : "Estampa"}:{" "}
            <b className="text-foreground">{estampas[i] ?? "toque para escolher"}</b>
          </p>
          <div
            className="mt-1.5 grid grid-cols-7 gap-1.5"
            role="radiogroup"
            aria-label={`Estampa da ${i + 1}ª máscara`}
          >
            {opcoes.map((e) => (
              <button
                key={e}
                type="button"
                role="radio"
                aria-checked={estampas[i] === e}
                title={e}
                onClick={() => escolherEstampa(i, e)}
                className={cn(
                  "overflow-hidden rounded border-2 bg-white transition",
                  estampas[i] === e
                    ? "border-[var(--ck-ok)]"
                    : "border-border hover:border-amber-400",
                )}
              >
                <img
                  src={fotos[e] ?? um.img}
                  alt={e}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      ))}
    </BumpCard>
  );
}

/** Escolha da essência: 3 frascos com os aromas escolhidos ou o kit com os 10. */
export type EssenciaEscolha = { n: 3; aromas: string[] } | { n: 10 };

/** Aromas que já vêm marcados nas 3 essências (o cliente troca tocando nos outros). */
const AROMAS_INICIAIS = ["Lavanda", "Jasmim", "Dama da Noite"];

/**
 * Order bump das essências, só com umidificador no pedido: 3 por R$ 34,90 (o cliente escolhe 3
 * aromas diferentes) ou o kit com as 10 por R$ 99,90. Vai para o pedido como item comum
 * ("essencia3" + aromas ou "essencia10"), com o preço do catálogo, validado no servidor.
 */
export function EssenciaBump({
  escolha,
  onChange,
  reveal = false,
}: {
  /** null = fora do pedido. */
  escolha: EssenciaEscolha | null;
  onChange: (e: EssenciaEscolha | null) => void;
  reveal?: boolean;
}) {
  const tres = getBundle("essencia3");
  const dez = getBundle("essencia10");
  const [n, setN] = useState<3 | 10>(escolha?.n ?? 3);
  const [aromas, setAromas] = useState<string[]>(
    escolha?.n === 3 ? escolha.aromas : AROMAS_INICIAIS,
  );
  const checked = escolha !== null;
  const atual = n === 10 ? dez : tres;
  const valor = (qtd: 3 | 10, lista: string[]): EssenciaEscolha =>
    qtd === 10 ? { n: 10 } : { n: 3, aromas: lista };
  const escolherKit = (qtd: 3 | 10) => {
    setN(qtd);
    if (checked) onChange(valor(qtd, aromas));
  };
  // Sempre 3 aromas diferentes: tocar num que não está escolhido troca o mais antigo. Só a caixa de
  // seleção põe a oferta no pedido; trocar aroma com ela marcada atualiza o item.
  const tocarAroma = (a: string) => {
    if (aromas.includes(a)) return;
    const novos = [...aromas.slice(1), a];
    setAromas(novos);
    if (checked) onChange(valor(3, novos));
  };
  const marcar = (on: boolean) => onChange(on ? valor(n, aromas) : null);
  return (
    <BumpCard
      img={dez.img}
      alt="Essências para umidificador"
      name={n === 10 ? "Kit com as 10 essências" : "3 essências"}
      price={atual.price}
      tag="Combina com o seu umidificador"
      question="Quer deixar o quarto perfumado também?"
      body={
        <>
          As <b className="text-foreground">essências à base de água</b> são para usar no
          umidificador de dragão e deixar o ambiente cheiroso. Leve 3 e escolha os aromas, ou o kit
          com os 10:
        </>
      }
      benefits={[
        "Frascos de 15 ml à base de água",
        "10 aromas: lavanda, jasmim, dama da noite e mais",
        "Para usar no umidificador de dragão",
      ]}
      cta={
        n === 10
          ? `Sim! Quero as 10 essências por + ${brl(dez.price)}`
          : `Sim! Quero 3 essências por + ${brl(tres.price)}`
      }
      checked={checked}
      onChange={marcar}
      reveal={reveal}
      nota="Sem frete extra."
    >
      <div className="mt-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Kit de essências">
        {([3, 10] as const).map((q) => {
          const b = q === 10 ? dez : tres;
          const on = n === q;
          return (
            <button
              key={q}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => escolherKit(q)}
              className={cn(
                "rounded-md border-2 bg-white px-2 py-2 text-center leading-tight transition",
                on ? "border-[var(--ck-ok)]" : "border-border hover:border-amber-400",
              )}
            >
              <span className="block text-[13.5px] font-bold">
                {q === 10 ? "As 10" : "3"} por {brl(b.price)}
              </span>
              <span className="block text-[11.5px] text-muted-foreground">
                {q === 10 ? `${brl(b.price / 10)} cada · melhor custo` : "você escolhe os aromas"}
              </span>
            </button>
          );
        })}
      </div>

      {n === 3 ? (
        <div className="mt-3">
          <p className="text-[12.5px] text-muted-foreground">
            Seus 3 aromas: <b className="text-foreground">{aromas.join(", ")}</b>
            <span className="block text-[11.5px]">Toque em outro aroma para trocar.</span>
          </p>
          <div className="mt-1.5 grid grid-cols-5 gap-1.5" role="group" aria-label="Aromas">
            {ESSENCIA_AROMAS.map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={aromas.includes(a)}
                title={a}
                onClick={() => tocarAroma(a)}
                className={cn(
                  "overflow-hidden rounded border-2 bg-white transition",
                  aromas.includes(a)
                    ? "border-[var(--ck-ok)]"
                    : "border-border hover:border-amber-400",
                )}
              >
                <img
                  src={ESSENCIA_FOTOS[a]}
                  alt=""
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
                <span className="block px-0.5 pb-1 text-center text-[10px] leading-tight">{a}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-[12.5px] text-muted-foreground">
          Vem um frasco de cada: {ESSENCIA_AROMAS.join(", ")}.
        </p>
      )}
    </BumpCard>
  );
}
