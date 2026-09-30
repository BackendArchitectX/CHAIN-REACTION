# Snapdragon Hardware Proof Contract

CHAIN//REACTION never equates “QNN requested” with “NPU verified.”

Use the exact target Snapdragon-powered HP PC and produce a JSON profile matching `public/qnn-profile.example.json` after the model has been compiled, executed, and profiled.

Required evidence:

- exact device/model identifier;
- runtime/execution provider = QNN;
- model artifact name and SHA-256;
- measured NPU layer coverage;
- warm P50 and P95 inference latency;
- cold model-load latency;
- memory footprint;
- verification timestamp.

The browser MVP validates this proof before changing EDGE LAB from **PENDING HARDWARE** to **VERIFIED EXACT-DEVICE PROFILE**.

This mechanism deliberately prevents placeholder or marketing numbers from being presented as measured Snapdragon results.
