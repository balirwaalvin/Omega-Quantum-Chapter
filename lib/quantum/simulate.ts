export type GateName = "H" | "X" | "Y" | "Z" | "CNOT" | "M";

export type PlacedGate = {
  gate: GateName;
  /** Control wire when gate is CNOT. The cell itself sits on the target wire. */
  control?: number;
};

export type CircuitGrid = Array<Array<PlacedGate | null>>;

const gateMap: Record<Exclude<GateName, "CNOT" | "M">, string> = {
  H: "h",
  X: "x",
  Y: "y",
  Z: "z",
};

/**
 * Runs a small circuit with quantum-circuit and returns computational-basis probabilities.
 * Simulation stays in the browser so the playground works offline.
 */
export async function simulateCircuit(qubits: number, grid: CircuitGrid): Promise<number[]> {
  const { default: QuantumCircuit } = await import(
    "quantum-circuit/dist/quantum-circuit.js"
  );
  const circuit = new QuantumCircuit(qubits);

  grid.forEach((column, columnIndex) => {
    column.forEach((cell, wire) => {
      if (!cell) return;
      if (cell.gate === "CNOT") {
        const control = cell.control ?? (wire === 0 ? 1 : 0);
        if (control === wire) return;
        circuit.addGate("cx", columnIndex, [control, wire]);
        return;
      }
      if (cell.gate === "M") {
        circuit.addGate("measure", columnIndex, wire);
        return;
      }
      circuit.addGate(gateMap[cell.gate], columnIndex, wire);
    });
  });

  circuit.run();
  const states = circuit.stateAsArray() as Array<{ index: number; magnitude: number }>;
  const size = 2 ** qubits;
  const probabilities = Array.from({ length: size }, () => 0);
  for (const entry of states) {
    if (entry.index >= 0 && entry.index < size) {
      probabilities[entry.index] = entry.magnitude;
    }
  }
  return probabilities;
}

export function basisLabel(index: number, qubits: number): string {
  return index.toString(2).padStart(qubits, "0");
}
