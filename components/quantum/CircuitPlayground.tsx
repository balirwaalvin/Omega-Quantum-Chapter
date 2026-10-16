"use client";

import { useMemo, useState } from "react";
import {
  basisLabel,
  simulateCircuit,
  type CircuitGrid,
  type GateName,
  type PlacedGate,
} from "@/lib/quantum/simulate";

const tools: Array<GateName | "E"> = ["H", "X", "Y", "Z", "CNOT", "M", "E"];

const gateColors: Record<GateName, string> = {
  H: "border-ucu-blue bg-ucu-blue text-white shadow-xs",
  X: "border-forest bg-forest text-white shadow-xs",
  Y: "border-forest bg-forest text-white shadow-xs",
  Z: "border-forest bg-forest text-white shadow-xs",
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
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);

  const wireLabels = useMemo(
    () => Array.from({ length: qubits }, (_, index) => `q${index}`),
    [qubits],
  );

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
  }

  async function run() {
    setRunning(true);
    setError("");
    try {
      setProbabilities(await simulateCircuit(qubits, grid));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Simulation failed.");
    } finally {
      setRunning(false);
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
        <button type="button" className="btn" onClick={run} disabled={running}>
          {running ? "Running…" : "Run simulation"}
        </button>
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
      {error ? <p className="mt-3 text-sm text-magenta">{error}</p> : null}
      {probabilities ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-ucu-blue">Probabilities</h3>
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
          Run the circuit to see measurement probabilities.
        </p>
      )}
      <p className="mt-3 text-xs text-muted">
        Bit strings follow quantum-circuit. The rightmost bit is q0.
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
