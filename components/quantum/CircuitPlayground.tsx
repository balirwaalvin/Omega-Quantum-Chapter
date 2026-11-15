"use client";

import { useMemo, useState } from "react";
import {
  basisLabel,
  circuitToOpenQasm,
  circuitToQiskit,
  simulateCircuitDetailed,
  type CircuitGrid,
  type GateName,
  type PlacedGate,
  type QubitReadout,
} from "@/lib/quantum/simulate";

const tools: Array<GateName | "E"> = [
  "H",
  "X",
  "Y",
  "Z",
  "S",
  "T",
  "CNOT",
  "M",
  "E",
];

const gateColors: Record<GateName, string> = {
  H: "border-ucu-blue bg-ucu-blue text-white shadow-xs",
  X: "border-forest bg-forest text-white shadow-xs",
  Y: "border-forest bg-forest text-white shadow-xs",
  Z: "border-forest bg-forest text-white shadow-xs",
  S: "border-alpha-blue bg-alpha-blue text-white shadow-xs",
  T: "border-alpha-blue bg-alpha-blue text-white shadow-xs",
  CNOT: "border-gold bg-gold text-ucu-blue shadow-xs",
  M: "border-magenta bg-magenta text-white shadow-xs",
};

function emptyGrid(columns: number, qubits: number): CircuitGrid {
  return Array.from({ length: columns }, () =>
    Array.from({ length: qubits }, () => null),
  );
}

export function CircuitPlayground({
  qubits = 2,
  columns = 6,
  initial,
  readOnly = false,
  title = "Circuit",
}: {
  qubits?: number;
  columns?: number;
  initial?: CircuitGrid;
  readOnly?: boolean;
  title?: string;
}) {
  const width = Math.max(columns, initial?.length ?? 0);
  const [grid, setGrid] = useState<CircuitGrid>(() => {
    const base = emptyGrid(width, qubits);
    initial?.forEach((column, columnIndex) => {
      column.forEach((cell, wire) => {
        if (base[columnIndex] && wire < qubits) base[columnIndex][wire] = cell;
      });
    });
    return base;
  });
  const [tool, setTool] = useState<GateName | "E">("H");
  const [control, setControl] = useState(0);
  const [probabilities, setProbabilities] = useState<number[] | null>(null);
  const [qubitReadouts, setQubitReadouts] = useState<QubitReadout[] | null>(
    null,
  );
  const [codeTab, setCodeTab] = useState<"none" | "qiskit" | "qasm">("none");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);

  const wireLabels = useMemo(
    () => Array.from({ length: qubits }, (_, index) => `q${index}`),
    [qubits],
  );

  const exportedCode = useMemo(() => {
    if (codeTab === "qiskit") return circuitToQiskit(qubits, grid);
    if (codeTab === "qasm") return circuitToOpenQasm(qubits, grid);
    return "";
  }, [codeTab, qubits, grid]);

  function place(columnIndex: number, wire: number) {
    if (readOnly) return;
    setGrid((current) =>
      current.map((column, index) => {
        if (index !== columnIndex) return column;
        const next = [...column];
        if (tool === "E") {
          next[wire] = null;
          return next;
        }
        const cell: PlacedGate = { gate: tool };
        if (tool === "CNOT") {
          cell.control = control === wire ? (wire + 1) % qubits : control;
        }
        next[wire] = cell;
        return next;
      }),
    );
    setProbabilities(null);
    setQubitReadouts(null);
  }

  function clearCircuit() {
    setGrid(emptyGrid(width, qubits));
    setProbabilities(null);
    setQubitReadouts(null);
  }

  async function run() {
    setRunning(true);
    setError("");
    try {
      const result = await simulateCircuitDetailed(qubits, grid);
      setProbabilities(result.probabilities);
      setQubitReadouts(result.qubits);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Simulation failed.");
    } finally {
      setRunning(false);
    }
  }

  async function copyCode() {
    if (!exportedCode) return;
    try {
      await navigator.clipboard.writeText(exportedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard fallback ignored
    }
  }

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
      aria-labelledby="circuit-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="circuit-heading" className="text-lg font-semibold text-ucu-blue">
          {title}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={
              codeTab === "qiskit" ? "btn-gold text-xs" : "btn-secondary text-xs"
            }
            onClick={() =>
              setCodeTab((t) => (t === "qiskit" ? "none" : "qiskit"))
            }
          >
            {codeTab === "qiskit" ? "Hide Qiskit" : "Export Qiskit (Python)"}
          </button>
          <button
            type="button"
            className={
              codeTab === "qasm" ? "btn-gold text-xs" : "btn-secondary text-xs"
            }
            onClick={() => setCodeTab((t) => (t === "qasm" ? "none" : "qasm"))}
          >
            {codeTab === "qasm" ? "Hide OpenQASM" : "Export OpenQASM 2.0"}
          </button>
          {!readOnly ? (
            <button
              type="button"
              className="btn-secondary text-xs"
              onClick={clearCircuit}
            >
              Clear
            </button>
          ) : null}
          <button
            type="button"
            className="btn"
            onClick={run}
            disabled={running}
          >
            {running ? "Running…" : "Run simulation"}
          </button>
        </div>
      </div>

      {readOnly ? null : (
        <div
          className="mt-3 flex flex-wrap items-center gap-2"
          role="toolbar"
          aria-label="Gates"
        >
          {tools.map((item) => (
            <button
              key={item}
              type="button"
              className={tool === item ? "btn" : "btn-secondary"}
              aria-pressed={tool === item}
              onClick={() => setTool(item)}
            >
              {item === "E" ? "Erase" : item}
            </button>
          ))}
          {tool === "CNOT" ? (
            <label className="flex items-center gap-2 text-sm">
              Control
              <select
                className="field w-auto"
                value={control}
                onChange={(event) => setControl(Number(event.target.value))}
                aria-label="CNOT control wire"
              >
                {wireLabels.map((label, index) => (
                  <option key={label} value={index}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      )}

      {/* Circuit Wire Grid */}
      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/70 p-4">
        <div
          className="inline-grid items-center gap-y-3 gap-x-2"
          style={{ gridTemplateColumns: `4.5rem repeat(${width}, 3.25rem)` }}
        >
          <span className="text-xs font-medium text-muted">Wire</span>
          {grid.map((_, index) => (
            <span
              key={index}
              className="text-center font-mono text-xs text-muted"
            >
              t{index}
            </span>
          ))}
          {wireLabels.map((label, wire) => (
            <Wire
              key={label}
              label={label}
              wire={wire}
              grid={grid}
              onPlace={place}
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>

      {/* Live Qiskit / OpenQASM 2.0 Code Export Panel */}
      {codeTab !== "none" ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2">
            <span className="font-mono text-xs font-semibold text-[#7fb3ff]">
              {codeTab === "qiskit"
                ? "circuit.py — Qiskit 1.x"
                : "circuit.qasm — OpenQASM 2.0"}
            </span>
            <button
              type="button"
              onClick={copyCode}
              className="rounded-md bg-[#2767b9] px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-[#1f569d]"
            >
              {copied ? "Copied ✓" : "Copy Code"}
            </button>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-200">
            <code>{exportedCode}</code>
          </pre>
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-magenta">{error}</p> : null}

      {/* Per-Qubit Reduced Bloch State & Entanglement Telemetry */}
      {qubitReadouts ? (
        <div className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-alpha-blue">
            Per-Qubit Reduced State &amp; Entanglement Witness
          </h3>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-3">
            {qubitReadouts.map((q) => (
              <div
                key={q.wire}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-ucu-blue">
                    |q{q.wire}⟩
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      q.entangled
                        ? "bg-magenta/10 text-magenta"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {q.entangled ? "Entangled" : "Separable (Pure)"}
                  </span>
                </div>
                <p className="mt-1.5 font-mono text-[11px] text-ink">
                  Bloch: ({q.x.toFixed(2)}, {q.y.toFixed(2)}, {q.z.toFixed(2)})
                </p>
                <p className="mt-0.5 text-[11px] text-muted">
                  Purity γ = Tr(ρ²):{" "}
                  <strong className="font-mono text-ink">
                    {q.purity.toFixed(2)}
                  </strong>{" "}
                  &middot; P(|1⟩) = {(q.p1 * 100).toFixed(0)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Computational Basis Probabilities */}
      {probabilities ? (
        <div className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ucu-blue">
            Computational Basis Probabilities
          </h3>
          <ul className="mt-2 grid gap-2">
            {probabilities.map((value, index) => (
              <li
                key={index}
                className="grid grid-cols-[3.5rem_1fr_3.5rem] items-center gap-2 text-sm"
              >
                <span className="font-mono text-xs font-medium">
                  |{basisLabel(index, qubits)}⟩
                </span>
                <span className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className="block h-full bg-forest transition-all"
                    style={{ width: `${Math.round(value * 100)}%` }}
                  />
                </span>
                <span className="text-right font-mono text-xs">
                  {(value * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">
          Run the circuit to see measurement probabilities and per-qubit
          entanglement purity.
        </p>
      )}
      <p className="mt-3 text-xs text-muted">
        Bit strings follow quantum-circuit. The rightmost bit is q0. Purity γ =
        1.00 indicates a separable pure state; γ = 0.50 indicates a maximally
        entangled qubit.
      </p>
    </section>
  );
}

function Wire({
  label,
  wire,
  grid,
  onPlace,
  readOnly,
}: {
  label: string;
  wire: number;
  grid: CircuitGrid;
  onPlace: (column: number, wire: number) => void;
  readOnly: boolean;
}) {
  return (
    <>
      <span className="self-center font-mono text-sm font-semibold text-ucu-blue">
        |{label}⟩
      </span>
      {grid.map((column, columnIndex) => {
        const cell = column[wire];
        const labelText = cell
          ? cell.gate === "CNOT"
            ? `X←${cell.control}`
            : cell.gate
          : "·";
        return (
          <div
            key={`${columnIndex}-${wire}`}
            className="relative flex items-center justify-center"
          >
            <span
              className="pointer-events-none absolute inset-x-0 h-0.5 bg-slate-300"
              aria-hidden
            />
            <button
              type="button"
              disabled={readOnly}
              onClick={() => onPlace(columnIndex, wire)}
              className={`relative z-10 h-11 w-11 rounded-lg border text-xs font-bold transition-colors disabled:cursor-default ${
                cell
                  ? gateColors[cell.gate]
                  : "border-slate-200 bg-white text-slate-400 hover:border-ucu-blue hover:text-ucu-blue"
              }`}
              aria-label={`${label} column ${columnIndex}, ${cell ? cell.gate : "empty"}`}
            >
              {labelText}
            </button>
          </div>
        );
      })}
    </>
  );
}
