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
