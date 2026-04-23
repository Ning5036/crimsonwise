import { useTranslation } from 'react-i18next'
import { usePatientStore } from '../../store/patientStore'
import { MEDICATION_OPTIONS } from '../../data/medications'
import CheckboxGroup from './CheckboxGroup'
import StepNav from './StepNav'

export default function Step3_Medications() {
  const { t } = useTranslation()
  const { patient, updatePatient } = usePatientStore()

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">💊</span>
        <div>
          <h2 className="text-xl font-bold text-white">{t('medication.title')}</h2>
          <p className="text-sm text-gray-400">{t('medication.subtitle')}</p>
        </div>
      </div>

      <CheckboxGroup
        options={[
          { id: 'none', labelKey: 'medication.none', icon: '✅' },
          ...MEDICATION_OPTIONS,
        ]}
        selected={patient.medications}
        onChange={v => updatePatient({ medications: v })}
        noneId="none"
      />

      <StepNav />
    </div>
  )
}
