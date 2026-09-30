# Snapdragon Integration Contract

The web MVP intentionally does not display fabricated NPU measurements.

The competition hardware gate is:

1. Detect the exact Snapdragon-powered HP target and native ARM64 environment.
2. Export/fine-tune a deliberately small perception model.
3. Compile and profile the model with Qualcomm tooling for that exact target.
4. Deploy through a supported ONNX Runtime + QNN path.
5. Verify actual per-layer placement; do not equate "QNN requested" with "NPU executed".
6. Record cold load, first inference, warm P50/P95, memory, and NPU coverage.
7. Store the model version, SHA-256, quantization configuration, runtime versions, and benchmark conditions in the model manifest.
8. Only after all gates pass may EDGE LAB replace `PENDING EXACT-DEVICE PROFILE` with measured numbers.

## Target production split

- **NPU**: perception/classification/detection.
- **CPU**: evidence fusion, causal simulation, uncertainty sampling, Safety Kernel, audit.
- **GPU/compositor**: causal topology and future visualization.

This heterogeneous split is intentional; the simulator is not presented as an NPU workload.
