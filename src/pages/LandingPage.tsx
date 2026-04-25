import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useStatsStore, flushClinicalQueue } from "../store/statsStore";
import { usePatientStore } from "../store/patientStore";

const FEATURES = [
  { icon: "🧭", key: "landing.feature1" },
  { icon: "🌿", key: "landing.feature2" },
  { icon: "💡", key: "landing.feature3" },
  { icon: "📚", key: "landing.feature4" },
  { icon: "🔢", key: "landing.feature5" },
  { icon: "🌍", key: "landing.feature6" },
];

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { recordVisit, todayCount, totalCount } = useStatsStore();
  const { reset } = usePatientStore();

  useEffect(() => {
    recordVisit();
    void flushClinicalQueue();
  }, []);

  const handleStart = () => {
    reset();
    navigate("/form");
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-grid"
      style={{
        background:
          "linear-gradient(180deg,#FFF5F3 0%,#FFF0EE 50%,#FFF5F3 100%)",
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 w-full max-w-xl"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="text-8xl mb-5 drop-shadow-sm"
          >
            🩸
          </motion.div>

          <h1 className="text-5xl sm:text-6xl font-black mb-3 crimson-text tracking-tight">
            {t("app.name")}
          </h1>

          {/* Edition badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={{
              background:
                "linear-gradient(135deg,rgba(192,57,43,0.12),rgba(231,76,60,0.08))",
              border: "1.5px solid rgba(192,57,43,0.35)",
            }}
          >
            <span className="text-sm">🏥</span>
            <span
              className="text-sm font-black tracking-widest"
              style={{ color: "#c0392b", letterSpacing: "0.12em" }}
            >
              {t("app.edition")}
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "rgba(192,57,43,0.4)" }}
            />
            <span className="text-xs font-medium" style={{ color: "#888" }}>
              {t("app.editionFor")}
            </span>
          </motion.div>

          <div
            className="text-2xl sm:text-3xl font-bold mb-1"
            style={{ color: "#1a1a1a" }}
          >
            {t("app.tagline")}
          </div>
          <div className="text-base mb-6 font-medium" style={{ color: "#888" }}>
            「{t("app.subtitle")}」
          </div>

          {/* Stats badges */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: "rgba(39,174,96,0.1)",
                border: "1px solid rgba(39,174,96,0.25)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse inline-block"
                style={{ background: "#27ae60" }}
              />
              <span className="text-sm" style={{ color: "#27ae60" }}>
                {t("stats.today")}: <strong>{todayCount}</strong>
              </span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: "rgba(192,57,43,0.08)",
                border: "1px solid rgba(192,57,43,0.2)",
              }}
            >
              <span className="text-sm" style={{ color: "#c0392b" }}>
                👥 {t("stats.total")}: <strong>{totalCount}</strong>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl w-full mb-12"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="glass-card p-4 flex items-start gap-3"
            >
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <span
                className="text-sm leading-snug"
                style={{ color: "#374151" }}
              >
                {t(f.key)}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-sm"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            className="w-full py-5 rounded-2xl font-black text-xl crimson-glow"
            style={{
              background: "linear-gradient(135deg,#c0392b,#e74c3c)",
              border: "none",
              cursor: "pointer",
              color: "white",
            }}
          >
            🚀 {t("app.start")}
          </motion.button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-5 max-w-lg text-center"
        >
          <p className="text-xs leading-relaxed" style={{ color: "#9ca3af" }}>
            {t("app.disclaimer")}
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <footer
        className="py-4 px-4 text-center"
        style={{ borderTop: "1px solid rgba(192,57,43,0.1)" }}
      >
        <div
          className="flex items-center justify-center gap-4 text-xs"
          style={{ color: "#b4b4b4" }}
        >
          <span>CrimsonWise © 2026</span>
          <span>•</span>
          <span>{t("app.edition")} v1.0</span>
        </div>
      </footer>
    </div>
  );
}
