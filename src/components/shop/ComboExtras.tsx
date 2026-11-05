import { Minus, Plus } from "lucide-react";
import { brl, getBundle, PERSONAGENS, URSINHO_FOTOS } from "@/lib/bundles";
import { MAX_URSINHOS, type ComboExtras as Extras } from "@/lib/combo-extras";
import { cn } from "@/lib/utils";

/** Ursinhos à parte na página dos pijamas kigurumi (no combo de 4, um já vai de brinde). */
export function ComboExtras({
  value,
  onChange,
  brinde,
}: {
  value: Extras;
  onChange: (v: Extras) => void;
  /** O combo já leva um ursinho de brinde. */
  brinde: boolean;
}) {
  const ursinho = getBundle("ursinho").price;
  const setUrsinhos = (nome: string, qtd: number) =>
    onChange({ ...value, ursinhos: { ...value.ursinhos, [nome]: qtd } });

  return (
    <div className="mt-6">
      <div className="mb-1 border-b border-[var(--border)] pb-1.5 text-[15px] font-extrabold text-[var(--night)]">
        {brinde ? "Ursinhos extras" : "Ursinhos de pelúcia"}{" "}
        <span className="text-[13px] font-semibold text-[var(--ink)]/50">(opcional)</span>
      </div>
      <p className="mb-3 text-[12.5px] text-[var(--ink)]/60">
        {brinde
          ? `O primeiro já vai de brinde. Cada ursinho a mais sai por ${brl(ursinho)}.`
          : `Cada ursinho sai por ${brl(ursinho)}. No combo de 4, um vai de brinde.`}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {PERSONAGENS.map((nome) => {
          const qtd = value.ursinhos[nome] ?? 0;
          return (
            <div
              key={nome}
              className={cn(
                "overflow-hidden rounded-2xl border-2 bg-white text-center",
                qtd ? "border-[var(--night)]" : "border-[var(--ink)]/15",
              )}
            >
              <img
                src={URSINHO_FOTOS[nome]}
                alt={`Ursinho ${nome}`}
                loading="lazy"
                className="aspect-square w-full bg-[var(--tile)] object-cover"
              />
              <span className="block px-1 pt-1 text-[12px] font-bold leading-tight text-[var(--night)]">
                {nome}
              </span>
              <div className="flex items-center justify-between px-1 pb-1.5 pt-1">
                <button
                  type="button"
                  aria-label={`Menos um ursinho ${nome}`}
                  disabled={!qtd}
                  onClick={() => setUrsinhos(nome, qtd - 1)}
                  className="grid h-7 w-7 place-items-center rounded-full border border-[var(--ink)]/20 text-[var(--night)] disabled:opacity-30"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-[14px] font-extrabold text-[var(--night)]">{qtd}</span>
                <button
                  type="button"
                  aria-label={`Mais um ursinho ${nome}`}
                  disabled={qtd >= MAX_URSINHOS}
                  onClick={() => setUrsinhos(nome, qtd + 1)}
                  className="grid h-7 w-7 place-items-center rounded-full bg-[var(--night)] text-white disabled:opacity-30"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
