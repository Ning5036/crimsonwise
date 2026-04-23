import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { hbPredictionCurve, predictPostTransfusionHb } from '../../utils/labPredictor'
import { usePatientStore } from '../../store/patientStore'

export default function HbPredictorWidget() {
  const { t } = useTranslation()
  const { patient, decision, updateDecision } = usePatientStore()

  const preHb = patient.hb ?? 7
  const weightKg = patient.weightKg ?? 60
  const sex = patient.sex ?? 'female'

  const [units, setUnits] = useState(decision.hbUnitsChosen)

  const curve = hbPredictionCurve(preHb, 8, weightKg, sex)
  const result = predictPostTransfusionHb({ preHb, units, weightKg, sex })

  const color = result.predictedHb < 7 ? '#e74c3c' : result.predictedHb < 10 ? '#f39c12' : '#27ae60'

  const handleUnitsChange = (n: number) => {
    setUnits(n)
    updateDecision({ hbUnitsChosen: n, predictedHb: predictPostTransfusionHb({ preHb, units: n, weightKg, sex }).predictedHb })
  }

  return (
    <div className="space-y-4">
      {/* Units selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm" style={{ color: '#555' }}>{t('tab6.predictor.units')}</span>
          <span className="text-2xl font-bold" style={{ color: '#c0392b' }}>{units} 袋</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[1,2,3,4,5,6,7,8].map(n => (
            <button key={n} onClick={() => handleUnitsChange(n)}
              className="w-10 h-10 rounded-lg font-bold text-sm transition-all"
              style={{
                background: units === n ? 'linear-gradient(135deg,#c0392b,#e74c3c)' : 'rgba(0,0,0,0.06)',
                color: units === n ? 'white' : '#666',
                border: units === n ? 'none' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer',
              }}>{n}</button>
          ))}
        </div>
      </div>

      {/* Result display */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <div className="text-xs mb-1" style={{ color: '#888' }}>輸前 Hb</div>
          <div className="text-xl font-bold" style={{ color: '#1a1a1a' }}>{preHb}</div>
          <div className="text-xs" style={{ color: '#9ca3af' }}>g/dL</div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <div className="text-xs mb-1" style={{ color: '#888' }}>{t('tab6.predictor.delta')}</div>
          <div className="text-xl font-bold" style={{ color: '#27ae60' }}>+{result.deltaHb}</div>
          <div className="text-xs" style={{ color: '#9ca3af' }}>g/dL</div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: `rgba(${color === '#27ae60' ? '39,174,96' : color === '#f39c12' ? '243,156,18' : '231,76,60'},0.1)`, border: `1px solid ${color}30` }}>
          <div className="text-xs mb-1" style={{ color: '#888' }}>{t('tab6.predictor.predicted')}</div>
          <div className="text-2xl font-bold" style={{ color }}>{result.predictedHb}</div>
          <div className="text-xs" style={{ color: '#9ca3af' }}>g/dL</div>
        </div>
      </div>

      <div className="text-xs text-center" style={{ color: '#9ca3af' }}>
        {t('tab6.predictor.confidence')}: {result.confidenceLow} – {result.confidenceHigh} g/dL
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curve}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.07)" />
            <XAxis dataKey="units" tick={{ fill: '#888', fontSize: 11 }} label={{ value: '袋數', position: 'insideBottom', offset: -2, fill: '#888', fontSize: 11 }} />
            <YAxis tick={{ fill: '#888', fontSize: 11 }} domain={[Math.max(0, preHb - 1), 'auto']} />
            <Tooltip formatter={(v) => [`${v} g/dL`, 'Hb']} contentStyle={{ background: 'white', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 8, color: '#1a1a1a' }} />
            <ReferenceLine y={7} stroke="#f39c12" strokeDasharray="4 4" label={{ value: '7', fill: '#f39c12', fontSize: 10 }} />
            <ReferenceLine y={10} stroke="#27ae60" strokeDasharray="4 4" label={{ value: '10', fill: '#27ae60', fontSize: 10 }} />
            <ReferenceLine x={units} stroke="#c0392b" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="hb" stroke="#c0392b" strokeWidth={2.5} dot={{ fill: '#c0392b', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-center px-2" style={{ color: '#9ca3af' }}>⚠️ {t('tab6.predictor.disclaimer')}</p>
    </div>
  )
}
