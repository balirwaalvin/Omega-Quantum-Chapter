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
      <div className="h-[28rem] overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <Canvas camera={{ position: [2.2, 1.6, 2.4], fov: 45 }}>
          <color attach="background" args={["#f4f6f8"]} />
          <ambientLight intensity={0.9} />
          <Sphere />
          <axesHelper args={[1.35]} />
          <StateArrow x={vector.x} y={vector.y} z={vector.z} />
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-ucu-blue">State</h2>
        <p className="mt-2 font-mono text-sm">
          {formatAmplitude(state[0])}|0⟩ + {formatAmplitude(state[1])}|1⟩
        </p>
        <p className="mt-2 text-sm text-muted">
          P(0) = {(p0 * 100).toFixed(1)}% · P(1) = {((1 - p0) * 100).toFixed(1)}%
        </p>
        <p className="mt-2 text-sm">
          Bloch (x, y, z) = ({vector.x.toFixed(2)}, {vector.y.toFixed(2)}, {vector.z.toFixed(2)})
        </p>
        <div className="mt-4 flex flex-wrap gap-2" role="toolbar" aria-label="Single-qubit gates">
          {gates.map((gate) => (
            <button
              key={gate}
              type="button"
              className="btn"
              onClick={() => setState((current) => applyGate(gate, current))}
            >
              {gate}
            </button>
          ))}
          <button type="button" className="btn-secondary" onClick={() => setState(ZERO)}>
            Reset
          </button>
        </div>
        <p className="mt-4 text-xs leading-5 text-muted">
          Drag to rotate the view. |0⟩ is up, along the vertical axis. Global phase is invisible on the sphere.
        </p>
      </div>
    </div>
  );
}

function Sphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 36, 36]} />
      <meshBasicMaterial color="#1e3a8a" wireframe transparent opacity={0.45} />
    </mesh>
  );
}

function StateArrow({ x, y, z }: { x: number; y: number; z: number }) {
  const arrow = useMemo(() => {
    const direction = new Vector3(x, z, -y);
    if (direction.lengthSq() < 1e-8) direction.set(0, 1, 0);
    return new ArrowHelper(direction.normalize(), new Vector3(0, 0, 0), 1.05, "#1b5e20", 0.16, 0.1);
  }, [x, y, z]);

  return <primitive object={arrow} />;
}
