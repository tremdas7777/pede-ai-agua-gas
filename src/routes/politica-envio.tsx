import { createFileRoute } from "@tanstack/react-router";
import { absUrl } from "@/lib/seo";
import { PolicyPage } from "@/components/site/PolicyPage";
import { brand } from "@/lib/brand";
import { FREE_SHIPPING_MIN, brl } from "@/lib/bundles";
import { FRETES } from "@/lib/pix.functions";

export const Route = createFileRoute("/politica-envio")({
  head: () => ({
    meta: [
      { title: `Política de Envio | ${brand.name}` },
      { name: "description", content: `Saiba como funciona o envio dos pedidos da ${brand.name}.` },
      { property: "og:title", content: "Política de Envio" },
      { property: "og:description", content: "Envio para todo o Brasil com rastreamento." },
      { property: "og:url", content: absUrl("/politica-envio") },
    ],
    links: [{ rel: "canonical", href: absUrl("/politica-envio") }],
  }),
  component: () => (
    <PolicyPage title="Política de Envio" intro="Enviamos para todo o Brasil com rastreamento.">
      <h2>Prazo de envio</h2>
      <p>Os pedidos são processados em até 1 dia útil após a confirmação do pagamento.</p>
      <h2>Prazo de entrega</h2>
      <p>Depois do envio, o prazo depende do frete escolhido no checkout:</p>
      <ul>
        {FRETES.map((f) => (
          <li key={f.id}>
            {f.name}: {f.eta}
            {f.price ? ` (${brl(f.price)})` : ` (compras a partir de R$ ${FREE_SHIPPING_MIN})`}
          </li>
        ))}
      </ul>
      <h2>Rastreamento</h2>
      <p>Você recebe o código de rastreio por e-mail assim que o pedido for despachado.</p>
      <h2>Frete</h2>
      <p>
        O frete é grátis para todo o Brasil em compras a partir de R$ {FREE_SHIPPING_MIN} em
        produtos. Abaixo desse valor, você escolhe no checkout entre o Frete Padrão e o Frete
        Express, com o valor exibido antes do pagamento.
      </p>
    </PolicyPage>
  ),
});
