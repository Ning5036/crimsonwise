import { useTranslation } from 'react-i18next'
import { useStatsStore } from '../../store/statsStore'
import { LANGUAGES } from '../../i18n/index'
import i18n from '../../i18n/index'

export default function Header() {
  const { t } = useTranslation()
  const { todayCount, totalCount } = useStatsStore()

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(192,57,43,0.12)', boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-2xl">🩸</span>
          <div>
            <div className="font-bold text-lg leading-none" style={{ background: 'linear-gradient(135deg,#e74c3c,#c0392b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {t('app.name')}
            </div>
            <div className="text-xs leading-none mt-0.5" style={{ color: '#888' }}>{t('app.tagline')}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4 text-xs" style={{ color: '#666' }}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: '#27ae60' }} />
            <span>{t('stats.today')}: <strong style={{ color: '#1a1a1a' }}>{todayCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>👥</span>
            <span>{t('stats.total')}: <strong style={{ color: '#1a1a1a' }}>{totalCount}</strong></span>
          </div>
        </div>

        {/* Language switcher */}
        <div className="flex flex-wrap gap-1 justify-end">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className="text-xs px-2 py-1 rounded-md transition-all"
              style={{
                background: i18n.language === lang.code ? 'linear-gradient(135deg,#c0392b,#e74c3c)' : 'rgba(0,0,0,0.05)',
                color: i18n.language === lang.code ? 'white' : '#555',
                border: i18n.language === lang.code ? 'none' : '1px solid rgba(0,0,0,0.08)',
                cursor: 'pointer',
              }}
            >
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
