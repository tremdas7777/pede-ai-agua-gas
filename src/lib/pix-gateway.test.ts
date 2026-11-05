import { beforeEach, describe, expect, mock, setSystemTime, test } from "bun:test";

// Banco falso: private_settings em memória (gateway escolhido, chaves e última troca automática).
const settings = new Map<string, string>();
mock.module("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: {
    from: () => ({
      select: () => ({
        eq: (_col: string, key: string) => ({
          maybeSingle: async () => ({
            data: settings.has(key) ? { value: settings.get(key) } : null,
          }),
        }),
      }),
      upsert: async (row: { key: string; value: string }) => {
        settings.set(row.key, row.value);
        return { error: null };
      },
    }),
  },
}));

type Call = { url: string; init: RequestInit };
let calls: Call[] = [];
let queue: Array<() => Response> = [];
globalThis.fetch = (async (url: string, init: RequestInit = {}) => {
  calls.push({ url: String(url), init });
  const next = queue.shift();
  if (!next) throw new Error(`fetch inesperado ${url}`);
  return next();
}) as typeof fetch;
const reply = (status: number, body: unknown) => () =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const warnings: string[] = [];
console.warn = (...a: unknown[]) => void warnings.push(a.join(" "));
console.log = () => {};
console.error = () => {};

const { createPix, getLastPixFallback } = await import("./pix-gateway.server");
const { PayerDataError } = await import("./pix-errors");

const UMBRELLA = "https://api-gateway.umbrellapag.com/api/user/transactions";
const KOKU = "https://api.kokupay.com/v1/pix/charges";
const PIXGATE = "https://app.pixgateip.com/api/v1/cashin";
const PAYSHARK = "https://api.gatewaypayshark.com.br/v1/payment";

const KEY_SETTING = {
  pixgate: "pixgate_api_key",
  umbrella: "umbrella_api_key",
  sagacepay: "sagacepay_api_key",
  payshark: "payshark_api_key",
  koku: "koku_api_key",
} as const;

/** Gateway escolhido no /admin e quais gateways têm chave. */
function setup(selected: keyof typeof KEY_SETTING, withKey: Array<keyof typeof KEY_SETTING>) {
  settings.set("pix_gateway", selected);
  for (const g of withKey) settings.set(KEY_SETTING[g], `${g}_chave_de_teste_123`);
}

const address = {
  street: "Rua Teste",
  number: "10",
  neighborhood: "Centro",
  city: "Fortaleza",
  state: "ce",
  zipcode: "60000-000",
};
const pedido = {
  amount: 9700,
  customer: { name: "Cliente Teste", email: "c@teste.com", phone: "(85) 98888-7777", cpf: "52998224725" },
  address,
  description: "Loja",
  origin: "https://loja.test",
};

const umbrellaOk = reply(200, { data: { id: "tx1", status: "waiting_payment", pix: { qrcode: "QR-UM" } } });
const kokuOk = reply(201, { id: "c1", status: "pending", pix: { qr_code_payload: "QR-KO" } });
const kokuDisabled = reply(503, {
  error: { code: "provider_unavailable", details: { reason: "account_not_enabled" } },
});

// As chaves ficam 1 minuto em cache em cada gateway: o relógio anda 2 minutos a cada teste.
let clock = Date.now();
beforeEach(() => {
  clock += 120_000;
  setSystemTime(new Date(clock));
  settings.clear();
  calls = [];
  queue = [];
  warnings.length = 0;
});

describe("createPix com gateway reserva", () => {
  test("gateway ativo gera o Pix: não troca", async () => {
    setup("umbrella", ["umbrella", "koku"]);
    queue.push(umbrellaOk);
    expect(await createPix(pedido)).toEqual({ id: "um_tx1", qrcode: "QR-UM", status: "waiting_payment" });
    expect(calls.map((c) => c.url)).toEqual([UMBRELLA]);
    expect(warnings).toEqual([]);
    expect(await getLastPixFallback()).toBeNull();
  });

  test("ativo falha (Umbrella sem Pix) → Pix sai pela Koku com prefixo ko_ e fica registrado", async () => {
    setup("umbrella", ["umbrella", "koku"]);
    queue.push(reply(403, { message: "Pix não habilitado" }), kokuOk);
    expect(await createPix(pedido)).toEqual({ id: "ko_c1", qrcode: "QR-KO", status: "pending" });
    expect(calls.map((c) => c.url)).toEqual([UMBRELLA, KOKU]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toStartWith("pix-fallback umbrella -> koku ");
    expect(warnings[0]).not.toContain(pedido.customer.cpf);
    const last = await getLastPixFallback();
    expect(last).toMatchObject({ from: "umbrella", to: "koku" });
    expect(last?.at).toBe(new Date(clock).toISOString());
  });

  test("Koku sem Pix habilitado → reserva é o primeiro com chave na ordem (PixGate, sem prefixo)", async () => {
    setup("koku", ["pixgate", "koku"]);
    queue.push(kokuDisabled, reply(200, { id: 777, pix: "QR-PG", status: "PENDING" }));
    expect(await createPix(pedido)).toEqual({ id: "777", qrcode: "QR-PG", status: "pending" });
    expect(calls.map((c) => c.url)).toEqual([KOKU, PIXGATE]);
    expect(warnings[0]).toStartWith("pix-fallback koku -> pixgate ");
  });

  test("PayShark sem endereço não serve de reserva", async () => {
    setup("umbrella", ["umbrella", "payshark", "koku"]);
    queue.push(reply(500, {}), kokuOk);
    const { address: _sem, ...semEndereco } = pedido;
    expect((await createPix(semEndereco)).id).toBe("ko_c1");
    expect(calls.map((c) => c.url)).toEqual([UMBRELLA, KOKU]);
  });
});

describe("createPix sem troca de gateway", () => {
  test("CPF recusado pela Koku: mostra a mensagem e não tenta outro gateway", async () => {
    setup("koku", ["umbrella", "koku"]);
    queue.push(
      reply(422, {
        error: { code: "validation_error", details: { fields: [{ field: "payer.document", rule: "cpf" }] } },
      }),
    );
    const erro = await createPix(pedido).catch((e) => e);
    expect(erro).toBeInstanceOf(PayerDataError);
    expect(erro.message).toBe("Confira o CPF e tente novamente.");
    expect(calls.map((c) => c.url)).toEqual([KOKU]);
    expect(warnings).toEqual([]);
  });

  test("PayShark sem endereço: pede o CEP e não tenta outro gateway", async () => {
    setup("payshark", ["payshark", "koku"]);
    const { address: _sem, ...semEndereco } = pedido;
    const erro = await createPix(semEndereco).catch((e) => e);
    expect(erro).toBeInstanceOf(PayerDataError);
    expect(erro.message).toBe("Confira o CEP e o endereço de entrega.");
    expect(calls).toEqual([]);
  });

  test("PayShark recusa o celular (payer.phone): não tenta outro gateway", async () => {
    setup("payshark", ["payshark", "koku"]);
    queue.push(reply(422, { message: "Validation failed", details: { payer: { phone: "invalid" } } }));
    const erro = await createPix(pedido).catch((e) => e);
    expect(erro).toBeInstanceOf(PayerDataError);
    expect(erro.message).toContain("payer.phone: invalid");
    expect(calls.map((c) => c.url)).toEqual([PAYSHARK]);
  });

  test("sem outro gateway com chave: erro original do gateway ativo", async () => {
    setup("umbrella", ["umbrella"]);
    queue.push(reply(500, { message: "erro interno" }));
    await expect(createPix(pedido)).rejects.toThrow(
      "Não foi possível gerar o Pix. Confira seus dados e tente novamente.",
    );
    expect(calls.map((c) => c.url)).toEqual([UMBRELLA]);
    expect(warnings).toEqual([]);
    expect(await getLastPixFallback()).toBeNull();
  });

  test("reserva também falha: só uma tentativa extra, erro do ativo e nada registrado", async () => {
    setup("umbrella", ["umbrella", "koku"]);
    queue.push(reply(401, { message: "Unauthorized" }), kokuDisabled);
    await expect(createPix(pedido)).rejects.toThrow("Não foi possível gerar o Pix");
    expect(calls.map((c) => c.url)).toEqual([UMBRELLA, KOKU]);
    expect(await getLastPixFallback()).toBeNull();
  });
});
