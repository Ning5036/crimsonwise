import { useTranslation } from "react-i18next";
import { usePatientStore } from "../../store/patientStore";
import { MEDICAL_HISTORY_OPTIONS } from "../../data/medicalHistory";
import CheckboxGroup from "./CheckboxGroup";
import StepNav from "./StepNav";

export default function Step2_MedHistory() {
  const { t } = useTranslation();
  const { patient, updatePatient } = usePatientStore();

  return (
    <div className="glass-card space-y-4" style={{ padding: "1.75rem 1.5rem" }}>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl" aria-hidden>
          🏥
        </span>
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--gray-800)" }}
          >
            {t("history.title")}
          </h2>
          <p className="text-xs" style={{ color: "var(--gray-400)" }}>
            {t("history.subtitle")}
          </p>
        </div>
      </div>

      <CheckboxGroup
        options={[
          { id: "none", labelKey: "history.none", icon: "✅" },
          ...MEDICAL_HISTORY_OPTIONS,
        ]}
        selected={patient.medicalHistory}
        onChange={(v) => updatePatient({ medicalHistory: v })}
        noneId="none"
      />

      <StepNav />
    </div>
  );
}
