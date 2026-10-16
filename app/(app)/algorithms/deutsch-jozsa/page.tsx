import type { Metadata } from "next";
import { CircuitPlayground } from "@/components/quantum/CircuitPlayground";
import { PageHeader } from "@/components/ui/PageHeader";
import { deutschJozsa } from "@/lib/quantum/examples";

export const metadata: Metadata = { title: "Deutsch-Jozsa" };

export default function DeutschJozsaPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Algorithms"
        title="Deutsch-Jozsa"
        description="A promised function is either constant or balanced. One quantum query is enough to tell which."
      />
      <div className="space-y-3 text-sm leading-7">
        <p>
          Wire 0 is the input qubit. Wire 1 is an ancilla prepared in |1⟩ and then put into superposition with H. The balanced case uses CNOT as the oracle f(x) = x. The constant case applies no oracle.
        </p>
        <p>
          After the final H on the input, a constant function leaves the input in |0⟩. A balanced function sends that amplitude elsewhere, so measuring 1 means balanced.
        </p>
      </div>
      <CircuitPlayground qubits={2} initial={deutschJozsa(false)} title="Constant oracle" />
      <CircuitPlayground qubits={2} initial={deutschJozsa(true)} title="Balanced oracle" />
    </div>
  );
}
