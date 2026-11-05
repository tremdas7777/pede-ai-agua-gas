import type { BundleId } from "@/lib/bundles";

/** Produtos com a calça de felpa dos vídeos e do comparador (os kits de short ficam de fora). */
const CALCA: readonly BundleId[] = [
  "pijama",
  "pijamai",
  "kitcalca",
  "kitcalcaf",
  "kitcalcam",
  "kitcalcai",
];
export const temDestaquesPijama = (id: BundleId) => CALCA.includes(id);
