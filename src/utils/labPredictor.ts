// ──────────────────────────────────────────────────────────────
// Post-Transfusion Lab Value Predictor
// Based on AABB Technical Manual & standard hematology formulas
// ──────────────────────────────────────────────────────────────

// ─── Hb Predictor (RLRBC) ─────────────────────────────────────
// Formula: ΔHb = (n × Hb_content_per_unit × 100) / TBV
//   TBV (mL) = weight_kg × gender_factor (male:70, female:65 mL/kg)
//   Hb content per unit ≈ 50 g (Taiwan RLRBC: 200 mL, Hct≈65%)
//   × 100: converts g/mL → g/dL
// Rule of thumb: 1 unit in 70 kg adult ≈ +1 g/dL

export interface HbPredictionInput {
  preHb: number           // g/dL
  units: number           // number of RLRBC units (1–8)
  weightKg: number        // kg
  sex: 'male' | 'female'
}

export interface HbPredictionResult {
  predictedHb: number     // g/dL
  deltaHb: number         // g/dL increase
  tbv: number             // mL (total blood volume)
  confidenceLow: number   // g/dL (−0.5)
  confidenceHigh: number  // g/dL (+0.5)
}

const HB_CONTENT_PER_UNIT_G = 50  // grams per RLRBC unit

export function predictPostTransfusionHb(input: HbPredictionInput): HbPredictionResult {
  const { preHb, units, weightKg, sex } = input
  const genderFactor = sex === 'male' ? 70 : 65
  const tbv = weightKg * genderFactor                               // mL
  const deltaHb = (units * HB_CONTENT_PER_UNIT_G * 100) / tbv      // g/dL
  const predictedHb = preHb + deltaHb

  return {
    predictedHb: round1(predictedHb),
    deltaHb: round1(deltaHb),
    tbv: Math.round(tbv),
    confidenceLow: round1(predictedHb - 0.5),
    confidenceHigh: round1(predictedHb + 0.5),
  }
}

/** Generate a curve: predicted Hb for units 0..maxUnits */
export function hbPredictionCurve(
  preHb: number,
  maxUnits: number,
  weightKg: number,
  sex: 'male' | 'female',
): Array<{ units: number; hb: number }> {
  return Array.from({ length: maxUnits + 1 }, (_, n) => ({
    units: n,
    hb: n === 0 ? round1(preHb) : round1(predictPostTransfusionHb({ preHb, units: n, weightKg, sex }).predictedHb),
  }))
}

// ─── PLT Predictor (RDP / SDP) ────────────────────────────────
// Formula: ΔPlt = (n × PLT_content × Recovery) / (weight_kg × 70,000)
//   PLT_content: RDP ≈ 0.55×10¹¹, SDP ≈ 3×10¹¹ per bag
//   Recovery ≈ 0.67 (67%)
//   BSA (m²) = √(height_cm × weight_kg / 3600)  [Mosteller]
//   CCI = ΔPlt × BSA / (PLT_infused_count × 10¹¹) × 10⁹
//         adequate CCI ≥ 7,500 at 1 hr

export type PlateletType = 'RDP' | 'SDP'

const PLT_CONTENT: Record<PlateletType, number> = {
  RDP: 0.55e11,   // cells per bag
  SDP: 3.0e11,    // cells per bag
}
const PLT_RECOVERY = 0.67

export interface PltPredictionInput {
  prePlt: number          // ×10³/μL
  units: number           // bags
  plateletType: PlateletType
  weightKg: number        // kg
  heightCm: number        // cm
}

export interface PltPredictionResult {
  predictedPlt: number    // ×10³/μL
  deltaPlt: number        // ×10³/μL increase
  bsa: number             // m² (Mosteller)
  tbv: number             // mL
  confidenceLow: number   // ×10³/μL (−10)
  confidenceHigh: number  // ×10³/μL (+10)
  cci: number             // corrected count increment
  cciAdequate: boolean    // ≥7,500
}

export function predictPostTransfusionPlt(input: PltPredictionInput): PltPredictionResult {
  const { prePlt, units, plateletType, weightKg, heightCm } = input
  const bsa = Math.sqrt((heightCm * weightKg) / 3600)              // m²
  const tbv = weightKg * 70                                         // mL

  const totalPltContent = units * PLT_CONTENT[plateletType]        // cells
  // ΔPlt (×10³/μL) = (n × content × recovery) / (weight × 70_000)
  // Derivation: TBV in μL = weight × 70 × 1000; divide by 10³ to get 10³/μL
  const deltaPlt = (totalPltContent * PLT_RECOVERY) / (tbv * 1000) // ×10³/μL

  const predictedPlt = prePlt + deltaPlt

  // CCI = ΔPlt (×10³/μL) × BSA / (total units × PLT_content_per_unit / 10¹¹)
  const unitsIn1e11 = (units * PLT_CONTENT[plateletType]) / 1e11
  const cci = unitsIn1e11 > 0 ? (deltaPlt * 1000 * bsa) / unitsIn1e11 : 0

  return {
    predictedPlt: round1(predictedPlt),
    deltaPlt: round1(deltaPlt),
    bsa: Math.round(bsa * 100) / 100,
    tbv: Math.round(tbv),
    confidenceLow: round1(predictedPlt - 10),
    confidenceHigh: round1(predictedPlt + 10),
    cci: Math.round(cci),
    cciAdequate: cci >= 7500,
  }
}

/** Generate a curve: predicted PLT for units 0..maxUnits */
export function pltPredictionCurve(
  prePlt: number,
  maxUnits: number,
  plateletType: PlateletType,
  weightKg: number,
  heightCm: number,
): Array<{ units: number; plt: number }> {
  return Array.from({ length: maxUnits + 1 }, (_, n) => ({
    units: n,
    plt: n === 0 ? round1(prePlt) : round1(predictPostTransfusionPlt({ prePlt, units: n, plateletType, weightKg, heightCm }).predictedPlt),
  }))
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}
