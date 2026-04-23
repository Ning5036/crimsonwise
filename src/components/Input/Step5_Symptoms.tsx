import { useTranslation } from 'react-i18next'
import { usePatientStore } from '../../store/patientStore'
import { SYMPTOM_OPTIONS } from '../../data/symptoms'
import CheckboxGroup from './CheckboxGroup'
import StepNav from './StepNav'

export default function Step5_Symptoms() {
  const { t } = useTranslation()
  const { patient, updatePatient } = usePatientStore()

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">😮‍💨</span>
        <div>
          <h2 className="text-xl font-bold text-white">{t('symptom.title')}</h2>
          <p className="text-sm text-gray-400">{t('symptom.subtitle')}</p>
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
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('symptom.other')} {t('app.optional')}
        </label>
        <textarea
          rows={2}
          value={patient.symptomsOther}
          onChange={e => updatePatient({ symptomsOther: e.target.value })}
          placeholder={t('symptom.otherPlaceholder')}
          className="w-full px-3 py-2 rounded-xl text-white text-sm resize-none"
          style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(192,57,43,0.3)', outline: 'none' }}
        />
      </div>

      <StepNav />
    </div>
  )
}
