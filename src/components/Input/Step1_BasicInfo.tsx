import { useTranslation } from 'react-i18next'
import { usePatientStore } from '../../store/patientStore'
import { useNavigate } from 'react-router-dom'

export default function Step1_BasicInfo() {
  const { t } = useTranslation()
  const { patient, updatePatient, setStep } = usePatientStore()
  const navigate = useNavigate()

  const canNext = patient.age !== null && patient.sex !== null && patient.weightKg !== null && patient.heightCm !== null

  const handleNext = () => {
    if (canNext) setStep(2)
  }

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">👤</span>
        <div>
          <h2 className="text-xl font-bold text-white">{t('steps.1')}</h2>
          <p className="text-sm text-gray-400">{t('app.required')} *</p>
        </div>
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('basic.age')} *</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0} max={120}
            value={patient.age ?? ''}
            onChange={e => updatePatient({ age: e.target.value ? Number(e.target.value) : null })}
            placeholder={t('basic.agePlaceholder')}
            className="w-32 px-3 py-2 rounded-lg text-white text-center text-lg font-bold"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(192,57,43,0.4)', outline: 'none' }}
          />
          <span className="text-gray-400">{t('basic.ageUnit')}</span>
        </div>
      </div>

      {/* Sex */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('basic.sex')} *</label>
        <div className="flex gap-3">
          {(['male', 'female'] as const).map(s => (
            <button
              key={s}
              onClick={() => updatePatient({ sex: s })}
              className="flex-1 py-3 rounded-xl font-medium transition-all"
              style={{
                background: patient.sex === s ? 'linear-gradient(135deg,#c0392b,#e74c3c)' : 'rgba(0,0,0,0.04)',
                border: patient.sex === s ? '2px solid #e74c3c' : '1px solid rgba(0,0,0,0.06)',
                color: patient.sex === s ? 'white' : '#555',
                cursor: 'pointer',
              }}
            >
              {s === 'male' ? '♂ ' : '♀ '}{t(`basic.${s}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Weight & Height */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('basic.weight')} *</label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={20} max={300}
              value={patient.weightKg ?? ''}
              onChange={e => updatePatient({ weightKg: e.target.value ? Number(e.target.value) : null })}
              placeholder={t('basic.weightPlaceholder')}
              className="w-24 px-3 py-2 rounded-lg text-white text-center font-bold"
              style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(192,57,43,0.4)', outline: 'none' }}
            />
            <span className="text-gray-400">{t('basic.weightUnit')}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('basic.height')} *</label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={50} max={250}
              value={patient.heightCm ?? ''}
              onChange={e => updatePatient({ heightCm: e.target.value ? Number(e.target.value) : null })}
              placeholder={t('basic.heightPlaceholder')}
              className="w-24 px-3 py-2 rounded-lg text-white text-center font-bold"
              style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(192,57,43,0.4)', outline: 'none' }}
            />
            <span className="text-gray-400">{t('basic.heightUnit')}</span>
          </div>
        </div>
      </div>

      {/* Vegetarian */}
      <div
        onClick={() => updatePatient({ isVegetarian: !patient.isVegetarian })}
        className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
        style={{
          background: patient.isVegetarian ? 'rgba(39,174,96,0.15)' : 'rgba(0,0,0,0.03)',
          border: patient.isVegetarian ? '1px solid rgba(39,174,96,0.5)' : '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div
          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{ background: patient.isVegetarian ? '#27ae60' : 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.1)' }}
        >
          {patient.isVegetarian && <span className="text-white text-sm">✓</span>}
        </div>
        <div>
          <span className="text-white font-medium">🌿 {t('basic.vegetarian')}</span>
          <p className="text-xs text-gray-400">{t('basic.vegetarianNote')}</p>
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={!canNext}
        className="w-full py-4 rounded-xl font-bold text-lg transition-all"
        style={{
          background: canNext ? 'linear-gradient(135deg,#c0392b,#e74c3c)' : 'rgba(0,0,0,0.06)',
          color: canNext ? 'white' : '#666',
          cursor: canNext ? 'pointer' : 'not-allowed',
          boxShadow: canNext ? '0 4px 20px rgba(192,57,43,0.4)' : 'none',
          border: 'none',
        }}
      >
        {t('app.next')} →
      </button>
      <button onClick={() => navigate('/')} className="w-full py-2 text-gray-500 hover:text-gray-300 transition-colors text-sm" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        ← {t('app.back')}
      </button>
    </div>
  )
}
