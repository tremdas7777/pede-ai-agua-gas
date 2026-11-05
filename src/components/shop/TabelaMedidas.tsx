import { useState } from "react";
import { Ruler } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  CALCA_ADULTO,
  CALCA_INFANTIL,
  CAMISETA_ADULTO,
  CAMISETA_INFANTIL,
  KIGURUMI_ADULTO,
  KIGURUMI_INFANTIL,
  type Peca,
} from "@/lib/medidas";
import { cn } from "@/lib/utils";

type Grade = { colunas: readonly string[]; linhas: readonly (readonly string[])[] };

function Tabela({ titulo, t }: { titulo: string; t: Grade }) {
  return (
    <div>
      <p className="mb-1.5 text-[14px] font-extrabold text-[var(--night)]">{titulo}</p>
      <table className="w-full text-center text-[13px]">
        <thead>
          <tr className="bg-[var(--mint)] text-[var(--night)]">
            {t.colunas.map((c, i) => (
              <th
                key={c}
                className={cn(
                  "px-2 py-2 font-extrabold",
                  i === 0 && "rounded-l-xl text-left",
                  i === t.colunas.length - 1 && "rounded-r-xl",
                )}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {t.linhas.map((l) => (
            <tr key={l[0]} className="border-b border-black/5 last:border-0">
              {l.map((v, i) => (
                <td
                  key={i}
                  className={cn(
                    "px-2 py-2",
                    i === 0 ? "text-left font-bold text-[var(--night)]" : "",
                  )}
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Botão "Tabela de medidas" que abre as medidas da camiseta e da calça, adulto e infantil. */
export function TabelaMedidas({
  pecas,
  infantilPrimeiro = false,
}: {
  pecas: readonly Peca[];
  infantilPrimeiro?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [aba, setAba] = useState<"adulto" | "infantil">(infantilPrimeiro ? "infantil" : "adulto");
  const adulto = aba === "adulto";
  // Kigurumi: a tabela é do corpo (altura e peso), não da peça.
  const corpo = pecas.includes("kigurumi");
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--night)] underline underline-offset-2"
      >
        <Ruler className="h-4 w-4" /> Tabela de medidas
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] w-[calc(100%-24px)] max-w-md gap-3 overflow-y-auto rounded-3xl p-5">
          <DialogTitle className="text-[20px] font-extrabold text-[var(--night)]">
            Tabela de medidas
          </DialogTitle>
          <DialogDescription className="text-[13px] text-black/60">
            {corpo
              ? "Escolha pela altura de quem vai usar. A modelagem é soltinha no corpo."
              : "Medidas da peça em centímetros. Compare com um pijama que fica bem em você."}
          </DialogDescription>
          <div className="grid grid-cols-2 gap-2 rounded-full bg-black/5 p-1">
            {(["adulto", "infantil"] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAba(a)}
                className={cn(
                  "rounded-full py-2 text-[13px] font-extrabold",
                  aba === a ? "bg-[var(--night)] text-white" : "text-[var(--night)]",
                )}
              >
                {a === "adulto" ? "Adulto" : "Infantil"}
              </button>
            ))}
          </div>
          {corpo && (
            <Tabela
              titulo={adulto ? "Adulto e plus size" : "Infantil"}
              t={adulto ? KIGURUMI_ADULTO : KIGURUMI_INFANTIL}
            />
          )}
          {pecas.includes("camiseta") && (
            <Tabela titulo="Camiseta" t={adulto ? CAMISETA_ADULTO : CAMISETA_INFANTIL} />
          )}
          {pecas.includes("calca") && (
            <Tabela titulo="Calça" t={adulto ? CALCA_ADULTO : CALCA_INFANTIL} />
          )}
          {corpo && (
            <div className="rounded-2xl bg-[var(--mint)] p-3 text-[12px] leading-relaxed text-[var(--night)]">
              <p>
                {adulto
                  ? "Ficou entre dois tamanhos? Escolha o maior, para mais conforto."
                  : "Para criança, use a altura como principal referência."}{" "}
                As medidas podem variar de 1 a 3 cm.
              </p>
            </div>
          )}
          <div
            className={cn(
              "rounded-2xl bg-[var(--mint)] p-3 text-[12px] leading-relaxed text-[var(--night)]",
              corpo && "hidden",
            )}
          >
            <p className="mb-1 font-extrabold">Como medir (peça esticada na mesa)</p>
            {pecas.includes("camiseta") && (
              <p>
                <b>Largura:</b> de uma axila à outra. <b>Comprimento:</b> do ombro até a barra.
              </p>
            )}
            {pecas.includes("calca") && (
              <p>
                <b>Cintura:</b> de ponta a ponta do cós, sem esticar o elástico.{" "}
                {adulto && (
                  <>
                    <b>Quadril:</b> de lado a lado na parte mais larga.{" "}
                  </>
                )}
                <b>Comprimento:</b> do cós até a barra.
              </p>
            )}
            <p className="mt-1">
              Ficou entre dois tamanhos? Escolha o maior. As medidas podem variar de 1 a 2 cm.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Tabela de medidas do kigurumi aberta na página (altura e peso), além do botão. */
export function MedidasKigurumi() {
  return (
    <section className="mx-auto mt-14 max-w-3xl">
      <h2 className="text-center text-[22px] font-bold text-[var(--night)] md:text-[28px]">
        Tabela de medidas
      </h2>
      <p className="mt-2 text-center text-[15px] text-[var(--ink)]/70">
        Escolha pela altura de quem vai usar. A modelagem é soltinha no corpo.
      </p>
      <div className="mt-6 grid gap-6 rounded-[20px] border border-[var(--border)] bg-white p-4 md:grid-cols-2 md:p-6">
        <Tabela titulo="Adulto e plus size" t={KIGURUMI_ADULTO} />
        <Tabela titulo="Infantil" t={KIGURUMI_INFANTIL} />
      </div>
      <div className="mt-3 rounded-2xl bg-[var(--mint)] p-4 text-[13px] leading-relaxed text-[var(--night)]">
        <p>
          <b>Ficou entre dois tamanhos?</b> Escolha o maior, para mais conforto. Para criança, use a
          altura como principal referência.
        </p>
        <p className="mt-1">
          As medidas podem variar de 1 a 3 cm. Lavar com água fria, sem alvejante, e secar à sombra.
        </p>
      </div>
    </section>
  );
}
