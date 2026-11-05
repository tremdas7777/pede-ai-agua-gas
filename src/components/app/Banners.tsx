import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { formatPreco } from "@/lib/catalogo";
import { Foto, FotoCombo } from "./Ilustracoes";

export type BannerId = "gas" | "agua" | "combo";

type Precos = { gas?: number; agua?: number; combo?: { total: number; economia: number } };

export function Banners({
  ordem,
  precos = {},
  onAcao,
}: {
  ordem: BannerId[];
  precos?: Precos;
  onAcao: (id: BannerId) => void;
}) {
  const trilho = useRef<HTMLDivElement>(null);
  const [atual, setAtual] = useState(0);
  const [parado, setParado] = useState(false);

  useEffect(() => {
    if (parado || ordem.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const el = trilho.current;
      if (!el) return;
      const proximo = (atual + 1) % ordem.length;
      el.scrollTo({ left: proximo * el.clientWidth, behavior: "smooth" });
    }, 5500);
    return () => window.clearInterval(id);
  }, [atual, parado, ordem.length]);

  return (
    <div>
      <div
        ref={trilho}
        onPointerDown={() => setParado(true)}
        onScroll={(e) => {
          const el = e.currentTarget;
          setAtual(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="sem-barra flex snap-x snap-mandatory overflow-x-auto"
        aria-roledescription="carrossel"
      >
        {ordem.map((id) => (
          <div key={id} className="w-full shrink-0 snap-center px-4">
            {id === "gas" && <BannerGas preco={precos.gas} onAcao={() => onAcao("gas")} />}
            {id === "agua" && <BannerAgua preco={precos.agua} onAcao={() => onAcao("agua")} />}
            {id === "combo" && <BannerCombo preco={precos.combo} onAcao={() => onAcao("combo")} />}
          </div>
        ))}
      </div>
      {ordem.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
          {ordem.map((id, i) => (
            <span
              key={id}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === atual ? "w-5 bg-tinta" : "w-1.5 bg-linha"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Moldura({ fundo, children }: { fundo: string; children: ReactNode }) {
  return <div className={`relative h-[200px] overflow-hidden rounded-[22px] ${fundo}`}>{children}</div>;
}

function Chamada({ children, onClick, estilo }: { children: ReactNode; onClick: () => void; estilo: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mt-auto inline-flex h-9 w-fit items-center gap-1.5 rounded-full px-4 text-[13px] font-bold transition active:scale-95 ${estilo}`}
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.75} />
    </button>
  );
}

function BannerGas({ preco, onAcao }: { preco?: number; onAcao: () => void }) {
  return (
    <Moldura fundo="bg-cobalto text-white">
      <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-cobalto-escuro" />
      <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full ring-[28px] ring-white/[0.06]" />
      <Foto
        tipo="gas"
        className="absolute -bottom-4 right-1 h-[184px] w-auto drop-shadow-[0_14px_14px_rgba(0,0,0,0.35)]"
      />
      <div className="relative flex h-full max-w-[58%] flex-col p-5">
        <p className="text-[12px] font-semibold text-white/65">Gás de cozinha P13</p>
        <p className="titulo-largo mt-2 text-[29px]">
          Acabou
          <br />o gás?
        </p>
        <p className="titulo-largo mt-0.5 text-[29px] text-sol">Pede Aí.</p>
        <Chamada onClick={onAcao} estilo="bg-white text-tinta">
          {preco ? `Pedir · ${formatPreco(preco)}` : "Pedir gás"}
        </Chamada>
      </div>
    </Moldura>
  );
}

function BannerAgua({ preco, onAcao }: { preco?: number; onAcao: () => void }) {
  return (
    <Moldura fundo="bg-sol text-tinta">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#f6b92a]" />
      <div className="absolute -bottom-3 right-3 flex items-end">
        <Foto tipo="agua" className="h-[136px] w-auto drop-shadow-[0_12px_12px_rgba(120,80,0,0.28)]" />
        <Foto tipo="agua" className="-ml-6 h-[174px] w-auto drop-shadow-[0_14px_14px_rgba(120,80,0,0.3)]" />
      </div>
      <div className="relative flex h-full max-w-[56%] flex-col p-5">
        <p className="text-[12px] font-semibold text-tinta/60">Água mineral 20 L</p>
        <p className="titulo-largo mt-2 text-[29px]">
          Galão
          <br />
          cheio,
          <br />
          sem sair.
        </p>
        <Chamada onClick={onAcao} estilo="bg-tinta text-white">
          {preco ? `Pedir · ${formatPreco(preco)}` : "Pedir água"}
        </Chamada>
      </div>
    </Moldura>
  );
}

function BannerCombo({
  preco,
  onAcao,
}: {
  preco?: { total: number; economia: number };
  onAcao: () => void;
}) {
  return (
    <Moldura fundo="bg-tinta text-white">
      <div className="absolute -bottom-28 -right-10 h-72 w-72 rounded-full bg-[#1b1d22]" />
      <div className="absolute -bottom-2 right-3">
        <FotoCombo gas={1} agua={1} altura="h-[150px]" />
      </div>
      <div className="relative flex h-full max-w-[52%] flex-col p-5">
        <p className="text-[12px] font-semibold text-sol">Combo da casa</p>
        <p className="titulo-largo mt-2 text-[29px]">
          Gás
          <br />+ Água
        </p>
        {preco ? (
          <p className="mt-2 leading-tight">
            <span className="block text-[17px] font-bold tabular-nums">{formatPreco(preco.total)}</span>
            <span className="block text-[12px] text-white/65">economize {formatPreco(preco.economia)}</span>
          </p>
        ) : (
          <p className="mt-2 text-[13px] text-white/70">Desconto no pedido junto</p>
        )}
        <Chamada onClick={onAcao} estilo="bg-sol text-tinta">
          {preco ? "Adicionar" : "Ver combos"}
        </Chamada>
      </div>
    </Moldura>
  );
}
