import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import { GUIDELINES, HB_THRESHOLD_DATA } from '../../data/guidelines'

export default function Tab4_Guidelines() {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
        <h3 className="font-bold mb-1" style={{ color: '#1a1a1a' }}>{t('tab4.chart.title')}</h3>
        <p className="text-xs mb-3" style={{ color: '#888' }}>{t('tab4.subtitle')}</p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={HB_THRESHOLD_DATA} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.07)" />
              <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 10 }} interval={0} />
              <YAxis tick={{ fill: '#888', fontSize: 11 }} domain={[0, 12]} label={{ value: 'g/dL', angle: -90, position: 'insideLeft', fill: '#999', fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v} g/dL`, t('tab4.chart.threshold')]} contentStyle={{ background: 'white', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 8, color: '#1a1a1a', fontSize: 12 }} />
              <ReferenceLine y={7} stroke="#f39c12" strokeDasharray="4 4" />
              <Bar dataKey="threshold" radius={[6, 6, 0, 0]}>
                {HB_THRESHOLD_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Reference cards */}
      <div>
        <h3 className="font-bold mb-3" style={{ color: '#1a1a1a' }}>📖 {t('tab4.references')}</h3>
        <div className="space-y-3">
          {GUIDELINES.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="glass-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(192,57,43,0.1)', color: '#c0392b' }}>{g.region}</span>
                    <span className="text-xs" style={{ color: '#9ca3af' }}>{g.year}</span>
                    {g.hbThreshold && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(243,156,18,0.12)', color: '#d97706' }}>Hb ≥ {g.hbThreshold} g/dL</span>}
                  </div>
                  <div className="text-sm font-medium leading-snug" style={{ color: '#1a1a1a' }}>{g.title}</div>
                  <div className="text-xs mt-1" style={{ color: '#9ca3af' }}>{g.authors} · {g.journal}</div>
                </div>
                {(g.doi || g.url) && (
                  <a href={g.url ?? (g.doi ? `https://doi.org/${g.doi}` : '#')} target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg transition-all" onClick={e => e.stopPropagation()}
                    style={{ background: 'rgba(52,152,219,0.08)', border: '1px solid rgba(52,152,219,0.2)', color: '#2980b9' }}>
                    🔗 {t('tab4.viewSource')}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
