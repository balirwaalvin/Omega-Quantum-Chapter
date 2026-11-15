"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ArrowHelper, Vector3 } from "three";
import {
  ZERO,
  applyGate,
  applyRotation,
  blochAngles,
  blochVector,
  formatAmplitude,
  probabilityZero,
  stateFromAngles,
  type QubitState,
} from "@/lib/quantum/state";

const gates = ["H", "X", "Y", "Z", "S", "T"] as const;

export function BlochSphere() {
  const [state, setState] = useState<QubitState>(ZERO);
  const vector = blochVector(state);
  const angles = blochAngles(vector);
  const p0 = probabilityZero(state);

  function handleSphericalChange(nextThetaDeg: number, nextPhiDeg: number) {
    const thetaRad = (nextThetaDeg * Math.PI) / 180;
    const phiRad = (nextPhiDeg * Math.PI) / 180;
    setState(stateFromAngles(thetaRad, phiRad));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="h-[28rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
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
          Qubit State |ψ⟩
        </h2>
        <p className="mt-2 rounded-md bg-[#f7fbfc] px-2.5 py-1.5 font-mono text-xs font-semibold text-ucu-blue">
          {formatAmplitude(state[0])}|0⟩ + {formatAmplitude(state[1])}|1⟩
        </p>
        <p className="mt-2 text-xs text-muted">
          P(|0⟩):{" "}
          <strong className="text-ink">{(p0 * 100).toFixed(1)}%</strong>{" "}
          &middot; P(|1⟩):{" "}
          <strong className="text-ink">{((1 - p0) * 100).toFixed(1)}%</strong>
        </p>
        <p className="mt-1 font-mono text-xs text-muted">
          Bloch (x, y, z): ({vector.x.toFixed(2)}, {vector.y.toFixed(2)},{" "}
          {vector.z.toFixed(2)})
        </p>

        {/* Discrete Clifford + T Gates */}
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-alpha-blue">
            Unitary Gates
          </p>
          <div
            className="mt-1.5 flex flex-wrap gap-1.5"
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
              Reset |0⟩
            </button>
          </div>
        </div>

        {/* Parameterized Pauli Rotations Rx, Ry, Rz */}
        <div className="mt-3.5 border-t border-slate-100 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-alpha-blue">
            Parameterized Rotations (+π/4)
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {(["X", "Y", "Z"] as const).map((axis) => (
              <button
                key={axis}
                type="button"
                className="btn-secondary px-2.5 py-1 text-xs font-mono"
                onClick={() =>
                  setState((current) =>
                    applyRotation(axis, Math.PI / 4, current),
                  )
                }
              >
                R{axis.toLowerCase()}(π/4)
              </button>
            ))}
          </div>
        </div>

        {/* Continuous Spherical Sliders (θ, φ) */}
        <div className="mt-3.5 space-y-2.5 border-t border-slate-100 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-alpha-blue">
            Continuous Spherical Angles
          </p>
          <label className="block text-xs">
            <div className="flex justify-between font-medium text-ink">
              <span>Polar Angle θ</span>
              <span className="font-mono text-ucu-blue">
                {angles.thetaDeg}°
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={180}
              value={angles.thetaDeg}
              onChange={(e) =>
                handleSphericalChange(Number(e.target.value), angles.phiDeg)
              }
              className="mt-1 w-full accent-ucu-blue"
            />
          </label>

          <label className="block text-xs">
            <div className="flex justify-between font-medium text-ink">
              <span>Azimuthal Phase φ</span>
              <span className="font-mono text-ucu-blue">{angles.phiDeg}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={angles.phiDeg}
              onChange={(e) =>
                handleSphericalChange(angles.thetaDeg, Number(e.target.value))
              }
              className="mt-1 w-full accent-magenta"
            />
          </label>
        </div>

        <p className="mt-3 text-[11px] leading-4 text-muted">
          Drag to orbit. |0⟩ sits at +Z (top), |1⟩ at −Z (bottom), and |+⟩ on +X.
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
