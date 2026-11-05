import { useSyncExternalStore } from "react";

/** Estado pequeno guardado no localStorage e compartilhado entre componentes. */
export function criarStore<T extends object>(chave: string, inicial: T) {
  let estado = inicial;
  let carregado = false;
  const ouvintes = new Set<() => void>();

  const carregar = () => {
    if (carregado || typeof window === "undefined") return;
    carregado = true;
    try {
      const salvo = localStorage.getItem(chave);
      if (salvo) estado = { ...inicial, ...JSON.parse(salvo) };
    } catch {}
  };

  const definir = (atualizar: (atual: T) => T) => {
    carregar();
    estado = atualizar(estado);
    try {
      localStorage.setItem(chave, JSON.stringify(estado));
    } catch {}
    ouvintes.forEach((o) => o());
  };

  const assinar = (ouvinte: () => void) => {
    ouvintes.add(ouvinte);
    return () => ouvintes.delete(ouvinte);
  };

  const usar = () =>
    useSyncExternalStore(
      assinar,
      () => {
        carregar();
        return estado;
      },
      () => inicial,
    );

  return { usar, definir };
}
