import { useTranslation } from "react-i18next";
import { usePatientStore } from "../../store/patientStore";
import { useNavigate } from "react-router-dom";

export default function Step1_BasicInfo() {
  const { t } = useTranslation();
  const { patient, updatePatient, setStep } = usePatientStore();
  const navigate = useNavigate();

  const canNext =
    patient.age !== null &&
    patient.sex !== null &&
    patient.weightKg !== null &&
    patient.heightCm !== null;

  const handleNext = () => {
    if (canNext) setStep(2);
  };

  return (
    <div className="glass-card space-y-6" style={{ padding: "1.75rem 1.5rem" }}>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl" aria-hidden>
          👤
        </span>
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--gray-800)" }}
          >
            {t("steps.1")}
          </h2>
          <p className="text-xs" style={{ color: "var(--gray-400)" }}>
            {t("app.required")} *
          </p>
        </div>
      </div>

      {/* Age */}
      <div>
        <label className="field-label">{t("basic.age")} *</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={120}
            value={patient.age ?? ""}
            onChange={(e) =>
              updatePatient({
                age: e.target.value ? Number(e.target.value) : null,
              })
            }
            placeholder={t("basic.agePlaceholder")}
            className="input-field text-center font-semibold"
            style={{ width: 140 }}
          />
          <span className="text-sm" style={{ color: "var(--gray-500)" }}>
            {t("basic.ageUnit")}
          </span>
        </div>
      </div>

      {/* Sex */}
      <div>
        <label className="field-label">{t("basic.sex")} *</label>
        <div className="flex gap-3">
          {(["male", "female"] as const).map((s) => {
            const selected = patient.sex === s;
            return (
              <button
                key={s}
                onClick={() => updatePatient({ sex: s })}
                className="flex-1"
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--r-md)",
                  background: selected
                    ? "var(--crimson-500)"
                    : "var(--surface)",
                  border: selected
                    ? "1px solid var(--crimson-500)"
                    : "1px solid var(--border-strong)",
                  color: selected ? "#fff" : "var(--gray-700)",
                  fontWeight: selected ? 700 : 500,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition:
                    "background 0.18s var(--easing), border-color 0.18s var(--easing), color 0.18s var(--easing)",
                  boxShadow: selected ? "var(--shadow-crimson)" : "none",
                }}
              >
                {s === "male" ? "♂ " : "♀ "}
                {t(`basic.${s}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Weight & Height */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">{t("basic.weight")} *</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={20}
              max={300}
              value={patient.weightKg ?? ""}
              onChange={(e) =>
                updatePatient({
                  weightKg: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder={t("basic.weightPlaceholder")}
              className="input-field text-center font-semibold"
              style={{ width: 100 }}
            />
            <span className="text-sm" style={{ color: "var(--gray-500)" }}>
              {t("basic.weightUnit")}
            </span>
          </div>
        </div>
        <div>
          <label className="field-label">{t("basic.height")} *</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={50}
              max={250}
              value={patient.heightCm ?? ""}
              onChange={(e) =>
                updatePatient({
                  heightCm: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder={t("basic.heightPlaceholder")}
              className="input-field text-center font-semibold"
              style={{ width: 100 }}
            />
            <span className="text-sm" style={{ color: "var(--gray-500)" }}>
              {t("basic.heightUnit")}
            </span>
          </div>
        </div>
      </div>

      {/* Vegetarian */}
      <div
        onClick={() => updatePatient({ isVegetarian: !patient.isVegetarian })}
        className="flex items-center gap-3 cursor-pointer"
        style={{
          padding: "0.875rem 1rem",
          borderRadius: "var(--r-md)",
          background: patient.isVegetarian
            ? "var(--status-ok-bg)"
            : "var(--gray-25)",
          border: patient.isVegetarian
            ? "1px solid var(--status-ok-fg)"
            : "1px solid var(--border)",
          transition:
            "background 0.18s var(--easing), border-color 0.18s var(--easing)",
        }}
      >
        <div
          className="rounded flex items-center justify-center flex-shrink-0"
          style={{
            width: 22,
            height: 22,
            background: patient.isVegetarian
              ? "var(--status-ok-fg)"
              : "var(--surface)",
            border: patient.isVegetarian
              ? "1px solid var(--status-ok-fg)"
              : "1px solid var(--border-strong)",
            transition: "background 0.18s var(--easing)",
          }}
        >
          {patient.isVegetarian && (
            <span style={{ color: "#fff", fontSize: 13, lineHeight: 1 }}>
              ✓
            </span>
          )}
        </div>
        <div className="flex-1">
          <div
            className="font-medium text-sm"
            style={{ color: "var(--gray-800)" }}
          >
            🌿 {t("basic.vegetarian")}
          </div>
          <div className="field-helper" style={{ marginTop: 2 }}>
            {t("basic.vegetarianNote")}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleNext}
          disabled={!canNext}
          className="btn btn-primary btn-lg w-full"
        >
          {t("app.next")} <span aria-hidden>→</span>
        </button>
        <button
          onClick={() => navigate("/")}
          className="btn btn-ghost w-full"
          style={{ fontSize: "0.85rem" }}
        >
          <span aria-hidden>←</span> {t("app.back")}
        </button>
      </div>
    </div>
  );
}
