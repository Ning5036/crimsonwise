import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

interface Props {
  currentStep: number
  totalSteps?: number
}

const STEP_ICONS = ['👤', '🏥', '💊', '🔬', '😮‍💨', '🏥']

export default function ProgressStepper({ currentStep, totalSteps = 6 }: Props) {
  const { t } = useTranslation()

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{t('steps.progress', { step: currentStep })}</span>
        <span className="text-sm font-semibold" style={{ color: '#e74c3c' }}>
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-2 rounded-full mb-4" style={{ background: 'rgba(192,57,43,0.1)' }}>
        <motion.div
          className="h-2 rounded-full"
          style={{ background: 'linear-gradient(135deg,#c0392b,#e74c3c)' }}
          initial={false}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      {/* Step dots */}
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const done = step < currentStep
          const active = step === currentStep
          return (
            <div key={step} className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                style={{
                  background: done
                    ? '#27ae60'
                    : active
                    ? 'linear-gradient(135deg,#c0392b,#e74c3c)'
                    : 'rgba(0,0,0,0.05)',
                  border: active ? '2px solid #e74c3c' : '1px solid rgba(0,0,0,0.1)',
                  boxShadow: active ? '0 0 12px rgba(231,76,60,0.4)' : 'none',
                }}
              >
                {done ? '✓' : STEP_ICONS[i]}
              </div>
              <span className="text-xs text-center hidden sm:block" style={{ color: active ? '#e74c3c' : '#666', maxWidth: 60 }}>
                {t(`steps.${step}`)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
