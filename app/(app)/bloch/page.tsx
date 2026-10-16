import type { Metadata } from "next";
import { BlochExplorer } from "@/components/quantum/BlochExplorer";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Bloch Sphere" };

export default function BlochPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Quantum Lab"
        title="3D Bloch Sphere"
        description="Apply single-qubit gates to rotate the state vector."
      />
      <BlochExplorer />
    </div>
  );
}

