import { useTranslation } from "react-i18next";

interface Option {
  id: string;
  labelKey: string;
  icon?: string;
}

interface Props {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  noneId?: string;
}

export default function CheckboxGroup({
  options,
  selected,
  onChange,
  noneId,
}: Props) {
  const { t } = useTranslation();

  const toggle = (id: string) => {
    if (id === noneId) {
      onChange(selected.includes(id) ? [] : [id]);
      return;
    }
    const withoutNone = selected.filter((s) => s !== noneId);
    if (withoutNone.includes(id)) {
      onChange(withoutNone.filter((s) => s !== id));
    } else {
      onChange([...withoutNone, id]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.id);
        return (
          <div
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className="flex items-center gap-3 cursor-pointer select-none"
            style={{
              padding: "0.75rem 0.875rem",
              borderRadius: "var(--r-md)",
              background: isSelected ? "var(--crimson-50)" : "var(--gray-25)",
              border: isSelected
                ? "1px solid var(--crimson-500)"
                : "1px solid var(--border)",
              transition:
                "background 0.18s var(--easing), border-color 0.18s var(--easing)",
            }}
          >
            <div
              className="rounded flex items-center justify-center flex-shrink-0"
              style={{
                width: 20,
                height: 20,
                background: isSelected
                  ? "var(--crimson-500)"
                  : "var(--surface)",
                border: isSelected
                  ? "1px solid var(--crimson-500)"
                  : "1px solid var(--border-strong)",
                transition: "background 0.18s var(--easing)",
              }}
            >
              {isSelected && (
                <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>
                  ✓
                </span>
              )}
            </div>
            <span className="text-sm" style={{ color: "var(--gray-700)" }}>
              {opt.icon && <span className="mr-1">{opt.icon}</span>}
              {t(opt.labelKey)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
