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
    <div className="min-h-screen flex flex-col bg-app bg-grid">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-center mb-12 w-full max-w-xl"
        >
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="text-7xl mb-5"
          >
            🩸
          </motion.div>

          <h1 className="text-5xl sm:text-6xl font-black mb-4 crimson-text tracking-tight leading-none">
            {t("app.name")}
          </h1>

          {/* Edition badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4 tag tag-neutral"
            style={{
              paddingTop: 6,
              paddingBottom: 6,
              paddingLeft: 12,
              paddingRight: 12,
            }}
          >
            <span style={{ color: "var(--crimson-500)" }}>🏥</span>
            <span
              style={{
                color: "var(--crimson-600)",
                letterSpacing: "0.10em",
                fontWeight: 700,
              }}
            >
              {t("app.edition")}
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "var(--gray-300)" }}
            />
            <span style={{ color: "var(--gray-500)", fontWeight: 500 }}>
              {t("app.editionFor")}
            </span>
          </motion.div>

          <h2
            className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight"
            style={{ color: "var(--gray-800)" }}
          >
            {t("app.tagline")}
          </h2>
          <p className="text-base mb-7" style={{ color: "var(--gray-500)" }}>
            「{t("app.subtitle")}」
          </p>

          {/* Stats badges */}
          <div className="flex items-center justify-center gap-2.5 mb-2 flex-wrap">
            <span className="tag tag-ok">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                style={{ background: "var(--status-ok-fg)" }}
              />
              {t("stats.today")}:{" "}
              <strong className="ml-0.5">{todayCount}</strong>
            </span>
            <span className="tag tag-urgent">
              👥 {t("stats.total")}:{" "}
              <strong className="ml-0.5">{totalCount}</strong>
            </span>
          </div>
        </motion.section>

        {/* Features grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl w-full mb-12"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="glass-card glass-card-hover p-4 flex items-start gap-3"
            >
              <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden>
                {f.icon}
              </span>
              <span
                className="text-sm leading-snug"
                style={{ color: "var(--gray-700)" }}
              >
                {t(f.key)}
              </span>
            </motion.div>
          ))}
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-sm"
        >
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="btn btn-primary btn-lg w-full"
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              padding: "1.1rem 1.5rem",
            }}
          >
            {t("app.start")}
            <span aria-hidden>→</span>
          </motion.button>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 max-w-lg text-center text-xs leading-relaxed"
          style={{ color: "var(--gray-400)" }}
        >
          {t("app.disclaimer")}
        </motion.p>
      </main>

      {/* Footer */}
      <footer
        className="py-5 px-4 text-center"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center justify-center gap-3 text-xs"
          style={{ color: "var(--gray-400)" }}
        >
          <span>CrimsonWise © 2026</span>
          <span aria-hidden>·</span>
          <span>{t("app.edition")} v1.0</span>
        </div>
      </footer>
    </div>
  );
}
