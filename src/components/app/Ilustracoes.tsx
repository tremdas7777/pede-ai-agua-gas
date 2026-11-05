type Props = { className?: string };

const FOTOS = { gas: "/app/botijao-p13.webp", agua: "/app/galao-20l.webp" } as const;

export function Foto({ tipo, className = "" }: Props & { tipo: keyof typeof FOTOS }) {
  return (
    <img
      src={FOTOS[tipo]}
      alt=""
      draggable={false}
      loading="lazy"
      decoding="async"
      className={`pointer-events-none select-none object-contain ${className}`}
    />
  );
}

/** Botijões e galões lado a lado, levemente sobrepostos. */
export function FotoCombo({
  gas,
  agua,
  altura = "h-16",
}: {
  gas: number;
  agua: number;
  altura?: string;
}) {
  const itens = [...Array(gas).fill("gas"), ...Array(agua).fill("agua")] as ("gas" | "agua")[];
  return (
    <div className="flex items-end justify-center">
      {itens.map((t, i) => (
        <Foto
          key={i}
          tipo={t}
          className={`${altura} w-auto ${i > 0 ? "-ml-2" : ""} drop-shadow-[0_6px_6px_rgba(16,17,20,0.18)]`}
        />
      ))}
    </div>
  );
}

export function Simbolo({ className }: Props) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="#1f4bff" />
      <path d="M16.5 8.5s-8 9.3-8 14.8a8 8 0 0 0 16 0c0-5.5-8-14.8-8-14.8z" fill="#ffffff" />
      <path
        d="M27.6 17.2c1 3 5.4 5 5.4 10.3a5.9 5.9 0 0 1-11.8 0c0-2.6 1.5-4.3 2.6-5.3.3 1.6 1.3 2.6 2.4 2.6 0-2.6.8-5.1 1.4-7.6z"
        fill="#ffc83d"
        stroke="#1f4bff"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Marca() {
  return (
    <span className="flex items-center gap-2">
      <Simbolo className="h-8 w-8 shrink-0" />
      <span className="titulo-largo text-[19px] text-tinta">Pede Aí</span>
    </span>
  );
}
