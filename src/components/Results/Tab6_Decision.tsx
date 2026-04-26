import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { usePatientStore } from "../../store/patientStore";
import { saveSession } from "../../store/statsStore";
import { assessRisk } from "../../utils/riskAssessment";
import HbPredictorWidget from "../Charts/HbPredictorWidget";
import PltPredictorWidget from "../Charts/PltPredictorWidget";

interface Props {
  onDecisionMade?: () => void;
}

export default function Tab6_Decision({ onDecisionMade }: Props) {
  const { t, i18n } = useTranslation();
  const { patient, decision, updateDecision, survey } = usePatientStore();
  const [predictorTab, setPredictorTab] = useState<"hb" | "plt">("hb");
  const [confirmModal, setConfirmModal] = useState<
    "transfuse" | "no_transfuse" | null
  >(null);

  const showPlt = patient.plt !== null;

  const handleConfirm = (d: "transfuse" | "no_transfuse") => {
    const risk = assessRisk(patient);
    const timestamp = new Date().toISOString();
    updateDecision({ decision: d, timestamp });

    // Save session record
    saveSession({
      id: `${Date.now()}`,
      timestamp,
      lang: i18n.language,
      age: patient.age,
      sex: patient.sex ?? "",
      isVegetarian: patient.isVegetarian,
      weightKg: patient.weightKg,
      heightCm: patient.heightCm,
      medicalHistory: patient.medicalHistory.join(", "),
      medications: patient.medications.join(", "),
      hb: patient.hb,
      plt: patient.plt,
      ptInr: patient.ptInr,
      apttInr: patient.apttInr,
      albumin: patient.albumin,
      gfr: patient.gfr,
      symptoms: patient.symptoms.join(", "),
      symptomsOther: patient.symptomsOther,
      clinicalScenarios: patient.clinicalScenarios.join(", "),
      clinicalOther: patient.clinicalOther,
      decision: d,
      decisionReason: decision.reason,
      physicianName: decision.physicianName,
      hbUnitsChosen: decision.hbUnitsChosen,
      pltUnitsChosen: decision.pltUnitsChosen,
      pltType: decision.pltType,
      predictedHb: decision.predictedHb,
      predictedPlt: decision.predictedPlt,
      riskLevel: risk.urgency,
      satisfaction: survey.satisfaction,
      betterUnderstanding: survey.betterUnderstanding ?? "",
      suggestions: survey.suggestions,
    });

    setConfirmModal(null);
    onDecisionMade?.();
  };

  return (
    <div className="space-y-5">
      {/* Predictor */}
      <div className="glass-card" style={{ padding: "1.25rem" }}>
        <h3
          className="font-semibold mb-3 text-base"
          style={{ color: "var(--gray-800)" }}
        >
          🔢 {t("tab6.predictor.title")}
        </h3>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setPredictorTab("hb")}
            className="flex-1 text-sm transition-all"
            style={{
              padding: "0.5rem 0.875rem",
              borderRadius: "var(--r-md)",
              background:
                predictorTab === "hb" ? "var(--crimson-500)" : "var(--gray-25)",
              color: predictorTab === "hb" ? "#fff" : "var(--gray-600)",
              border:
                predictorTab === "hb"
                  ? "1px solid var(--crimson-500)"
                  : "1px solid var(--border)",
              fontWeight: predictorTab === "hb" ? 700 : 500,
              cursor: "pointer",
            }}
          >
            🩸 {t("tab6.predictor.hbTab")}
          </button>
          {showPlt && (
            <button
              onClick={() => setPredictorTab("plt")}
              className="flex-1 text-sm transition-all"
              style={{
                padding: "0.5rem 0.875rem",
                borderRadius: "var(--r-md)",
                background:
                  predictorTab === "plt"
                    ? "var(--status-info-fg)"
                    : "var(--gray-25)",
                color: predictorTab === "plt" ? "#fff" : "var(--gray-600)",
                border:
                  predictorTab === "plt"
                    ? "1px solid var(--status-info-fg)"
                    : "1px solid var(--border)",
                fontWeight: predictorTab === "plt" ? 700 : 500,
                cursor: "pointer",
              }}
            >
              🧫 {t("tab6.predictor.pltTab")}
            </button>
          )}
        </div>
        {predictorTab === "hb" ? <HbPredictorWidget /> : <PltPredictorWidget />}
      </div>

      {/* Reason & physician */}
      <div className="glass-card space-y-3" style={{ padding: "1.25rem" }}>
        <div>
          <label className="field-label">{t("tab6.reasonLabel")}</label>
          <textarea
            rows={2}
            value={decision.reason}
            onChange={(e) => updateDecision({ reason: e.target.value })}
            placeholder={t("tab6.reasonPlaceholder")}
            className="input-field"
            style={{ resize: "none" }}
          />
        </div>
        <div>
          <label className="field-label">{t("tab6.physicianLabel")}</label>
          <input
            type="text"
            value={decision.physicianName}
            onChange={(e) => updateDecision({ physicianName: e.target.value })}
            placeholder={t("tab6.physicianPlaceholder")}
            className="input-field"
          />
        </div>
      </div>

      {/* Decision buttons */}
      <div>
        <h3
          className="font-semibold text-center mb-3"
          style={{ color: "var(--gray-800)" }}
        >
          {t("tab6.decisionTitle")}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setConfirmModal("transfuse")}
            className="font-bold flex flex-col items-center gap-2"
            style={{
              padding: "1.25rem 1rem",
              borderRadius: "var(--r-lg)",
              background:
                decision.decision === "transfuse"
                  ? "var(--crimson-500)"
                  : "var(--surface)",
              border:
                decision.decision === "transfuse"
                  ? "1px solid var(--crimson-500)"
                  : "1px solid var(--crimson-100)",
              color:
                decision.decision === "transfuse"
                  ? "#fff"
                  : "var(--crimson-600)",
              cursor: "pointer",
              boxShadow:
                decision.decision === "transfuse"
                  ? "var(--shadow-crimson)"
                  : "var(--shadow-sm)",
              transition: "all 0.18s var(--easing)",
            }}
          >
            <span className="text-3xl" aria-hidden>
              🩸
            </span>
            <span className="text-sm">{t("tab6.transfuse")}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setConfirmModal("no_transfuse")}
            className="font-bold flex flex-col items-center gap-2"
            style={{
              padding: "1.25rem 1rem",
              borderRadius: "var(--r-lg)",
              background:
                decision.decision === "no_transfuse"
                  ? "var(--status-ok-bg)"
                  : "var(--surface)",
              border: `1px solid ${decision.decision === "no_transfuse" ? "var(--status-ok-fg)" : "var(--border)"}`,
              color:
                decision.decision === "no_transfuse"
                  ? "var(--status-ok-fg)"
                  : "var(--gray-600)",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              transition: "all 0.18s var(--easing)",
            }}
          >
            <span className="text-3xl" aria-hidden>
              🌿
            </span>
            <span className="text-sm">{t("tab6.noTransfuse")}</span>
          </motion.button>
        </div>
      </div>

      {decision.decision && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl text-center text-sm"
          style={{
            background: "rgba(39,174,96,0.06)",
            border: "1px solid rgba(39,174,96,0.2)",
            color: "#555",
          }}
        >
          ✅ 已記錄：
          {decision.decision === "transfuse"
            ? t("tab6.transfuse")
            : t("tab6.noTransfuse")}
          {decision.timestamp && (
            <span className="text-xs ml-2" style={{ color: "var(--gray-400)" }}>
              ({new Date(decision.timestamp).toLocaleString()})
            </span>
          )}
        </motion.div>
      )}

      {/* Confirm modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-sm w-full"
            >
              <h3
                className="font-bold text-lg mb-3 text-center"
                style={{ color: "var(--gray-800)" }}
              >
                {t("tab6.confirmTitle")}
              </h3>
              <p
                className="text-center mb-5 text-sm"
                style={{ color: "var(--gray-600)", lineHeight: 1.5 }}
              >
                {confirmModal === "transfuse"
                  ? t("tab6.confirmTransfuse")
                  : t("tab6.confirmNo")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="btn btn-secondary flex-1"
                >
                  {t("app.cancel")}
                </button>
                <button
                  onClick={() => handleConfirm(confirmModal)}
                  className="btn btn-primary flex-1"
                >
                  {t("app.confirm")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
