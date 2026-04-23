import { useTranslation } from 'react-i18next'
import { usePatientStore } from '../../store/patientStore'
import StepNav from './StepNav'

interface LabFieldProps {
  label: string
  unit: string
  value: number | null
  onChange: (v: number | null) => void
  placeholder?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  warningBelow?: number
  warningAbove?: number
}

function LabField({ label, unit, value, onChange, placeholder, required, min, max, step = 0.1, warningBelow, warningAbove }: LabFieldProps) {
  const isWarning = value !== null && ((warningBelow !== undefined && value < warningBelow) || (warningAbove !== undefined && value > warningAbove))

  return (
    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.025)', border: `1px solid ${isWarning ? 'rgba(243,156,18,0.5)' : 'rgba(0,0,0,0.05)'}` }}>
      <div>
        <div className="text-sm font-medium text-gray-200">
          {label} {required && <span className="text-red-400">*</span>}
        </div>
        <div className="text-xs text-gray-500">{unit}</div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min} max={max} step={step}
          value={value ?? ''}
          onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
          placeholder={placeholder ?? '--'}
          className="w-24 px-3 py-2 rounded-lg text-white text-right font-bold text-lg"
          style={{ background: 'rgba(0,0,0,0.06)', border: `1px solid ${isWarning ? 'rgba(243,156,18,0.6)' : 'rgba(192,57,43,0.4)'}`, outline: 'none' }}
        />
        {isWarning && <span className="text-yellow-400 text-lg">⚠️</span>}
      </div>
    </div>
  )
}

export default function Step4_LabValues() {
  const { t } = useTranslation()
  const { patient, updatePatient } = usePatientStore()

  const canNext = patient.hb !== null

  return (
    <div className="glass-card p-6 space-y-3">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🔬</span>
        <div>
          <h2 className="text-xl font-bold text-white">{t('lab.title')}</h2>
          <p className="text-sm text-gray-400">{t('app.optional')} 除Hb外皆為選填</p>
        </div>
      </div>

      <LabField label={t('lab.hb')} unit={t('lab.hbUnit')} value={patient.hb}
        onChange={v => updatePatient({ hb: v })} required min={0} max={20} step={0.1}
        warningBelow={7} placeholder="例: 8.5" />

      <LabField label={t('lab.plt')} unit={t('lab.pltUnit')} value={patient.plt}
        onChange={v => updatePatient({ plt: v })} min={0} max={2000} step={1}
        warningBelow={50} placeholder="例: 150" />

      <LabField label={t('lab.ptInr')} unit={t('lab.ptInrUnit')} value={patient.ptInr}
        onChange={v => updatePatient({ ptInr: v })} min={0} max={20} step={0.1}
        warningAbove={1.5} placeholder="例: 1.1" />

      <LabField label={t('lab.apttInr')} unit={t('lab.apttInrUnit')} value={patient.apttInr}
        onChange={v => updatePatient({ apttInr: v })} min={0} max={20} step={0.1}
        warningAbove={1.5} placeholder="例: 1.0" />

      <LabField label={t('lab.albumin')} unit={t('lab.albuminUnit')} value={patient.albumin}
        onChange={v => updatePatient({ albumin: v })} min={0} max={6} step={0.1}
        warningBelow={3.0} placeholder="例: 3.5" />

      <LabField label={t('lab.gfr')} unit={t('lab.gfrUnit')} value={patient.gfr}
        onChange={v => updatePatient({ gfr: v })} min={0} max={200} step={1}
        warningBelow={15} placeholder="例: 60" />

      <StepNav canNext={canNext} />
    </div>
  )
}
