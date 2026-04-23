import { useTranslation } from 'react-i18next'
import { usePatientStore } from '../../store/patientStore'
import { MEDICAL_HISTORY_OPTIONS } from '../../data/medicalHistory'
import CheckboxGroup from './CheckboxGroup'
import StepNav from './StepNav'

export default function Step2_MedHistory() {
  const { t } = useTranslation()
  const { patient, updatePatient } = usePatientStore()

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🏥</span>
        <div>
          <h2 className="text-xl font-bold text-white">{t('history.title')}</h2>
          <p className="text-sm text-gray-400">{t('history.subtitle')}</p>
        </div>
      </div>

      <CheckboxGroup
        options={[
          { id: 'none', labelKey: 'history.none', icon: '✅' },
          ...MEDICAL_HISTORY_OPTIONS,
        ]}
        selected={patient.medicalHistory}
        onChange={v => updatePatient({ medicalHistory: v })}
        noneId="none"
      />

      <StepNav />
    </div>
  )
}
