import { criarStore } from "./persistente";

export type Local = { cep: string; cidade: string; uf: string; bairro: string; rua: string };

const store = criarStore<Local>("paag:local", { cep: "", cidade: "", uf: "", bairro: "", rua: "" });

export const useLocal = store.usar;
export const salvarLocal = (l: Local) => store.definir(() => l);

/** Pede permissão ao navegador e tenta descobrir o CEP aproximado do visitante. */
export async function detectarLocalizacao(): Promise<Local | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return null;
  const posicao = await new Promise<GeolocationPosition | null>((resolve) => {
    navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 300000,
    });
  });
  if (!posicao) return null;
  const { latitude, longitude } = posicao.coords;
  const resposta = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`,
  );
  if (!resposta.ok) return null;
  const j = (await resposta.json()) as {
    postcode?: string;
    city?: string;
    locality?: string;
    principalSubdivisionCode?: string;
    principalSubdivision?: string;
    localityInfo?: { administrative?: { name?: string }[] };
  };
  const cep = soDigitos(j.postcode ?? "");
  const uf = (j.principalSubdivisionCode ?? "").replace(/^BR-/, "");
  const cidade = j.city || j.locality || "";
  if (cep.length !== 8 || !cidade || !uf) return null;
  return { cep, cidade, uf, bairro: j.locality ?? "", rua: "" };
}

export const soDigitos = (v: string) => v.replace(/\D/g, "");

export function mascaraTelefone(v: string) {
  const d = soDigitos(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function mascaraCep(v: string) {
  const d = soDigitos(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export async function buscarCep(cep: string): Promise<Local | null> {
  const limpo = soDigitos(cep);
  if (limpo.length !== 8) return null;
  const resposta = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
  if (!resposta.ok) return null;
  const j = (await resposta.json()) as {
    erro?: boolean | string;
    localidade?: string;
    uf?: string;
    bairro?: string;
    logradouro?: string;
  };
  if (j.erro || !j.localidade || !j.uf) return null;
  return {
    cep: limpo,
    cidade: j.localidade,
    uf: j.uf,
    bairro: j.bairro ?? "",
    rua: j.logradouro ?? "",
  };
}
