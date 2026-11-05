import { useState, type ReactNode } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export type StoreSelectItem = {
  value: string;
  /** Texto no campo depois de escolhido ("Infantil • 2 anos"). */
  label: string;
  /** Texto curto no botão da grade ("2 anos"); sem ele, vale o `label`. */
  short?: string;
  /** Foto da opção, mostrada na lista (modelos de Crocs). */
  img?: string;
};
export type StoreSelectGroup = { nome: string; itens: StoreSelectItem[] };

/**
 * Seletor no visual da loja, no lugar do <select> do navegador: no celular abre uma gaveta de
 * baixo para cima, no computador um painel logo abaixo do campo. "grade" mostra botões lado a lado
 * (tamanhos, numeração); "lista" mostra uma opção por linha (modelos, parcelas).
 */
export function StoreSelect({
  title,
  placeholder,
  groups,
  value,
  onChange,
  layout = "grade",
  invalid = false,
  className,
  label,
}: {
  title: string;
  placeholder: string;
  groups: readonly StoreSelectGroup[];
  value: string | undefined;
  onChange: (v: string) => void;
  layout?: "grade" | "lista";
  invalid?: boolean;
  /** Classes do campo; sem elas, o campo redondo das páginas de produto. */
  className?: string;
  /** Nome acessível do campo, quando difere do título. */
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const mobile = useIsMobile();
  const atual = groups.flatMap((g) => g.itens).find((i) => i.value === value);
  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const trigger = (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-label={label ?? title}
      onClick={() => setOpen(true)}
      className={cn(
        className ??
          cn(
            "h-12 rounded-full border-2 pl-5 pr-4 text-[15px] font-semibold",
            atual ? "border-[var(--night)] bg-[var(--mint)]" : "border-[var(--ink)]/20 bg-white",
            invalid && !atual && "border-[var(--sale)]",
          ),
        "flex w-full cursor-pointer items-center justify-between gap-2 text-left text-[var(--night)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--night)]/30",
      )}
    >
      <span className={cn("truncate", !atual && "text-[var(--ink)]/55")}>
        {atual?.label ?? placeholder}
      </span>
      <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", open && "rotate-180")} />
    </button>
  );

  const opcoes: ReactNode = (
    <div role="listbox" aria-label={title} className="space-y-4">
      {groups.map((g) => (
        <div key={g.nome || "_"}>
          {g.nome && (
            <div className="mb-2 text-[12px] font-extrabold uppercase tracking-[0.06em] text-[var(--ink)]/50">
              {g.nome}
            </div>
          )}
          <div className={layout === "grade" ? "grid grid-cols-4 gap-2" : "space-y-1.5"}>
            {g.itens.map((i) => {
              const on = i.value === value;
              return (
                <button
                  key={i.value}
                  type="button"
                  role="option"
                  aria-selected={on}
                  onClick={() => pick(i.value)}
                  className={cn(
                    "transition",
                    layout === "grade"
                      ? "h-12 rounded-xl border-2 px-1 text-[14px] font-bold"
                      : "flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-[14.5px] font-semibold",
                    on
                      ? "border-[var(--night)] bg-[var(--night)] text-white"
                      : "border-[var(--ink)]/12 bg-white text-[var(--night)] hover:border-[var(--night)]/50",
                  )}
                >
                  {layout === "grade" ? (
                    (i.short ?? i.label)
                  ) : (
                    <>
                      {i.img && (
                        <img
                          src={i.img}
                          alt=""
                          loading="lazy"
                          className="-my-1 -ml-2 h-11 w-11 shrink-0 rounded-lg bg-[var(--tile)] object-cover"
                        />
                      )}
                      <span className="flex-1">{i.short ?? i.label}</span>
                      {on && <Check className="h-4 w-4 shrink-0" strokeWidth={3} />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  if (mobile)
    return (
      <DrawerPrimitive.Root open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
        {trigger}
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Overlay className="fixed inset-0 z-[80] bg-black/45" />
          <DrawerPrimitive.Content className="fixed inset-x-0 bottom-0 z-[80] flex max-h-[85vh] flex-col rounded-t-[24px] bg-white outline-none">
            <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-[var(--ink)]/15" />
            <DrawerPrimitive.Title className="px-5 pb-3 pt-3 text-[17px] font-extrabold text-[var(--night)]">
              {title}
            </DrawerPrimitive.Title>
            <DrawerPrimitive.Description className="sr-only">
              {placeholder}
            </DrawerPrimitive.Description>
            <div className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              {opcoes}
            </div>
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    );

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          collisionPadding={12}
          className="z-[80] max-h-[min(420px,var(--radix-popover-content-available-height))] w-[max(var(--radix-popover-trigger-width),300px)] overflow-y-auto rounded-2xl border border-[var(--ink)]/10 bg-white p-4 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.3)] outline-none"
        >
          {opcoes}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
