import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { brand } from "@/lib/brand";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/sobre")({
  head: () =>
    seo({
      path: "/sobre",
      title: `Sobre a ${brand.name}`,
      description: `A ${brand.name} é uma loja online de produtos de dragão para vestir, presentear e decorar, com envio rastreado para todo o Brasil.`,
    }),
  component: Page,
});

const VALUES = [
  ["Envio rastreado", "Pedidos despachados em até 1 dia útil, com código de rastreio por e-mail."],
  ["Troca de tamanho", "Pijamas, Snuggy e pantufas podem ser trocados em até 30 dias."],
  ["Pagamento seguro", "Pix ou cartão de crédito, em site com certificado SSL."],
  ["Atendimento", "Respondemos dúvidas sobre tamanho, prazo e troca em dias úteis."],
] as const;

function Page() {
  return (
    <SiteLayout>
      <section className="container-edge grid items-center gap-10 py-14 md:grid-cols-2 md:py-20 lg:gap-16">
        <div>
          <span className="eyebrow text-[var(--ink)]/50">Sobre</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl text-balance">
            Sobre a {brand.name}
          </h1>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-[var(--ink)]/65">
            Somos uma loja online de produtos de dragão: calças de pijama, Snuggy, pantufas, joias e
            mascotes para carro. Vendemos para todo o Brasil, com pagamento por Pix ou cartão.
          </p>
          <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-[var(--ink)]/65">
            Ficou com dúvida sobre tamanho, prazo ou troca? Fale com a gente pela página de contato.
          </p>
        </div>
        <img
          src="/produtos/p1_casal.jpg"
          alt="Casal com pijamas de dragão"
          className="aspect-[4/5] max-h-[520px] w-full rounded-3xl border border-[var(--border)] object-cover"
        />
      </section>
      <section className="border-t border-[var(--border)] bg-white">
        <div className="container-edge grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(([t, d]) => (
            <div key={t} className="border-l-[3px] border-[var(--primary)] pl-4">
              <h2 className="font-display text-xl font-bold">{t}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink)]/65">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
