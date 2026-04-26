import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { usePatientStore } from "../../store/patientStore";
import { assessRisk } from "../../utils/riskAssessment";

const URGENCY_CONFIG = {
  urgent: {
    color: "#e74c3c",
    bg: "rgba(231,76,60,0.15)",
    border: "#e74c3c",
    emoji: "🚨",
  },
  consider: {
    color: "#f39c12",
    bg: "rgba(243,156,18,0.15)",
    border: "#f39c12",
    emoji: "⚠️",
  },
  watchful: {
    color: "#3498db",
    bg: "rgba(52,152,219,0.15)",
    border: "#3498db",
    emoji: "👁️",
  },
  unlikely: {
    color: "#27ae60",
    bg: "rgba(39,174,96,0.15)",
    border: "#27ae60",
    emoji: "✅",
  },
};

export default function Tab1_Consultation() {
  const { t } = useTranslation();
  const { patient } = usePatientStore();
  const risk = assessRisk(patient);
  const cfg = URGENCY_CONFIG[risk.urgency];
  const slogans = t("app.slogans", { returnObjects: true }) as string[];

  const keyPoints = buildKeyPoints(patient, risk, t);

  return (
    <div className="space-y-5">
      {/* Key factors */}
      {risk.keyFactors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4"
        >
          <h3 className="font-semibold mb-3" style={{ color: "#1a1a1a" }}>
            🎯 {t("tab1.keyPoints")}
          </h3>
          <ul className="space-y-2">
            {risk.keyFactors.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center gap-2 text-sm"
                style={{ color: "#374151" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: cfg.color }}
                />
                {t(f)}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Consultation points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4"
      >
        <h3 className="font-semibold mb-3" style={{ color: "#1a1a1a" }}>
          💬 {t("tab1.keyPoints")}
        </h3>
        <ul className="space-y-2">
          {keyPoints.map((pt, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm p-2.5 rounded-xl"
              style={{ background: "rgba(0,0,0,0.03)", color: "#374151" }}
            >
              <span className="mt-0.5">{pt.icon}</span>
              <span>{pt.text}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Slogans banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-2xl text-center"
        style={{
          background:
            "linear-gradient(135deg,rgba(192,57,43,0.07),rgba(231,76,60,0.04))",
          border: "1px solid rgba(192,57,43,0.2)",
        }}
      >
        <div className="text-xs mb-2" style={{ color: "#888" }}>
          🏥 {t("tab5.sloganTitle")}
        </div>
        <div className="space-y-1">
          {slogans.map((s, i) => (
            <div
              key={i}
              className="text-sm font-medium"
              style={{ color: "#e74c3c" }}
            >
              「{s}」
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function buildKeyPoints(
  patient: ReturnType<
    typeof import("../../store/patientStore").usePatientStore.getState
  >["patient"],
  risk: ReturnType<typeof assessRisk>,
  t: (k: string, opts?: Record<string, unknown>) => string,
) {
  const pts: { icon: string; text: string }[] = [];
  const hb = patient.hb ?? 12;

  if (hb < 7)
    pts.push({ icon: "🩸", text: t("tab1.consult.hbCritical", { value: hb }) });
  else if (hb < 8)
    pts.push({
      icon: "⚠️",
      text: t("tab1.consult.hbBorderline", { value: hb }),
    });
  else pts.push({ icon: "✅", text: t("tab1.consult.hbSafe", { value: hb }) });

  if (patient.medicalHistory.includes("heartDisease"))
    pts.push({ icon: "❤️", text: t("tab1.consult.heartDisease") });
  if (patient.medications.includes("antiplatelet"))
    pts.push({ icon: "💊", text: t("tab1.consult.antiplatelet") });
  if (patient.isVegetarian)
    pts.push({ icon: "🌿", text: t("tab1.consult.vegetarian") });
  if (risk.alternativesPotential === "high")
    pts.push({ icon: "🔄", text: t("tab1.consult.alternativeHigh") });
  if (patient.clinicalScenarios.includes("massiveBleed"))
    pts.push({ icon: "🚨", text: t("tab1.consult.massiveBleed") });

  if (pts.length === 0)
    pts.push({ icon: "💬", text: t("tab1.consult.general") });

  return pts.slice(0, 5);
}
