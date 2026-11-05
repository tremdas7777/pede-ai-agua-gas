import { describe, expect, test } from "bun:test";
import { availableBundles, getBundle, parseVariant, encodeVariant } from "./bundles";
import { crocsPairSelection } from "./crocs-selection";

describe("Crocs offers", () => {
  test("every single Crocs costs 99", () => {
    const singles = availableBundles.filter((p) => p.category === "crocs" && p.id !== "crocs2");
    expect(singles.length).toBeGreaterThan(1);
    for (const p of singles) expect(p.price).toBe(99);
  });

  test("two Crocs cost 149", () => {
    expect(getBundle("crocs2").price).toBe(149);
    expect(getBundle("crocs2").unidades).toBe(2);
  });

  test("customer can choose two different models and sizes", () => {
    const pair = getBundle("crocs2");
    const first = getBundle("crocs1");
    const a = first.options[0]?.values[0] ?? "";
    const b = first.options[0]?.values[1] ?? "";
    expect(a).not.toBe(b);
    const chosen = crocsPairSelection(first, [a, "34"], [b, "43"]);
    expect(chosen).toEqual([a, "34", b, "43"]);
    expect(parseVariant(pair, encodeVariant(chosen))).toEqual(chosen);
  });

  test("upgrading a specific model retains that model and size", () => {
    const first = getBundle("cr21a");
    const second = getBundle("crocs2").options[2]?.values[1] ?? "";
    const chosen = crocsPairSelection(first, ["39"], [second, "40"]);
    expect(chosen).toEqual([first.name, "39", second, "40"]);
    expect(parseVariant(getBundle("crocs2"), encodeVariant(chosen))).toEqual(chosen);
  });
});