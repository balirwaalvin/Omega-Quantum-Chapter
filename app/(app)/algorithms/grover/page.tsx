import type { Metadata } from "next";
import { CircuitPlayground } from "@/components/quantum/CircuitPlayground";
import { PageHeader } from "@/components/ui/PageHeader";
import { groverTwoQubit } from "@/lib/quantum/examples";

export const metadata: Metadata = { title: "Grover" };

export default function GroverPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Algorithms"
        title="Grover search"
        description="One iteration of amplitude amplification for the marked state |11⟩ on two qubits."
      />
      <div className="space-y-3 text-sm leading-7">
        <p>
          Both qubits start with H, an equal superposition. The oracle marks |11⟩ with a phase flip. With only H, X, and CNOT available here, that phase flip is a controlled-Z written as H on the target, CNOT, and H again.
        </p>
        <p>
          Diffusion reflects about the mean: H and X around another controlled-Z, then H again. On two qubits a single iteration concentrates the probability on |11⟩. Run the circuit and compare the bars.
        </p>
      </div>
      <CircuitPlayground qubits={2} columns={12} initial={groverTwoQubit()} title="Grover iteration" />
    </div>
  );
}
