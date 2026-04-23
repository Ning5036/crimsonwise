import { useTranslation } from 'react-i18next'
import { usePatientStore } from '../../store/patientStore'
import { useNavigate } from 'react-router-dom'

interface Props {
  canNext?: boolean
  onNext?: () => void
  isLastStep?: boolean
}

export default function StepNav({ canNext = true, onNext, isLastStep = false }: Props) {
  const { t } = useTranslation()
  const { currentStep, setStep } = usePatientStore()
  const navigate = useNavigate()

  const handleNext = () => {
    if (onNext) { onNext(); return }
    if (isLastStep) {
      navigate('/result')
    } else {
      setStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep === 1) navigate('/')
    else setStep(currentStep - 1)
  }

  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={handleBack}
        className="flex-1 py-3 rounded-xl font-medium transition-all"
        style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', color: '#666', cursor: 'pointer' }}
      >
        ← {t('app.back')}
      </button>
      <button
        onClick={handleNext}
        disabled={!canNext}
        className="flex-2 py-3 px-8 rounded-xl font-bold transition-all"
        style={{
          background: canNext ? 'linear-gradient(135deg,#c0392b,#e74c3c)' : 'rgba(0,0,0,0.06)',
          color: canNext ? 'white' : '#666',
          cursor: canNext ? 'pointer' : 'not-allowed',
          boxShadow: canNext ? '0 4px 20px rgba(192,57,43,0.4)' : 'none',
          border: 'none',
          flex: 2,
        }}
      >
        {isLastStep ? '🚀 ' + t('app.submit') : t('app.next') + ' →'}
      </button>
    </div>
  )
}
