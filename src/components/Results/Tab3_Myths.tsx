import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MYTHS, TRANSFUSION_RISKS } from '../../data/myths'

const SEVERITY_COLORS = {
  low: { color: 'var(--status-ok-fg)', label: 'risk.severity.low' },
  medium: { color: 'var(--status-warn-fg)', label: 'risk.severity.medium' },
  high: { color: '#e67e22', label: 'risk.severity.high' },
  critical: { color: 'var(--crimson-500)', label: 'risk.severity.critical' },
}

export default function Tab3_Myths() {
  const { t } = useTranslation()
  const [flipped, setFlipped] = useState<Set<string>>(new Set())

  const toggleFlip = (id: string) => {
    setFlipped(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-5">
      {/* Myths flip cards */}
      <div>
        <h3 className="font-bold mb-2 text-lg" style={{ color: 'var(--gray-800)' }}>💡 {t('tab3.title')}</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--gray-400)' }}>👆 {t('tab3.clickToFlip')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MYTHS.map((myth, i) => {
            const isFlipped = flipped.has(myth.id)
            return (
              <motion.div key={myth.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} style={{ height: 180 }} onClick={() => toggleFlip(myth.id)}>
                  <div className="flip-card-inner relative" style={{ height: '100%' }}>
                    {/* Front */}
                    <div className="flip-card-front absolute inset-0 p-5 rounded-2xl flex flex-col cursor-pointer" style={{ background: 'rgba(231,76,60,0.07)', border: '1.5px solid rgba(231,76,60,0.25)', boxShadow: '0 2px 12px rgba(231,76,60,0.08)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{myth.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--crimson-500)' }}>{t('tab3.mythLabel')}</span>
                      </div>
                      <p className="text-sm leading-relaxed flex-1 flex items-center" style={{ color: 'var(--gray-700)' }}>{t(myth.mythKey)}</p>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back absolute inset-0 p-5 rounded-2xl flex flex-col cursor-pointer" style={{ background: 'rgba(39,174,96,0.07)', border: '1.5px solid rgba(39,174,96,0.25)', boxShadow: '0 2px 12px rgba(39,174,96,0.08)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">✅</span>
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--status-ok-fg)' }}>{t('tab3.factLabel')}</span>
                      </div>
                      <p className="text-sm leading-relaxed flex-1 flex items-center" style={{ color: 'var(--gray-700)' }}>{t(myth.factKey)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Indications */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-5">
        <h3 className="font-bold mb-3" style={{ color: 'var(--gray-800)' }}>📋 {t('tab3.indications.title')}</h3>
        <ul className="space-y-2">
          {(t('tab3.indications.items', { returnObjects: true }) as string[]).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--gray-600)' }}>
              <span className="flex-shrink-0 mt-0.5 font-bold" style={{ color: 'var(--crimson-600)' }}>▸</span>
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Risks */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card p-5">
        <h3 className="font-bold mb-1" style={{ color: 'var(--gray-800)' }}>{t('tab3.risks.title')}</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--gray-400)' }}>{t('tab3.risks.subtitle')}</p>
        <div className="space-y-2">
          {TRANSFUSION_RISKS.map(r => {
            const sev = SEVERITY_COLORS[r.severity as keyof typeof SEVERITY_COLORS]
            return (
              <div key={r.id} className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.025)' }}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: sev.color }} />
                  <span className="text-sm truncate" style={{ color: 'var(--gray-700)' }}>{t(r.labelKey)}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-xs" style={{ color: 'var(--gray-400)' }}>{r.rate}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${sev.color}18`, color: sev.color }}>{t(sev.label)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
