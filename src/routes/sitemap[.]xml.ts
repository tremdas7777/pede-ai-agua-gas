import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { absUrl, sitemapEntries } from "@/lib/seo";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Endereços absolutos (o Google recusa sitemap com caminho relativo) e as fotos de cada produto.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
          ...sitemapEntries().map(
            (e) =>
              `  <url><loc>${esc(absUrl(e.path))}</loc>${e.images
                .map((i) => `<image:image><image:loc>${esc(absUrl(i))}</image:loc></image:image>`)
                .join("")}</url>`,
          ),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
