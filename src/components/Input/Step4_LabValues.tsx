import { useTranslation } from "react-i18next";
import { usePatientStore } from "../../store/patientStore";
import StepNav from "./StepNav";

interface LabFieldProps {
  label: string;
  unit: string;
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  warningBelow?: number;
  warningAbove?: number;
}

function LabField({
  label,
  unit,
  value,
  onChange,
  placeholder,
  required,
  min,
  max,
  step = 0.1,
  warningBelow,
  warningAbove,
}: LabFieldProps) {
  const isWarning =
    value !== null &&
    ((warningBelow !== undefined && value < warningBelow) ||
      (warningAbove !== undefined && value > warningAbove));

  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "0.75rem 0.875rem",
        borderRadius: "var(--r-md)",
        background: isWarning ? "var(--status-warn-bg)" : "var(--gray-25)",
        border: isWarning
          ? "1px solid var(--status-warn-fg)"
          : "1px solid var(--border)",
        transition:
          "background 0.18s var(--easing), border-color 0.18s var(--easing)",
      }}
    >
      <div>
        <div
          className="text-sm font-medium"
          style={{ color: "var(--gray-800)" }}
        >
          {label}{" "}
          {required && <span style={{ color: "var(--crimson-500)" }}>*</span>}
        </div>
        <div className="text-xs" style={{ color: "var(--gray-500)" }}>
          {unit}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value ? Number(e.target.value) : null)
          }
          placeholder={placeholder ?? "--"}
          className="input-field text-right font-semibold"
          style={{ width: 110, fontSize: "0.95rem" }}
        />
        {isWarning && (
          <span
            aria-label="warning"
            style={{ color: "var(--status-warn-fg)", fontSize: 16 }}
          >
            ⚠️
          </span>
        )}
      </div>
    </div>
  );
}

export default function Step4_LabValues() {
  const { t } = useTranslation();
  const { patient, updatePatient } = usePatientStore();

  const canNext = patient.hb !== null;

  return (
    <div className="glass-card space-y-3" style={{ padding: "1.75rem 1.5rem" }}>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl" aria-hidden>
          🔬
        </span>
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--gray-800)" }}
          >
            {t("lab.title")}
          </h2>
          <p className="text-xs" style={{ color: "var(--gray-400)" }}>
            {t("app.optional")} 除Hb外皆為選填
          </p>
        </div>
      </div>

      <LabField
        label={t("lab.hb")}
        unit={t("lab.hbUnit")}
        value={patient.hb}
        onChange={(v) => updatePatient({ hb: v })}
        required
        min={0}
        max={20}
        step={0.1}
        warningBelow={7}
        placeholder="例: 8.5"
      />

      <LabField
        label={t("lab.plt")}
        unit={t("lab.pltUnit")}
        value={patient.plt}
        onChange={(v) => updatePatient({ plt: v })}
        min={0}
        max={2000}
        step={1}
        warningBelow={50}
        placeholder="例: 150"
      />

      <LabField
        label={t("lab.ptInr")}
        unit={t("lab.ptInrUnit")}
        value={patient.ptInr}
        onChange={(v) => updatePatient({ ptInr: v })}
        min={0}
        max={20}
        step={0.1}
        warningAbove={1.5}
        placeholder="例: 1.1"
      />

      <LabField
        label={t("lab.apttInr")}
        unit={t("lab.apttInrUnit")}
        value={patient.apttInr}
        onChange={(v) => updatePatient({ apttInr: v })}
        min={0}
        max={20}
        step={0.1}
        warningAbove={1.5}
        placeholder="例: 1.0"
      />

      <LabField
        label={t("lab.albumin")}
        unit={t("lab.albuminUnit")}
        value={patient.albumin}
        onChange={(v) => updatePatient({ albumin: v })}
        min={0}
        max={6}
        step={0.1}
        warningBelow={3.0}
        placeholder="例: 3.5"
      />

      <LabField
        label={t("lab.gfr")}
        unit={t("lab.gfrUnit")}
        value={patient.gfr}
        onChange={(v) => updatePatient({ gfr: v })}
        min={0}
        max={200}
        step={1}
        warningBelow={15}
        placeholder="例: 60"
      />

      <StepNav canNext={canNext} />
    </div>
  );
}
