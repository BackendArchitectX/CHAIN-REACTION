# Snapdragon Integration Contract

The web build intentionally does not display fabricated NPU measurements or convert self-reported JSON into an independent hardware-verification claim.

The competition hardware evidence path is:

1. Detect the exact Snapdragon-powered HP target and native ARM64 environment.
2. Export/fine-tune a deliberately small perception model.
3. Compile and profile the model with Qualcomm tooling for that exact target.
4. Deploy through a supported ONNX Runtime + QNN path.
5. Verify actual per-layer placement externally; do not equate “QNN requested” with “NPU executed”.
6. Record cold load, first inference, warm P50/P95, memory, and NPU coverage.
7. Store the model version, SHA-256, quantization configuration, runtime versions, benchmark conditions, and source profiling artifacts.
8. Load the resulting JSON evidence profile into EDGE LAB for structural/consistency validation.
9. Treat displayed numbers as **reported exact-device evidence** unless the source provenance has been independently reviewed outside the browser.

## Target production split

- **NPU**: perception/classification/detection when a validated QNN deployment is available.
- **CPU**: evidence fusion, causal simulation, uncertainty sampling, Safety Kernel, audit.
- **GPU/compositor**: causal topology and future visualization.

This heterogeneous split is intentional; the simulator is not presented as an NPU workload.

## Current implementation boundary

The current repository ships the deterministic browser application and the evidence-profile validation boundary. It does not ship a native Windows ARM64/Tauri package or a cryptographic hardware-attestation service.
