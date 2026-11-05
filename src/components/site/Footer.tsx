import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, MessageCircle, ShieldCheck } from "lucide-react";
import logo from "@/assets/logo-full.webp";
import { brand } from "@/lib/brand";
import { categories, FREE_SHIPPING_LABEL } from "@/lib/bundles";
import { getSiteSettings } from "@/lib/site-settings.functions";
import { formatWhatsapp, whatsappLink } from "@/lib/whatsapp";

const productLinks = [
  ...categories.map((c) => ({ label: c.name, href: `/colecao/${c.id}` })),
  { label: "Mais vendido", href: "/produto?plano=snuggy" },
];

const supportLinks = [
  { label: "Perguntas frequentes", href: "/faq" },
  { label: "Rastrear pedido", href: "/rastreio" },
  { label: "Contato", href: "/contato" },
  { label: "Sobre", href: "/sobre" },
];

const legalLinks = [
  { label: "Envio", href: "/politica-envio" },
  { label: "Privacidade", href: "/politica-privacidade" },
  { label: "Trocas e reembolso", href: "/politica-reembolso" },
];

function LinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-2">
      {links.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            className="text-[14px] text-[var(--ink)]/70 transition-colors hover:text-[var(--night)]"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** No celular vira sanfona fechada; no computador, coluna aberta. */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <>
      <details className="group border-b border-[var(--night)]/10 py-3.5 md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-bold text-[var(--night)] [&::-webkit-details-marker]:hidden">
          {title}
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
        </summary>
        <div className="pt-3">
          <LinkList links={links} />
        </div>
      </details>
      <div className="hidden md:block">
        <h4 className="mb-3 text-[15px] font-bold text-[var(--night)]">{title}</h4>
        <LinkList links={links} />
      </div>
    </>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const fetchSettings = useServerFn(getSiteSettings);
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => fetchSettings(),
    staleTime: 60_000,
  });
  const whatsappPhone = settings?.whatsappPhone ?? "";
  const whatsappEnabled = (settings?.whatsappEnabled ?? false) && !!whatsappPhone;
  const whatsappHref = whatsappLink(
    whatsappPhone,
    settings?.whatsappMessage ?? brand.whatsapp.message,
  );

  return (
    <footer className="bg-[var(--mint)] text-[var(--ink)]">
      <div className="container-edge py-10 md:py-14">
        <div className="text-center">
          <Link to="/" aria-label={`${brand.name} — início`} className="inline-block">
            <img src={logo} alt={brand.name} className="mx-auto h-32 w-auto" loading="lazy" />
          </Link>
          <p className="mx-auto mt-3 max-w-sm text-[14px] text-[var(--ink)]/65">
            Loja online de produtos de dragão. Enviamos para todo o Brasil.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl border-t border-[var(--night)]/10 md:mt-10 md:grid-cols-3 md:gap-10 md:border-0 md:text-center">
          <FooterColumn title="Loja" links={productLinks} />
          <FooterColumn title="Dúvidas" links={supportLinks} />
          <FooterColumn title="Políticas" links={legalLinks} />
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          {whatsappEnabled && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--night)] px-5 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90"
              aria-label={`Chamar no WhatsApp ${formatWhatsapp(whatsappPhone)}`}
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
              WhatsApp {formatWhatsapp(whatsappPhone)}
            </a>
          )}
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {["Pix", "Cartão de crédito", "Site seguro (SSL)"].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--night)]"
              >
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
                {t}
              </span>
            ))}
          </div>
          <p className="max-w-md text-[12px] text-[var(--ink)]/55">{FREE_SHIPPING_LABEL}.</p>
        </div>
      </div>

      <div className="border-t border-[var(--night)]/10">
        <p className="container-edge py-4 text-center text-[12px] text-[var(--ink)]/55">
          © {year} {brand.name} · CNPJ {brand.cnpj}
        </p>
      </div>
    </footer>
  );
}
