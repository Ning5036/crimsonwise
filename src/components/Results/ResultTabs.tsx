import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

interface Props {
  activeTab: number
  onTabChange: (tab: number) => void
}

const TAB_ICONS = ['🧭', '🌿', '💡', '📚', '🩸', '✅', '📊', '⭐']

export default function ResultTabs({ activeTab, onTabChange }: Props) {
  const { t } = useTranslation()

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-1 min-w-max px-1 pb-1">
        {Array.from({ length: 8 }, (_, i) => i + 1).map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all flex-shrink-0"
            style={{
              background: activeTab === tab ? 'linear-gradient(135deg,#c0392b,#e74c3c)' : 'rgba(0,0,0,0.04)',
              border: activeTab === tab ? '1px solid #e74c3c' : '1px solid rgba(0,0,0,0.08)',
              color: activeTab === tab ? 'white' : '#666',
              cursor: 'pointer',
              minWidth: 64,
            }}
          >
            <span className="text-base">{TAB_ICONS[tab - 1]}</span>
            <span className="text-xs font-medium whitespace-nowrap">{t(`tabs.${tab}`)}</span>
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-red-400"
                style={{ transform: 'translateX(-50%)' }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
