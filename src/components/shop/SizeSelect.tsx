import type { ProductOption } from "@/lib/bundles";
import { StoreSelect, type StoreSelectGroup } from "@/components/shop/StoreSelect";

const ADULTO = new Set(["PP", "P", "M", "G", "GG"]);

/** Grupo e rótulo de cada tamanho no menu: "Infantil • 2 anos", "Adulto • M", "Plus Size • G1". */
function rotulo(v: string, numeracao: boolean): { grupo: string; label: string } {
  const idade = /^(\d+) anos?$/.exec(v);
  if (idade) return { grupo: "Infantil", label: `Infantil • ${v}` };
  if (ADULTO.has(v)) return { grupo: "Adulto", label: `Adulto • ${v}` };
  if (/^G\d$/.test(v)) return { grupo: "Plus Size", label: `Plus Size • ${v}` };
  // Numeração de pantufa: infantil até o 34, adulto do 35 em diante. Em "Tamanho" (ex.: Crocs, que
  // já separam infantil, juvenil e adulto em versões), o número aparece sozinho.
  if (numeracao && /^\d{2}$/.test(v)) {
    const grupo = Number(v) <= 34 ? "Infantil" : "Adulto";
    return { grupo, label: `${grupo} • ${v}` };
  }
  return { grupo: "", label: v };
}

/** Menu "Escolha o tamanho" agrupado por Infantil / Adulto / Plus Size, no visual da loja. */
export function SizeSelect({
  option,
  value,
  onChange,
  missing,
}: {
  option: ProductOption;
  value: string | undefined;
  onChange: (v: string) => void;
  missing: boolean;
}) {
  const numeracao = /^Numeração/.test(option.name);
  const grupos: StoreSelectGroup[] = [];
  for (const v of option.values) {
    const { grupo, label } = rotulo(v, numeracao);
    const item = { value: v, label, short: label.split(" • ").at(-1) };
    const atual = grupos.at(-1);
    if (atual && atual.nome === grupo) atual.itens.push(item);
    else grupos.push({ nome: grupo, itens: [item] });
  }
  const titulo = numeracao ? "Escolha a numeração" : "Escolha o tamanho";
  return (
    <StoreSelect
      title={titulo}
      placeholder={titulo}
      label={option.name}
      groups={grupos}
      value={value}
      onChange={onChange}
      invalid={missing}
    />
  );
}
