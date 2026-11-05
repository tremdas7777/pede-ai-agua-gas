import { criarStore } from "./persistente";

export type Sacola = {
  gas: number;
  agua: number;
  marcaGas: string;
  marcaAgua: string;
  temVazioGas: boolean;
  temVazioAgua: boolean;
};

const VAZIA: Sacola = {
  gas: 0,
  agua: 0,
  marcaGas: "",
  marcaAgua: "",
  temVazioGas: true,
  temVazioAgua: true,
};

const store = criarStore<Sacola>("paag:sacola", VAZIA);

export const useSacola = store.usar;
export const atualizarSacola = store.definir;

export const MAX_ITENS = 10;

export function somar(tipo: "gas" | "agua", delta: number) {
  atualizarSacola((s) => ({ ...s, [tipo]: Math.max(0, Math.min(MAX_ITENS, s[tipo] + delta)) }));
}

export function adicionarCombo(gas: number, agua: number) {
  atualizarSacola((s) => ({
    ...s,
    gas: Math.min(MAX_ITENS, s.gas + gas),
    agua: Math.min(MAX_ITENS, s.agua + agua),
  }));
}

export function esvaziarSacola() {
  atualizarSacola((s) => ({ ...VAZIA, marcaGas: s.marcaGas, marcaAgua: s.marcaAgua }));
}
