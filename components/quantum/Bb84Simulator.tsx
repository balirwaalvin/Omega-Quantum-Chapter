"use client";

import { useMemo, useState } from "react";
import { runBb84Protocol } from "@/lib/quantum/bb84";

export function Bb84Simulator() {
  const [length, setLength] = useState(16);
  const [eavesdropPercent, setEavesdropPercent] = useState(0);
  const [seed, setSeed] = useState(20261115);

  const sim = useMemo(
    () =>
      runBb84Protocol({
        length,
        eavesdropRate: eavesdropPercent / 100,
        seed,
      }),
    [length, eavesdropPercent, seed],
  );

  return (
    <div className="space-y-5">
      {/* Control Panel */}
      <div className="alpha-card-frame">
        <div className="rounded-[8px] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-alpha-blue">
                Quantum Channel Controls
              </p>
              <h2 className="text-base font-bold text-ucu-blue">
                Alice → Quantum Fiber → Bob (with Optional Eve Tap)
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setSeed((s) => s + 137)}
              className="btn text-xs"
            >
              Transmit New Photon Batch
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <span className="block text-xs font-semibold text-ink">
                Transmitted Qubits (Photons): {length}
              </span>
              <div className="mt-1.5 flex gap-2">
                {[12, 16, 24, 32].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setLength(count)}
                    className={
                      length === count
                        ? "btn px-3 py-1 text-xs"
                        : "btn-secondary px-3 py-1 text-xs"
                    }
                  >
                    {count} qubits
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-ink">
                <span>Eve Intercept-Resend Rate</span>
                <span className="font-mono text-magenta">
                  {eavesdropPercent}%{" "}
                  {eavesdropPercent === 0
                    ? "(No Eavesdropper)"
                    : eavesdropPercent === 100
                      ? "(Full Wiretap)"
                      : "(Partial Tap)"}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={25}
                value={eavesdropPercent}
                onChange={(e) => setEavesdropPercent(Number(e.target.value))}
                className="mt-2 w-full accent-magenta"
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted">
                <span>0% Safe</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100% Eve</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Sifted Key Telemetry Banner */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-alpha-blue">
            Basis Sifting Efficiency
          </p>
          <p className="mt-1 text-2xl font-extrabold text-ucu-blue">
            {sim.siftedCount} / {length} bits
          </p>
          <p className="mt-0.5 text-xs text-muted">
            Kept where Alice &amp; Bob chose matching basis (Z or X)
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-alpha-blue">
            Quantum Bit Error Rate (QBER)
          </p>
          <p
            className={`mt-1 text-2xl font-extrabold ${
              sim.qber > 0 ? "text-magenta" : "text-emerald-700"
            }`}
          >
            {(sim.qber * 100).toFixed(1)}%
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {sim.errorCount} bit mismatch{sim.errorCount === 1 ? "" : "es"} in
            sifted key (Theoretical Eve = 25%)
          </p>
        </div>

        <div
          className={`rounded-xl border p-4 shadow-2xs ${
            sim.compromised
              ? "border-magenta/40 bg-magenta/5"
              : "border-emerald-200 bg-emerald-50/60"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink">
            Channel Security Verdict
          </p>
          <p
            className={`mt-1 text-base font-extrabold uppercase ${
              sim.compromised ? "text-magenta" : "text-emerald-800"
            }`}
          >
            {sim.compromised
              ? "⚠ Eavesdropper Detected — Abort Key"
              : "✓ Quantum Channel Secure"}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {sim.compromised
              ? "Eve's measurement collapsed conjugate states, introducing bit errors."
              : "Zero state disturbance observed across sifted basis checks."}
          </p>
        </div>
      </div>

      {/* Sifted Key Comparison */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ucu-blue">
          Extracted Sifted Secret Key
        </h3>
        <div className="mt-2 grid gap-2 font-mono text-xs sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-2.5">
            <span className="font-sans text-[11px] font-semibold text-muted">
              Alice Sifted Key:{" "}
            </span>
            <span className="font-bold tracking-widest text-ucu-blue">
              {sim.aliceSiftedKey || "—"}
            </span>
          </div>
          <div className="rounded-lg bg-slate-50 p-2.5">
            <span className="font-sans text-[11px] font-semibold text-muted">
              Bob Sifted Key:{" "}
            </span>
            <span
              className={`font-bold tracking-widest ${
                sim.compromised ? "text-magenta" : "text-emerald-700"
              }`}
            >
              {sim.bobSiftedKey || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Photon-by-Photon Transmission Register */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-ucu-blue">
          Photon-by-Photon Quantum Register Trace
        </h3>
        <table className="w-full min-w-[640px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-muted">
              <th className="py-2 pr-2">#</th>
              <th className="py-2 px-2">Alice Bit</th>
              <th className="py-2 px-2">Alice Basis</th>
              <th className="py-2 px-2">Sent State</th>
              <th className="py-2 px-2">Eve Basis</th>
              <th className="py-2 px-2">Bob Basis</th>
              <th className="py-2 px-2">Bob Bit</th>
              <th className="py-2 pl-2">Sifted Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {sim.photons.map((p) => (
              <tr
                key={p.index}
                className={
                  p.error
                    ? "bg-magenta/8"
                    : p.sifted
                      ? "bg-emerald-50/40"
                      : "opacity-60"
                }
              >
                <td className="py-2 pr-2 text-muted">{p.index}</td>
                <td className="py-2 px-2 font-bold text-ucu-blue">
                  {p.aliceBit}
                </td>
                <td className="py-2 px-2">{p.aliceBasis}</td>
                <td className="py-2 px-2 font-semibold text-alpha-blue">
                  {p.aliceStateLabel}
                </td>
                <td className="py-2 px-2">
                  {p.intercepted ? (
                    <span className="rounded bg-magenta/15 px-1.5 py-0.5 text-[10px] font-bold text-magenta">
                      {p.eveBasis} → {p.eveBit}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="py-2 px-2">{p.bobBasis}</td>
                <td className="py-2 px-2 font-bold text-ink">{p.bobBit}</td>
                <td className="py-2 pl-2 font-sans text-[11px] font-semibold">
                  {!p.sifted ? (
                    <span className="text-slate-400">Discarded (Basis ≠)</span>
                  ) : p.error ? (
                    <span className="text-magenta">✗ Error (QBER)</span>
                  ) : (
                    <span className="text-emerald-700">✓ Sifted Key Bit</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
