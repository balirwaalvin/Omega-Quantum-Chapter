/**
 * Optional future hook for IBM Quantum / Qiskit Runtime.
 *
 * Omega simulates circuits in the browser so the playground works offline.
 * Do not call this from the circuit playground. A later "Run on hardware"
 * action can post a QASM or ISA circuit to a server route that uses this helper.
 *
 * Env:
 * - IBM_QUANTUM_TOKEN  (or IBM_QUANTUM_API_KEY)
 * - IBM_QUANTUM_CRN    instance CRN for Qiskit Runtime
 *
 * Sketch (not executed):
 *
 *   const token = process.env.IBM_QUANTUM_TOKEN;
 *   const response = await fetch("https://quantum.cloud.ibm.com/api/runtime/jobs", {
 *     method: "POST",
 *     headers: {
 *       Authorization: `Bearer ${token}`,
 *       "Content-Type": "application/json",
 *     },
 *     body: JSON.stringify({
 *       program_id: "sampler",
 *       backend: "ibm_fez",
 *       params: { pubs: [[qasm]] },
 *     }),
 *   });
 *
 * Keep the token on the server. Members should still see the local simulation
 * when the device queue or the network is unavailable.
 */
export type HardwareJobRequest = {
  qasm: string;
  shots: number;
  backend?: string;
};

export async function submitHardwareJob(
  job: HardwareJobRequest,
): Promise<{ status: "not_configured"; message: string }> {
  void job;
  return {
    status: "not_configured",
    message:
      "Hardware jobs are stubbed. Add IBM_QUANTUM_TOKEN and implement submitHardwareJob in lib/ibm-quantum.ts.",
  };
}
