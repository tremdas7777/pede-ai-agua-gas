import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { WhatsappSuporte } from "@/components/site/WhatsappSuporte";
import { brand } from "@/lib/brand";
import { FAQ } from "@/lib/faq";
import { faqJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () =>
    seo({
      path: "/faq",
      title: `Perguntas Frequentes | ${brand.name}`,
      description: `Tire suas dúvidas sobre a ${brand.name}: prazo de entrega, frete grátis, pagamento, tamanhos e trocas.`,
      jsonLd: [faqJsonLd(FAQ)],
    }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <section className="container-edge max-w-3xl py-14 md:py-20">
        <span className="eyebrow text-[var(--ink)]/50">Dúvidas</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Perguntas frequentes
        </h1>
        <div className="mt-10 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-white">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5 py-4 md:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink)]/65">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-[15px] text-[var(--ink)]/65">
          Não achou sua resposta? Fale com a gente pelo <WhatsappSuporte /> ou use a página de{" "}
          <a href="/contato" className="font-semibold text-[var(--primary)] hover:underline">
            contato
          </a>
          .
        </p>
      </section>
    </SiteLayout>
  );
}
