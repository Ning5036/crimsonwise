import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { usePatientStore } from '../../store/patientStore'

const ALTERNATIVES = ['iron', 'epo', 'folate_b12', 'autologous', 'cellSaver'] as const
type AltKey = typeof ALTERNATIVES[number]

const ALT_ICONS: Record<AltKey, string> = { iron: '🔩', epo: '💉', folate_b12: '🌿', autologous: '🔄', cellSaver: '⚕️' }

function feasibilityScore(alt: AltKey, patient: ReturnType<typeof import('../../store/patientStore').usePatientStore.getState>['patient']): number {
  const hb = patient.hb ?? 12
  switch (alt) {
    case 'iron': return (patient.isVegetarian || patient.medicalHistory.includes('gynecological')) ? 90 : (hb < 10 ? 70 : 50)
    case 'epo': return (patient.medicalHistory.includes('ckd') || patient.clinicalScenarios.includes('recentChemo')) ? 85 : 40
    case 'folate_b12': return patient.isVegetarian ? 95 : 60
    case 'autologous': return patient.clinicalScenarios.includes('postSurgery') ? 30 : (patient.clinicalScenarios.includes('massiveBleed') ? 10 : 70)
    case 'cellSaver': return patient.clinicalScenarios.includes('postSurgery') ? 80 : 40
  }
}

export default function Tab2_Alternatives() {
  const { t } = useTranslation()
  const { patient } = usePatientStore()

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl" style={{ background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.3)' }}>
        <p className="text-sm text-green-300 font-medium">🌿 {t('tab2.subtitle')}</p>
      </div>

      {ALTERNATIVES.map((alt, i) => {
        const score = feasibilityScore(alt, patient)
        const color = score >= 70 ? '#27ae60' : score >= 40 ? '#f39c12' : '#95a5a6'
        return (
          <motion.div key={alt} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-2xl flex-shrink-0 mt-1">{ALT_ICONS[alt]}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{t(`tab2.alternatives.${alt}.name`)}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">{t(`tab2.alternatives.${alt}.desc`)}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs">
                    <span className="text-gray-400">⏰ {t(`tab2.alternatives.${alt}.effect`)}</span>
                    <span className="text-gray-400">🎯 {t(`tab2.alternatives.${alt}.when`)}</span>
                  </div>
                </div>
              </div>
              {/* Feasibility arc */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="text-xs text-gray-500 mb-1">{t('tab2.feasibility')}</div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: `${color}22`, border: `2px solid ${color}`, color }}>
                  {score}%
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.05)' }}>
              <motion.div className="h-1.5 rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8, delay: i * 0.1 + 0.3 }} />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
