import { useState, type ReactNode } from "react";
import { ArrowRight, Loader2, Minus, Plus, X } from "lucide-react";
import { buscarCep, mascaraCep, salvarLocal } from "@/lib/local";
import { MAX_ITENS } from "@/lib/sacola";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#e9e6df]">
      <div className="relative mx-auto min-h-dvh max-w-md bg-papel pb-32 text-tinta md:shadow-[0_0_0_1px_#e0dcd2]">
        {children}
      </div>
    </div>
  );
}

/** Botão redondo "+" que fica sobre a foto do produto; vira contador quando já tem item. */
export function Quantidade({
  valor,
  rotulo,
  onMais,
  onMenos,
}: {
  valor: number;
  rotulo: string;
  onMais: () => void;
  onMenos: () => void;
}) {
  if (valor === 0) {
    return (
      <button
        type="button"
        onClick={onMais}
        aria-label={`Adicionar ${rotulo}`}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-cobalto shadow-[0_2px_10px_rgba(16,17,20,0.16)] ring-1 ring-black/5 transition active:scale-90"
      >
        <Plus className="h-[18px] w-[18px]" strokeWidth={2.75} />
      </button>
    );
  }
  return (
    <div className="flex h-9 items-center rounded-full bg-tinta text-white shadow-[0_2px_10px_rgba(16,17,20,0.22)]">
      <button
        type="button"
        onClick={onMenos}
        aria-label={`Diminuir ${rotulo}`}
        className="flex h-9 w-9 items-center justify-center rounded-full transition active:scale-90"
      >
        <Minus className="h-4 w-4" strokeWidth={2.75} />
      </button>
      <span className="min-w-4 text-center text-sm font-bold tabular-nums" aria-live="polite">
        {valor}
      </span>
      <button
        type="button"
        onClick={onMais}
        disabled={valor >= MAX_ITENS}
        aria-label={`Aumentar ${rotulo}`}
        className="flex h-9 w-9 items-center justify-center rounded-full transition active:scale-90 disabled:opacity-40"
      >
        <Plus className="h-4 w-4" strokeWidth={2.75} />
      </button>
    </div>
  );
}

export function CepForm({ onOk, autoFocus = false }: { onOk?: () => void; autoFocus?: boolean }) {
  const [cep, setCep] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const local = await buscarCep(cep);
      if (!local) {
        setErro("CEP não encontrado. Confira os 8 números.");
        return;
      }
      salvarLocal(local);
      onOk?.();
    } catch {
      setErro("Não deu pra consultar o CEP agora. Tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={enviar}>
      <div className="flex h-14 items-center gap-2 rounded-2xl bg-white pl-4 pr-1.5 ring-1 ring-linha focus-within:ring-2 focus-within:ring-tinta">
        <input
          value={cep}
          onChange={(e) => setCep(mascaraCep(e.target.value))}
          inputMode="numeric"
          autoComplete="postal-code"
          autoFocus={autoFocus}
          placeholder="Seu CEP"
          aria-label="CEP"
          className="min-w-0 flex-1 bg-transparent text-[17px] font-semibold tabular-nums text-tinta placeholder:font-medium placeholder:text-apagado/70 focus:outline-none"
        />
        <button
          type="submit"
          disabled={carregando || cep.length < 9}
          aria-label="Buscar CEP"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-tinta text-white transition active:scale-95 disabled:bg-linha disabled:text-apagado"
        >
          {carregando ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
        </button>
      </div>
      {erro && <p className="mt-2 text-[13px] font-medium text-red-700">{erro}</p>}
      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noreferrer"
        className="mt-2.5 inline-block text-[13px] font-medium text-apagado underline decoration-linha underline-offset-4"
      >
        Não sei meu CEP
      </a>
    </form>
  );
}

export function CepSheet({ aberto, onFechar }: { aberto: boolean; onFechar: () => void }) {
  if (!aberto) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Endereço de entrega"
      onClick={onFechar}
      className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/40 animate-in fade-in sm:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-papel px-5 pb-[max(28px,env(safe-area-inset-bottom))] pt-3 animate-in slide-in-from-bottom duration-300 sm:rounded-3xl sm:pb-6"
      >
        <div className="mx-auto mb-5 h-1 w-9 rounded-full bg-linha sm:hidden" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="titulo-largo text-[24px]">Onde entregamos?</h2>
            <p className="mt-2 text-sm text-apagado">
              Com o CEP mostramos a revenda da sua região, os preços e o prazo.
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-linha"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5">
          <CepForm onOk={onFechar} autoFocus />
        </div>
      </div>
    </div>
  );
}

export function Bloco({ titulo, sub, children }: { titulo: string; sub?: string; children: ReactNode }) {
  return (
    <section className="mt-3 bg-white px-4 pb-4 pt-5">
      <h2 className="titulo-largo text-[19px]">{titulo}</h2>
      {sub && <p className="mt-1.5 text-[13px] text-apagado">{sub}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function Campo({
  rotulo,
  valor,
  onChange,
  opcional,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
}: {
  rotulo: string;
  valor: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  opcional?: boolean;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block rounded-xl bg-papel px-3 pb-2 pt-1.5 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-tinta">
      <span className="block text-[11px] font-medium text-apagado">
        {rotulo}
        {opcional && " · opcional"}
      </span>
      <input
        type={type}
        value={valor}
        onChange={onChange}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-label={rotulo}
        className="w-full bg-transparent text-[15px] font-semibold text-tinta placeholder:font-normal placeholder:text-apagado/60 focus:outline-none"
      />
    </label>
  );
}

export function Chip({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`h-9 rounded-full px-3.5 text-[13px] font-semibold transition ${
        ativo ? "bg-tinta text-white" : "bg-white text-tinta ring-1 ring-linha"
      }`}
    >
      {children}
    </button>
  );
}

export function TituloSecao({ titulo, acao }: { titulo: string; acao?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="titulo-largo text-[21px]">{titulo}</h2>
      {acao}
    </div>
  );
}
