export type Status = 'healthy' | 'stressed' | 'degraded' | 'critical' | 'failed' | 'recovering';
export type EvidenceKind = 'observed' | 'assumed' | 'predicted';
export type TrustLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type TrustState = 'VERIFIED' | 'DEGRADED' | 'UNCERTAIN' | 'SAFE ANALYSIS';

export type InfraNode = {
  id: string;
  label: string;
  kind: 'Power' | 'Telecom' | 'Healthcare' | 'Water' | 'Transport' | 'Response';
  critical: boolean;
  x: number;
  y: number;
};

export type DependencyEdge = {
  id: string;
  source: string;
  target: string;
  type: string;
  strength: number;
  threshold: number;
  propagationDelaySec: [number, number];
};

export type NodeRuntime = {
  id: string;
  status: Status;
  capacity: number;
  reserve: number;
  load: number;
  stress: number;
  recoveringFor: number;
};

export type ResourceState = {
  gridReservePct: number;
  mobileUnits: number;
  generators: number;
  repairCrews: number;
};

export type ChaosFlags = {
  roadBlocked: boolean;
  sensorConflict: boolean;
  staleCamera: boolean;
  secondShock: boolean;
  npuUnavailable: boolean;
};

export type EvidenceEvent = {
  id: string;
  source: string;
  event: string;
  kind: EvidenceKind;
  eventTime: number;
  receivedTime: number;
  confidence: number;
  trust: TrustLevel;
  detail: string;
};

export type PlanId = 'NO_ACTION' | 'REROUTE' | 'SHED_LOAD' | 'REROUTE_MOBILE';

export type InterventionPlan = {
  id: PlanId;
  name: string;
  description: string;
  leadTimeSec: number;
  safetyMarginSec: number;
  reversible: 'YES' | 'PARTIAL' | 'NO';
  gridReserveCost: number;
  mobileUnitsRequired: number;
  generatorsRequired: number;
};

export type WorldParameters = {
  floodGrowth: number;
  telecomBackupSec: number;
  gridSparePct: number;
  mobileTravelSec: number;
  repairDelaySec: number;
  perceptionConfidence: number;
};

export type SimulationOptions = {
  untilSec: number;
  plan: PlanId;
  parameters: WorldParameters;
  chaos: ChaosFlags;
  interventionCommitSec: number;
};

export type WorldSnapshot = {
  time: number;
  nodes: Record<string, NodeRuntime>;
  resources: ResourceState;
  activePlan: PlanId;
  planActivated: boolean;
  planActivationTime: number | null;
  planFeasible: boolean;
  planInfeasibleReason?: string;
  observations: EvidenceEvent[];
  trace: TraceEvent[];
};

export type TraceEvent = {
  id: string;
  time: number;
  kind: EvidenceKind | 'system';
  message: string;
  ref?: string;
};

export type SimulationRun = {
  final: WorldSnapshot;
  checkpoints: WorldSnapshot[];
  firstCriticalImpactSec: number | null;
  firstFailureSec: number | null;
  recoverySec: number | null;
  failures: number;
  criticalServicesPreserved: number;
  minimumCriticalCapacity: number;
  minimumHospitalReserve: number;
  safety: SafetyResult;
};

export type SafetyResult = {
  pass: boolean;
  violations: string[];
};

export type PlanEvaluation = {
  plan: PlanId;
  robustness: number;
  safeFutures: number;
  totalFutures: number;
  criticalServicesPreservedMedian: number;
  medianFailures: number;
  worstFailures: number;
  medianRecoverySec: number | null;
  p90RecoverySec: number | null;
  recoveryDebt: 'LOW' | 'MEDIUM' | 'HIGH';
  decisionHorizonSec: number | null;
  decisionMargin: 'STRONG' | 'NARROW' | 'MISSED' | 'N/A';
  safety: 'PASS' | 'REJECT' | 'CONDITIONAL';
  infeasibleReason?: string;
};

export type FutureSample = {
  index: number;
  parameters: WorldParameters;
};

export type SensitivityItem = {
  key: keyof WorldParameters;
  label: string;
  score: number;
  nextObservation: string;
};

export type AssuranceProof = {
  claim: string;
  status: 'PROVEN' | 'DESIGNED' | 'PENDING HARDWARE';
  evidence: string;
};
