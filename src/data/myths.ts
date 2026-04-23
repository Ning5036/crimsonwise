export interface MythItem {
  id: string
  mythKey: string
  factKey: string
  icon: string
  category: 'safety' | 'indication' | 'efficacy' | 'alternative'
}

export const MYTHS: MythItem[] = [
  {
    id: 'myth1',
    mythKey: 'myth.myth1.myth',
    factKey: 'myth.myth1.fact',
    icon: '💉',
    category: 'safety',
  },
  {
    id: 'myth2',
    mythKey: 'myth.myth2.myth',
    factKey: 'myth.myth2.fact',
    icon: '🩸',
    category: 'indication',
  },
  {
    id: 'myth3',
    mythKey: 'myth.myth3.myth',
    factKey: 'myth.myth3.fact',
    icon: '⚡',
    category: 'efficacy',
  },
  {
    id: 'myth4',
    mythKey: 'myth.myth4.myth',
    factKey: 'myth.myth4.fact',
    icon: '🌿',
    category: 'alternative',
  },
  {
    id: 'myth5',
    mythKey: 'myth.myth5.myth',
    factKey: 'myth.myth5.fact',
    icon: '🔬',
    category: 'safety',
  },
  {
    id: 'myth6',
    mythKey: 'myth.myth6.myth',
    factKey: 'myth.myth6.fact',
    icon: '📊',
    category: 'indication',
  },
]

export const TRANSFUSION_RISKS = [
  { id: 'febrile', labelKey: 'risk.febrile', severity: 'low', rate: '1-2%' },
  { id: 'allergic', labelKey: 'risk.allergic', severity: 'medium', rate: '0.1-0.5%' },
  { id: 'taco', labelKey: 'risk.taco', severity: 'high', rate: '1-8%' },
  { id: 'trali', labelKey: 'risk.trali', severity: 'high', rate: '0.01-0.02%' },
  { id: 'hemolytic', labelKey: 'risk.hemolytic', severity: 'critical', rate: '<0.01%' },
  { id: 'infection', labelKey: 'risk.infection', severity: 'low', rate: '<0.001%' },
  { id: 'immunomod', labelKey: 'risk.immunomod', severity: 'medium', rate: 'variable' },
  { id: 'iron_overload', labelKey: 'risk.iron_overload', severity: 'medium', rate: 'chronic' },
]
