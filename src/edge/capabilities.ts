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
  verifiedAt: string;
};

export type HardwareProofValidation =
  | { valid: true; reason: string; proof: HardwareProof }
  | { valid: false; reason: string };

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isBoundedText(value: unknown, maxLength: number) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function isFiniteMetric(value: unknown, minExclusive: number, maxInclusive: number) {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value > minExclusive
    && value <= maxInclusive;
}

export function validateHardwareProof(input: unknown): HardwareProofValidation {
  if (!isRecord(input)) return { valid: false, reason: 'No exact-device QNN profile loaded.' };
  if (input.schema !== 'chainreaction.qnn-proof.v1') return { valid: false, reason: 'Unsupported proof schema.' };
  if (!isBoundedText(input.device, 200) || !/snapdragon/i.test(input.device as string)) {
    return { valid: false, reason: 'Device field must identify a Snapdragon target.' };
  }
  if (!isBoundedText(input.provider, 100) || !/qnn/i.test(input.provider as string)) {
    return { valid: false, reason: 'Execution provider must identify QNN.' };
  }
  if (!isBoundedText(input.model, 260)) {
    return { valid: false, reason: 'Model artifact name is missing or too long.' };
  }
  if (typeof input.modelSha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(input.modelSha256)) {
    return { valid: false, reason: 'Model SHA-256 must be a 64-character hexadecimal digest.' };
  }
  if (typeof input.npuCoveragePct !== 'number' || !Number.isFinite(input.npuCoveragePct)
      || input.npuCoveragePct < 90 || input.npuCoveragePct > 100) {
    return { valid: false, reason: 'NPU layer coverage must be a numeric value between 90% and 100% for the competition gate.' };
  }
  if (!isFiniteMetric(input.p50Ms, 0, 60_000)
      || !isFiniteMetric(input.p95Ms, 0, 60_000)
      || (input.p95Ms as number) < (input.p50Ms as number)
      || !isFiniteMetric(input.coldLoadMs, 0, 300_000)
      || !isFiniteMetric(input.memoryMb, 0, 65_536)) {
    return { valid: false, reason: 'Benchmark fields must be finite numeric values inside the supported proof bounds.' };
  }
  if (!isBoundedText(input.verifiedAt, 64) || !Number.isFinite(Date.parse(input.verifiedAt as string))) {
    return { valid: false, reason: 'Profile verification timestamp is missing or invalid.' };
  }

  const proof: HardwareProof = {
    schema: 'chainreaction.qnn-proof.v1',
    device: (input.device as string).trim(),
    provider: (input.provider as string).trim(),
    model: (input.model as string).trim(),
    modelSha256: (input.modelSha256 as string).toLowerCase(),
    npuCoveragePct: input.npuCoveragePct as number,
    p50Ms: input.p50Ms as number,
    p95Ms: input.p95Ms as number,
    coldLoadMs: input.coldLoadMs as number,
    memoryMb: input.memoryMb as number,
    verifiedAt: input.verifiedAt as string,
  };

  return {
    valid: true,
    reason: 'Exact-device QNN profile passes the CHAIN//REACTION hardware proof gate.',
    proof,
  };
}

export function detectEdgeCapability(input?: unknown, userAgent = ''): EdgeCapability {
  const architecture = /ARM64|aarch64/i.test(userAgent)
    ? 'ARM64 detected'
    : 'Web runtime / architecture unverified';
  const validation = validateHardwareProof(input);
  const proof = validation.valid ? validation.proof : null;

  return {
    architecture,
    runtime: proof ? 'ONNX Runtime + QNN proof loaded' : 'Browser MVP — ONNX Runtime/QNN integration gate pending',
    qnnRequested: input != null,
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
