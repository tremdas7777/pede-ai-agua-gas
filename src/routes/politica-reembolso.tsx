import { createFileRoute } from "@tanstack/react-router";
import { absUrl } from "@/lib/seo";
import { PolicyPage } from "@/components/site/PolicyPage";
import { WhatsappSuporte } from "@/components/site/WhatsappSuporte";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/politica-reembolso")({
  head: () => ({
    meta: [
      { title: `Política de Trocas e Reembolso | ${brand.name}` },
      {
        name: "description",
        content: `Condições de troca e reembolso dos produtos da ${brand.name}.`,
      },
      { property: "og:title", content: "Política de Trocas e Reembolso" },
      {
        property: "og:description",
        content: `Direito de arrependimento, trocas e reembolso na ${brand.name}.`,
      },
      { property: "og:url", content: absUrl("/politica-reembolso") },
    ],
    links: [{ rel: "canonical", href: absUrl("/politica-reembolso") }],
  }),
  component: () => (
    <PolicyPage
      title="Política de Trocas e Reembolso"
      intro="Garantia conforme o Código de Defesa do Consumidor."
    >
      <h2>Direito de arrependimento</h2>
      <p>
        Você tem até 7 dias após o recebimento do produto para desistir da compra, conforme o art.
        49 do CDC.
      </p>
      <h2>Troca de tamanho ou cor</h2>
      <p>
        Pijamas, Snuggy e pantufas podem ser trocados por outro tamanho ou cor em até 30 dias, sem
        uso e com a etiqueta, sujeito à disponibilidade em estoque.
      </p>
      <h2>Como solicitar</h2>
      <p>
        Fale com a gente pelo <WhatsappSuporte /> com o número do pedido. Na desistência dentro dos
        7 dias, o frete de devolução é por nossa conta.
      </p>
      <h2>Prazo de reembolso</h2>
      <p>
        O reembolso é processado em até 7 dias úteis após o recebimento do produto em nosso centro
        de distribuição.
      </p>
    </PolicyPage>
  ),
});
