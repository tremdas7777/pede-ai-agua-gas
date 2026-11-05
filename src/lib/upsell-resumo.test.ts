import { describe, expect, test } from "bun:test";
import { etapaDoUpsell, resumoUpsell } from "./upsell-resumo";

const principal = (status: string) => ({ status, amount_cents: 9790, customer: {} });
const upsell = (status: string, itens: string[] | undefined, cents: number) => ({
  status,
  amount_cents: cents,
  customer: { upsellOf: "pb_main", upsellItems: itens },
});

describe("resumo do pós-compra no /admin", () => {
  test("separa as etapas pelo que foi comprado", () => {
    expect(etapaDoUpsell(["pilhas4"])).toBe("pilhas");
    expect(etapaDoUpsell(["kit", "seguro"])).toBe("ofertas");
    expect(etapaDoUpsell(["expresso"])).toBe("expresso");
    expect(etapaDoUpsell(undefined)).toBe("ofertas");
  });

  test("conta gerados, pagos e o valor pago por etapa", () => {
    const r = resumoUpsell(
      [
        principal("paid"),
        principal("paid"),
        principal("waiting_payment"),
        upsell("paid", ["pilhas4"], 8990),
        upsell("waiting_payment", ["pilhas2"], 4990),
        upsell("paid", ["kit", "seguro"], 12000),
      ],
      ["pilhas", "ofertas", "expresso"],
    );
    expect(r.pedidosPagos).toBe(2);
    expect(r.linhas).toEqual([
      { etapa: "pilhas", gerados: 2, pagos: 1, valorGerado: 13980, valorPago: 8990 },
      { etapa: "ofertas", gerados: 1, pagos: 1, valorGerado: 12000, valorPago: 12000 },
      { etapa: "expresso", gerados: 0, pagos: 0, valorGerado: 0, valorPago: 0 },
    ]);
    expect(r.valorGerado).toBe(25980);
    expect(r.valorPago).toBe(20990);
  });

  test("cobrança de teste do admin não conta", () => {
    const r = resumoUpsell(
      [{ status: "paid", amount_cents: 500, customer: { testOf: "pb_main" } }],
      ["ofertas"],
    );
    expect(r.pedidosPagos).toBe(0);
    expect(r.gerados).toBe(0);
  });
});
