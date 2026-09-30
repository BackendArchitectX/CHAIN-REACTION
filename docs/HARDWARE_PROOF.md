# Snapdragon Hardware Evidence Contract

CHAIN//REACTION never equates “QNN requested” with “NPU verified,” and it does not treat a self-supplied JSON file as independent proof of hardware execution.

Use the exact target Snapdragon-powered HP PC and produce a JSON profile matching `public/qnn-profile.example.json` after the model has been compiled, executed, and profiled.

Required reported evidence:

- exact device/model identifier;
- runtime/execution provider = QNN;
- model artifact name and SHA-256;
- measured NPU layer coverage;
- warm P50 and P95 inference latency;
- cold model-load latency;
- memory footprint;
- measurement timestamp.

## Browser validation boundary

The browser performs structural and consistency validation only. It verifies schema shape, bounded fields, digest format, metric ranges, ordering constraints, and timestamp parseability.

A profile that passes those checks is shown as:

```text
PROFILE ACCEPTED / NOT ATTESTED
```

Its numeric values may be displayed as **reported evidence**, but the browser does not independently attest:

- which physical device generated the file;
- whether the profiler actually ran;
- whether QNN/NPU placement occurred;
- whether the measurements were altered before import.

Therefore profile acceptance must never be described as independent hardware verification.

## Exact-device verification

For a reviewer to treat the evidence as exact-device execution proof, preserve the external profiling artifacts and provenance from the Snapdragon target and Qualcomm/ONNX Runtime tooling. A future trusted attestation mechanism could automate that provenance check, but none is implemented in the current browser build.

The example profile intentionally fails until populated. Even after it is populated and accepted by the browser, provenance remains a separate evidence question.
