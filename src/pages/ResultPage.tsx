import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { usePatientStore } from '../store/patientStore'
import ResultTabs from '../components/Results/ResultTabs'
import Tab1_Consultation from '../components/Results/Tab1_Consultation'
import Tab2_Alternatives from '../components/Results/Tab2_Alternatives'
import Tab3_Myths from '../components/Results/Tab3_Myths'
import Tab4_Guidelines from '../components/Results/Tab4_Guidelines'
import Tab5_BloodValue from '../components/Results/Tab5_BloodValue'
import Tab6_Decision from '../components/Results/Tab6_Decision'
import Tab7_Recommendation from '../components/Results/Tab7_Recommendation'
import Tab8_Survey from '../components/Results/Tab8_Survey'

const TAB_COMPONENTS = [Tab1_Consultation, Tab2_Alternatives, Tab3_Myths, Tab4_Guidelines, Tab5_BloodValue, Tab6_Decision, Tab7_Recommendation, Tab8_Survey]

export default function ResultPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { patient, reset } = usePatientStore()
  const [activeTab, setActiveTab] = useState(1)

  // Guard: if no data, redirect
  if (!patient.hb) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FFF5F3' }}>
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="mb-4" style={{ color: '#666' }}>請先完成資料輸入</p>
          <button onClick={() => navigate('/form')} className="px-6 py-3 rounded-xl font-bold" style={{ background: 'linear-gradient(135deg,#c0392b,#e74c3c)', border: 'none', cursor: 'pointer', color: 'white' }}>
            開始評估
          </button>
        </div>
      </div>
    )
  }

  const TabComponent = TAB_COMPONENTS[activeTab - 1]

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#FFF5F3 0%,#FFF0EE 100%)' }}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Tab nav */}
        <div className="mb-5">
          <ResultTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <TabComponent onDecisionMade={() => setActiveTab(7)} />
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons between tabs */}
        <div className="flex gap-3 mt-6">
          {activeTab > 1 && (
            <button onClick={() => setActiveTab(prev => Math.max(1, prev - 1))}
              className="flex-1 py-3 rounded-xl font-medium text-sm"
              style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', color: '#555' }}>
              ← {t('app.prevPage')}
            </button>
          )}
          {activeTab < 8 && (
            <button onClick={() => setActiveTab(prev => Math.min(8, prev + 1))}
              className="flex-1 py-3 rounded-xl font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#c0392b,#e74c3c)', border: 'none', cursor: 'pointer', color: 'white' }}>
              {t('app.nextPage')} →
            </button>
          )}
        </div>

        {/* Restart */}
        <div className="text-center mt-4">
          <button onClick={() => { reset(); navigate('/') }}
            className="text-xs transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b4b4b4' }}>
            🔄 {t('app.restart')}
          </button>
        </div>
      </div>
    </div>
  )
}
