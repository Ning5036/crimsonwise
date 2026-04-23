import type { PatientData } from '../store/patientStore'

export type UrgencyLevel = 'urgent' | 'consider' | 'watchful' | 'unlikely'

export interface RiskAssessmentResult {
  urgency: UrgencyLevel
  score: number          // 0–100
  keyFactors: string[]
  alternativesPotential: 'high' | 'medium' | 'low'
  recommendedHbTarget: number
  recommendedPltTarget: number | null
}

export function assessRisk(p: PatientData): RiskAssessmentResult {
  let score = 0
  const factors: string[] = []

  const hb = p.hb ?? 12

  // ── Hb ───────────────────────────────────────────────
  if (hb < 6) { score += 50; factors.push('risk.factor.hbCritical') }
  else if (hb < 7) { score += 35; factors.push('risk.factor.hbLow') }
  else if (hb < 8) { score += 20; factors.push('risk.factor.hbBorderline') }
  else if (hb < 10) { score += 8 }

  // ── Clinical scenarios ────────────────────────────────
  if (p.clinicalScenarios.includes('sepsisShock')) { score += 25; factors.push('risk.factor.sepsisShock') }
  if (p.clinicalScenarios.includes('massiveBleed')) { score += 30; factors.push('risk.factor.massiveBleed') }
  if (p.clinicalScenarios.includes('hemolysis')) { score += 20; factors.push('risk.factor.hemolysis') }
  if (p.clinicalScenarios.includes('recentChemo')) { score += 12; factors.push('risk.factor.recentChemo') }
  if (p.clinicalScenarios.includes('ckdEpoResistant')) { score += 10; factors.push('risk.factor.ckdEpoResistant') }
  if (p.clinicalScenarios.includes('dialysisEpoResistant')) { score += 10; factors.push('risk.factor.dialysisEpo') }
  if (p.clinicalScenarios.includes('postSurgery')) { score += 8; factors.push('risk.factor.postSurgery') }
  if (p.clinicalScenarios.includes('cirrhosisAscites')) { score += 8; factors.push('risk.factor.cirrhosisAscites') }

  // ── Medical history ───────────────────────────────────
  if (p.medicalHistory.includes('heartDisease')) { score += 10; factors.push('risk.factor.heartDisease') }
  if (p.medicalHistory.includes('ckd')) { score += 8; factors.push('risk.factor.ckd') }
  if (p.medicalHistory.includes('cancer')) { score += 6; factors.push('risk.factor.cancer') }
  if (p.medicalHistory.includes('bloodDisease')) { score += 8; factors.push('risk.factor.bloodDisease') }

  // ── Coagulation ───────────────────────────────────────
  if ((p.ptInr ?? 1) > 1.5) { score += 10; factors.push('risk.factor.coagPt') }
  if ((p.apttInr ?? 1) > 1.5) { score += 8; factors.push('risk.factor.coagAptt') }

  // ── Platelets ─────────────────────────────────────────
  const plt = p.plt
  if (plt !== null) {
    if (plt < 10) { score += 20; factors.push('risk.factor.pltCritical') }
    else if (plt < 50) { score += 10; factors.push('risk.factor.pltLow') }
  }

  // ── Nutritional markers ───────────────────────────────
  if ((p.albumin ?? 4) < 3) { score += 5; factors.push('risk.factor.albumin') }
  if ((p.gfr ?? 90) < 15) { score += 5; factors.push('risk.factor.gfrLow') }

  // ── Symptoms ─────────────────────────────────────────
  const highSx = ['palpitation', 'dyspnea', 'oliguria']
  const hasSevereSymptom = p.symptoms.some(s => highSx.includes(s))
  if (hasSevereSymptom) { score += 8; factors.push('risk.factor.severeSx') }
  else if (p.symptoms.length > 2) { score += 4; factors.push('risk.factor.multipleSx') }

  // ── Medications ───────────────────────────────────────
  if (p.medications.includes('antiplatelet')) { score += 5; factors.push('risk.factor.antiplatelet') }

  // ── Cap score at 100 ─────────────────────────────────
  score = Math.min(score, 100)

  // ── Urgency level ─────────────────────────────────────
  let urgency: UrgencyLevel
  if (score >= 55 || hb < 7) urgency = 'urgent'
  else if (score >= 30 || hb < 8) urgency = 'consider'
  else if (score >= 15 || hb < 10) urgency = 'watchful'
  else urgency = 'unlikely'

  // ── Alternatives potential ───────────────────────────
  const noAlts = p.clinicalScenarios.includes('massiveBleed') || p.clinicalScenarios.includes('sepsisShock')
  const altsFavorable =
    p.isVegetarian ||
    p.clinicalScenarios.includes('malnutrition') ||
    p.medicalHistory.includes('ckd') ||
    (p.albumin !== null && p.albumin < 3)
  const alternativesPotential = noAlts ? 'low' : altsFavorable ? 'high' : 'medium'

  // ── Recommended targets ───────────────────────────────
  const needHigherHb =
    p.medicalHistory.includes('heartDisease') ||
    p.clinicalScenarios.includes('postSurgery') ||
    (p.age !== null && p.age > 70)
  const recommendedHbTarget = needHigherHb ? 8 : 7

  const needPlt = plt !== null && plt < 50
  const recommendedPltTarget = needPlt ? 50 : null

  return { urgency, score, keyFactors: factors.slice(0, 5), alternativesPotential, recommendedHbTarget, recommendedPltTarget }
}
