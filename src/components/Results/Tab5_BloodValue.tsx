import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const BLOOD_STEP_ICONS = ["🙋", "🩸", "🔬", "⚗️", "❄️", "🏥", "💊"];

export default function Tab5_BloodValue() {
  const { t } = useTranslation();
  const bloodStepLabels = t("tab5.bloodSteps", {
    returnObjects: true,
  }) as string[];
  const slogans = t("app.slogans", { returnObjects: true }) as string[];

  const facts = t("tab5.facts", { returnObjects: true }) as string[];
  const evidenceItems = t("tab5.evidence.items", { returnObjects: true }) as {
    study: string;
    finding: string;
    level: string;
  }[];

  return (
    <div className="space-y-5">
      {/* Blood journey infographic */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-4"
      >
        <h3 className="font-bold text-white mb-4">
          🩸 {t("tab5.bloodJourneyTitle")}
        </h3>
        <div className="flex items-center flex-wrap gap-1 justify-center">
          {BLOOD_STEP_ICONS.map((icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-1"
            >
              <div className="flex flex-col items-center gap-1 px-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(192,57,43,0.15)",
                    border: "1px solid rgba(192,57,43,0.3)",
                  }}
                >
                  <span className="text-lg">{icon}</span>
                </div>
                <span
                  className="text-xs text-gray-400 text-center leading-tight"
                  style={{ maxWidth: 56 }}
                >
                  {bloodStepLabels[i]}
                </span>
              </div>
              {i < BLOOD_STEP_ICONS.length - 1 && (
                <span className="text-gray-600 text-sm">→</span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Facts */}
      <div className="space-y-2">
        {facts.map((fact, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{
              background: "rgba(0,0,0,0.025)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <span className="text-red-400 text-lg flex-shrink-0">•</span>
            <span className="text-sm text-gray-300">{fact}</span>
          </motion.div>
        ))}
      </div>

      {/* Evidence */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="glass-card p-4"
      >
        <h3 className="font-bold text-white mb-3">
          📊 {t("tab5.evidence.title")}
        </h3>
        <div className="space-y-3">
          {evidenceItems.map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-xl"
              style={{
                background: "rgba(0,0,0,0.02)",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(192,57,43,0.2)",
                    color: "var(--crimson-500)",
                  }}
                >
                  {item.study}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(39,174,96,0.15)",
                    color: "var(--status-ok-fg)",
                  }}
                >
                  {item.level}
                </span>
              </div>
              <p className="text-sm text-gray-300">{item.finding}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Slogans */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="rounded-2xl text-center"
        style={{
          padding: "1.25rem",
          background: "var(--crimson-50)",
          border: "1px solid var(--crimson-100)",
        }}
      >
        <div
          className="font-semibold mb-3 text-xs tracking-widest uppercase"
          style={{ color: "var(--gray-500)", letterSpacing: "0.08em" }}
        >
          {t("tab5.sloganTitle")}
        </div>
        <div className="space-y-1.5">
          {slogans.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.12 }}
              className="text-sm font-medium"
              style={{ color: "var(--crimson-600)" }}
            >
              「{s}」
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
