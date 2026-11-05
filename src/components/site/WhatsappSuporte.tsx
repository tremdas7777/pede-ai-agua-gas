import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { brand } from "@/lib/brand";
import { getSiteSettings } from "@/lib/site-settings.functions";
import { formatWhatsapp, whatsappLink } from "@/lib/whatsapp";

/**
 * Número de atendimento da loja (o do admin ou, sem ele, o de brand.ts). A loja não tem e-mail,
 * então as páginas de contato e as políticas sempre mostram o WhatsApp, mesmo com o botão
 * flutuante desligado no admin.
 */
export function useWhatsappSuporte() {
  const fetchSettings = useServerFn(getSiteSettings);
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => fetchSettings(),
    staleTime: 60_000,
  });
  const phone = settings?.whatsappPhone || brand.whatsapp.phoneE164;
  const message = settings?.whatsappMessage ?? brand.whatsapp.message;
  return { phone, message, href: whatsappLink(phone, message), label: formatWhatsapp(phone) };
}

/** Link "WhatsApp +55 (85) …" para usar no meio de um texto. */
export function WhatsappSuporte() {
  const w = useWhatsappSuporte();
  return (
    <a
      href={w.href}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-[var(--primary)] hover:underline"
    >
      WhatsApp {w.label}
    </a>
  );
}
