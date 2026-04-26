import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { pltPredictionCurve, predictPostTransfusionPlt, type PlateletType } from '../../utils/labPredictor'
import { usePatientStore } from '../../store/patientStore'

export default function PltPredictorWidget() {
  const { t } = useTranslation()
  const { patient, decision, updateDecision } = usePatientStore()

  const prePlt = patient.plt ?? 80
  const weightKg = patient.weightKg ?? 60
  const heightCm = patient.heightCm ?? 160

  const [plateletType, setPlateletType] = useState<PlateletType>(decision.pltType)
  const [units, setUnits] = useState(decision.pltUnitsChosen)

  const maxUnits = plateletType === 'SDP' ? 4 : 12
  const curve = pltPredictionCurve(prePlt, maxUnits, plateletType, weightKg, heightCm)
  const result = predictPostTransfusionPlt({ prePlt, units, plateletType, weightKg, heightCm })

  const color = result.predictedPlt < 50 ? 'var(--crimson-500)' : result.predictedPlt < 150 ? 'var(--status-warn-fg)' : 'var(--status-ok-fg)'

  const handleTypeChange = (type: PlateletType) => {
    setPlateletType(type)
    updateDecision({ pltType: type, pltUnitsChosen: 1 })
    setUnits(1)
  }

  const handleUnitsChange = (n: number) => {
    setUnits(n)
    updateDecision({ pltUnitsChosen: n, predictedPlt: predictPostTransfusionPlt({ prePlt, units: n, plateletType, weightKg, heightCm }).predictedPlt })
  }

  return (
    <div className="space-y-4">
      {/* Type toggle */}
      <div>
        <div className="text-sm mb-2" style={{ color: '#555' }}>血小板種類</div>
        <div className="flex gap-2">
          {(['SDP', 'RDP'] as PlateletType[]).map(type => (
            <button key={type} onClick={() => handleTypeChange(type)}
              className="flex-1 py-2 rounded-xl font-medium text-sm transition-all"
              style={{
                background: plateletType === type ? 'linear-gradient(135deg,#2980b9,#3498db)' : 'rgba(0,0,0,0.05)',
                color: plateletType === type ? 'white' : '#555',
                border: plateletType === type ? 'none' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer',
              }}
            >
              {type === 'SDP' ? t('tab6.predictor.sdp') : t('tab6.predictor.rdp')}
            </button>
          ))}
        </div>
      </div>

      {/* Units selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm" style={{ color: '#555' }}>{t('tab6.predictor.units')}</span>
          <span className="text-2xl font-bold" style={{ color: '#2980b9' }}>{units} 袋</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: maxUnits }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => handleUnitsChange(n)}
              className="w-9 h-9 rounded-lg font-bold text-sm transition-all"
              style={{
                background: units === n ? 'linear-gradient(135deg,#2980b9,#3498db)' : 'rgba(0,0,0,0.05)',
                color: units === n ? 'white' : 'var(--gray-500)',
                border: units === n ? 'none' : '1px solid rgba(0,0,0,0.08)', cursor: 'pointer',
              }}>{n}</button>
          ))}
        </div>
      </div>

      {/* PL → PH result display */}
      <div className="flex items-center gap-3">
        <div className="flex-1 p-4 rounded-2xl text-center" style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)' }}>
          <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--gray-400)' }}>PL（輸前）</div>
          <div className="text-3xl font-black" style={{ color: 'var(--gray-800)' }}>{prePlt}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--gray-400)' }}>×10³/μL</div>
        </div>
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="text-xl font-bold" style={{ color: '#2980b9' }}>→</div>
          <div className="text-xs font-medium" style={{ color: '#2980b9' }}>+{result.deltaPlt}</div>
        </div>
        <div className="flex-1 p-4 rounded-2xl text-center" style={{ background: `rgba(${color === 'var(--status-ok-fg)' ? '39,174,96' : color === 'var(--status-warn-fg)' ? '243,156,18' : '231,76,60'},0.1)`, border: `1.5px solid ${color}40` }}>
          <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--gray-400)' }}>PH（預測輸後）</div>
          <div className="text-3xl font-black" style={{ color }}>{result.predictedPlt}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--gray-400)' }}>×10³/μL</div>
        </div>
      </div>

      <div className="text-xs text-center" style={{ color: 'var(--gray-400)' }}>
        預測範圍：{result.confidenceLow} – {result.confidenceHigh} ×10³/μL
      </div>

      {/* Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curve}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.07)" />
            <XAxis dataKey="units" tick={{ fill: 'var(--gray-400)', fontSize: 11 }} label={{ value: '袋數', position: 'insideBottom', offset: -2, fill: 'var(--gray-400)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'var(--gray-400)', fontSize: 11 }} domain={[Math.max(0, prePlt - 20), 'auto']} />
            <Tooltip formatter={(v) => [`${v} ×10³/μL`, 'PLT']} contentStyle={{ background: 'white', border: '1px solid rgba(41,128,185,0.3)', borderRadius: 8, color: 'var(--gray-800)' }} />
            <ReferenceLine y={50} stroke="#f39c12" strokeDasharray="4 4" label={{ value: '50', fill: 'var(--status-warn-fg)', fontSize: 10 }} />
            <ReferenceLine y={150} stroke="#27ae60" strokeDasharray="4 4" label={{ value: '150', fill: 'var(--status-ok-fg)', fontSize: 10 }} />
            <ReferenceLine x={units} stroke="#2980b9" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="plt" stroke="#2980b9" strokeWidth={2.5} dot={{ fill: '#2980b9', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-center px-2" style={{ color: 'var(--gray-400)' }}>⚠️ {t('tab6.predictor.disclaimer')}</p>
    </div>
  )
}
