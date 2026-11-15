export type Basis = "Z" | "X";
export type Bit = 0 | 1;

export type Bb84Photon = {
  index: number;
  aliceBit: Bit;
  aliceBasis: Basis;
  aliceStateLabel: "|0⟩" | "|1⟩" | "|+⟩" | "|−⟩";
  intercepted: boolean;
  eveBasis?: Basis;
  eveBit?: Bit;
  bobBasis: Basis;
  bobBit: Bit;
  sifted: boolean;
  error: boolean;
};

export type Bb84Simulation = {
  photons: Bb84Photon[];
  aliceSiftedKey: string;
  bobSiftedKey: string;
  siftedCount: number;
  errorCount: number;
  /** Quantum Bit Error Rate in [0, 1] across sifted key bits. */
  qber: number;
  /** Standard BB84 security threshold (~11% or >0% in ideal noiseless channel). */
  compromised: boolean;
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stateLabel(bit: Bit, basis: Basis): "|0⟩" | "|1⟩" | "|+⟩" | "|−⟩" {
  if (basis === "Z") return bit === 0 ? "|0⟩" : "|1⟩";
  return bit === 0 ? "|+⟩" : "|−⟩";
}

/**
 * Simulates the Bennett-Brassard 1984 (BB84) Quantum Key Distribution protocol
 * with optional intercept-and-resend eavesdropping by Eve.
 */
export function runBb84Protocol({
  length = 16,
  eavesdropRate = 0,
  seed = 20261115,
}: {
  length?: number;
  /** Fraction of photons intercepted by Eve in [0, 1]. */
  eavesdropRate?: number;
  seed?: number;
}): Bb84Simulation {
  const rand = mulberry32(seed);
  const photons: Bb84Photon[] = [];

  for (let i = 0; i < length; i++) {
    const aliceBit: Bit = rand() < 0.5 ? 0 : 1;
    const aliceBasis: Basis = rand() < 0.5 ? "Z" : "X";

    let transmittedBit: Bit = aliceBit;
    let transmittedBasis: Basis = aliceBasis;

    const intercepted = rand() < eavesdropRate;
    let eveBasis: Basis | undefined;
    let eveBit: Bit | undefined;

    if (intercepted) {
      eveBasis = rand() < 0.5 ? "Z" : "X";
      // If Eve measures in the same basis as Alice, she gets Alice's bit deterministically;
      // if she measures in the conjugate basis, quantum state collapse yields 50/50 random bit.
      eveBit =
        eveBasis === aliceBasis ? aliceBit : rand() < 0.5 ? 0 : 1;
      transmittedBit = eveBit;
      transmittedBasis = eveBasis;
    }

    const bobBasis: Basis = rand() < 0.5 ? "Z" : "X";
    const bobBit: Bit =
      bobBasis === transmittedBasis
        ? transmittedBit
        : rand() < 0.5
          ? 0
          : 1;

    const sifted = aliceBasis === bobBasis;
    const error = sifted && aliceBit !== bobBit;

    photons.push({
      index: i + 1,
      aliceBit,
      aliceBasis,
      aliceStateLabel: stateLabel(aliceBit, aliceBasis),
      intercepted,
      eveBasis,
      eveBit,
      bobBasis,
      bobBit,
      sifted,
      error,
    });
  }

  const siftedPhotons = photons.filter((p) => p.sifted);
  const aliceSiftedKey = siftedPhotons.map((p) => p.aliceBit).join("");
  const bobSiftedKey = siftedPhotons.map((p) => p.bobBit).join("");
  const errorCount = siftedPhotons.filter((p) => p.error).length;
  const qber =
    siftedPhotons.length > 0 ? errorCount / siftedPhotons.length : 0;

  return {
    photons,
    aliceSiftedKey,
    bobSiftedKey,
    siftedCount: siftedPhotons.length,
    errorCount,
    qber,
    compromised: qber >= 0.11 || errorCount > 0,
  };
}
