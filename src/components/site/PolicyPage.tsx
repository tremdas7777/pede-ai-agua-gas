import type { ReactNode } from "react";
import { SiteLayout } from "./Layout";

export function PolicyPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <SiteLayout>
      <section className="pt-32 md:pt-44 pb-24">
        <div className="container-edge max-w-3xl">
          <span className="eyebrow text-[var(--ink)]/40">Políticas</span>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] mt-6 mb-8 text-balance">
            {title}
          </h1>
          <p className="text-lg text-[var(--ink)]/70 leading-relaxed">{intro}</p>
          <div className="mt-16 space-y-8 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:mt-12 [&_h2]:mb-4 [&_p]:text-[var(--ink)]/70 [&_p]:leading-relaxed [&_ul]:list-none [&_ul]:p-0 [&_ul]:text-[var(--ink)]/70 [&_ul]:space-y-3 [&_li]:border-b [&_li]:border-[rgba(13,13,13,0.08)] [&_li]:pb-3">
            {children}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
