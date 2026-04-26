import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { usePatientStore } from "../../store/patientStore";
import { saveSession } from "../../store/statsStore";
import { assessRisk } from "../../utils/riskAssessment";

export default function Tab8_Survey() {
  const { t, i18n } = useTranslation();
  const { patient, decision, survey, updateSurvey } = usePatientStore();
  const [submitted, setSubmitted] = useState(survey.submittedAt !== null);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = () => {
    if (!survey.satisfaction) return;
    const timestamp = new Date().toISOString();
    updateSurvey({ submittedAt: timestamp });

    // Save/update session with survey data
    const risk = assessRisk(patient);
    saveSession({
      id: `survey_${Date.now()}`,
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
      decision: decision.decision ?? "",
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
    setSubmitted(true);
  };

  const starLabels = t("tab8.stars", { returnObjects: true }) as string[];
  const betterOptions: { key: string; labelKey: string }[] = [
    { key: "yes", labelKey: "tab8.betterYes" },
    { key: "partial", labelKey: "tab8.betterPartial" },
    { key: "no", labelKey: "tab8.betterNo" },
  ];

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="thank"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-6xl"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-bold text-white">
              {t("tab8.thankYou")}
            </h2>
            <p className="text-gray-400">{t("tab8.thankYouSub")}</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                {t("tab8.title")}
              </h2>
              <p className="text-sm text-gray-400 mt-1">{t("tab8.subtitle")}</p>
            </div>

            {/* Stars */}
            <div className="glass-card p-5">
              <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                {t("tab8.satisfactionLabel")}
              </label>
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateSurvey({ satisfaction: s })}
                    onMouseEnter={() => setHoveredStar(s)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="text-4xl transition-transform hover:scale-125 focus:outline-none"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      filter:
                        s <= (hoveredStar || survey.satisfaction || 0)
                          ? "none"
                          : "grayscale(1) opacity(0.3)",
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              {survey.satisfaction && (
                <p
                  className="text-center text-sm font-medium"
                  style={{ color: "#f39c12" }}
                >
                  {starLabels[survey.satisfaction - 1]}
                </p>
              )}
            </div>

            {/* Better understanding */}
            <div className="glass-card p-4">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t("tab8.betterLabel")}
              </label>
              <div className="space-y-2">
                {betterOptions.map((opt) => (
                  <div
                    key={opt.key}
                    onClick={() =>
                      updateSurvey({
                        betterUnderstanding: opt.key as
                          | "yes"
                          | "no"
                          | "partial",
                      })
                    }
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                    style={{
                      background:
                        survey.betterUnderstanding === opt.key
                          ? "rgba(192,57,43,0.15)"
                          : "rgba(0,0,0,0.025)",
                      border:
                        survey.betterUnderstanding === opt.key
                          ? "1px solid rgba(192,57,43,0.5)"
                          : "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          survey.betterUnderstanding === opt.key
                            ? "#c0392b"
                            : "rgba(0,0,0,0.06)",
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                    >
                      {survey.betterUnderstanding === opt.key && (
                        <span className="text-white text-xs">●</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-200">
                      {t(opt.labelKey)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <label className="field-label">
                {t("tab8.suggestionsLabel")} {t("app.optional")}
              </label>
              <textarea
                className="input-field"
                rows={3}
                value={survey.suggestions}
                onChange={(e) => updateSurvey({ suggestions: e.target.value })}
                placeholder={t("tab8.suggestionsPlaceholder")}
                style={{ resize: "none", fontSize: "0.9rem" }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              disabled={!survey.satisfaction}
              className="btn btn-primary btn-lg w-full"
            >
              ⭐ {t("tab8.submitSurvey")}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
