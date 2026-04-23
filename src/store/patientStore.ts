import { create } from 'zustand'

export interface PatientData {
  // Step 1: Basic Info
  age: number | null
  sex: 'male' | 'female' | null
  isVegetarian: boolean
  weightKg: number | null
  heightCm: number | null

  // Step 2: Medical History
  medicalHistory: string[]

  // Step 3: Medications
  medications: string[]

  // Step 4: Lab Values
  hb: number | null           // g/dL (required)
  plt: number | null          // ×10³/μL (optional)
  ptInr: number | null        // PT INR (optional)
  apttInr: number | null      // aPTT INR (optional)
  albumin: number | null      // g/dL (optional)
  gfr: number | null          // mL/min/1.73m² (optional)

  // Step 5: Symptoms
  symptoms: string[]
  symptomsOther: string

  // Step 6: Clinical Scenarios
  clinicalScenarios: string[]
  clinicalOther: string
}

export interface DecisionData {
  decision: 'transfuse' | 'no_transfuse' | null
  reason: string
  physicianName: string
  timestamp: string | null
  // Predictor results
  hbUnitsChosen: number
  pltUnitsChosen: number
  pltType: 'RDP' | 'SDP'
  predictedHb: number | null
  predictedPlt: number | null
}

export interface SurveyData {
  satisfaction: number | null  // 1-5
  betterUnderstanding: 'yes' | 'no' | 'partial' | null
  suggestions: string
  submittedAt: string | null
}

interface PatientStore {
  currentStep: number
  patient: PatientData
  decision: DecisionData
  survey: SurveyData
  setStep: (step: number) => void
  updatePatient: (data: Partial<PatientData>) => void
  updateDecision: (data: Partial<DecisionData>) => void
  updateSurvey: (data: Partial<SurveyData>) => void
  reset: () => void
}

const DEFAULT_PATIENT: PatientData = {
  age: null, sex: null, isVegetarian: false, weightKg: null, heightCm: null,
  medicalHistory: [], medications: [],
  hb: null, plt: null, ptInr: null, apttInr: null, albumin: null, gfr: null,
  symptoms: [], symptomsOther: '',
  clinicalScenarios: [], clinicalOther: '',
}

const DEFAULT_DECISION: DecisionData = {
  decision: null, reason: '', physicianName: '', timestamp: null,
  hbUnitsChosen: 1, pltUnitsChosen: 1, pltType: 'SDP',
  predictedHb: null, predictedPlt: null,
}

const DEFAULT_SURVEY: SurveyData = {
  satisfaction: null, betterUnderstanding: null, suggestions: '', submittedAt: null,
}

export const usePatientStore = create<PatientStore>((set) => ({
  currentStep: 1,
  patient: { ...DEFAULT_PATIENT },
  decision: { ...DEFAULT_DECISION },
  survey: { ...DEFAULT_SURVEY },
  setStep: (step) => set({ currentStep: step }),
  updatePatient: (data) => set((s) => ({ patient: { ...s.patient, ...data } })),
  updateDecision: (data) => set((s) => ({ decision: { ...s.decision, ...data } })),
  updateSurvey: (data) => set((s) => ({ survey: { ...s.survey, ...data } })),
  reset: () => set({ currentStep: 1, patient: { ...DEFAULT_PATIENT }, decision: { ...DEFAULT_DECISION }, survey: { ...DEFAULT_SURVEY } }),
}))
