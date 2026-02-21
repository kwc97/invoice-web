/**
 * i18n 모듈 re-export
 */

export { SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from './types'
export type { SupportedLanguage, Dictionary } from './types'
export { getDictionary } from './dictionaries'
export { translateTexts, translateQuoteContent } from './translate'
export { formatDateByLanguage, formatCurrencyByLanguage } from './format'
