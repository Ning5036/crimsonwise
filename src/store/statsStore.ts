import { create } from 'zustand'

const TODAY_KEY = () => `cw_daily_${new Date().toISOString().split('T')[0]}`
const TOTAL_KEY = 'cw_total'
const SESSIONS_KEY = 'cw_sessions'

function getStored(key: string, fallback: number): number {
  const v = localStorage.getItem(key)
  return v ? parseInt(v, 10) : fallback
}

interface StatsStore {
  todayCount: number
  totalCount: number
  recordVisit: () => void
}

export const useStatsStore = create<StatsStore>((set) => ({
  todayCount: getStored(TODAY_KEY(), 0),
  totalCount: getStored(TOTAL_KEY, 0),
  recordVisit: () => {
    const today = getStored(TODAY_KEY(), 0) + 1
    const total = getStored(TOTAL_KEY, 0) + 1
    localStorage.setItem(TODAY_KEY(), String(today))
    localStorage.setItem(TOTAL_KEY, String(total))
    set({ todayCount: today, totalCount: total })
  },
}))

// Session record for Excel export
export interface SessionRecord {
  id: string
  timestamp: string
  lang: string
  age: number | null
  sex: string
  isVegetarian: boolean
  weightKg: number | null
  heightCm: number | null
  medicalHistory: string
  medications: string
  hb: number | null
  plt: number | null
  ptInr: number | null
  apttInr: number | null
  albumin: number | null
  gfr: number | null
  symptoms: string
  symptomsOther: string
  clinicalScenarios: string
  clinicalOther: string
  decision: string
  decisionReason: string
  physicianName: string
  hbUnitsChosen: number
  pltUnitsChosen: number
  pltType: string
  predictedHb: number | null
  predictedPlt: number | null
  riskLevel: string
  satisfaction: number | null
  betterUnderstanding: string
  suggestions: string
}

export function saveSession(record: SessionRecord) {
  const sessions: SessionRecord[] = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]')
  sessions.push(record)
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export function getAllSessions(): SessionRecord[] {
  return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]')
}
