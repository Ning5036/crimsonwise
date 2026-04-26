import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { usePatientStore } from "../store/patientStore";
import ResultTabs from "../components/Results/ResultTabs";
import Tab1_Consultation from "../components/Results/Tab1_Consultation";
import Tab2_Alternatives from "../components/Results/Tab2_Alternatives";
import Tab3_Myths from "../components/Results/Tab3_Myths";
import Tab4_Guidelines from "../components/Results/Tab4_Guidelines";
import Tab5_BloodValue from "../components/Results/Tab5_BloodValue";
import Tab6_Decision from "../components/Results/Tab6_Decision";
import Tab7_Recommendation from "../components/Results/Tab7_Recommendation";
import Tab8_Survey from "../components/Results/Tab8_Survey";

const TAB_COMPONENTS = [
  Tab1_Consultation,
  Tab2_Alternatives,
  Tab3_Myths,
  Tab4_Guidelines,
  Tab5_BloodValue,
  Tab6_Decision,
  Tab7_Recommendation,
  Tab8_Survey,
];

export default function ResultPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { patient, reset } = usePatientStore();
  const [activeTab, setActiveTab] = useState(1);

  // Guard: if no data, redirect
  if (!patient.hb) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center px-4">
        <div
          className="glass-card text-center"
          style={{ padding: "2rem 1.75rem", maxWidth: 360 }}
        >
          <div className="text-4xl mb-3" aria-hidden>
            ⚠️
          </div>
          <p className="mb-5" style={{ color: "var(--gray-600)" }}>
            請先完成資料輸入
          </p>
          <button onClick={() => navigate("/form")} className="btn btn-primary">
            開始評估 <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    );
  }

  const TabComponent = TAB_COMPONENTS[activeTab - 1];

  return (
    <div className="min-h-screen bg-app">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Tab nav */}
        <div className="mb-5">
          <ResultTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <TabComponent onDecisionMade={() => setActiveTab(7)} />
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons between tabs */}
        <div className="flex gap-3 mt-6">
          {activeTab > 1 && (
            <button
              onClick={() => setActiveTab((prev) => Math.max(1, prev - 1))}
              className="btn btn-secondary flex-1"
            >
              <span aria-hidden>←</span> {t("app.prevPage")}
            </button>
          )}
          {activeTab < 8 && (
            <button
              onClick={() => setActiveTab((prev) => Math.min(8, prev + 1))}
              className="btn btn-primary flex-1"
            >
              {t("app.nextPage")} <span aria-hidden>→</span>
            </button>
          )}
        </div>

        {/* Restart */}
        <div className="text-center mt-5">
          <button
            onClick={() => {
              reset();
              navigate("/");
            }}
            className="btn btn-ghost"
            style={{ fontSize: "0.75rem", padding: "0.5rem 0.875rem" }}
          >
            🔄 {t("app.restart")}
          </button>
        </div>
      </div>
    </div>
  );
}
