import { Check, Frown } from "lucide-react";
import { BeforeAfter } from "@/components/shop/BeforeAfter";

/** Blocos imagem + texto, na ordem da página de referência (os dois primeiros são WebP animado, como GIF). */
const BLOCOS = [
  {
    img: "/pijama/gif-fas.webp",
    alt: "Calça branca e calça cinza do pijama de dragão lado a lado",
    title: "Pijama de Dragão 🌟 – O queridinho dos fãs!",
    text: "Nossos pijamas de dragão conquistaram quem é fã do Banguela. Com muito conforto, felpa macia e estampa de dragão fofinha, viraram o pijama favorito de quem ama a saga.",
  },
  {
    img: "/pijama/gif-qualidade.webp",
    alt: "Mão passando no tecido felpudo da calça cinza",
    title: "Qualidade incomparável 🧵",
    text: "Feito com felpa macia e antialérgica, que dura e continua confortável por muito tempo. Nada de se preocupar com desgaste: o tecido é resistente e deixa você quentinho noite após noite.",
  },
  {
    img: "/pijama/destaque-conforto.webp",
    alt: "Casal no sofá com as calças de pijama de dragão",
    title: "Conforto pra todo mundo 👨‍👩‍👧‍👦",
    text: "Conheça o parceiro perfeito pro aconchego: o nosso Pijama de Dragão. Seja relaxando sozinho, agarradinho com o seu amor ou curtindo com a família, ele deixa todo mundo quentinho, confortável e feliz.",
  },
];

const VANTAGENS = [
  "Qualidade premium",
  "Troca em até 30 dias",
  "Veste no tamanho certo",
  "Materiais de qualidade",
];

const titulo = "text-[24px] font-bold leading-tight text-[var(--night)] md:text-[30px]";
const texto = "mt-3 text-[15px] leading-relaxed text-[var(--ink)]/75";

/** Descrição dos pijamas de calça no estilo da página de referência. */
export function PijamaDestaques() {
  return (
    <section className="mt-14 space-y-12 md:space-y-16">
      {BLOCOS.map((b, i) => (
        <div key={b.img} className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
          <img
            src={b.img}
            alt={b.alt}
            loading="lazy"
            className={`mx-auto w-full max-w-md rounded-[20px] object-cover ${i % 2 ? "md:order-2" : ""}`}
          />
          <div className="px-2 md:px-0">
            <h2 className={titulo}>{b.title}</h2>
            <p className={texto}>{b.text}</p>
          </div>
        </div>
      ))}

      <div>
        <h2 className={`${titulo} mb-5 text-center`}>Antes e depois</h2>
        <div className="mx-auto w-full max-w-md">
          <BeforeAfter
            left={{
              src: "/pijama/antes.webp",
              label: "Antes",
              alt: "Tecido de pijama comum gasto, com bolinhas",
            }}
            right={{
              src: "/pijama/depois.webp",
              label: "Depois",
              alt: "Felpa da calça cinza com o Banguela, macia e sem bolinhas",
            }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-xl">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-[18px] font-extrabold text-[var(--night)]">Pijama de Dragão</p>
            <p className="mt-1 text-[13px] text-[var(--ink)]/70">
              Feito pro conforto, pensado pros fãs
            </p>
          </div>
          <div>
            <p className="text-[18px] font-extrabold text-[var(--ink)]/55 line-through">Outros</p>
            <p className="mt-1 text-[13px] text-[var(--ink)]/70">
              Genéricos. Sem graça. Descartáveis.
            </p>
          </div>
        </div>
        <div className="mt-5 divide-y divide-[var(--border)] rounded-[20px] border border-[var(--border)]">
          {VANTAGENS.map((v) => (
            <div key={v} className="grid grid-cols-[1fr_auto_1fr] items-center py-3">
              <span className="grid place-items-center">
                <Check className="h-6 w-6 text-[var(--primary)]" strokeWidth={3} />
              </span>
              <span className="px-2 text-center text-[14px] font-bold text-[var(--night)]">
                {v}
              </span>
              <span className="grid place-items-center">
                <Frown className="h-6 w-6 text-[var(--ink)]/45" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
