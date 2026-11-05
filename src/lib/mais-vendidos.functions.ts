import { createServerFn } from "@tanstack/react-start";
import type { BundleId } from "@/lib/bundles";
import {
  comFixos,
  DESTAQUES,
  MIN_VENDIDOS,
  produtoDaVitrine,
  type MaisVendidos,
} from "@/lib/mais-vendidos";

/** Janela do ranking e por quanto tempo o resultado fica guardado (evita consultar a cada visita). */
const DIAS = 90;
const CACHE_MS = 10 * 60 * 1000;
let cache: { at: number; data: MaisVendidos } | null = null;

const destaques = (): MaisVendidos => ({ ids: comFixos(DESTAQUES), reais: false });

/** Pedido que não vale: recusado, cancelado, estornado ou expirado. Pago e pendente contam. */
const NAO_CONTA = /refus|recus|fail|falh|cancel|refund|estorn|chargeback|expir/i;

type Linha = {
  bundle_id: string;
  status: string;
  customer: { upsellOf?: string; bumps?: { id?: string }[] } | null;
};

async function calcular(): Promise<MaisVendidos> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const desde = new Date(Date.now() - DIAS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabaseAdmin
    .from("pix_orders")
    .select("bundle_id,status,customer")
    .gte("created_at", desde)
    .limit(5000);
  if (error) throw new Error(error.message);

  const vendas = new Map<BundleId, number>();
  for (const o of (data ?? []) as unknown as Linha[]) {
    // Pagos e pendentes; upsell pós-compra é outra cobrança do mesmo cliente.
    if (NAO_CONTA.test(o.status ?? "") || o.customer?.upsellOf) continue;
    const ids = [o.bundle_id, ...(o.customer?.bumps ?? []).map((b) => b.id ?? "")];
    // Cada produto conta uma vez por pedido.
    const noPedido = new Set(ids.map(produtoDaVitrine).filter((x): x is BundleId => !!x));
    for (const id of noPedido) vendas.set(id, (vendas.get(id) ?? 0) + 1);
  }
  if (vendas.size < MIN_VENDIDOS) return destaques();
  const ranking = [...vendas.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
  return { ids: comFixos(ranking), reais: true };
}

export const getMaisVendidos = createServerFn({ method: "GET" }).handler(
  async (): Promise<MaisVendidos> => {
    if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;
    try {
      const data = await calcular();
      cache = { at: Date.now(), data };
      return data;
    } catch (e) {
      console.error("mais vendidos", e);
      return destaques();
    }
  },
);
