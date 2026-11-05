import { Link } from "@tanstack/react-router";
import { brl, brlCurto, discountPct, getBundle, ofertaCombo, type Bundle } from "@/lib/bundles";

/** Card da vitrine: abre a página do produto (onde o cliente escolhe cor/tamanho). */
export function ProductCard({ p }: { p: Bundle }) {
  const off = discountPct(p);
  // Combo ("2 por R$ 79"): a oferta vai no selo e no preço, para não parecer o preço de 1 peça.
  // Produto de 1 com combo maior (pelúcia): "1 por R$ 69" no preço e "2 por R$ 89" no selo.
  const maior = p.comboVitrine ? ofertaCombo(getBundle(p.comboVitrine)) : undefined;
  const oferta = ofertaCombo(p) ?? (maior ? `1 por ${brlCurto(p.price)}` : undefined);
  const selo = maior ?? oferta ?? p.badge;
  return (
    <Link to="/produto" search={{ plano: p.id }} className="group block text-center">
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-[var(--tile)]">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        {selo && (
          <span
            className={
              oferta
                ? "absolute left-2.5 top-2.5 rounded-full bg-[var(--primary-dark)] px-3 py-1.5 text-[13px] font-extrabold leading-none text-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.35)]"
                : "absolute left-3 top-3 rounded-full bg-[var(--night)] px-2.5 py-1 text-[11px] font-bold text-white"
            }
          >
            {selo}
          </span>
        )}
        {off > 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[var(--mint-strong)] px-2.5 py-1 text-[11px] font-bold text-[var(--night)]">
            -{off}% OFF
          </span>
        )}
      </div>
      <h3 className="mt-3 px-1 text-[15px] font-semibold leading-snug text-[var(--ink)]">
        {p.name}
      </h3>
      <div className="mt-1 flex flex-wrap items-baseline justify-center gap-x-2 text-[14px]">
        {oferta ? (
          <span className="text-[16px] font-extrabold text-[var(--primary-dark)]">{oferta}</span>
        ) : (
          <span className="font-bold text-[var(--night)]">{brl(p.price)}</span>
        )}
        {p.compareAtPrice && (
          <s className="text-[13px] text-[var(--ink)]/45">{brl(p.compareAtPrice)}</s>
        )}
      </div>
      {maior ? (
        <p className="mt-0.5 text-[14px] font-extrabold text-[var(--primary-dark)]">ou {maior}</p>
      ) : (
        oferta &&
        p.unidades && (
          <p className="mt-0.5 text-[12px] text-[var(--ink)]/55">
            {brl(p.price / p.unidades)} cada
          </p>
        )
      )}
    </Link>
  );
}
