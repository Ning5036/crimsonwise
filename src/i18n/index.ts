import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhTW from './zh-TW.json'
import zhCN from './zh-CN.json'
import en from './en.json'
import ja from './ja.json'
import ko from './ko.json'
import vi from './vi.json'
import id from './id.json'

export const LANGUAGES = [
  { code: 'zh-TW', label: '繁中', flag: '🇹🇼' },
  { code: 'zh-CN', label: '简中', flag: '🇨🇳' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', label: 'Bahasa', flag: '🇮🇩' },
]

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-TW': { translation: zhTW },
      'zh-CN': { translation: zhCN },
      en: { translation: en },
      ja: { translation: ja },
      ko: { translation: ko },
      vi: { translation: vi },
      id: { translation: id },
    },
    lng: 'zh-TW',
    fallbackLng: 'zh-TW',
    interpolation: { escapeValue: false },
  })

export default i18n
