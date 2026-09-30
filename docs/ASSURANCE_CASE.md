# Assurance Case

CHAIN//REACTION separates product claims from evidence. Competition screenshots must not substitute for runtime proof.

| Claim | Evidence gate | Current status |
| --- | --- | --- |
| Same scenario + seed is reproducible | deterministic engine tests | Proven in repository tests |
| Reality Forks are paired fairly | common-randomness sample generator | Proven in code/tests |
| Unsafe plans are rejected | deterministic Safety Kernel invariants | Proven in code/tests |
| Intervention resource prerequisites are fail-closed | activation/resource accounting invariants | Proven in engine tests |
| Core runtime does not require cloud AI | network-independent simulation | Proven by architecture |
| NPU actually executes the model | exact-device QNN layer-placement artifacts with independently reviewed provenance | Pending Snapdragon HP hardware |
| Model latency / memory | exact-device Workbench/QNN benchmark | Pending hardware |
| Real municipal effectiveness | real pilot + shadow-mode validation | Not claimed |

## Evidence categories

- **OBSERVED**: directly measured or received evidence.
- **ASSUMED**: explicit CITY//01 world-model parameter.
- **PREDICTED**: simulation-derived future state.

The UI must not visually blur these categories.


## Hardware evidence boundary

Profile acceptance in EDGE LAB proves only that the imported evidence is structurally and internally consistent with the repository contract. It does not independently attest the physical device or profiler provenance. Reported metrics remain reported evidence until external exact-device artifacts are reviewed.
