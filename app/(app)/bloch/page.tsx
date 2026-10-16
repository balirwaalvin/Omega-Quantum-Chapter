import type { Metadata } from "next";
import { BlochExplorer } from "@/components/quantum/BlochExplorer";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Bloch sphere" };

export default function BlochPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Quantum"
        title="Bloch sphere explorer"
        description="Apply H, X, Y, Z, S, or T and watch the state vector move. The sphere is drawn with Three.js."
      />
      <BlochExplorer />
    </div>
  );
}
