import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { usePatientStore } from "../../store/patientStore";
import { assessRisk } from "../../utils/riskAssessment";

const URGENCY_TAG: Record<ReturnType<typeof assessRisk>["urgency"], string> = {
  urgent: "tag tag-urgent tag-dot",
  consider: "tag tag-warn tag-dot",
  watchful: "tag tag-info tag-dot",
  unlikely: "tag tag-ok tag-dot",
};

const URGENCY_DOT_COLOR: Record<
  ReturnType<typeof assessRisk>["urgency"],
  string
> = {
  urgent: "var(--status-urgent-fg)",
  consider: "var(--status-warn-fg)",
  watchful: "var(--status-info-fg)",
  unlikely: "var(--status-ok-fg)",
};

export default function Tab1_Consultation() {
  const { t } = useTranslation();
  const { patient } = usePatientStore();
  const risk = assessRisk(patient);
  const slogans = t("app.slogans", { returnObjects: true }) as string[];
  const dotColor = URGENCY_DOT_COLOR[risk.urgency];

  const keyPoints = buildKeyPoints(patient, risk, t);

  return (
    <div className="space-y-4">
      {/* Combined: 病人重點諮詢方向 (key factors + consultation points) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        className="glass-card"
        style={{ padding: "1.25rem" }}
      >
        <div className="flex items-center justify-between mb-3 gap-2">
          <h3
            className="font-semibold text-base"
            style={{ color: "var(--gray-800)" }}
          >
            💬 {t("tab1.keyPoints")}
          </h3>
          <span className={URGENCY_TAG[risk.urgency]}>
            {t(`tab1.${risk.urgency}`)}
          </span>
        </div>

        {risk.keyFactors.length > 0 && (
          <ul className="space-y-1.5 mb-3">
            {risk.keyFactors.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--gray-600)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: dotColor }}
                />
                {t(f)}
              </motion.li>
            ))}
          </ul>
        )}

        <ul className="space-y-2">
          {keyPoints.map((pt, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm rounded-xl"
              style={{
                background: "var(--gray-25)",
                color: "var(--gray-700)",
                padding: "0.625rem 0.75rem",
                border: "1px solid var(--border)",
              }}
            >
              <span className="mt-0.5" aria-hidden>
                {pt.icon}
              </span>
              <span style={{ lineHeight: 1.5 }}>{pt.text}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Slogans banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-center rounded-2xl"
        style={{
          background: "var(--crimson-50)",
          border: "1px solid var(--crimson-100)",
          padding: "1rem 1rem",
        }}
      >
        <div
          className="text-xs mb-2 font-medium tracking-wider uppercase"
          style={{ color: "var(--gray-500)", letterSpacing: "0.08em" }}
        >
          {t("tab5.sloganTitle")}
        </div>
        <div className="space-y-0.5">
          {slogans.map((s, i) => (
            <div
              key={i}
              className="text-sm font-medium"
              style={{ color: "var(--crimson-600)" }}
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
