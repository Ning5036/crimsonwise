import { useTranslation } from 'react-i18next'
import { usePatientStore } from '../../store/patientStore'
import { CLINICAL_SCENARIO_OPTIONS } from '../../data/clinicalScenarios'
import CheckboxGroup from './CheckboxGroup'
import StepNav from './StepNav'

export default function Step6_Clinical() {
  const { t } = useTranslation()
  const { patient, updatePatient } = usePatientStore()

  return (
    <div className="glass-card space-y-4" style={{ padding: '1.75rem 1.5rem' }}>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl" aria-hidden>🏥</span>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--gray-800)' }}>{t('scenario.title')}</h2>
          <p className="text-xs" style={{ color: 'var(--gray-400)' }}>{t('scenario.subtitle')}</p>
        </div>
      </div>

      <CheckboxGroup
        options={[
          { id: 'none', labelKey: 'scenario.none', icon: '✅' },
          ...CLINICAL_SCENARIO_OPTIONS,
        ]}
        selected={patient.clinicalScenarios}
        onChange={v => updatePatient({ clinicalScenarios: v })}
        noneId="none"
      />

      {/* Other clinical context free text */}
      <div>
        <label className="field-label">
          {t('scenario.other')} {t('app.optional')}
        </label>
        <textarea
          className="input-field"
          rows={2}
          value={patient.clinicalOther}
          onChange={e => updatePatient({ clinicalOther: e.target.value })}
          placeholder={t('scenario.otherPlaceholder')}
          style={{ resize: "none", fontSize: "0.9rem" }}
        />
      </div>

      <StepNav isLastStep />
    </div>
  )
}
