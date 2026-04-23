import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllSessions } from '../../store/statsStore'
import { exportToExcel } from '../../utils/excelExport'

const ADMIN_PASSWORD = 'bloodwise@2026'

export default function AdminDownload() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  const sessions = getAllSessions()

  const handleDownload = () => {
    if (password !== ADMIN_PASSWORD) {
      setError(t('admin.wrongPassword'))
      return
    }
    if (sessions.length === 0) {
      setError(t('admin.noData'))
      return
    }
    setError('')
    setDownloading(true)
    try {
      exportToExcel()
    } finally {
      setDownloading(false)
      setOpen(false)
      setPassword('')
    }
  }

  const handleClose = () => { setOpen(false); setPassword(''); setError('') }

  return (
    <>
      {/* Admin panel card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
        className="w-full max-w-sm mx-auto mt-6 px-4 py-3 rounded-2xl flex items-center justify-between gap-4"
        style={{ background: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.18)' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔐</span>
          <div>
            <div className="text-sm font-semibold" style={{ color: '#c0392b' }}>{t('admin.downloadTitle')}</div>
            <div className="text-xs" style={{ color: '#999' }}>{t('admin.recordCount', { count: sessions.length })}</div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
          style={{ background: 'linear-gradient(135deg,#c0392b,#e74c3c)', color: 'white', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          📥 {t('admin.downloadBtn')}
        </motion.button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) handleClose() }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-sm w-full">
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2" style={{ color: '#1a1a1a' }}>
                🔐 {t('admin.downloadTitle')}
              </h3>
              <div className="text-xs mb-4" style={{ color: '#999' }}>
                {t('admin.recordCount', { count: sessions.length })}
              </div>

              <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>{t('admin.passwordLabel')}</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleDownload()}
                placeholder={t('admin.passwordPlaceholder')}
                className="w-full px-3 py-2 rounded-xl text-sm mb-3"
                style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${error ? '#e74c3c' : 'rgba(192,57,43,0.25)'}`, outline: 'none', color: '#1a1a1a' }}
                autoFocus
              />

              {error && <p className="text-xs text-red-400 mb-3">⚠️ {error}</p>}

              <div className="flex gap-3">
                <button onClick={handleClose}
                  className="flex-1 py-2.5 rounded-xl text-sm"
                  style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', color: '#666' }}>
                  {t('app.cancel')}
                </button>
                <button onClick={handleDownload} disabled={downloading || !password}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                  style={{ background: password ? 'linear-gradient(135deg,#c0392b,#e74c3c)' : 'rgba(0,0,0,0.06)', color: password ? 'white' : '#999', border: 'none', cursor: password ? 'pointer' : 'not-allowed' }}>
                  {downloading ? '⏳ ...' : '📥 ' + t('admin.downloadBtn')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
