export type HardwareProof = {
  schema: 'chainreaction.qnn-proof.v1';
  device: string;
  provider: string;
  model: string;
  modelSha256: string;
  npuCoveragePct: number;
  p50Ms: number;
  p95Ms: number;
  coldLoadMs: number;
  memoryMb: number;
  verifiedAt: string | null;
};

export type EdgeCapability = {
  architecture: string;
  runtime: string;
  qnnRequested: boolean;
  npuVerified: boolean;
  modelArtifact: string;
  cloudInference: number;
  proofReason: string;
  npuCoveragePct?: number;
  p50Ms?: number;
  p95Ms?: number;
  coldLoadMs?: number;
  memoryMb?: number;
};

export function validateHardwareProof(proof: HardwareProof | null | undefined) {
  if (!proof) return { valid: false, reason: 'No exact-device QNN profile loaded.' };
  if (proof.schema !== 'chainreaction.qnn-proof.v1') return { valid: false, reason: 'Unsupported proof schema.' };
  if (!/snapdragon/i.test(proof.device)) return { valid: false, reason: 'Device field does not identify a Snapdragon target.' };
  if (!/qnn/i.test(proof.provider)) return { valid: false, reason: 'Execution provider is not QNN.' };
  if (!proof.modelSha256 || proof.modelSha256.startsWith('REPLACE_')) return { valid: false, reason: 'Model hash is missing.' };
  if (proof.npuCoveragePct < 90) return { valid: false, reason: 'NPU layer coverage is below the 90% competition gate.' };
  if (!(proof.p50Ms > 0 && proof.p95Ms >= proof.p50Ms && proof.coldLoadMs > 0 && proof.memoryMb > 0)) return { valid: false, reason: 'Benchmark fields are incomplete or inconsistent.' };
  if (!proof.verifiedAt) return { valid: false, reason: 'Profile verification timestamp is missing.' };
  return { valid: true, reason: 'Exact-device QNN profile passes the CHAIN//REACTION hardware proof gate.' };
}

export function detectEdgeCapability(proof?: HardwareProof | null): EdgeCapability {
  const architecture = navigator.userAgent.includes('ARM64') || navigator.userAgent.includes('aarch64') ? 'ARM64 detected' : 'Web runtime / architecture unverified';
  const validation = validateHardwareProof(proof);
  return {
    architecture,
    runtime: validation.valid ? 'ONNX Runtime + QNN proof loaded' : 'Browser MVP — ONNX Runtime/QNN integration gate pending',
    qnnRequested: Boolean(proof),
    npuVerified: validation.valid,
    modelArtifact: proof?.model ?? 'No production NPU artifact loaded',
    cloudInference: 0,
    proofReason: validation.reason,
    npuCoveragePct: proof?.npuCoveragePct,
    p50Ms: proof?.p50Ms,
    p95Ms: proof?.p95Ms,
    coldLoadMs: proof?.coldLoadMs,
    memoryMb: proof?.memoryMb,
  };
}
