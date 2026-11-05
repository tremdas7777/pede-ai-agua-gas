import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { StoreSelect } from "@/components/shop/StoreSelect";
import {
  brl,
  getBundle,
  isFreeShippingEligible,
  PANTUFA_NUMEROS,
  PANTUFA_P_FOTOS,
} from "@/lib/bundles";
import { pacotePantufas, PANTUFA_PACOTES, type ParPantufa } from "@/lib/combo-extras";
import { cn } from "@/lib/utils";

const GRUPOS = [
  { label: "Infantil", numeros: PANTUFA_NUMEROS.filter((n) => Number(n) <= 34) },
  { label: "Adulto", numeros: PANTUFA_NUMEROS.filter((n) => Number(n) > 34) },
];

/**
 * Popup do "Comprar" nos pijamas: oferece as pantufas que combinam com os pijamas escolhidos (já
 * marcadas). Saem em pacote de 2 ou 4 pares; o cliente só escolhe a numeração e pode desmarcar as
 * que não quer.
 */
export function OfertaPantufas({
  open,
  personagens,
  rotulos,
  descricao,
  infantilPrimeiro = false,
  productPrice,
  onClose,
  onContinue,
}: {
  open: boolean;
  /** Personagem de cada pantufa sugerida, na ordem. */
  personagens: readonly string[];
  /** Linha embaixo do nome de cada pantufa ("do 1º pijama"). */
  rotulos?: readonly string[];
  /** Por que essas pantufas (ex.: "nas cores do seu pijama"). */
  descricao: string;
  /** Pijama infantil: a numeração infantil aparece primeiro. */
  infantilPrimeiro?: boolean;
  /** Total do pedido sem as pantufas, para avisar quando elas liberam o frete grátis. */
  productPrice: number;
  onClose: () => void;
  onContinue: (pares: ParPantufa[]) => void;
}) {
  const [sel, setSel] = useState<boolean[]>([]);
  const [num, setNum] = useState<string[]>([]);
  const [nudge, setNudge] = useState(false);
  // Ao abrir: todas as pantufas marcadas, sem numeração ainda.
  const chave = personagens.join("|");
  useEffect(() => {
    if (!open) return;
    setSel(personagens.map(() => true));
    setNum(personagens.map(() => ""));
    setNudge(false);
  }, [open, chave]); // eslint-disable-line react-hooks/exhaustive-deps

  const escolhidas = personagens.flatMap((p, i) => (sel[i] ? [i] : []));
  const pacote = pacotePantufas(escolhidas.length);
  const total = pacote ? getBundle(pacote.id).price : 0;
  const completo = !!pacote && escolhidas.every((i) => num[i]);
  const opcoes = PANTUFA_PACOTES.filter((p) => p.pares <= personagens.length);
  const precos = opcoes.map((p) => `${p.pares} pares por ${brl(getBundle(p.id).price)}`);
  const freteGratis =
    !!pacote &&
    !isFreeShippingEligible(productPrice) &&
    isFreeShippingEligible(productPrice + total);

  const confirmar = () => {
    if (!completo) return setNudge(true);
    onContinue(escolhidas.map((i) => ({ personagem: personagens[i]!, numero: num[i]! })));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-h-[92vh] w-[calc(100%-24px)] max-w-md flex-col gap-0 overflow-hidden rounded-3xl p-0">
        <div className="overflow-y-auto px-5 pb-4 pt-6">
          <DialogTitle className="pr-6 text-center text-[22px] font-extrabold leading-tight text-[var(--night)]">
            Pantufas para combinar com os pijamas
          </DialogTitle>
          <DialogDescription className="mt-1.5 text-center text-[14px] text-black/65">
            Separamos as pantufas {descricao}:{" "}
            <b className="text-[var(--night)]">{precos.join(" ou ")}</b>.
          </DialogDescription>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {personagens.map((nome, i) => {
              const on = !!sel[i];
              return (
                <div key={i}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setSel((s) => s.map((v, j) => (j === i ? !v : v)));
                      setNudge(false);
                    }}
                    className={cn(
                      "relative block w-full overflow-hidden rounded-2xl border-2 bg-white text-left transition",
                      on ? "border-[var(--night)] shadow-md" : "border-black/10 opacity-60",
                    )}
                  >
                    <img
                      src={PANTUFA_P_FOTOS[nome]}
                      alt={`Pantufa ${nome}`}
                      className="aspect-square w-full object-cover"
                    />
                    <span
                      className={cn(
                        "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border-2",
                        on
                          ? "border-[var(--night)] bg-[var(--night)] text-white"
                          : "border-white bg-white/80",
                      )}
                    >
                      {on && <Check className="h-4 w-4" strokeWidth={3} />}
                    </span>
                    <span
                      className={cn(
                        "block px-3 py-2 text-[14px] font-bold leading-tight text-[var(--night)]",
                        on ? "bg-[var(--mint)]" : "bg-white",
                      )}
                    >
                      {nome}
                      {rotulos?.[i] && (
                        <span className="block text-[11.5px] font-semibold text-black/55">
                          {rotulos[i]}
                        </span>
                      )}
                    </span>
                  </button>
                  {on && (
                    <div className="mt-2">
                      <StoreSelect
                        title={`Número da pantufa ${nome}`}
                        placeholder="Número"
                        groups={(infantilPrimeiro ? GRUPOS : [...GRUPOS].reverse()).map((g) => ({
                          nome: g.label,
                          itens: g.numeros.map((n) => ({ value: n, label: n })),
                        }))}
                        value={num[i]}
                        onChange={(v) => {
                          setNum((s) => s.map((x, j) => (j === i ? v : x)));
                          setNudge(false);
                        }}
                        className={cn(
                          "h-10 rounded-xl border-2 bg-white px-3 text-[14px] font-bold",
                          nudge && !num[i] ? "border-[var(--sale)]" : "border-black/15",
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {escolhidas.length > 0 && !pacote && (
            <p className="mt-4 rounded-xl bg-[var(--mint)] px-3 py-2.5 text-center text-[13.5px] font-bold text-[var(--night)]">
              As pantufas saem em pacote de {opcoes.map((p) => p.pares).join(" ou ")} pares. Marque{" "}
              {opcoes.map((p) => p.pares).join(" ou ")} para continuar.
            </p>
          )}
          {freteGratis && (
            <p className="mt-3 text-center text-[13px] font-bold text-[var(--ok,#1f9d41)]">
              Com as pantufas, seu frete fica grátis
            </p>
          )}
          {nudge && pacote && (
            <p className="mt-3 text-center text-[13px] font-semibold text-[var(--sale)]">
              Escolha o número de cada pantufa.
            </p>
          )}
        </div>

        <div className="border-t border-black/10 bg-white px-5 pb-5 pt-3">
          <button
            type="button"
            onClick={confirmar}
            disabled={!pacote}
            className={cn(
              "w-full rounded-full py-4 text-[14px] font-extrabold uppercase tracking-[0.06em] transition",
              pacote
                ? "bg-[var(--night)] text-white hover:opacity-90"
                : "bg-black/10 text-black/45",
            )}
          >
            {pacote ? `Adicionar ${pacote.pares} pares por + ${brl(total)}` : "Escolha as pantufas"}
          </button>
          <button
            type="button"
            onClick={() => onContinue([])}
            className="mt-2 w-full py-1 text-[13px] font-semibold text-black/55 underline underline-offset-2"
          >
            Não, quero só os pijamas
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
