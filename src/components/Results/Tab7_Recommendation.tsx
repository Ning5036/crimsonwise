import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { usePatientStore } from "../../store/patientStore";
import { assessRisk } from "../../utils/riskAssessment";

const URGENCY_ICONS = {
  urgent: "🚨",
  consider: "⚠️",
  watchful: "👁️",
  unlikely: "✅",
};
const URGENCY_COLORS = {
  urgent: "var(--crimson-500)",
  consider: "var(--status-warn-fg)",
  watchful: "var(--status-info-fg)",
  unlikely: "var(--status-ok-fg)",
};

export default function Tab7_Recommendation() {
  const { t } = useTranslation();
  const { patient, decision } = usePatientStore();
  const risk = assessRisk(patient);
  const urgencyColor = URGENCY_COLORS[risk.urgency];

  const decisionMatchesAdvice =
    (decision.decision === "transfuse" &&
      (risk.urgency === "urgent" || risk.urgency === "consider")) ||
    (decision.decision === "no_transfuse" &&
      (risk.urgency === "watchful" || risk.urgency === "unlikely"));

  const followUpItems = t("tab7.followUpItems", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="space-y-5">
      {/* Decision vs recommendation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Your decision */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4"
          style={{
            background: "transparent",
            border: "none",
            boxShadow: "none",
            borderRadius: 0,
          }}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            {t("tab7.yourDecision")}
          </h3>
          {decision.decision ? (
            <div>
              <div className="text-xl font-bold text-white mb-2">
                {decision.decision === "transfuse"
                  ? "🩸 " + t("tab6.transfuse")
                  : "🌿 " + t("tab6.noTransfuse")}
              </div>
              {decision.reason && (
                <p className="text-sm text-gray-400 italic">
                  「{decision.reason}」
                </p>
              )}
              {decision.physicianName && (
                <p className="text-xs text-gray-500 mt-1">
                  👤 {decision.physicianName}
                </p>
              )}
              {decision.timestamp && (
                <p className="text-xs text-gray-500">
                  {new Date(decision.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">{t("tab7.notDecided")}</div>
          )}
        </motion.div>

        {/* Medical advice (borderless) */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4"
          style={{
            background: "transparent",
            border: "none",
            boxShadow: "none",
            borderRadius: 0,
          }}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            {t("tab7.medAdvice")}
          </h3>
          <div
            className="text-xl font-bold mb-1"
            style={{ color: urgencyColor }}
          >
            {URGENCY_ICONS[risk.urgency]}{" "}
            {t(`tab7.urgentLevel.${risk.urgency}`)}
          </div>
          <div className="text-xs text-gray-400">
            {t("tab7.riskScore")}: {risk.score}/100
          </div>
          {risk.recommendedHbTarget && (
            <div
              className="mt-2 text-xs px-2 py-1 rounded"
              style={{ background: `${urgencyColor}15`, color: urgencyColor }}
            >
              {t("tab7.hbTargetLabel", { value: risk.recommendedHbTarget })}
            </div>
          )}
          {decision.predictedHb && (
            <div className="mt-1 text-xs text-gray-400">
              {t("tab7.predictedHbLabel", {
                units: decision.hbUnitsChosen,
                value: decision.predictedHb,
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Agreement status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl text-center font-medium"
        style={{
          padding: "0.875rem 1rem",
          background: decisionMatchesAdvice
            ? "var(--status-ok-bg)"
            : "var(--status-warn-bg)",
          border: `1px solid ${decisionMatchesAdvice ? "var(--status-ok-fg)" : "var(--status-warn-fg)"}`,
          color: decisionMatchesAdvice
            ? "var(--status-ok-fg)"
            : "var(--status-warn-fg)",
          fontSize: "0.875rem",
        }}
      >
        {decision.decision
          ? decisionMatchesAdvice
            ? t("tab7.agree")
            : t("tab7.disagree")
          : t("tab7.notDecided")}
      </motion.div>

      {/* Follow-up recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="glass-card p-4"
      >
        <h3 className="font-bold text-white mb-3">📋 {t("tab7.followUp")}</h3>
        <ul className="space-y-2">
          {followUpItems.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex items-start gap-2 text-sm text-gray-300 p-2 rounded-lg"
              style={{ background: "rgba(0,0,0,0.02)" }}
            >
              <span className="text-red-400 flex-shrink-0">▸</span>
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* PLT predictor summary if relevant */}
      {decision.predictedPlt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="p-3 rounded-xl"
          style={{
            background: "rgba(52,152,219,0.1)",
            border: "1px solid rgba(52,152,219,0.3)",
          }}
        >
          <div className="text-sm text-gray-300">
            🧫{" "}
            {t("tab7.predictedPltLabel", {
              units: decision.pltUnitsChosen,
              type: decision.pltType,
              value: decision.predictedPlt,
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
