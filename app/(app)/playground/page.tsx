import type { Metadata } from "next";
import { CircuitPlayground } from "@/components/quantum/CircuitPlayground";
import { PageHeader } from "@/components/ui/PageHeader";
import { bellPair } from "@/lib/quantum/examples";

export const metadata: Metadata = { title: "Circuit playground" };

export default function PlaygroundPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Quantum"
        title="Circuit playground"
        description="Click a gate, then a cell. CNOT uses the control selector and lands on the target wire. Simulation uses quantum-circuit in the browser."
      />
      <CircuitPlayground initial={bellPair} columns={6} qubits={3} title="Bell pair starter" />
    </div>
  );
}
