export type Complex = { re: number; im: number };
export type QubitState = [Complex, Complex];
type GateMatrix = [[Complex, Complex], [Complex, Complex]];

export const c = (re: number, im = 0): Complex => ({ re, im });

export const ZERO: QubitState = [c(1), c(0)];

const s2 = Math.SQRT1_2;

export const BLOCH_GATES: Record<string, GateMatrix> = {
  H: [
    [c(s2), c(s2)],
    [c(s2), c(-s2)],
  ],
  X: [
    [c(0), c(1)],
    [c(1), c(0)],
  ],
  Y: [
    [c(0), c(0, -1)],
    [c(0, 1), c(0)],
  ],
  Z: [
    [c(1), c(0)],
    [c(0), c(-1)],
  ],
  S: [
    [c(1), c(0)],
    [c(0), c(0, 1)],
  ],
  T: [
    [c(1), c(0)],
    [c(0), c(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4))],
  ],
};

function mul(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function applyGate(name: string, state: QubitState): QubitState {
  const gate = BLOCH_GATES[name];
  if (!gate) return state;
  const [a, b] = state;
  return [
    add(mul(gate[0][0], a), mul(gate[0][1], b)),
    add(mul(gate[1][0], a), mul(gate[1][1], b)),
  ];
}

export function blochVector(state: QubitState): { x: number; y: number; z: number } {
  const [a, b] = state;
  const conjATimesB = mul(c(a.re, -a.im), b);
  return {
    x: 2 * conjATimesB.re,
    y: 2 * conjATimesB.im,
    z: a.re * a.re + a.im * a.im - (b.re * b.re + b.im * b.im),
  };
}

export function probabilityZero(state: QubitState): number {
  const [a] = state;
  return a.re * a.re + a.im * a.im;
}

export function formatAmplitude(value: Complex): string {
  const trim = (n: number) => {
    if (Math.abs(n) < 1e-8) return "0";
    return n.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  };
  const re = trim(value.re);
  const im = trim(value.im);
  if (im === "0") return re;
  if (re === "0") return `${im}i`;
  const sign = value.im < 0 ? "−" : "+";
  return `${re} ${sign} ${trim(Math.abs(value.im))}i`;
}

/**
 * Constructs a pure single-qubit state |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩
 * from spherical Bloch coordinates θ ∈ [0, π] and φ ∈ [0, 2π].
 */
export function stateFromAngles(thetaRad: number, phiRad: number): QubitState {
  const half = thetaRad / 2;
  const cosH = Math.cos(half);
  const sinH = Math.sin(half);
  return [
    c(cosH, 0),
    c(sinH * Math.cos(phiRad), sinH * Math.sin(phiRad)),
  ];
}

/**
 * Extracts spherical angles (thetaDeg ∈ [0, 180], phiDeg ∈ [0, 360]) from a Bloch vector.
 */
export function blochAngles(vector: {
  x: number;
  y: number;
  z: number;
}): { thetaDeg: number; phiDeg: number } {
  const clampedZ = Math.max(-1, Math.min(1, vector.z));
  const thetaRad = Math.acos(clampedZ);
  let phiRad = Math.atan2(vector.y, vector.x);
  if (phiRad < 0) phiRad += 2 * Math.PI;
  return {
    thetaDeg: Math.round((thetaRad * 180) / Math.PI),
    phiDeg: Math.round((phiRad * 180) / Math.PI) % 360,
  };
}

/**
 * Applies a continuous Pauli rotation gate Rx(θ), Ry(θ), or Rz(θ) to |ψ⟩.
 */
export function applyRotation(
  axis: "X" | "Y" | "Z",
  angleRad: number,
  state: QubitState,
): QubitState {
  const half = angleRad / 2;
  const ch = Math.cos(half);
  const sh = Math.sin(half);
  const [a, b] = state;

  if (axis === "X") {
    // Rx(θ) = [[cos(θ/2), -i sin(θ/2)], [-i sin(θ/2), cos(θ/2)]]
    return [
      add(mul(c(ch, 0), a), mul(c(0, -sh), b)),
      add(mul(c(0, -sh), a), mul(c(ch, 0), b)),
    ];
  }
  if (axis === "Y") {
    // Ry(θ) = [[cos(θ/2), -sin(θ/2)], [sin(θ/2), cos(θ/2)]]
    return [
      add(mul(c(ch, 0), a), mul(c(-sh, 0), b)),
      add(mul(c(sh, 0), a), mul(c(ch, 0), b)),
    ];
  }
  // Rz(θ) = [[e^(-iθ/2), 0], [0, e^(iθ/2)]]
  return [mul(c(ch, -sh), a), mul(c(ch, sh), b)];
}

