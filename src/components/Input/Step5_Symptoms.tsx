import { useTranslation } from 'react-i18next'
import { usePatientStore } from '../../store/patientStore'
import { SYMPTOM_OPTIONS } from '../../data/symptoms'
import CheckboxGroup from './CheckboxGroup'
import StepNav from './StepNav'

export default function Step5_Symptoms() {
  const { t } = useTranslation()
  const { patient, updatePatient } = usePatientStore()

  return (
    <div className="glass-card space-y-4" style={{ padding: '1.75rem 1.5rem' }}>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl" aria-hidden>😮‍💨</span>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--gray-800)' }}>{t('symptom.title')}</h2>
          <p className="text-xs" style={{ color: 'var(--gray-400)' }}>{t('symptom.subtitle')}</p>
        </div>
      </div>

      <CheckboxGroup
        options={[
          { id: 'none', labelKey: 'symptom.none', icon: '✅' },
          ...SYMPTOM_OPTIONS,
        ]}
        selected={patient.symptoms}
        onChange={v => updatePatient({ symptoms: v })}
        noneId="none"
      />

      {/* Other symptoms free text */}
      <div>
        <label className="field-label">
          {t('symptom.other')} {t('app.optional')}
        </label>
        <textarea
          className="input-field"
          rows={2}
          value={patient.symptomsOther}
          onChange={e => updatePatient({ symptomsOther: e.target.value })}
          placeholder={t('symptom.otherPlaceholder')}
          style={{ resize: "none", fontSize: "0.9rem" }}
        />
      </div>

      <StepNav />
    </div>
  )
}
