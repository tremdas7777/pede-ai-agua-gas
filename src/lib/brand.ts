/**
 * Marca da loja — Pede Aí Água e Gás.
 * A loja não tem e-mail: o atendimento é pelo WhatsApp (número abaixo ou o do admin).
 */
export const brand = {
  name: "Pede Aí Água e Gás",
  /** Endereço oficial da loja (o webhook dos gateways sempre aponta para cá). */
  siteUrl: "https://pedeaiaguaegas.com.br",
  productName: "Pede Aí Água e Gás",
  /** Nome genérico que aparece na fatura do cliente (gateways Pix e cartão). */
  gatewayName: "Pede Ai Agua e Gas",
  tagline: "Água mineral e gás de cozinha entregues na sua porta, em todo o Brasil",
  taglineShort: "Água e gás com entrega rápida",
  manufacturer: "Pede Aí Água e Gás",
  manufacturerTagline: "Rede de delivery de água e gás",
  cnpj: "64.756.111/0001-05",
  whatsapp: {
    /**
     * Número inicial em E.164 (55 + DDD + número), sem símbolos. Depois de trocado no
     * admin (Configurações da loja → Botão de WhatsApp), vale o do admin. Vazio = oculto.
     */
    phoneE164: "5585958549956",
    message: "Olá! Vim pelo Pede Aí Água e Gás e quero tirar uma dúvida.",
  },
  colors: {
    primary: "#1a4bd6",
    primaryDark: "#143bb0",
    primaryDeep: "#0d2a7d",
    onPrimary: "#ffffff",
    surfaceTint: "#eaf0ff",
    accent: "#ff6a00",
    accentDark: "#d95800",
  },
} as const;
