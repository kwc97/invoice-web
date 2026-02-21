/**
 * 사전 로더
 * 언어 코드로 해당 사전을 반환
 */

import type { SupportedLanguage, Dictionary } from '../types'
import { ko } from './ko'
import { en } from './en'
import { zh } from './zh'
import { ja } from './ja'
import { it } from './it'
import { es } from './es'

const dictionaries: Record<SupportedLanguage, Dictionary> = {
  ko,
  en,
  zh,
  ja,
  it,
  es,
}

/** 언어 코드에 해당하는 사전 반환 (기본값: ko) */
export function getDictionary(lang: SupportedLanguage = 'ko'): Dictionary {
  return dictionaries[lang] ?? dictionaries.ko
}
