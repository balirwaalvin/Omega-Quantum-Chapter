import type { Metadata } from "next";
import { CircuitPlayground } from "@/components/quantum/CircuitPlayground";
import { PageHeader } from "@/components/ui/PageHeader";
import { deutschJozsa } from "@/lib/quantum/examples";

export const metadata: Metadata = { title: "Deutsch-Jozsa" };

export default function DeutschJozsaPage() {
  return (
    <div className="grid gap-5">
      <PageHeader
        eyebrow="Algorithms"
        title="Deutsch-Jozsa"
        description="Distinguish constant vs. balanced oracle in a single query. Measuring |0⟩ on q0 indicates constant; |1⟩ indicates balanced."
      />
      <CircuitPlayground qubits={2} initial={deutschJozsa(false)} title="Constant oracle" />
      <CircuitPlayground qubits={2} initial={deutschJozsa(true)} title="Balanced oracle" />
    </div>
  );
}

