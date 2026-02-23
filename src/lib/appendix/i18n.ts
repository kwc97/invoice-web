/**
 * 부속 내역서 라벨 다국어 번역
 * 컬럼 라벨, 그룹명, 제목 등 알려진 라벨을 언어별로 번역
 */

import type { SupportedLanguage } from '@/lib/i18n/types'
import type { AppendixTable } from '@/types/appendix'

/** 번역 가능한 라벨 목록 (한국어 기준 key) */
const LABEL_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  // 컬럼 라벨
  품명: {
    ko: '품명',
    en: 'Item',
    zh: '品名',
    ja: '品名',
    it: 'Articolo',
    es: 'Artículo',
  },
  '품 명': {
    ko: '품 명',
    en: 'Item',
    zh: '品名',
    ja: '品名',
    it: 'Articolo',
    es: 'Artículo',
  },
  규격: {
    ko: '규격',
    en: 'Spec',
    zh: '规格',
    ja: '規格',
    it: 'Spec.',
    es: 'Espec.',
  },
  '규 격': {
    ko: '규 격',
    en: 'Spec',
    zh: '规格',
    ja: '規格',
    it: 'Spec.',
    es: 'Espec.',
  },
  단위: {
    ko: '단위',
    en: 'Unit',
    zh: '单位',
    ja: '単位',
    it: 'Unità',
    es: 'Unidad',
  },
  '단 위': {
    ko: '단 위',
    en: 'Unit',
    zh: '单位',
    ja: '単位',
    it: 'Unità',
    es: 'Unidad',
  },
  수량: {
    ko: '수량',
    en: 'Qty',
    zh: '数量',
    ja: '数量',
    it: 'Qtà',
    es: 'Cant.',
  },
  '수 량': {
    ko: '수 량',
    en: 'Qty',
    zh: '数量',
    ja: '数量',
    it: 'Qtà',
    es: 'Cant.',
  },
  단가: {
    ko: '단가',
    en: 'Unit Price',
    zh: '单价',
    ja: '単価',
    it: 'Prezzo unit.',
    es: 'Precio unit.',
  },
  금액: {
    ko: '금액',
    en: 'Amount',
    zh: '金额',
    ja: '金額',
    it: 'Importo',
    es: 'Importe',
  },
  '금 액': {
    ko: '금 액',
    en: 'Amount',
    zh: '金额',
    ja: '金額',
    it: 'Importo',
    es: 'Importe',
  },
  비고: {
    ko: '비고',
    en: 'Remarks',
    zh: '备注',
    ja: '備考',
    it: 'Note',
    es: 'Notas',
  },
  '비 고': {
    ko: '비 고',
    en: 'Remarks',
    zh: '备注',
    ja: '備考',
    it: 'Note',
    es: 'Notas',
  },
  품질인정번호: {
    ko: '품질인정번호',
    en: 'Quality No.',
    zh: '质量认证号',
    ja: '品質認定番号',
    it: 'N. qualità',
    es: 'N.º calidad',
  },
  적용가능울타리: {
    ko: '적용가능울타리',
    en: 'Applicable Fence',
    zh: '适用围栏',
    ja: '適用フェンス',
    it: 'Recinzione appl.',
    es: 'Cerca aplic.',
  },
  적용가능울타리브: {
    ko: '적용가능울타리브',
    en: 'Applicable Fence',
    zh: '适用围栏',
    ja: '適用フェンス',
    it: 'Recinzione appl.',
    es: 'Cerca aplic.',
  },
  합계: {
    ko: '합계',
    en: 'Total',
    zh: '合计',
    ja: '合計',
    it: 'Totale',
    es: 'Total',
  },
  항목: {
    ko: '항목',
    en: 'Item',
    zh: '项目',
    ja: '項目',
    it: 'Voce',
    es: 'Concepto',
  },
  '새 컬럼': {
    ko: '새 컬럼',
    en: 'New Column',
    zh: '新列',
    ja: '新列',
    it: 'Nuova col.',
    es: 'Nueva col.',
  },
  // 그룹명 / 테이블 제목
  자재비: {
    ko: '자재비',
    en: 'Material',
    zh: '材料费',
    ja: '資材費',
    it: 'Materiale',
    es: 'Material',
  },
  노무비: {
    ko: '노무비',
    en: 'Labor',
    zh: '人工费',
    ja: '労務費',
    it: 'Manodopera',
    es: 'Mano de obra',
  },
  경비: {
    ko: '경비',
    en: 'Expense',
    zh: '经费',
    ja: '経費',
    it: 'Spese',
    es: 'Gastos',
  },
  재료비: {
    ko: '재료비',
    en: 'Material Cost',
    zh: '材料费',
    ja: '材料費',
    it: 'Costo mat.',
    es: 'Coste mat.',
  },
  // 데이터 셀에서 자주 사용되는 고정 텍스트
  '총 계': {
    ko: '총 계',
    en: 'Grand Total',
    zh: '总计',
    ja: '総計',
    it: 'Totale gen.',
    es: 'Total gral.',
  },
  총계: {
    ko: '총계',
    en: 'Grand Total',
    zh: '总计',
    ja: '総計',
    it: 'Totale gen.',
    es: 'Total gral.',
  },
  소계: {
    ko: '소계',
    en: 'Subtotal',
    zh: '小计',
    ja: '小計',
    it: 'Subtotale',
    es: 'Subtotal',
  },
  부가세별도: {
    ko: '부가세별도',
    en: 'VAT excluded',
    zh: '不含增值税',
    ja: '税別',
    it: 'IVA esclusa',
    es: 'IVA excl.',
  },
  부가세포함: {
    ko: '부가세포함',
    en: 'VAT included',
    zh: '含增值税',
    ja: '税込',
    it: 'IVA inclusa',
    es: 'IVA incl.',
  },
  세별도: {
    ko: '세별도',
    en: 'Tax excl.',
    zh: '不含税',
    ja: '税別',
    it: 'Tasse escluse',
    es: 'Imp. excl.',
  },
  // 울타리 유형
  합석: {
    ko: '합석',
    en: 'Composite',
    zh: '复合石',
    ja: '合石',
    it: 'Composito',
    es: 'Compuesto',
  },
  '합석/PVC': {
    ko: '합석/PVC',
    en: 'Composite/PVC',
    zh: '复合石/PVC',
    ja: '合石/PVC',
    it: 'Composito/PVC',
    es: 'Compuesto/PVC',
  },
}

/** 제목 번역 (부속 내역서) */
const TITLE_TRANSLATIONS: Record<SupportedLanguage, string> = {
  ko: '부속 내역서',
  en: 'Appendix',
  zh: '附属明细表',
  ja: '付属明細書',
  it: 'Allegato',
  es: 'Anexo',
}

/**
 * 모든 언어의 라벨 → 한국어 key 역방향 맵 생성
 * 어떤 언어에서든 한국어 원본 key를 찾을 수 있도록
 */
function buildReverseLookup(): Map<string, string> {
  const map = new Map<string, string>()
  for (const [koKey, translations] of Object.entries(LABEL_TRANSLATIONS)) {
    for (const lang of Object.keys(translations) as SupportedLanguage[]) {
      map.set(translations[lang], koKey)
    }
  }
  return map
}

const reverseLookup = buildReverseLookup()

/**
 * 단일 라벨을 목표 언어로 번역
 * 알려진 라벨이 아니면 원본 그대로 반환
 */
export function translateAppendixLabel(
  label: string,
  toLang: SupportedLanguage
): string {
  // 역방향 맵에서 한국어 key 찾기
  const koKey = reverseLookup.get(label)
  if (!koKey) return label

  const translations = LABEL_TRANSLATIONS[koKey]
  return translations?.[toLang] ?? label
}

/**
 * 부속 내역서 테이블의 제목/컬럼 라벨/그룹명/데이터 셀을 목표 언어로 번역
 */
export function translateAppendixTable(
  table: AppendixTable,
  toLang: SupportedLanguage
): AppendixTable {
  return {
    ...table,
    title: translateTitle(table.title, toLang),
    columns: table.columns.map(col => ({
      ...col,
      label: translateAppendixLabel(col.label, toLang),
      group: col.group ? translateAppendixLabel(col.group, toLang) : undefined,
    })),
    rows: table.rows.map(row => ({
      ...row,
      values: Object.fromEntries(
        Object.entries(row.values).map(([key, val]) => [
          key,
          typeof val === 'string' ? translateCellValue(val, toLang) : val,
        ])
      ),
    })),
  }
}

/**
 * 셀 값에 포함된 알려진 한국어 텍스트를 번역
 * 정확히 일치하면 바로 번역, 아니면 알려진 토큰을 부분 치환
 */
function translateCellValue(value: string, toLang: SupportedLanguage): string {
  if (!value) return value

  // 정확히 일치하는 경우
  const exact = reverseLookup.get(value.trim())
  if (exact) {
    const translations = LABEL_TRANSLATIONS[exact]
    if (translations?.[toLang]) return translations[toLang]
  }

  // 부분 치환: 셀 값 안에 포함된 알려진 텍스트를 번역
  let result = value
  for (const [koKey, translations] of Object.entries(LABEL_TRANSLATIONS)) {
    // 모든 언어의 번역을 확인하여 현재 값에 포함된 것을 찾기
    for (const lang of Object.keys(translations) as SupportedLanguage[]) {
      const fromText = translations[lang]
      if (
        fromText &&
        result.includes(fromText) &&
        fromText !== translations[toLang]
      ) {
        // 짧은 단어(2자 이하)는 정확 일치만 처리 (오탐 방지)
        if (fromText.length <= 2 && result.trim() !== fromText) continue
        result = result.replaceAll(fromText, translations[toLang])
      }
    }
    void koKey
  }
  return result
}

/**
 * 부속 내역서 제목 번역
 * "부속 내역서 1" 형태를 "Appendix 1"로 변환
 */
function translateTitle(title: string, toLang: SupportedLanguage): string {
  // 모든 언어의 "부속 내역서" 제목 패턴 검사
  for (const lang of Object.keys(TITLE_TRANSLATIONS) as SupportedLanguage[]) {
    const prefix = TITLE_TRANSLATIONS[lang]
    if (title.startsWith(prefix)) {
      const suffix = title.slice(prefix.length) // " 1" 등 숫자 부분
      return TITLE_TRANSLATIONS[toLang] + suffix
    }
  }
  return title
}

/** 해당 언어의 부속 내역서 기본 제목 반환 */
export function getAppendixTitle(
  lang: SupportedLanguage,
  index: number
): string {
  return `${TITLE_TRANSLATIONS[lang]} ${index}`
}
