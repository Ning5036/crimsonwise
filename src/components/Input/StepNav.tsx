import { useTranslation } from "react-i18next";
import { usePatientStore } from "../../store/patientStore";
import { useNavigate } from "react-router-dom";

interface Props {
  canNext?: boolean;
  onNext?: () => void;
  isLastStep?: boolean;
}

export default function StepNav({
  canNext = true,
  onNext,
  isLastStep = false,
}: Props) {
  const { t } = useTranslation();
  const { currentStep, setStep } = usePatientStore();
  const navigate = useNavigate();

  const handleNext = () => {
    if (onNext) {
      onNext();
      return;
    }
    if (isLastStep) {
      navigate("/result");
    } else {
      setStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) navigate("/");
    else setStep(currentStep - 1);
  };

  return (
    <div className="flex gap-3 mt-6">
      <button onClick={handleBack} className="btn btn-secondary flex-1">
        <span aria-hidden>←</span> {t("app.back")}
      </button>
      <button
        onClick={handleNext}
        disabled={!canNext}
        className="btn btn-primary"
        style={{ flex: 2 }}
      >
        {isLastStep ? (
          <>🚀 {t("app.submit")}</>
        ) : (
          <>
            {t("app.next")} <span aria-hidden>→</span>
          </>
        )}
      </button>
    </div>
  );
}
