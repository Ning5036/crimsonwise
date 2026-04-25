import { create } from "zustand";
import { sbInsert, supabaseConfigured } from "../utils/supabaseClient";

const TODAY_KEY = () => `cw_daily_${new Date().toISOString().split("T")[0]}`;
const TOTAL_KEY = "cw_total";
const SESSIONS_KEY = "cw_sessions";
const CLINICAL_QUEUE_KEY = "cw_clinical_pending";

function getStored(key: string, fallback: number): number {
  const v = localStorage.getItem(key);
  return v ? parseInt(v, 10) : fallback;
}

function newClientId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
}

interface StatsStore {
  todayCount: number;
  totalCount: number;
  recordVisit: () => void;
}

export const useStatsStore = create<StatsStore>((set) => ({
  todayCount: getStored(TODAY_KEY(), 0),
  totalCount: getStored(TOTAL_KEY, 0),
  recordVisit: () => {
    const today = getStored(TODAY_KEY(), 0) + 1;
    const total = getStored(TOTAL_KEY, 0) + 1;
    localStorage.setItem(TODAY_KEY(), String(today));
    localStorage.setItem(TOTAL_KEY, String(total));
    set({ todayCount: today, totalCount: total });
  },
}));

// Session record kept in localStorage for offline use.
export interface SessionRecord {
  id: string;
  timestamp: string;
  lang: string;
  age: number | null;
  sex: string;
  isVegetarian: boolean;
  weightKg: number | null;
  heightCm: number | null;
  medicalHistory: string;
  medications: string;
  hb: number | null;
  plt: number | null;
  ptInr: number | null;
  apttInr: number | null;
  albumin: number | null;
  gfr: number | null;
  symptoms: string;
  symptomsOther: string;
  clinicalScenarios: string;
  clinicalOther: string;
  decision: string;
  decisionReason: string;
  physicianName: string;
  hbUnitsChosen: number;
  pltUnitsChosen: number;
  pltType: string;
  predictedHb: number | null;
  predictedPlt: number | null;
  riskLevel: string;
  satisfaction: number | null;
  betterUnderstanding: string;
  suggestions: string;
}

// Shape that matches the `sessions` Supabase table (nested JSONB columns).
type SessionInsert = {
  client_id: string;
  lang: string;
  patient: Record<string, unknown>;
  decision: Record<string, unknown>;
  survey: Record<string, unknown>;
  risk_level: string;
  physician_name: string;
};

function recordToInsert(record: SessionRecord): SessionInsert {
  return {
    client_id: newClientId(),
    lang: record.lang,
    patient: {
      age: record.age,
      sex: record.sex,
      isVegetarian: record.isVegetarian,
      weightKg: record.weightKg,
      heightCm: record.heightCm,
      medicalHistory: record.medicalHistory,
      medications: record.medications,
      hb: record.hb,
      plt: record.plt,
      ptInr: record.ptInr,
      apttInr: record.apttInr,
      albumin: record.albumin,
      gfr: record.gfr,
      symptoms: record.symptoms,
      symptomsOther: record.symptomsOther,
      clinicalScenarios: record.clinicalScenarios,
      clinicalOther: record.clinicalOther,
    },
    decision: {
      decision: record.decision,
      decisionReason: record.decisionReason,
      hbUnitsChosen: record.hbUnitsChosen,
      pltUnitsChosen: record.pltUnitsChosen,
      pltType: record.pltType,
      predictedHb: record.predictedHb,
      predictedPlt: record.predictedPlt,
      timestamp: record.timestamp,
    },
    survey: {
      satisfaction: record.satisfaction,
      betterUnderstanding: record.betterUnderstanding,
      suggestions: record.suggestions,
    },
    risk_level: record.riskLevel,
    physician_name: record.physicianName,
  };
}

function pushToQueue(row: SessionInsert) {
  const q: SessionInsert[] = JSON.parse(
    localStorage.getItem(CLINICAL_QUEUE_KEY) || "[]",
  );
  q.push(row);
  localStorage.setItem(CLINICAL_QUEUE_KEY, JSON.stringify(q));
}

async function sendOrQueue(row: SessionInsert): Promise<void> {
  if (!supabaseConfigured()) {
    pushToQueue(row);
    return;
  }
  try {
    await sbInsert("sessions", row);
  } catch {
    pushToQueue(row);
  }
}

export async function flushClinicalQueue(): Promise<void> {
  if (!supabaseConfigured()) return;
  let queue: SessionInsert[] = [];
  try {
    queue = JSON.parse(localStorage.getItem(CLINICAL_QUEUE_KEY) || "[]");
  } catch {
    queue = [];
  }
  if (!queue.length) return;
  const remaining: SessionInsert[] = [];
  for (const row of queue) {
    const withId: SessionInsert = row.client_id
      ? row
      : { ...row, client_id: newClientId() };
    try {
      await sbInsert("sessions", withId);
    } catch {
      remaining.push(withId);
    }
  }
  localStorage.setItem(CLINICAL_QUEUE_KEY, JSON.stringify(remaining));
}

export function saveSession(record: SessionRecord) {
  const sessions: SessionRecord[] = JSON.parse(
    localStorage.getItem(SESSIONS_KEY) || "[]",
  );
  sessions.push(record);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  void sendOrQueue(recordToInsert(record));
}

export function getAllSessions(): SessionRecord[] {
  return JSON.parse(localStorage.getItem(SESSIONS_KEY) || "[]");
}
