import { createFileRoute } from "@tanstack/react-router";
import { absUrl } from "@/lib/seo";
import { SiteLayout } from "@/components/site/Layout";
import { useWhatsappSuporte } from "@/components/site/WhatsappSuporte";
import { brand } from "@/lib/brand";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: `Contato | ${brand.name}` },
      { name: "description", content: `Fale com a equipe da ${brand.name}. Atendimento humano.` },
      { property: "og:title", content: `Contato ${brand.name}` },
      { property: "og:description", content: `Fale com a equipe da ${brand.name}.` },
      { property: "og:url", content: absUrl("/contato") },
    ],
    links: [{ rel: "canonical", href: absUrl("/contato") }],
  }),
  component: Page,
});

function Page() {
  const whatsapp = useWhatsappSuporte();
  return (
    <SiteLayout>
      <section className="pt-32 md:pt-44 pb-24">
        <div className="container-edge grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <span className="eyebrow text-[var(--primary)]">Atendimento</span>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] mt-6 text-balance">
              Estamos aqui <br />
              <span className="italic">para ajudar.</span>
            </h1>
            <p className="mt-6 text-[var(--ink)]/70 leading-relaxed max-w-sm">
              Nossa equipe responde em até 24 horas em dias úteis.
            </p>
            <ul className="mt-12 space-y-6 text-sm">
              <li className="border-b border-[rgba(13,13,13,0.08)] pb-5">
                <div className="eyebrow text-[var(--ink)]/40 mb-2">WhatsApp</div>
                <a
                  href={whatsapp.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
                  aria-label={`Chamar no WhatsApp ${whatsapp.label}`}
                >
                  {whatsapp.label}
                </a>
              </li>
              <li className="border-b border-[rgba(13,13,13,0.08)] pb-5">
                <div className="eyebrow text-[var(--ink)]/40 mb-2">Empresa</div>
                <div>
                  {brand.name} · CNPJ {brand.cnpj}
                </div>
              </li>
              <li className="border-b border-[rgba(13,13,13,0.08)] pb-5">
                <div className="eyebrow text-[var(--ink)]/40 mb-2">Atendimento</div>
                <div>Online, para todo o Brasil</div>
              </li>
            </ul>
          </div>

          <form
            className="lg:col-span-7 bg-white p-10 md:p-12 border border-[rgba(13,13,13,0.08)] rounded-xl space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              // Abre o WhatsApp da loja com a mensagem já escrita (a loja não tem e-mail).
              const f = new FormData(e.currentTarget);
              const text = `${whatsapp.message}\n\n${f.get("mensagem") ?? ""}\n\n— ${f.get("nome") ?? ""}`;
              window.open(whatsappLink(whatsapp.phone, text), "_blank", "noreferrer");
            }}
          >
            <Field label="Nome" name="nome" />
            <Field label="Mensagem" name="mensagem" textarea />
            <button className="w-full bg-[var(--primary)] text-white py-5 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-colors">
              Enviar pelo WhatsApp
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
}) {
  const cls =
    "mt-3 w-full border-0 border-b border-[rgba(13,13,13,0.2)] bg-transparent px-0 py-3 focus:outline-none focus:border-[var(--ink)] transition-colors text-base";
  return (
    <label className="block">
      <span className="eyebrow text-[var(--ink)]/60">{label}</span>
      {textarea ? (
        <textarea required name={name} rows={5} className={cls} />
      ) : (
        <input required name={name} type={type} className={cls} />
      )}
    </label>
  );
}
