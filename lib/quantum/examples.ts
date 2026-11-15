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

/** Three-qubit Greenberger-Horne-Zeilinger maximally entangled state (|000> + |111>)/sqrt(2). */
export const ghzThreeQubit: CircuitGrid = [
  [{ gate: "H" }, null, null],
  [null, { gate: "CNOT", control: 0 }, null],
  [null, null, { gate: "CNOT", control: 1 }],
  [{ gate: "M" }, { gate: "M" }, { gate: "M" }],
];

/** Three-qubit equal superposition across all 8 computational basis states. */
export const uniformSuperposition: CircuitGrid = [
  [{ gate: "H" }, { gate: "H" }, { gate: "H" }],
  [{ gate: "M" }, { gate: "M" }, { gate: "M" }],
];

export const circuitPresets: Record<
  "bell" | "ghz" | "superposition" | "deutsch-jozsa" | "grover",
  {
    id: "bell" | "ghz" | "superposition" | "deutsch-jozsa" | "grover";
    label: string;
    description: string;
    qubits: number;
    columns: number;
    grid: CircuitGrid;
  }
> = {
  bell: {
    id: "bell",
    label: "Bell State |Φ⁺⟩",
    description: "Two-qubit maximal entanglement via Hadamard + CNOT.",
    qubits: 3,
    columns: 6,
    grid: bellPair,
  },
  ghz: {
    id: "ghz",
    label: "3-Qubit GHZ State",
    description: "Tripartite entanglement (|000⟩ + |111⟩)/√2 across q0, q1, q2.",
    qubits: 3,
    columns: 6,
    grid: ghzThreeQubit,
  },
  superposition: {
    id: "superposition",
    label: "Uniform Superposition",
    description: "Hadamard layer across 3 qubits producing 8 equal-probability basis states.",
    qubits: 3,
    columns: 6,
    grid: uniformSuperposition,
  },
  "deutsch-jozsa": {
    id: "deutsch-jozsa",
    label: "Deutsch-Jozsa Balanced Oracle",
    description: "Single-query interference distinguishing balanced vs. constant functions.",
    qubits: 2,
    columns: 6,
    grid: deutschJozsa(true),
  },
  grover: {
    id: "grover",
    label: "Grover 2-Qubit Search (|11⟩)",
    description: "Phase oracle + diffusion operator amplifying the marked |11⟩ state.",
    qubits: 2,
    columns: 12,
    grid: groverTwoQubit(),
  },
};
