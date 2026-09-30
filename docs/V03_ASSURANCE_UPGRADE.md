# v0.3 Assurance Upgrade

This release strengthens CHAIN//REACTION around failure behavior rather than feature volume.

## Evidence Fabric

The Evidence Fabric now normalizes equivalent observations before they are surfaced to planning. Diagnostics explicitly expose duplicate delivery, late telemetry, stale evidence, source-clock skew, and contradictions.

## Forecast Lease

A forecast is valid only while both conditions hold:

1. the world revision remains unchanged; and
2. the configured forecast TTL has not elapsed.

Expired branch results are blocked from simulated commitment until replanning renews the lease.

## Decision Stability

Robustness asks whether a plan survives sampled futures. Decision Stability asks whether the *choice itself* is fragile. It combines local parameter sensitivity, decision-horizon pressure, and robustness separation from feasible alternatives.

A low-stability result is not treated as a recommendation. Instead, the UI elevates the **Next Best Observation** and its Information Value.

## Exact-device NPU proof

EDGE LAB accepts a `chainreaction.qnn-proof.v1` JSON profile. The proof gate requires:

- a Snapdragon-identified device;
- QNN execution provider;
- versioned model hash;
- at least 90% NPU layer coverage for the configured competition gate;
- consistent measured P50/P95 latency;
- cold-load and memory measurements;
- a verification timestamp.

The example profile ships with zero values and therefore cannot accidentally mark the NPU as verified.

## Reproducibility fingerprint

Runs export a stable non-cryptographic trace fingerprint derived from deterministic serialized state. It is intended for regression/replay comparison, not as a security signature.

## Safety boundary

The deterministic Safety Kernel remains independent from plan generation. Hardware proof, perception confidence, and planning sophistication cannot bypass hard simulation safety invariants.
