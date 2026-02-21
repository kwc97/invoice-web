/**
 * Google Cloud Translation API 래퍼
 * 동적 콘텐츠(notes, item.name 등) 번역 처리
 */

import { unstable_cache } from 'next/cache'
import type { Quote } from '@/types/quote'
import type { SupportedLanguage } from './types'

/**
 * 한국어 단위 → 다국어 정적 매핑
 * Google Translate가 단위 약어를 잘못 번역하므로 정적 매핑 사용
 */
const UNIT_MAP: Record<string, Record<SupportedLanguage, string>> = {
  식: { ko: '식', en: 'Set', zh: '套', ja: 'セット', it: 'Set', es: 'Juego' },
  본: { ko: '본', en: 'Pcs', zh: '根', ja: '本', it: 'Pz', es: 'Pzs' },
  인: { ko: '인', en: 'Person', zh: '人', ja: '人', it: 'Pers.', es: 'Pers.' },
  개: { ko: '개', en: 'Pcs', zh: '个', ja: '個', it: 'Pz', es: 'Pzs' },
  대: { ko: '대', en: 'Unit', zh: '台', ja: '台', it: 'Unità', es: 'Unid.' },
  세트: { ko: '세트', en: 'Set', zh: '套', ja: 'セット', it: 'Set', es: 'Juego' },
  건: { ko: '건', en: 'Case', zh: '件', ja: '件', it: 'Caso', es: 'Caso' },
  조: { ko: '조', en: 'Set', zh: '组', ja: '組', it: 'Set', es: 'Juego' },
  m: { ko: 'm', en: 'm', zh: 'm', ja: 'm', it: 'm', es: 'm' },
  EA: { ko: 'EA', en: 'EA', zh: 'EA', ja: 'EA', it: 'EA', es: 'EA' },
  ea: { ko: 'ea', en: 'EA', zh: 'EA', ja: 'EA', it: 'EA', es: 'EA' },
}

/** 단위 번역 (정적 매핑 우선, 없으면 원본 반환) */
function translateUnit(unit: string, lang: SupportedLanguage): string {
  if (!unit || lang === 'ko') return unit
  const trimmed = unit.trim()
  return UNIT_MAP[trimmed]?.[lang] ?? trimmed
}

/**
 * Google Translate API로 텍스트 배열 일괄 번역
 * API 키 미설정 시 원본 반환 (graceful fallback)
 */
export async function translateTexts(
  texts: string[],
  targetLang: SupportedLanguage,
  sourceLang: string = 'ko'
): Promise<string[]> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
  if (!apiKey) {
    console.warn('GOOGLE_TRANSLATE_API_KEY 미설정, 원본 텍스트 반환')
    return texts
  }

  // 빈 문자열 필터링
  const nonEmptyIndices: number[] = []
  const nonEmptyTexts: string[] = []
  texts.forEach((text, i) => {
    if (text.trim()) {
      nonEmptyIndices.push(i)
      nonEmptyTexts.push(text)
    }
  })

  if (nonEmptyTexts.length === 0) return texts

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: nonEmptyTexts,
          target: targetLang,
          source: sourceLang,
          format: 'text',
        }),
      }
    )

    if (!response.ok) {
      console.error('Google Translate API 오류:', response.status)
      return texts
    }

    const data = await response.json()
    const translations: { translatedText: string }[] =
      data.data?.translations ?? []

    // 원본 배열에 번역 결과 매핑
    const result = [...texts]
    translations.forEach((t, i) => {
      result[nonEmptyIndices[i]] = t.translatedText
    })

    return result
  } catch (error) {
    console.error('번역 실패, 원본 반환:', error)
    return texts
  }
}

/**
 * Quote의 동적 필드 번역
 * notes, item.name, item.description, item.remarks 대상
 */
async function translateQuoteContentInner(
  quote: Quote,
  lang: SupportedLanguage
): Promise<Quote> {
  if (lang === 'ko') return quote

  // 번역할 텍스트 수집
  const textsToTranslate: string[] = []
  textsToTranslate.push(quote.notes ?? '')
  textsToTranslate.push(quote.projectName ?? '')
  textsToTranslate.push(quote.recipient ?? '')
  textsToTranslate.push(quote.contactPerson ?? '')

  const items = quote.items ?? []
  items.forEach(item => {
    textsToTranslate.push(item.name)
    textsToTranslate.push(item.description ?? '')
    textsToTranslate.push(item.remarks ?? '')
  })

  const translated = await translateTexts(textsToTranslate, lang)

  // 번역 결과 매핑
  let idx = 0
  const translatedNotes = translated[idx++]
  const translatedProjectName = translated[idx++]
  const translatedRecipient = translated[idx++]
  const translatedContactPerson = translated[idx++]

  const translatedItems = items.map(item => ({
    ...item,
    name: translated[idx++],
    description: translated[idx++],
    remarks: translated[idx++],
    unit: translateUnit(item.unit ?? '', lang),
  }))

  return {
    ...quote,
    notes: translatedNotes,
    projectName: translatedProjectName,
    recipient: translatedRecipient,
    contactPerson: translatedContactPerson,
    items: translatedItems,
  }
}

/**
 * Quote 동적 콘텐츠 번역 (캐싱 적용)
 */
export async function translateQuoteContent(
  quote: Quote,
  lang: SupportedLanguage
): Promise<Quote> {
  if (lang === 'ko') return quote

  return unstable_cache(
    () => translateQuoteContentInner(quote, lang),
    [`quote-translation-v2-${quote.id}-${lang}`],
    { revalidate: 3600, tags: ['quotes'] }
  )()
}
