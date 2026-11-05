import { trackFunnelEvent } from "@/lib/checkout-tracking.functions";

const SESSION_KEY = "bshop_session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const UTM_KEYS = [
  "src",
  "sck",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
const UTM_STORE = "bshop_utms";

/** Domínios da própria loja (navegação interna não é origem). */
const PROPRIOS = /(^|\.)(banguelashop\.store|lovable\.app|lovableproject\.com)$/;
/** Buscadores: a visita sem UTM vinda deles é busca orgânica. */
const BUSCADORES = /^(google|bing|yahoo|duckduckgo|ecosia|yandex)\./;

/**
 * Origem de uma visita SEM UTM, pelo site de onde veio: busca no Google vira "google / organic";
 * outros sites (Instagram sem parâmetros, ChatGPT, etc.) viram "<site> / referral". Sem isso a venda
 * chega na UTMify sem origem nenhuma ("não trackeada").
 */
function utmsDoReferrer(): Record<string, string> {
  let site = "";
  try {
    const r = new URL(document.referrer);
    if (r.protocol === "android-app:") {
      // App Android que abriu o link (ex.: app do Google, com.google.android.googlequicksearchbox).
      site = r.hostname.includes("google") ? "google.com" : r.hostname;
    } else if (r.protocol === "http:" || r.protocol === "https:") {
      if (r.hostname === window.location.hostname || PROPRIOS.test(r.hostname)) return {};
      site = r.hostname.replace(/^(www|l|lm|m|mobile)\./, "");
    }
  } catch {
    return {};
  }
  if (!site) return {};
  return BUSCADORES.test(site)
    ? { utm_source: site.split(".")[0]!, utm_medium: "organic" }
    : { utm_source: site.slice(0, 300), utm_medium: "referral" };
}

/**
 * Guarda as UTMs da visita (localStorage) para enviá-las na venda. UTM na URL sempre vale (é o
 * anúncio). Sem UTM e sem nada guardado, guarda a origem pelo referrer; ela nunca substitui UTMs
 * de anúncio já guardadas.
 */
export function getStoredUtms(): Record<string, string | null> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const fromUrl: Record<string, string | null> = {};
  for (const k of UTM_KEYS) {
    const v = p.get(k);
    if (v) fromUrl[k] = v.slice(0, 300);
  }
  try {
    if (Object.keys(fromUrl).length) {
      localStorage.setItem(UTM_STORE, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const raw = localStorage.getItem(UTM_STORE);
    if (raw) return JSON.parse(raw) as Record<string, string | null>;
    const ref = utmsDoReferrer();
    if (Object.keys(ref).length) localStorage.setItem(UTM_STORE, JSON.stringify(ref));
    return ref;
  } catch {
    return fromUrl;
  }
}

function getUtmParams() {
  const u = getStoredUtms();
  return {
    utm_source: u["utm_source"] ?? null,
    utm_medium: u["utm_medium"] ?? null,
    utm_campaign: u["utm_campaign"] ?? null,
  };
}

export type FunnelEventInput = {
  event_type: "page_view" | "product_view" | "checkout_click";
  path?: string;
  bundle_id?: string;
  bundle_name?: string;
  value?: number;
  metadata?: Record<string, unknown>;
};

export async function trackEvent(input: FunnelEventInput) {
  if (typeof window === "undefined") return;
  try {
    const utm = getUtmParams();
    const source = input.metadata?.["source"];
    await trackFunnelEvent({
      data: {
        sessionId: getSessionId(),
        event_type: input.event_type,
        path: (input.path ?? window.location.pathname).slice(0, 300),
        bundle_id: input.bundle_id?.slice(0, 80) ?? null,
        bundle_name: input.bundle_name?.slice(0, 160) ?? null,
        value: input.value ?? null,
        referrer: document.referrer ? document.referrer.slice(0, 500) : null,
        user_agent: navigator.userAgent.slice(0, 400),
        utm_source: utm.utm_source?.slice(0, 300) ?? null,
        utm_medium: utm.utm_medium?.slice(0, 300) ?? null,
        utm_campaign: utm.utm_campaign?.slice(0, 300) ?? null,
        source: typeof source === "string" ? source.slice(0, 60) : null,
      },
    });
  } catch (e) {
    console.warn("trackEvent failed", e);
  }
}
