import { useEffect, useState } from "react";
import { FREE_SHIPPING_MIN } from "@/lib/bundles";

const messages = [
  `Frete grátis em compras acima de R$ ${FREE_SHIPPING_MIN}`,
  "Brinde: chaveiro de dragão em toda compra",
  "Pelúcia gigante 1,10 m: 1 por R$ 69 ou 2 por R$ 89",
  "Pantufas de pelúcia: 2 pares por R$ 49,90",
  "Pix com desconto · Cartão de crédito",
  "Envio para todo o Brasil com rastreio",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="bg-[var(--mint)] text-[var(--night)]"
      role="region"
      aria-label="Anúncio da loja"
      aria-live="polite"
    >
      <p
        key={index}
        className="container-edge truncate py-2 text-center text-[12.5px] font-semibold leading-tight md:text-[13.5px] animate-in fade-in duration-500"
        title={messages[index]}
      >
        {messages[index]}
      </p>
    </div>
  );
}
