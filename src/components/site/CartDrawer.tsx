import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { brl, FREE_SHIPPING_MIN, isFreeShippingEligible } from "@/lib/bundles";
import {
  cartCount,
  cartLines,
  cartSubtotal,
  checkoutSearch,
  markCartCheckout,
  MAX_QTD,
  removeItem,
  setCartOpen,
  setCartPantufas,
  setItemQty,
  useCart,
  useCartOpen,
} from "@/lib/cart";
import { pantufaItems } from "@/lib/pantufa-oferta";
import { trackCheckoutClick } from "@/lib/analytics";

const qtyBtn =
  "grid h-8 w-8 place-items-center rounded-full border border-black/15 text-[var(--night)] disabled:opacity-35";

/** Gaveta do carrinho (lado direito), aberta pelo ícone do header ou ao adicionar um produto. */
export function CartDrawer() {
  const cart = useCart();
  const open = useCartOpen();
  const navigate = useNavigate();
  const lines = cartLines(cart.items);
  const pantufas = pantufaItems(cart.pantufas);
  const subtotal = cartSubtotal(cart);
  const count = cartCount(cart);
  const freeOk = isFreeShippingEligible(subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_MIN) * 100));

  const finalizar = () => {
    const search = checkoutSearch(cart);
    if (!search) return;
    trackCheckoutClick({
      source: "cart",
      bundleId: search.plano,
      bundleName: lines.map((l) => l.title).join(" + "),
      value: subtotal,
    });
    markCartCheckout(true);
    setCartOpen(false);
    navigate({ to: "/checkout", search });
  };

  return (
    <Sheet open={open} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="flex w-[92%] max-w-md flex-col gap-0 p-0">
        <div className="border-b border-black/10 px-5 pb-4 pt-5">
          <SheetTitle className="text-[20px] font-extrabold text-[var(--night)]">
            Seu carrinho {count > 0 && `(${count})`}
          </SheetTitle>
          <SheetDescription className="sr-only">Produtos escolhidos e total</SheetDescription>
          {count > 0 && (
            <div className="mt-3 rounded-2xl bg-[var(--mint)] px-3 py-2.5 text-[13px] text-[var(--night)]">
              <p className="flex items-center gap-2 font-semibold">
                <Truck className="h-4 w-4 shrink-0" />
                {freeOk ? (
                  <span>Seu pedido ganhou frete grátis</span>
                ) : (
                  <span>
                    Faltam <b>{brl(FREE_SHIPPING_MIN - subtotal)}</b> para o frete grátis
                  </span>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-[var(--night)] transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-[var(--night)]/40" />
            <p className="text-[15px] font-semibold text-[var(--night)]">Seu carrinho está vazio</p>
            <Link
              to="/"
              onClick={() => setCartOpen(false)}
              className="rounded-full bg-[var(--night)] px-6 py-3 text-[13px] font-extrabold uppercase tracking-[0.06em] text-white"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-black/10 overflow-y-auto px-5">
              {lines.map((l, i) => (
                <li key={l.key} className="flex gap-3 py-4">
                  <img
                    src={l.bundle.img}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold leading-snug text-[var(--night)]">
                      {l.title}
                    </p>
                    {l.detail && <p className="mt-0.5 text-[12px] text-black/55">{l.detail}</p>}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        className={qtyBtn}
                        onClick={() => setItemQty(i, l.qtd - 1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-[14px] font-bold">{l.qtd}</span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        className={qtyBtn}
                        disabled={l.qtd >= MAX_QTD}
                        onClick={() => setItemQty(i, l.qtd + 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Remover do carrinho"
                        className="ml-auto grid h-8 w-8 place-items-center text-black/45"
                        onClick={() => removeItem(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <span className="text-[14px] font-bold text-[var(--night)]">{brl(l.price)}</span>
                </li>
              ))}
              {pantufas.map((p) => (
                <li key={p.name} className="flex gap-3 py-4">
                  <img src={p.img} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold leading-snug text-[var(--night)]">
                      {p.fullName}
                    </p>
                    <p className="mt-0.5 text-[12px] text-black/55">
                      1 par{pantufas.length === 2 ? " · desconto das duas cores" : ""}
                    </p>
                    <button
                      type="button"
                      onClick={() => setCartPantufas([])}
                      className="mt-2 text-[12px] font-semibold text-black/50 underline"
                    >
                      Remover pantufas
                    </button>
                  </div>
                  <span className="text-[14px] font-bold text-[var(--night)]">{brl(p.price)}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-black/10 px-5 pb-5 pt-4 [padding-bottom:max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between text-[15px]">
                <span className="font-semibold">Subtotal</span>
                <b className="text-[18px] text-[var(--night)]">{brl(subtotal)}</b>
              </div>
              <p className="mt-0.5 text-[12px] text-black/50">
                Frete e desconto do Pix no checkout
              </p>
              <button
                type="button"
                onClick={finalizar}
                className="mt-3 w-full rounded-full bg-[var(--night)] py-4 text-[14px] font-extrabold uppercase tracking-[0.06em] text-white transition hover:opacity-90"
              >
                Finalizar compra
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="mt-2 w-full py-1 text-[13px] font-semibold text-black/55 underline underline-offset-2"
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/** Ícone do carrinho com a quantidade, para o header. */
export function CartButton({ className }: { className: string }) {
  const count = cartCount(useCart());
  return (
    <button
      type="button"
      aria-label={count ? `Carrinho com ${count} ${count === 1 ? "item" : "itens"}` : "Carrinho"}
      className={`${className} relative`}
      onClick={() => setCartOpen(true)}
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--sale)] px-1 text-[10px] font-extrabold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
