import type { CircuitGrid } from "@/lib/quantum/simulate";

/** One-bit Deutsch-Jozsa. Ancilla is wire 1. Balanced oracle is CNOT; constant oracle is identity. */
export function deutschJozsa(balanced: boolean): CircuitGrid {
  return [
    [{ gate: "H" }, { gate: "X" }],
    [null, { gate: "H" }],
    balanced ? [null, { gate: "CNOT", control: 0 }] : [null, null],
    [{ gate: "H" }, null],
    [{ gate: "M" }, null],
  ];
}

/**
 * One Grover iteration that marks |11>.
 * The phase oracle is CZ, written with H, CNOT, H because the playground gate set is H, X, Y, Z, CNOT, and measure.
 */
export function groverTwoQubit(): CircuitGrid {
  const H = { gate: "H" as const };
  const X = { gate: "X" as const };
  const cz: CircuitGrid[number] = [null, { gate: "CNOT", control: 0 }];
  return [
    [H, H],
    [null, H],
    cz,
    [null, H],
    [H, H],
    [X, X],
    [null, H],
    cz,
    [null, H],
    [X, X],
    [H, H],
    [{ gate: "M" }, { gate: "M" }],
  ];
}

export const bellPair: CircuitGrid = [
  [{ gate: "H" }, null],
  [null, { gate: "CNOT", control: 0 }],
  [{ gate: "M" }, { gate: "M" }],
];
