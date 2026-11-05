import { describe, expect, test } from "bun:test";
import { needsUtmifyRetry } from "./utmify-retry";

const now = Date.parse("2026-11-01T19:00:00Z");
const ago = (min: number) => new Date(now - min * 60_000).toISOString();

describe("reenvio de venda paga para a UTMify", () => {
  test("UTMify falhou há mais de 2 min: reenvia", () => {
    expect(
      needsUtmifyRetry(
        {
          id: "pb_1",
          paid_reported_at: null,
          report_result: { utmify: { ok: false }, at: ago(3) },
        },
        now,
      ),
    ).toBe(true);
  });

  test("UTMify falhou agora há pouco: espera a próxima rodada", () => {
    expect(
      needsUtmifyRetry(
        { id: "pb_1", paid_reported_at: null, report_result: { utmify: { ok: false }, at: ago(1) } },
        now,
      ),
    ).toBe(false);
  });

  test("UTMify confirmou (mesmo com o Meta falhando): não reenvia", () => {
    expect(
      needsUtmifyRetry(
        { id: "pb_1", paid_reported_at: null, report_result: { utmify: { ok: true }, at: ago(30) } },
        now,
      ),
    ).toBe(false);
  });

  test("cobrança de teste do admin: não reenvia", () => {
    expect(
      needsUtmifyRetry(
        {
          id: "pb_1",
          paid_reported_at: ago(30),
          report_result: { skipped: "cobrança de teste do admin", at: ago(30) },
        },
        now,
      ),
    ).toBe(false);
  });

  test("processo morreu no meio do envio (trava presa há mais de 5 min): reenvia", () => {
    expect(
      needsUtmifyRetry(
        { id: "pb_1", paid_reported_at: ago(6), report_result: {} },
        now,
      ),
    ).toBe(true);
  });

  test("envio em andamento (trava recente): não mexe", () => {
    expect(needsUtmifyRetry({ id: "pb_1", paid_reported_at: ago(1), report_result: null }, now)).toBe(
      false,
    );
  });
});
