import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { usePatientStore } from '../../store/patientStore'
import { saveSession } from '../../store/statsStore'
import { assessRisk } from '../../utils/riskAssessment'
import HbPredictorWidget from '../Charts/HbPredictorWidget'
import PltPredictorWidget from '../Charts/PltPredictorWidget'

interface Props { onDecisionMade?: () => void }

export default function Tab6_Decision({ onDecisionMade }: Props) {
  const { t, i18n } = useTranslation()
  const { patient, decision, updateDecision, survey } = usePatientStore()
  const [predictorTab, setPredictorTab] = useState<'hb' | 'plt'>('hb')
  const [confirmModal, setConfirmModal] = useState<'transfuse' | 'no_transfuse' | null>(null)

  const showPlt = patient.plt !== null

  const handleConfirm = (d: 'transfuse' | 'no_transfuse') => {
    const risk = assessRisk(patient)
    const timestamp = new Date().toISOString()
    updateDecision({ decision: d, timestamp })

    // Save session record
    saveSession({
      id: `${Date.now()}`,
      timestamp,
      lang: i18n.language,
      age: patient.age,
      sex: patient.sex ?? '',
      isVegetarian: patient.isVegetarian,
      weightKg: patient.weightKg,
      heightCm: patient.heightCm,
      medicalHistory: patient.medicalHistory.join(', '),
      medications: patient.medications.join(', '),
      hb: patient.hb,
      plt: patient.plt,
      ptInr: patient.ptInr,
      apttInr: patient.apttInr,
      albumin: patient.albumin,
      gfr: patient.gfr,
      symptoms: patient.symptoms.join(', '),
      symptomsOther: patient.symptomsOther,
      clinicalScenarios: patient.clinicalScenarios.join(', '),
      clinicalOther: patient.clinicalOther,
      decision: d,
      decisionReason: decision.reason,
      physicianName: decision.physicianName,
      hbUnitsChosen: decision.hbUnitsChosen,
      pltUnitsChosen: decision.pltUnitsChosen,
      pltType: decision.pltType,
      predictedHb: decision.predictedHb,
      predictedPlt: decision.predictedPlt,
      riskLevel: risk.urgency,
      satisfaction: survey.satisfaction,
      betterUnderstanding: survey.betterUnderstanding ?? '',
      suggestions: survey.suggestions,
    })

    setConfirmModal(null)
    onDecisionMade?.()
  }

  return (
    <div className="space-y-5">
      {/* Predictor */}
      <div className="glass-card p-4">
        <h3 className="font-bold mb-3" style={{ color: '#1a1a1a' }}>🔢 {t('tab6.predictor.title')}</h3>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setPredictorTab('hb')}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: predictorTab === 'hb' ? 'linear-gradient(135deg,#c0392b,#e74c3c)' : 'rgba(0,0,0,0.05)', color: predictorTab === 'hb' ? 'white' : '#555', border: predictorTab === 'hb' ? 'none' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }}>
            🩸 {t('tab6.predictor.hbTab')}
          </button>
          {showPlt && (
            <button onClick={() => setPredictorTab('plt')}
              className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: predictorTab === 'plt' ? 'linear-gradient(135deg,#2980b9,#3498db)' : 'rgba(0,0,0,0.05)', color: predictorTab === 'plt' ? 'white' : '#555', border: predictorTab === 'plt' ? 'none' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }}>
              🧫 {t('tab6.predictor.pltTab')}
            </button>
          )}
        </div>
        {predictorTab === 'hb' ? <HbPredictorWidget /> : <PltPredictorWidget />}
      </div>

      {/* Reason & physician */}
      <div className="glass-card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>{t('tab6.reasonLabel')}</label>
          <textarea rows={2} value={decision.reason} onChange={e => updateDecision({ reason: e.target.value })}
            placeholder={t('tab6.reasonPlaceholder')}
            className="w-full px-3 py-2 rounded-xl text-sm resize-none"
            style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(192,57,43,0.25)', outline: 'none', color: '#1a1a1a' }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>{t('tab6.physicianLabel')}</label>
          <input type="text" value={decision.physicianName} onChange={e => updateDecision({ physicianName: e.target.value })}
            placeholder={t('tab6.physicianPlaceholder')}
            className="w-full px-3 py-2 rounded-xl text-sm"
            style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(192,57,43,0.25)', outline: 'none', color: '#1a1a1a' }} />
        </div>
      </div>

      {/* Decision buttons */}
      <div>
        <h3 className="font-bold text-center mb-4" style={{ color: '#1a1a1a' }}>{t('tab6.decisionTitle')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setConfirmModal('transfuse')}
            className="py-6 rounded-2xl font-bold text-lg flex flex-col items-center gap-2"
            style={{ background: decision.decision === 'transfuse' ? 'linear-gradient(135deg,#c0392b,#e74c3c)' : 'rgba(192,57,43,0.08)', border: '2px solid rgba(192,57,43,0.4)', color: decision.decision === 'transfuse' ? 'white' : '#c0392b', cursor: 'pointer', boxShadow: decision.decision === 'transfuse' ? '0 4px 24px rgba(192,57,43,0.4)' : 'none' }}>
            <span className="text-3xl">🩸</span>
            <span className="text-base">{t('tab6.transfuse')}</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setConfirmModal('no_transfuse')}
            className="py-6 rounded-2xl font-bold flex flex-col items-center gap-2"
            style={{ background: decision.decision === 'no_transfuse' ? 'rgba(39,174,96,0.15)' : 'rgba(0,0,0,0.03)', border: `2px solid ${decision.decision === 'no_transfuse' ? '#27ae60' : 'rgba(0,0,0,0.1)'}`, color: decision.decision === 'no_transfuse' ? '#27ae60' : '#888', cursor: 'pointer' }}>
            <span className="text-3xl">🌿</span>
            <span className="text-base">{t('tab6.noTransfuse')}</span>
          </motion.button>
        </div>
      </div>

      {decision.decision && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="p-3 rounded-xl text-center text-sm"
          style={{ background: 'rgba(39,174,96,0.06)', border: '1px solid rgba(39,174,96,0.2)', color: '#555' }}>
          ✅ 已記錄：{decision.decision === 'transfuse' ? t('tab6.transfuse') : t('tab6.noTransfuse')}
          {decision.timestamp && <span className="text-xs ml-2" style={{ color: '#9ca3af' }}>({new Date(decision.timestamp).toLocaleString()})</span>}
        </motion.div>
      )}

      {/* Confirm modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-sm w-full">
              <h3 className="font-bold text-lg mb-3 text-center" style={{ color: '#1a1a1a' }}>{t('tab6.confirmTitle')}</h3>
              <p className="text-center mb-5 text-sm" style={{ color: '#555' }}>
                {confirmModal === 'transfuse' ? t('tab6.confirmTransfuse') : t('tab6.confirmNo')}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmModal(null)} className="flex-1 py-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', color: '#666' }}>
                  {t('app.cancel')}
                </button>
                <button onClick={() => handleConfirm(confirmModal)} className="flex-1 py-3 rounded-xl font-bold"
                  style={{ background: 'linear-gradient(135deg,#c0392b,#e74c3c)', border: 'none', cursor: 'pointer', color: 'white' }}>
                  {t('app.confirm')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
