import type { Metadata } from "next";
import { Bb84Simulator } from "@/components/quantum/Bb84Simulator";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "BB84 Quantum Key Distribution" };

export default function Bb84Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quantum Cryptography"
        title="BB84 Quantum Key Distribution"
        description="Simulate how Alice and Bob establish an information-theoretically secure key using non-orthogonal single-photon states, and observe how measurement disturbance exposes an eavesdropper (Eve)."
      />
      <Bb84Simulator />
    </div>
  );
}
