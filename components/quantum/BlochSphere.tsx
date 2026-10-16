"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ArrowHelper, Vector3 } from "three";
import {
  ZERO,
  applyGate,
  blochVector,
  formatAmplitude,
  probabilityZero,
  type QubitState,
} from "@/lib/quantum/state";

const gates = ["H", "X", "Y", "Z", "S", "T"] as const;

export function BlochSphere() {
  const [state, setState] = useState<QubitState>(ZERO);
  const vector = blochVector(state);
  const p0 = probabilityZero(state);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="h-[26rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
        <Canvas camera={{ position: [2.2, 1.6, 2.4], fov: 45 }}>
          <color attach="background" args={["#f8f9fa"]} />
          <ambientLight intensity={0.9} />
          <Sphere />
          <axesHelper args={[1.35]} />
          <StateArrow x={vector.x} y={vector.y} z={vector.z} />
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ucu-blue">
          Qubit State
        </h2>
        <p className="mt-2 rounded-md bg-[#f7fbfc] px-2.5 py-1.5 font-mono text-xs font-semibold text-ucu-blue">
          {formatAmplitude(state[0])}|0⟩ + {formatAmplitude(state[1])}|1⟩
        </p>
        <p className="mt-2 text-xs text-muted">
          P(0): <strong className="text-ink">{(p0 * 100).toFixed(1)}%</strong> &middot; P(1):{" "}
          <strong className="text-ink">{((1 - p0) * 100).toFixed(1)}%</strong>
        </p>
        <p className="mt-1.5 font-mono text-xs text-muted">
          ({vector.x.toFixed(2)}, {vector.y.toFixed(2)}, {vector.z.toFixed(2)})
        </p>
        <div
          className="mt-4 flex flex-wrap gap-1.5"
          role="toolbar"
          aria-label="Single-qubit gates"
        >
          {gates.map((gate) => (
            <button
              key={gate}
              type="button"
              className="btn px-3 py-1.5 text-xs"
              onClick={() => setState((current) => applyGate(gate, current))}
            >
              {gate}
            </button>
          ))}
          <button
            type="button"
            className="btn-secondary px-3 py-1.5 text-xs"
            onClick={() => setState(ZERO)}
          >
            Reset
          </button>
        </div>
        <p className="mt-4 text-[11px] leading-4 text-muted">
          Drag to orbit. |0⟩ is +Z (top).
        </p>
      </div>
    </div>
  );
}

function Sphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 36, 36]} />
      <meshBasicMaterial color="#2767b9" wireframe transparent opacity={0.4} />
    </mesh>
  );
}

function StateArrow({ x, y, z }: { x: number; y: number; z: number }) {
  const arrow = useMemo(() => {
    const direction = new Vector3(x, z, -y);
    if (direction.lengthSq() < 1e-8) direction.set(0, 1, 0);
    return new ArrowHelper(
      direction.normalize(),
      new Vector3(0, 0, 0),
      1.05,
      "#b5004f",
      0.16,
      0.1,
    );
  }, [x, y, z]);

  return <primitive object={arrow} />;
}

