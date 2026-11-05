import { FREE_SHIPPING_MIN } from "@/lib/bundles";
import { PIX_DISCOUNT } from "@/lib/payment-pricing";

/** Perguntas frequentes da loja (home e /faq). */
export const FAQ: readonly { q: string; a: string }[] = [
  {
    q: "Qual o prazo de entrega?",
    // Mesmos prazos das opções de frete do checkout (FRETES em pix.functions.ts).
    a: "Os pedidos são despachados em até 1 dia útil após a confirmação do pagamento. Depois disso, a entrega leva 5 dias úteis no Frete Padrão, 1 a 2 dias úteis no Frete Express e 7 a 10 dias úteis no Frete Grátis.",
  },
  {
    q: "O frete é grátis?",
    a: `Sim, para compras a partir de R$ ${FREE_SHIPPING_MIN} em produtos, para todo o Brasil. Abaixo disso, você escolhe o frete no checkout e vê o valor antes de pagar.`,
  },
  {
    q: "Quais as formas de pagamento?",
    a: `Pix, com ${Math.round(PIX_DISCOUNT * 100)}% de desconto quando o cartão estiver liberado, e cartão de crédito à vista.`,
  },
  {
    q: "Como escolho o tamanho?",
    a: "Na página de cada produto você escolhe o tamanho e a cor antes de comprar. Os pijamas vão do infantil 2 anos ao plus size G3, e nos conjuntos você escolhe o tamanho da camiseta e o da calça separadamente, as pantufas do 22 ao 46, e o Snuggy e os cobertores vestíveis têm tamanhos infantis (4 a 14 anos) e adulto.",
  },
  {
    q: "Posso trocar se não servir?",
    a: "Sim. Você tem 7 dias para desistir da compra e até 30 dias para trocar pijamas, Snuggy e pantufas por outro tamanho ou cor, sem uso e com a etiqueta.",
  },
  {
    q: "Como acompanho meu pedido?",
    a: "Você recebe o código de rastreio por e-mail assim que o pedido sai. Também dá para consultar na página Rastrear pedido, pelo CPF de quem comprou.",
  },
];
