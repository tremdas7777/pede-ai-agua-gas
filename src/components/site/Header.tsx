import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight, CircleHelp, Menu, Search, Truck, X } from "lucide-react";
import logo from "@/assets/logo.webp";
import { CartButton, CartDrawer } from "@/components/site/CartDrawer";
import { brand } from "@/lib/brand";
import { availableBundles, brl, categories, listedBundles, type BundleId } from "@/lib/bundles";

/** Menu principal: um atalho por tipo de produto, como numa loja de roupa. */
/** collection: abre a página da coleção em vez de um produto. */
const nav: { id: BundleId; label: string; collection?: string }[] = [
  { id: "pijama", label: "Pijamas", collection: "pijamas" },
  { id: "snuggy", label: "Snuggy" },
  { id: "pantufa2", label: "Pantufas", collection: "pantufas" },
  { id: "aneis", label: "Anéis" },
  { id: "colares", label: "Colares" },
  { id: "carro", label: "Para o carro" },
];

const help = [
  { href: "/rastreio", label: "Rastrear pedido" },
  { href: "/faq", label: "Dúvidas frequentes" },
  { href: "/contato", label: "Contato" },
  { href: "/sobre", label: "Sobre a loja" },
];

const iconBtn =
  "grid h-10 w-10 place-items-center rounded-full text-[var(--night)] transition hover:bg-[var(--mint)]";

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const term = normalize(q.trim());
  const results = listedBundles.filter((b) => {
    if (!term) return true;
    const cat = categories.find((c) => c.id === b.category)?.name ?? "";
    return normalize(`${b.name} ${b.tag} ${cat}`).includes(term);
  });

  return (
    <div className="fixed inset-0 z-[60] bg-black/30" onClick={onClose}>
      <div
        className="bg-white pb-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="container-edge flex items-center gap-3 py-3">
          <label className="flex flex-1 items-center gap-2 rounded-full bg-[var(--tile)] px-4">
            <Search className="h-4 w-4 shrink-0 text-[var(--ink)]/50" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="O que você procura?"
              aria-label="Buscar produtos"
              className="h-11 w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--ink)]/45"
            />
          </label>
          <button type="button" aria-label="Fechar busca" className={iconBtn} onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="container-edge">
          <p className="mb-2 text-[12px] font-semibold text-[var(--ink)]/50">
            {term ? `${results.length} resultado${results.length === 1 ? "" : "s"}` : "Produtos"}
          </p>
          {results.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-[var(--ink)]/60">
              Nada encontrado para “{q}”.
            </p>
          ) : (
            <ul className="grid gap-1 sm:grid-cols-2">
              {results.map((b) => (
                <li key={b.id}>
                  <Link
                    to="/produto"
                    search={{ plano: b.id }}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-[var(--tile)]"
                  >
                    <img src={b.img} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold">{b.name}</span>
                      <span className="text-[13px] font-bold text-[var(--night)]">
                        {brl(b.price)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Drawer({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] bg-black/35 lg:hidden" onClick={onClose}>
      <aside
        className="flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-white animate-in slide-in-from-left duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <img src={logo} alt={brand.name} className="h-16 w-auto" />
          <button type="button" aria-label="Fechar menu" className={iconBtn} onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-5 pt-2">
          <p className="mb-2 text-[12px] font-bold text-[var(--ink)]/45">Produtos</p>
          <ul className="space-y-1">
            <li>
              <Link
                to="/colecao/$id"
                params={{ id: "mais-vendidos" }}
                onClick={onClose}
                className="flex items-center gap-3 rounded-2xl py-2 pr-2"
              >
                <img
                  src="/produtos/p2_snuggy.jpg"
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <span className="flex-1 text-[15px] font-semibold">Mais vendidos</span>
                <ChevronRight className="h-4 w-4 text-[var(--ink)]/35" />
              </Link>
            </li>
            <li>
              <Link
                to="/colecao/$id"
                params={{ id: "kigurumi" }}
                onClick={onClose}
                className="flex items-center gap-3 rounded-2xl py-2 pr-2"
              >
                <img
                  src="/produtos/kg-stitch.jpg"
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <span className="flex-1 text-[15px] font-semibold">Pijamas Kigurumi</span>
                <ChevronRight className="h-4 w-4 text-[var(--ink)]/35" />
              </Link>
            </li>
            <li>
              <Link
                to="/colecao/$id"
                params={{ id: "crocs" }}
                onClick={onClose}
                className="flex items-center gap-3 rounded-2xl py-2 pr-2"
              >
                <img
                  src="/produtos/crocs/cr21a-1.jpg"
                  alt=""
                  className="h-12 w-12 rounded-xl bg-white object-cover"
                />
                <span className="flex-1 text-[15px] font-semibold">Crocs</span>
                <ChevronRight className="h-4 w-4 text-[var(--ink)]/35" />
              </Link>
            </li>
            <li>
              <Link
                to="/colecao/$id"
                params={{ id: "moletons" }}
                onClick={onClose}
                className="flex items-center gap-3 rounded-2xl py-2 pr-2"
              >
                <img
                  src="/produtos/sleepo-preto-uso.jpg"
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <span className="flex-1 text-[15px] font-semibold">Sleepo Dragão</span>
                <ChevronRight className="h-4 w-4 text-[var(--ink)]/35" />
              </Link>
            </li>
            <li>
              <Link
                to="/colecao/$id"
                params={{ id: "brinquedos" }}
                onClick={onClose}
                className="flex items-center gap-3 rounded-2xl py-2 pr-2"
              >
                <img
                  src="/produtos/bq15-1.jpg"
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <span className="flex-1 text-[15px] font-semibold">Brinquedos com 70% OFF</span>
                <ChevronRight className="h-4 w-4 text-[var(--ink)]/35" />
              </Link>
            </li>
            {nav.map((item) => {
              const b = availableBundles.find((x) => x.id === item.id);
              return (
                <li key={item.id}>
                  {item.collection ? (
                    <Link
                      to="/colecao/$id"
                      params={{ id: item.collection }}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-2xl py-2 pr-2"
                    >
                      {b && (
                        <img src={b.img} alt="" className="h-12 w-12 rounded-xl object-cover" />
                      )}
                      <span className="flex-1 text-[15px] font-semibold">{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-[var(--ink)]/35" />
                    </Link>
                  ) : (
                    <Link
                      to="/produto"
                      search={{ plano: item.id }}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-2xl py-2 pr-2"
                    >
                      {b && (
                        <img src={b.img} alt="" className="h-12 w-12 rounded-xl object-cover" />
                      )}
                      <span className="flex-1 text-[15px] font-semibold">{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-[var(--ink)]/35" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mb-2 mt-6 text-[12px] font-bold text-[var(--ink)]/45">Coleções</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/colecao/$id"
                params={{ id: c.id }}
                onClick={onClose}
                className="rounded-full bg-[var(--mint)] px-4 py-2 text-[13px] font-semibold text-[var(--night)]"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <p className="mb-1 mt-6 text-[12px] font-bold text-[var(--ink)]/45">Ajuda</p>
          <ul className="pb-8">
            {help.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="block border-b border-[var(--border)] py-3.5 text-[15px]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export function Header() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const closeMenu = useCallback(() => setMenu(false), []);
  const closeSearch = useCallback(() => setSearch(false), []);

  // Trava a rolagem da página com o menu ou a busca abertos.
  useEffect(() => {
    if (!menu && !search) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menu, search]);

  return (
    <header className="border-b border-[var(--border)] bg-white">
      <div className="container-edge grid grid-cols-[1fr_auto_1fr] items-center py-2 lg:flex lg:gap-6 lg:py-3">
        <div className="-ml-2 flex items-center lg:hidden">
          <button
            type="button"
            aria-label="Abrir menu"
            className={iconBtn}
            onClick={() => setMenu(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Buscar"
            className={iconBtn}
            onClick={() => setSearch(true)}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        <Link to="/" aria-label={`${brand.name} — início`} className="flex shrink-0 justify-center">
          <img src={logo} alt={brand.name} className="h-[84px] w-auto md:h-24" />
        </Link>

        <nav className="hidden flex-1 justify-center gap-5 text-[14px] font-semibold text-[var(--night)] lg:flex xl:gap-7">
          <Link
            to="/colecao/$id"
            params={{ id: "mais-vendidos" }}
            className="py-2 transition-colors hover:text-[var(--primary)]"
          >
            Mais vendidos
          </Link>
          <Link
            to="/colecao/$id"
            params={{ id: "kigurumi" }}
            className="py-2 transition-colors hover:text-[var(--primary)]"
          >
            Kigurumi
          </Link>
          <Link
            to="/colecao/$id"
            params={{ id: "crocs" }}
            className="py-2 transition-colors hover:text-[var(--primary)]"
          >
            Crocs
          </Link>
          <Link
            to="/colecao/$id"
            params={{ id: "moletons" }}
            className="py-2 transition-colors hover:text-[var(--primary)]"
          >
            Sleepo Dragão
          </Link>
          <Link
            to="/colecao/$id"
            params={{ id: "brinquedos" }}
            className="py-2 transition-colors hover:text-[var(--primary)]"
          >
            Brinquedos
          </Link>
          {nav.map((item) =>
            item.collection ? (
              <Link
                key={item.id}
                to="/colecao/$id"
                params={{ id: item.collection }}
                className="py-2 transition-colors hover:text-[var(--primary)]"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.id}
                to="/produto"
                search={{ plano: item.id }}
                className="py-2 transition-colors hover:text-[var(--primary)]"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="-mr-2 flex items-center justify-end">
          <button
            type="button"
            aria-label="Buscar"
            className={`${iconBtn} hidden lg:grid`}
            onClick={() => setSearch(true)}
          >
            <Search className="h-5 w-5" />
          </button>
          <a href="/faq" aria-label="Dúvidas" className={iconBtn}>
            <CircleHelp className="h-5 w-5" />
          </a>
          <a href="/rastreio" aria-label="Rastrear pedido" className={`${iconBtn} hidden sm:grid`}>
            <Truck className="h-5 w-5" />
          </a>
          <CartButton className={iconBtn} />
        </div>
      </div>
      <CartDrawer />

      {menu && <Drawer onClose={closeMenu} />}
      {search && <SearchPanel onClose={closeSearch} />}
    </header>
  );
}
