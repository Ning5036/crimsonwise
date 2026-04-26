import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface Props {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

const TAB_ICONS = ["🧭", "🌿", "💡", "📚", "🩸", "✅", "📊", "⭐"];

export default function ResultTabs({ activeTab, onTabChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="tab-strip-fade">
      <div className="tab-strip">
        <div className="flex gap-1.5 min-w-max px-1 pb-2 pt-1">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className="relative flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl flex-shrink-0"
                style={{
                  background: isActive ? "var(--surface)" : "transparent",
                  border: isActive
                    ? "1px solid var(--border-strong)"
                    : "1px solid transparent",
                  color: isActive ? "var(--crimson-600)" : "var(--gray-500)",
                  cursor: "pointer",
                  minWidth: 64,
                  fontWeight: isActive ? 700 : 500,
                  boxShadow: isActive ? "var(--shadow-sm)" : "none",
                  transition:
                    "background 0.18s var(--easing), color 0.18s var(--easing), box-shadow 0.18s var(--easing), border-color 0.18s var(--easing)",
                }}
              >
                <span className="text-base" aria-hidden>
                  {TAB_ICONS[tab - 1]}
                </span>
                <span className="text-xs whitespace-nowrap">
                  {t(`tabs.${tab}`)}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1.5 left-1/2 h-0.5 rounded-full"
                    style={{
                      width: 24,
                      transform: "translateX(-50%)",
                      background: "var(--crimson-500)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 32,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
