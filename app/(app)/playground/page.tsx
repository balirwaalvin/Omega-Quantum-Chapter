import type { Metadata } from "next";
import Link from "next/link";
import { CircuitPlayground } from "@/components/quantum/CircuitPlayground";
import { PageHeader } from "@/components/ui/PageHeader";
import { circuitPresets } from "@/lib/quantum/examples";
import type { CircuitPresetId } from "@/types";

export const metadata: Metadata = { title: "Circuit Lab" };

const presetOrder: CircuitPresetId[] = [
  "bell",
  "ghz",
  "superposition",
  "deutsch-jozsa",
  "grover",
];

export default async function PlaygroundPage({
  searchParams,
}: {
  searchParams: Promise<{ preset?: string }>;
}) {
  const { preset } = await searchParams;
  const presetKey: CircuitPresetId =
    preset && preset in circuitPresets
      ? (preset as CircuitPresetId)
      : "bell";
  const activePreset = circuitPresets[presetKey];

  return (
    <div>
      <PageHeader
        eyebrow="Quantum Lab"
        title="Circuit Lab"
        description="Select a quantum circuit preset or place gates directly on the register wires to simulate state probabilities."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-alpha-blue">
          Presets:
        </span>
        {presetOrder.map((id) => {
          const item = circuitPresets[id];
          const active = id === activePreset.id;
          return (
            <Link
              key={id}
              href={`/playground?preset=${id}`}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-ucu-blue text-white shadow-xs"
                  : "border border-slate-200 bg-slate-50 text-ink hover:border-alpha-blue/40 hover:bg-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <CircuitPlayground
        key={activePreset.id}
        initial={activePreset.grid}
        columns={activePreset.columns}
        qubits={activePreset.qubits}
        title={`${activePreset.label} — ${activePreset.description}`}
      />
    </div>
  );
}


