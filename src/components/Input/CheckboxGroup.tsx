import { useTranslation } from 'react-i18next'

interface Option {
  id: string
  labelKey: string
  icon?: string
}

interface Props {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  noneId?: string
}

export default function CheckboxGroup({ options, selected, onChange, noneId }: Props) {
  const { t } = useTranslation()

  const toggle = (id: string) => {
    if (id === noneId) {
      onChange(selected.includes(id) ? [] : [id])
      return
    }
    const withoutNone = selected.filter(s => s !== noneId)
    if (withoutNone.includes(id)) {
      onChange(withoutNone.filter(s => s !== id))
    } else {
      onChange([...withoutNone, id])
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map(opt => {
        const isSelected = selected.includes(opt.id)
        return (
          <div
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all select-none"
            style={{
              background: isSelected ? 'rgba(192,57,43,0.15)' : 'rgba(0,0,0,0.025)',
              border: isSelected ? '1px solid rgba(192,57,43,0.5)' : '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: isSelected ? '#c0392b' : 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.1)' }}
            >
              {isSelected && <span className="text-white text-xs">✓</span>}
            </div>
            <span className="text-sm text-gray-200">
              {opt.icon && <span className="mr-1">{opt.icon}</span>}
              {t(opt.labelKey)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
