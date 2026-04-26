import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { usePatientStore } from "../../store/patientStore";

const ALTERNATIVES = [
  "iron",
  "epo",
  "folate_b12",
  "autologous",
  "cellSaver",
] as const;
type AltKey = (typeof ALTERNATIVES)[number];

const ALT_ICONS: Record<AltKey, string> = {
  iron: "🔩",
  epo: "💉",
  folate_b12: "🌿",
  autologous: "🔄",
  cellSaver: "⚕️",
};

function feasibilityScore(
  alt: AltKey,
  patient: ReturnType<
    typeof import("../../store/patientStore").usePatientStore.getState
  >["patient"],
): number {
  const hb = patient.hb ?? 12;
  switch (alt) {
    case "iron":
      return patient.isVegetarian ||
        patient.medicalHistory.includes("gynecological")
        ? 90
        : hb < 10
          ? 70
          : 50;
    case "epo":
      return patient.medicalHistory.includes("ckd") ||
        patient.clinicalScenarios.includes("recentChemo")
        ? 85
        : 40;
    case "folate_b12":
      return patient.isVegetarian ? 95 : 60;
    case "autologous":
      return patient.clinicalScenarios.includes("postSurgery")
        ? 30
        : patient.clinicalScenarios.includes("massiveBleed")
          ? 10
          : 70;
    case "cellSaver":
      return patient.clinicalScenarios.includes("postSurgery") ? 80 : 40;
  }
}

function feasibilityToken(score: number): {
  fg: string;
  bg: string;
  trackBg: string;
} {
  if (score >= 70)
    return {
      fg: "var(--status-ok-fg)",
      bg: "var(--status-ok-bg)",
      trackBg: "var(--status-ok-fg)",
    };
  if (score >= 40)
    return {
      fg: "var(--status-warn-fg)",
      bg: "var(--status-warn-bg)",
      trackBg: "var(--status-warn-fg)",
    };
  return {
    fg: "var(--gray-500)",
    bg: "var(--gray-100)",
    trackBg: "var(--gray-400)",
  };
}

export default function Tab2_Alternatives() {
  const { t } = useTranslation();
  const { patient } = usePatientStore();

  return (
    <div className="space-y-3">
      <div
        className="rounded-xl"
        style={{
          background: "var(--status-ok-bg)",
          border: "1px solid var(--status-ok-bg)",
          padding: "0.875rem 1rem",
        }}
      >
        <p
          className="text-sm font-bold"
          style={{ color: "var(--status-ok-fg)", lineHeight: 1.45 }}
        >
          🌿 {t("tab2.subtitle")}
        </p>
      </div>

      {ALTERNATIVES.map((alt, i) => {
        const score = feasibilityScore(alt, patient);
        const tok = feasibilityToken(score);
        return (
          <motion.div
            key={alt}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
            className="glass-card glass-card-hover"
            style={{ padding: "1.125rem" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span
                  className="text-2xl flex-shrink-0"
                  aria-hidden
                  style={{ marginTop: 2 }}
                >
                  {ALT_ICONS[alt]}
                </span>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-base"
                    style={{ color: "var(--gray-800)" }}
                  >
                    {t(`tab2.alternatives.${alt}.name`)}
                  </h3>
                  <p
                    className="text-sm mt-0.5"
                    style={{ color: "var(--gray-500)", lineHeight: 1.5 }}
                  >
                    {t(`tab2.alternatives.${alt}.desc`)}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                    <span style={{ color: "var(--gray-500)" }}>
                      ⏰ {t(`tab2.alternatives.${alt}.effect`)}
                    </span>
                    <span style={{ color: "var(--gray-500)" }}>
                      🎯 {t(`tab2.alternatives.${alt}.when`)}
                    </span>
                  </div>
                </div>
              </div>
              {/* Feasibility chip */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="text-xs mb-1.5"
                  style={{
                    color: "var(--gray-500)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {t("tab2.feasibility")}
                </div>
                <div
                  className="rounded-full flex items-center justify-center font-bold"
                  style={{
                    background: tok.bg,
                    color: tok.fg,
                    width: 52,
                    height: 52,
                    fontSize: 13,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {score}%
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div
              className="mt-3 h-1 rounded-full overflow-hidden"
              style={{ background: "var(--gray-100)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: tok.trackBg }}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.7, delay: i * 0.06 + 0.2 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
