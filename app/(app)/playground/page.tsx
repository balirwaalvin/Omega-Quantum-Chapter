import type { Metadata } from "next";
import { CircuitPlayground } from "@/components/quantum/CircuitPlayground";
import { PageHeader } from "@/components/ui/PageHeader";
import { bellPair } from "@/lib/quantum/examples";

export const metadata: Metadata = { title: "Circuit Lab" };

export default function PlaygroundPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Quantum Lab"
        title="Circuit Lab"
        description="Select a gate, then click a wire cell to simulate."
      />
      <CircuitPlayground initial={bellPair} columns={6} qubits={3} title="Bell pair starter" />
    </div>
  );
}

