/**
 * 언어별 포맷 유틸리티
 */

import type { SupportedLanguage } from './types'

/** 언어별 로케일 매핑 */
const LOCALE_MAP: Record<SupportedLanguage, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  it: 'it-IT',
  es: 'es-ES',
}

/**
 * 언어별 날짜 포맷
 * @param isoDate ISO 날짜 문자열 (YYYY-MM-DD) 또는 한국어 형식
 * @param lang 대상 언어
 */
export function formatDateByLanguage(
  isoDate: string,
  lang: SupportedLanguage
): string {
  if (!isoDate) return ''

  // 한국어 날짜 형식("2026년 01월 11일") → ISO 변환
  const koreanMatch = isoDate.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/)
  const dateStr = koreanMatch
    ? `${koreanMatch[1]}-${koreanMatch[2].padStart(2, '0')}-${koreanMatch[3].padStart(2, '0')}`
    : isoDate

  const date = new Date(dateStr + 'T00:00:00')
  if (isNaN(date.getTime())) return isoDate

  const locale = LOCALE_MAP[lang]

  if (lang === 'ko') {
    // 한국어는 기존 형식 유지: 2026년 01월 11일
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}년 ${m}월 ${d}일`
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * 언어별 통화 포맷 (항상 KRW, 로케일만 변경)
 */
export function formatCurrencyByLanguage(
  amount: number,
  lang: SupportedLanguage
): string {
  const locale = LOCALE_MAP[lang]
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount)
}
