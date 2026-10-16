declare module "quantum-circuit/dist/quantum-circuit.js" {
  export default class QuantumCircuit {
    constructor(numQubits?: number);
    addGate(gateName: string, column: number, wires: number | number[]): void;
    run(initialState?: Array<0 | 1 | boolean>): void;
    stateAsArray(): Array<{ index: number; magnitude: number; indexBinStr: string }>;
    probabilities(): number[];
  }
}
