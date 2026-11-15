export type GateName = "H" | "X" | "Y" | "Z" | "S" | "T" | "CNOT" | "M";

export type PlacedGate = {
  gate: GateName;
  /** Control wire when gate is CNOT. The cell itself sits on the target wire. */
  control?: number;
};

export type CircuitGrid = Array<Array<PlacedGate | null>>;

export type QubitReadout = {
  wire: number;
  x: number;
  y: number;
  z: number;
  /** Tr(rho^2) in [0.5, 1.0]. < 0.99 indicates entanglement with other wires. */
  purity: number;
  entangled: boolean;
  p1: number;
};

export type SimulationResult = {
  probabilities: number[];
  qubits: QubitReadout[];
};

const gateMap: Record<Exclude<GateName, "CNOT" | "M">, string> = {
  H: "h",
  X: "x",
  Y: "y",
  Z: "z",
  S: "s",
  T: "t",
};

type Complex = { re: number; im: number };

function c(re: number, im = 0): Complex {
  return { re, im };
}

function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

function mul(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

/**
 * Pure statevector evolution for computing exact per-qubit reduced density
 * matrices, Bloch vectors, and entanglement purity prior to measurement.
 */
function evolveStatevector(qubits: number, grid: CircuitGrid): Complex[] {
  const dim = 1 << qubits;
  const state: Complex[] = Array.from({ length: dim }, (_, i) =>
    i === 0 ? c(1, 0) : c(0, 0),
  );
  const s2 = Math.SQRT1_2;
  const tPhase = c(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4));

  for (const column of grid) {
    for (let wire = 0; wire < qubits; wire++) {
      const cell = column[wire];
      if (!cell || cell.gate === "M") continue;

      const bit = 1 << wire;

      if (cell.gate === "CNOT") {
        const control = cell.control ?? (wire === 0 ? 1 : 0);
        if (control === wire || control < 0 || control >= qubits) continue;
        const ctrlBit = 1 << control;
        for (let idx = 0; idx < dim; idx++) {
          if ((idx & ctrlBit) !== 0 && (idx & bit) === 0) {
            const partner = idx | bit;
            const tmp = state[idx];
            state[idx] = state[partner];
            state[partner] = tmp;
          }
        }
        continue;
      }

      for (let idx = 0; idx < dim; idx++) {
        if ((idx & bit) !== 0) continue;
        const i0 = idx;
        const i1 = idx | bit;
        const a0 = state[i0];
        const a1 = state[i1];

        switch (cell.gate) {
          case "H":
            state[i0] = c((a0.re + a1.re) * s2, (a0.im + a1.im) * s2);
            state[i1] = c((a0.re - a1.re) * s2, (a0.im - a1.im) * s2);
            break;
          case "X":
            state[i0] = a1;
            state[i1] = a0;
            break;
          case "Y":
            // Y = [[0, -i], [i, 0]]
            state[i0] = c(a1.im, -a1.re);
            state[i1] = c(-a0.im, a0.re);
            break;
          case "Z":
            state[i1] = c(-a1.re, -a1.im);
            break;
          case "S":
            // S|1> = i|1>
            state[i1] = c(-a1.im, a1.re);
            break;
          case "T":
            state[i1] = mul(a1, tPhase);
            break;
        }
      }
    }
  }

  return state;
}

/**
 * Computes reduced single-qubit Bloch coordinates and state purity Tr(rho_k^2)
 * by partial-tracing over all other wires.
 */
function computeQubitReadouts(
  qubits: number,
  state: Complex[],
): QubitReadout[] {
  const dim = 1 << qubits;
  const readouts: QubitReadout[] = [];

  for (let wire = 0; wire < qubits; wire++) {
    const bit = 1 << wire;
    let rho00 = 0;
    let rho11 = 0;
    let rho01 = c(0, 0);

    for (let idx = 0; idx < dim; idx++) {
      if ((idx & bit) !== 0) continue;
      const i0 = idx;
      const i1 = idx | bit;
      const a0 = state[i0];
      const a1 = state[i1];
      rho00 += a0.re * a0.re + a0.im * a0.im;
      rho11 += a1.re * a1.re + a1.im * a1.im;
      // rho01 += a0 * conj(a1)
      rho01 = add(
        rho01,
        c(a0.re * a1.re + a0.im * a1.im, a0.im * a1.re - a0.re * a1.im),
      );
    }

    const x = 2 * rho01.re;
    const y = -2 * rho01.im;
    const z = rho00 - rho11;
    const rSq = Math.min(1, x * x + y * y + z * z);
    const purity = Number((0.5 * (1 + rSq)).toFixed(3));

    readouts.push({
      wire,
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      z: Number(z.toFixed(2)),
      purity,
      entangled: purity < 0.98,
      p1: Number(rho11.toFixed(3)),
    });
  }

  return readouts;
}

/**
 * Runs a small circuit with quantum-circuit and returns computational-basis probabilities.
 * Simulation stays in the browser so the playground works offline.
 */
export async function simulateCircuit(
  qubits: number,
  grid: CircuitGrid,
): Promise<number[]> {
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
  const states = circuit.stateAsArray() as Array<{
    index: number;
    magnitude: number;
  }>;
  const size = 2 ** qubits;
  const probabilities = Array.from({ length: size }, () => 0);
  for (const entry of states) {
    if (entry.index >= 0 && entry.index < size) {
      probabilities[entry.index] = entry.magnitude;
    }
  }
  return probabilities;
}

export async function simulateCircuitDetailed(
  qubits: number,
  grid: CircuitGrid,
): Promise<SimulationResult> {
  const probabilities = await simulateCircuit(qubits, grid);
  const sv = evolveStatevector(qubits, grid);
  const readouts = computeQubitReadouts(qubits, sv);
  return { probabilities, qubits: readouts };
}

export function basisLabel(index: number, qubits: number): string {
  return index.toString(2).padStart(qubits, "0");
}

/**
 * Exports a CircuitGrid into runnable Python Qiskit 1.x code.
 */
export function circuitToQiskit(qubits: number, grid: CircuitGrid): string {
  const lines: string[] = [
    "from qiskit import QuantumCircuit",
    "from qiskit.quantum_info import Statevector",
    "",
    `qc = QuantumCircuit(${qubits}, ${qubits})`,
  ];

  let hasOps = false;
  grid.forEach((column) => {
    column.forEach((cell, wire) => {
      if (!cell) return;
      hasOps = true;
      switch (cell.gate) {
        case "H":
        case "X":
        case "Y":
        case "Z":
        case "S":
        case "T":
          lines.push(`qc.${cell.gate.toLowerCase()}(${wire})`);
          break;
        case "CNOT": {
          const ctrl = cell.control ?? (wire === 0 ? 1 : 0);
          if (ctrl !== wire) {
            lines.push(`qc.cx(${ctrl}, ${wire})`);
          }
          break;
        }
        case "M":
          lines.push(`qc.measure(${wire}, ${wire})`);
          break;
      }
    });
  });

  if (!hasOps) {
    lines.push("# Place gates on the circuit wires above");
  }

  lines.push("", "print(qc.draw())");
  return lines.join("\n");
}

/**
 * Exports a CircuitGrid into standard OpenQASM 2.0 code for IBM Quantum Composer.
 */
export function circuitToOpenQasm(qubits: number, grid: CircuitGrid): string {
  const lines: string[] = [
    "OPENQASM 2.0;",
    'include "qelib1.inc";',
    `qreg q[${qubits}];`,
    `creg c[${qubits}];`,
    "",
  ];

  grid.forEach((column) => {
    column.forEach((cell, wire) => {
      if (!cell) return;
      switch (cell.gate) {
        case "H":
        case "X":
        case "Y":
        case "Z":
        case "S":
        case "T":
          lines.push(`${cell.gate.toLowerCase()} q[${wire}];`);
          break;
        case "CNOT": {
          const ctrl = cell.control ?? (wire === 0 ? 1 : 0);
          if (ctrl !== wire) {
            lines.push(`cx q[${ctrl}], q[${wire}];`);
          }
          break;
        }
        case "M":
          lines.push(`measure q[${wire}] -> c[${wire}];`);
          break;
      }
    });
  });

  return lines.join("\n");
}
