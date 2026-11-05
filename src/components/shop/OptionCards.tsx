import { cn } from "@/lib/utils";

/** Escolha com foto (personagem, ursinho...): cartões em 4 colunas, no visual da loja. */
export function OptionCards({
  values,
  images,
  value,
  onPick,
  missing = false,
}: {
  values: readonly string[];
  images: Readonly<Record<string, string>>;
  value: string | undefined;
  onPick: (v: string) => void;
  missing?: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {values.map((v) => {
        const on = value === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onPick(v)}
            aria-pressed={on}
            className={cn(
              "overflow-hidden rounded-2xl border-2 bg-white text-center transition",
              on
                ? "border-[var(--night)]"
                : missing && !value
                  ? "border-[var(--sale)]/60"
                  : "border-[var(--ink)]/15 hover:border-[var(--night)]/50",
            )}
          >
            <img
              src={images[v]}
              alt=""
              loading="lazy"
              className="aspect-square w-full bg-[var(--tile)] object-cover"
            />
            <span
              className={cn(
                "block px-1 py-1.5 text-[12px] font-bold leading-tight",
                on ? "bg-[var(--night)] text-white" : "text-[var(--night)]",
              )}
            >
              {v}
            </span>
          </button>
        );
      })}
    </div>
  );
}
