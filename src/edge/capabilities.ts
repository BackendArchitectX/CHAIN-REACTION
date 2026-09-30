export type EdgeCapability = {
  architecture: string;
  runtime: string;
  qnnRequested: boolean;
  npuVerified: boolean;
  modelArtifact: string;
  cloudInference: number;
};

export function detectEdgeCapability(): EdgeCapability {
  const architecture = navigator.userAgent.includes('ARM64') || navigator.userAgent.includes('aarch64') ? 'ARM64 detected' : 'Web runtime / architecture unverified';
  return {
    architecture,
    runtime: 'Browser MVP — ONNX Runtime/QNN integration gate pending',
    qnnRequested: false,
    npuVerified: false,
    modelArtifact: 'No production NPU artifact loaded',
    cloudInference: 0,
  };
}
