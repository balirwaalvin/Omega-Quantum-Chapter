import type { Metadata } from "next";
import { CircuitPlayground } from "@/components/quantum/CircuitPlayground";
import { PageHeader } from "@/components/ui/PageHeader";
import { groverTwoQubit } from "@/lib/quantum/examples";

export const metadata: Metadata = { title: "Grover Search" };

export default function GroverPage() {
  return (
    <div className="grid gap-5">
      <PageHeader
        eyebrow="Algorithms"
        title="Grover Search"
        description="Single-iteration amplitude amplification marking |11⟩ via phase flip and inversion about the mean."
      />
      <CircuitPlayground qubits={2} columns={12} initial={groverTwoQubit()} title="Grover iteration" />
    </div>
  );
}

