import { useTranslation } from 'react-i18next'
import { usePatientStore } from '../../store/patientStore'
import { CLINICAL_SCENARIO_OPTIONS } from '../../data/clinicalScenarios'
import CheckboxGroup from './CheckboxGroup'
import StepNav from './StepNav'

export default function Step6_Clinical() {
  const { t } = useTranslation()
  const { patient, updatePatient } = usePatientStore()

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🏥</span>
        <div>
          <h2 className="text-xl font-bold text-white">{t('scenario.title')}</h2>
          <p className="text-sm text-gray-400">{t('scenario.subtitle')}</p>
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
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('scenario.other')} {t('app.optional')}
        </label>
        <textarea
          rows={2}
          value={patient.clinicalOther}
          onChange={e => updatePatient({ clinicalOther: e.target.value })}
          placeholder={t('scenario.otherPlaceholder')}
          className="w-full px-3 py-2 rounded-xl text-white text-sm resize-none"
          style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(192,57,43,0.3)', outline: 'none' }}
        />
      </div>

      <StepNav isLastStep />
    </div>
  )
}
