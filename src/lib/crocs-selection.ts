import type { Bundle } from "./bundles";

/** Preserve the first pair when upgrading a single Crocs purchase to the two-pair offer. */
export function crocsPairSelection(
  first: Pick<Bundle, "id" | "name">,
  firstValues: readonly string[],
  secondValues: readonly string[],
): string[] {
  const firstPair = first.id === "crocs1" ? firstValues : [first.name, firstValues[0] ?? ""];
  return [...firstPair, ...secondValues];
}