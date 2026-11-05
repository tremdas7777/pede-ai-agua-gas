import { Children, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Prateleira com deslize lateral: no celular arrasta com o dedo (encaixa card a card),
 * no computador tem setas. `itemClassName` controla a largura de cada card.
 * Com `rows={2}`: duas linhas que deslizam juntas no celular e, no computador, uma grade de
 * 2 linhas de 6, sem deslize (cabe a vitrine inteira de 12).
 */
export function Shelf({
  children,
  label,
  itemClassName = "w-[45%] sm:w-[31%] md:w-[23.5%]",
  rows = 1,
}: {
  children: ReactNode;
  label: string;
  itemClassName?: string;
  rows?: 1 | 2;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((first?.offsetWidth ?? 280) + 12), behavior: "smooth" });
  };
  const arrow =
    "absolute top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--night)] shadow-[0_6px_18px_-8px_rgba(16,30,20,0.45)] transition hover:scale-105 md:grid";
  if (rows === 2)
    return (
      <div
        role="list"
        aria-label={label}
        className="-mx-6 grid snap-x snap-mandatory auto-cols-[45%] grid-flow-col grid-rows-2 gap-3 overflow-x-auto scroll-smooth scroll-px-6 px-6 pb-2 [scrollbar-width:none] sm:auto-cols-[31%] md:mx-0 md:auto-cols-auto md:grid-flow-row md:grid-cols-6 md:grid-rows-none md:gap-4 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div role="listitem" className="min-w-0 snap-start">
            {child}
          </div>
        ))}
      </div>
    );
  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`${label}: anteriores`}
        onClick={() => go(-1)}
        className={cn(arrow, "-left-4")}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div
        ref={ref}
        className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto scroll-smooth px-6 pb-2 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:gap-4 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div className={cn("shrink-0 snap-start", itemClassName)}>{child}</div>
        ))}
      </div>
      <button
        type="button"
        aria-label={`${label}: próximos`}
        onClick={() => go(1)}
        className={cn(arrow, "-right-4")}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
