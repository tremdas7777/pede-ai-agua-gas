import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Lado = { src: string; label: string; alt: string };

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/**
 * Comparador de duas fotos com uma alça no meio. Fica indo e voltando sozinho enquanto está na
 * tela; quando a pessoa toca ou arrasta, para e obedece o dedo.
 */
export function BeforeAfter({ left, right }: { left: Lado; right: Lado }) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [auto, setAuto] = useState(true);
  const dragging = useRef(false);

  // Vai e volta sozinho (só na tela e sem "reduzir movimento").
  useEffect(() => {
    const el = box.current;
    if (!auto || !el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let visible = false;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      setPos(50 + 28 * Math.sin(((t - start) / 3200) * Math.PI * 2));
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      const now = !!e?.isIntersecting;
      if (now === visible) return;
      visible = now;
      if (visible) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [auto]);

  const moveTo = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r?.width) setPos(clamp(((clientX - r.left) / r.width) * 100));
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    setAuto(false);
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX);
  };
  const onUp = () => {
    dragging.current = false;
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setAuto(false);
    setPos((p) => clamp(p + (e.key === "ArrowLeft" ? -5 : 5)));
  };

  return (
    <div
      ref={box}
      role="slider"
      tabIndex={0}
      aria-label={`Comparar ${left.label.toLowerCase()} e ${right.label.toLowerCase()}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onKeyDown={onKey}
      className="relative aspect-square w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[20px] bg-[var(--tile)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--night)]"
    >
      <img
        src={right.src}
        alt={right.alt}
        draggable={false}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src={left.src}
        alt={left.alt}
        draggable={false}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />
      <span className="absolute bottom-4 left-4 rounded-md bg-black px-3.5 py-2 text-[13px] font-extrabold uppercase tracking-[0.04em] text-white">
        {left.label}
      </span>
      <span className="absolute bottom-4 right-4 rounded-md bg-black px-3.5 py-2 text-[13px] font-extrabold uppercase tracking-[0.04em] text-white">
        {right.label}
      </span>
      <div
        className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_6px_rgba(0,0,0,0.35)]"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--night)] shadow-md">
          <ChevronLeft className="h-4 w-4" strokeWidth={3} />
          <ChevronRight className="-ml-1 h-4 w-4" strokeWidth={3} />
        </span>
      </div>
    </div>
  );
}
