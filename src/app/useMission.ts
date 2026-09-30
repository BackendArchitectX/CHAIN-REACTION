import { useEffect, useMemo, useRef, useState } from 'react';
import { BASE_PARAMETERS, PLANS, SCENARIO_DURATION_SEC, SCENARIO_SEED } from '../data/city01';
import { evidenceAt, simulate, snapshotAt } from '../core/engine';
import { evaluateAllPlans, pairedPrevention, selectedPlanSensitivity } from '../core/planning';
import { analyzeEvidence, normalizeEvidence } from '../core/evidence';
import { evaluateForecastLease } from '../core/leases';
import { traceFingerprint } from '../core/integrity';
import { deriveRuntimeTrust } from '../core/runtime';
import { decisionStability, evaluateCommitEligibility, informationValue } from '../core/decision';
import { detectEdgeCapability, validateHardwareProof } from '../edge/capabilities';
import type { ChaosFlags, PlanId } from '../core/types';
import type { AppTab, AuditEntry } from './types';
import { DEFAULT_TAB, tabFromHash, tabSlug } from './navigation';

const INITIAL_CHAOS: ChaosFlags = {
  roadBlocked: false,
  sensorConflict: false,
  staleCamera: false,
  secondShock: false,
  npuUnavailable: false,
};

const MAX_HARDWARE_PROOF_BYTES = 1_000_000;

export function useMission() {
  const [t, setT] = useState(0);
  const [tab, setTabState] = useState<AppTab>(() => {
    if (typeof window === 'undefined') return DEFAULT_TAB;
    return tabFromHash(window.location.hash) ?? DEFAULT_TAB;
  });
  const [chaos, setChaos] = useState<ChaosFlags>(INITIAL_CHAOS);
  const [worldRevision, setWorldRevision] = useState(0);
  const [forecastRevision, setForecastRevision] = useState(0);
  const [forecastChaos, setForecastChaos] = useState<ChaosFlags>(INITIAL_CHAOS);
  const [forecastCommitSec, setForecastCommitSec] = useState(48);
  const [forecastIssuedSec, setForecastIssuedSec] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('REROUTE_MOBILE');
  const [activePlan, setActivePlan] = useState<PlanId>('NO_ACTION');
  const [activeCommitSec, setActiveCommitSec] = useState(0);
  const [futureOffset, setFutureOffset] = useState(90);
  const [playing, setPlaying] = useState(false);
  const [hardwareProof, setHardwareProof] = useState<unknown | null>(null);
  const auditSequence = useRef(2);
  const chaosRef = useRef<ChaosFlags>(INITIAL_CHAOS);
  const [audit, setAudit] = useState<AuditEntry[]>([
    { time: 0, kind: 'system', message: 'CITY//01 initialized with deterministic seed 271828.', ref: 'SYS-0001' },
  ]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setT(value => {
        const next = Math.min(SCENARIO_DURATION_SEC, value + 3);
        if (next >= SCENARIO_DURATION_SEC) setPlaying(false);
        return next;
      });
    }, 250);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncTabFromLocation = () => {
      const next = tabFromHash(window.location.hash);
      if (next) setTabState(next);
    };

    window.addEventListener('popstate', syncTabFromLocation);
    window.addEventListener('hashchange', syncTabFromLocation);
    return () => {
      window.removeEventListener('popstate', syncTabFromLocation);
      window.removeEventListener('hashchange', syncTabFromLocation);
    };
  }, []);

  const setTab = (next: AppTab) => {
    setTabState(next);
    if (typeof window === 'undefined') return;

    const nextHash = `#${tabSlug(next)}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }
  };


  const appendAudit = (kind: AuditEntry['kind'], message: string, refPrefix: string, at = t) => {
    const ref = `${refPrefix}-${String(auditSequence.current++).padStart(4, '0')}`;
    setAudit(items => [...items, { time: at, kind, message, ref }]);
  };

  const liveRun = useMemo(
    () => simulate({ untilSec: t, plan: activePlan, parameters: BASE_PARAMETERS, chaos, interventionCommitSec: activeCommitSec }),
    [t, activePlan, activeCommitSec, chaos],
  );

  const evaluations = useMemo(
    () => evaluateAllPlans(forecastChaos, forecastCommitSec, 256, SCENARIO_SEED),
    [forecastChaos, forecastCommitSec],
  );

  const selectedEvaluation = evaluations.find(evaluation => evaluation.plan === selectedPlan)!;
  const sensitivity = useMemo(
    () => selectedPlanSensitivity(selectedPlan, forecastChaos, forecastCommitSec),
    [selectedPlan, forecastChaos, forecastCommitSec],
  );
  const prevention = useMemo(
    () => pairedPrevention(selectedPlan, forecastChaos, forecastCommitSec, 256, SCENARIO_SEED),
    [selectedPlan, forecastChaos, forecastCommitSec],
  );

  const futureSnapshots = useMemo(() => {
    const until = Math.min(SCENARIO_DURATION_SEC, forecastCommitSec + futureOffset);
    return Object.keys(PLANS).reduce<Record<PlanId, ReturnType<typeof snapshotAt>>>((accumulator, id) => {
      const plan = id as PlanId;
      const run = simulate({
        untilSec: until,
        plan,
        parameters: BASE_PARAMETERS,
        chaos: forecastChaos,
        interventionCommitSec: forecastCommitSec,
      });
      accumulator[plan] = snapshotAt(run, until);
      return accumulator;
    }, {} as Record<PlanId, ReturnType<typeof snapshotAt>>);
  }, [forecastChaos, forecastCommitSec, futureOffset]);

  const rawEvidence = evidenceAt(t, chaos, BASE_PARAMETERS);
  const evidence = normalizeEvidence(rawEvidence);
  const evidenceDiagnostics = analyzeEvidence(rawEvidence, t);
  const leaseInfo = evaluateForecastLease({
    worldRevision,
    forecastRevision,
    nowSec: t,
    issuedSec: forecastIssuedSec,
    ttlSec: 75,
  });
  const lease = leaseInfo.status;
  const runtimeUserAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent;
  const edgeCapability = detectEdgeCapability(hardwareProof, runtimeUserAgent);
  const runtimeTrust = deriveRuntimeTrust({
    chaos,
    evidence: evidenceDiagnostics,
    lease: leaseInfo,
    hardwareEvidenceAccepted: edgeCapability.profileAccepted,
  });
  const trust = runtimeTrust.state;
  const commitEligibility = evaluateCommitEligibility(lease, selectedEvaluation);
  const stability = decisionStability(selectedEvaluation, evaluations, sensitivity);
  const nextObservationValue = informationValue(sensitivity[0]);

  const noActionBase = useMemo(
    () => simulate({ untilSec: 420, plan: 'NO_ACTION', parameters: BASE_PARAMETERS, chaos: forecastChaos, interventionCommitSec: forecastCommitSec }),
    [forecastChaos, forecastCommitSec],
  );
  const noActionAdverse = useMemo(
    () => simulate({ untilSec: 420, plan: 'NO_ACTION', parameters: { ...BASE_PARAMETERS, floodGrowth: 1.13, telecomBackupSec: 102 }, chaos: forecastChaos, interventionCommitSec: forecastCommitSec }),
    [forecastChaos, forecastCommitSec],
  );
  const noActionOptimistic = useMemo(
    () => simulate({ untilSec: 420, plan: 'NO_ACTION', parameters: { ...BASE_PARAMETERS, floodGrowth: 0.88, telecomBackupSec: 140 }, chaos: forecastChaos, interventionCommitSec: forecastCommitSec }),
    [forecastChaos, forecastCommitSec],
  );
  const impactCandidates = [
    noActionAdverse.firstCriticalImpactSec,
    noActionBase.firstCriticalImpactSec,
    noActionOptimistic.firstCriticalImpactSec,
  ].filter((value): value is number => value != null);
  const cascadeEarliest = impactCandidates.length ? Math.max(0, Math.min(...impactCandidates) - t) : null;
  const cascadeLatest = impactCandidates.length ? Math.max(0, Math.max(...impactCandidates) - t) : null;

  const advance = (delta = 15) => setT(value => Math.min(SCENARIO_DURATION_SEC, value + delta));

  const reset = () => {
    setT(0);
    chaosRef.current = INITIAL_CHAOS;
    setChaos(INITIAL_CHAOS);
    setWorldRevision(0);
    setForecastRevision(0);
    setForecastChaos(INITIAL_CHAOS);
    setForecastCommitSec(48);
    setForecastIssuedSec(0);
    setPlaying(false);
    setSelectedPlan('REROUTE_MOBILE');
    setActivePlan('NO_ACTION');
    setActiveCommitSec(0);
    setFutureOffset(90);
    setHardwareProof(null);
    auditSequence.current = 2;
    setAudit([{ time: 0, kind: 'system', message: 'CITY//01 initialized with deterministic seed 271828.', ref: 'SYS-0001' }]);
  };

  const toggleChaos = (key: keyof ChaosFlags, minimumTime: number, label: string) => {
    const at = Math.max(t, minimumTime);
    const enabled = !chaosRef.current[key];
    const nextChaos = { ...chaosRef.current, [key]: enabled };
    chaosRef.current = nextChaos;
    setT(value => Math.max(value, minimumTime));
    setChaos(nextChaos);
    setWorldRevision(value => value + 1);
    appendAudit('observed', `${label} ${enabled ? 'enabled' : 'cleared'} in CITY//01.`, 'E', at);
  };

  const replan = () => {
    setForecastChaos({ ...chaosRef.current });
    setForecastCommitSec(t);
    setForecastRevision(worldRevision);
    setForecastIssuedSec(t);
    appendAudit('system', 'Forecast lease renewed. Reality Forks recomputed using current world revision.', 'F');
  };

  const commitPlan = () => {
    if (!commitEligibility.allowed) {
      appendAudit('system', commitEligibility.message, commitEligibility.auditRef);
      return;
    }
    setActivePlan(selectedPlan);
    setActiveCommitSec(t);
    appendAudit('system', `${PLANS[selectedPlan].name} committed to the CITY//01 simulation.`, `P-${selectedPlan}`);
  };

  const loadHardwareProof = async (file: File) => {
    if (file.size > MAX_HARDWARE_PROOF_BYTES) {
      setHardwareProof(null);
      appendAudit('system', 'Hardware proof rejected because the file exceeds the 1 MB safety limit.', 'EDGE-PROOF');
      return;
    }

    try {
      const parsed: unknown = JSON.parse(await file.text());
      setHardwareProof(parsed);
      const result = detectEdgeCapability(parsed, runtimeUserAgent);
      appendAudit(
        'system',
        result.profileAccepted
          ? 'QNN evidence profile accepted for review; exact-device execution provenance remains independently unverified.'
          : `Hardware evidence profile rejected: ${result.proofReason}`,
        'EDGE-PROOF',
      );
    } catch {
      setHardwareProof(null);
      appendAudit('system', 'Hardware proof could not be parsed as JSON.', 'EDGE-PROOF');
    }
  };

  const exportCapsule = () => {
    const hardwareValidation = validateHardwareProof(hardwareProof);
    const capsule = {
      product: 'CHAIN//REACTION',
      scenario: 'MONSOON ZERO',
      seed: SCENARIO_SEED,
      time: t,
      worldRevision,
      forecastRevision,
      chaos,
      forecastChaos,
      forecastCommitSec,
      selectedPlan,
      activePlan,
      activeCommitSec,
      evaluation: selectedEvaluation,
      evidence,
      evidenceDiagnostics,
      runtimeTrust,
      lease: leaseInfo,
      decisionStability: stability,
      hardwareProof: hardwareValidation.valid ? hardwareValidation.proof : null,
      hardwareEvidenceStatus: edgeCapability.profileAccepted ? 'PROFILE_ACCEPTED_NOT_ATTESTED' : 'UNVERIFIED',
      trace: liveRun.final.trace,
      audit,
      traceFingerprint: traceFingerprint({ seed: SCENARIO_SEED, activePlan, activeCommitSec, trace: liveRun.final.trace, audit }),
      simulationBoundary: 'CITY//01 synthetic environment — not operational municipal validation',
    };
    const blob = new Blob([JSON.stringify(capsule, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monsoon-zero-t${t}.crx.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return {
    t,
    setT,
    tab,
    setTab,
    chaos,
    selectedPlan,
    setSelectedPlan,
    activePlan,
    liveRun,
    evaluations,
    selectedEvaluation,
    sensitivity,
    prevention,
    futureSnapshots,
    futureOffset,
    setFutureOffset,
    evidence,
    rawEvidence,
    evidenceDiagnostics,
    lease,
    leaseInfo,
    trust,
    runtimeTrust,
    stability,
    commitEligibility,
    nextObservationValue,
    cascadeEarliest,
    cascadeLatest,
    forecastCommitSec,
    forecastIssuedSec,
    worldRevision,
    forecastRevision,
    audit,
    advance,
    reset,
    toggleChaos,
    replan,
    commitPlan,
    exportCapsule,
    playing,
    setPlaying,
    hardwareProof,
    loadHardwareProof,
    edgeCapability,
  };
}

export type Mission = ReturnType<typeof useMission>;
