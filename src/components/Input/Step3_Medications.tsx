import { useTranslation } from 'react-i18next'
import { usePatientStore } from '../../store/patientStore'
import { MEDICATION_OPTIONS } from '../../data/medications'
import CheckboxGroup from './CheckboxGroup'
import StepNav from './StepNav'

export default function Step3_Medications() {
  const { t } = useTranslation()
  const { patient, updatePatient } = usePatientStore()

  return (
    <div className="glass-card space-y-4" style={{ padding: '1.75rem 1.5rem' }}>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl" aria-hidden>💊</span>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--gray-800)' }}>{t('medication.title')}</h2>
          <p className="text-xs" style={{ color: 'var(--gray-400)' }}>{t('medication.subtitle')}</p>
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
