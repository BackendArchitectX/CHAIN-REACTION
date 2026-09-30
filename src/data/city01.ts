import type { DependencyEdge, InfraNode, InterventionPlan, PlanId, WorldParameters } from '../core/types';

export const SCENARIO_SEED = 271828;
export const SCENARIO_DURATION_SEC = 420;

export const NODES: InfraNode[] = [
  { id: 'sub03', label: 'SUBSTATION 03', kind: 'Power', critical: true, x: 15, y: 43 },
  { id: 'tel07', label: 'TELECOM 07', kind: 'Telecom', critical: true, x: 42, y: 29 },
  { id: 'hospN', label: 'HOSPITAL NORTH', kind: 'Healthcare', critical: true, x: 76, y: 17 },
  { id: 'pump02', label: 'PUMP 02', kind: 'Water', critical: true, x: 42, y: 67 },
  { id: 'road12', label: 'ROAD 12', kind: 'Transport', critical: false, x: 76, y: 64 },
  { id: 'ems01', label: 'EMERGENCY OPS', kind: 'Response', critical: true, x: 89, y: 42 },
];

export const EDGES: DependencyEdge[] = [
  { id: 'e1', source: 'sub03', target: 'tel07', type: 'POWER', strength: 0.91, threshold: 45, propagationDelaySec: [6, 14] },
  { id: 'e2', source: 'sub03', target: 'pump02', type: 'POWER', strength: 0.87, threshold: 50, propagationDelaySec: [4, 10] },
  { id: 'e3', source: 'tel07', target: 'hospN', type: 'CONNECTIVITY', strength: 0.94, threshold: 48, propagationDelaySec: [18, 35] },
  { id: 'e4', source: 'tel07', target: 'ems01', type: 'CONNECTIVITY', strength: 0.83, threshold: 46, propagationDelaySec: [12, 24] },
  { id: 'e5', source: 'road12', target: 'ems01', type: 'ACCESS', strength: 0.75, threshold: 40, propagationDelaySec: [5, 12] },
  { id: 'e6', source: 'pump02', target: 'road12', type: 'DRAINAGE', strength: 0.71, threshold: 45, propagationDelaySec: [20, 40] },
];

export const PLANS: Record<PlanId, InterventionPlan> = {
  NO_ACTION: {
    id: 'NO_ACTION', name: 'NO ACTION', description: 'Observe the cascade without intervention.', leadTimeSec: 0, safetyMarginSec: 0,
    reversible: 'YES', gridReserveCost: 0, mobileUnitsRequired: 0, generatorsRequired: 0,
  },
  REROUTE: {
    id: 'REROUTE', name: 'REROUTE GRID', description: 'Reroute spare grid capacity toward the affected power zone.', leadTimeSec: 18, safetyMarginSec: 10,
    reversible: 'YES', gridReserveCost: 14, mobileUnitsRequired: 0, generatorsRequired: 0,
  },
  SHED_LOAD: {
    id: 'SHED_LOAD', name: 'SHED NON-CRITICAL LOAD', description: 'Shed industrial load to preserve critical power and telecom capacity.', leadTimeSec: 10, safetyMarginSec: 8,
    reversible: 'PARTIAL', gridReserveCost: 5, mobileUnitsRequired: 0, generatorsRequired: 0,
  },
  REROUTE_MOBILE: {
    id: 'REROUTE_MOBILE', name: 'REROUTE + MOBILE', description: 'Reroute grid power and dispatch a mobile telecom unit.', leadTimeSec: 27, safetyMarginSec: 12,
    reversible: 'PARTIAL', gridReserveCost: 18, mobileUnitsRequired: 1, generatorsRequired: 0,
  },
};

export const BASE_PARAMETERS: WorldParameters = {
  floodGrowth: 1,
  telecomBackupSec: 120,
  gridSparePct: 24,
  mobileTravelSec: 27,
  repairDelaySec: 250,
  perceptionConfidence: 0.93,
};
