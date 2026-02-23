/**
 * 부속 내역서 컬럼 프리셋 정의
 * 자주 사용되는 테이블 구조를 빠르게 적용할 수 있도록 템플릿 제공
 */

import type { AppendixColumn, AppendixRow } from '@/types/appendix'
import type { SupportedLanguage } from '@/lib/i18n/types'
import { translateAppendixLabel } from '@/lib/appendix/i18n'

export interface ColumnPreset {
  /** 프리셋 ID */
  id: string
  /** 프리셋 이름 (UI 표시) */
  name: string
  /** 컬럼 정의 */
  columns: AppendixColumn[]
}

/** 빈 행 생성 헬퍼 */
export function createEmptyRows(
  columns: AppendixColumn[],
  count: number
): AppendixRow[] {
  return Array.from({ length: count }, () => ({
    values: Object.fromEntries(columns.map(col => [col.key, ''])),
  }))
}

/** 프리셋 목록 */
export const COLUMN_PRESETS: ColumnPreset[] = [
  {
    id: 'basic',
    name: '기본 단가표 (7컬럼)',
    columns: [
      { key: 'col_0', label: '품명', format: 'text', align: 'left' },
      { key: 'col_1', label: '규격', format: 'text', align: 'center' },
      { key: 'col_2', label: '단위', format: 'text', align: 'center' },
      { key: 'col_3', label: '수량', format: 'number', align: 'right' },
      { key: 'col_4', label: '단가', format: 'currency', align: 'right' },
      { key: 'col_5', label: '금액', format: 'currency', align: 'right' },
      { key: 'col_6', label: '비고', format: 'text', align: 'left' },
    ],
  },
  {
    id: 'material-cost',
    name: '자재비 내역서 (11컬럼)',
    columns: [
      { key: 'col_0', label: '품명', format: 'text', align: 'left' },
      { key: 'col_1', label: '규격', format: 'text', align: 'center' },
      { key: 'col_2', label: '단위', format: 'text', align: 'center' },
      { key: 'col_3', label: '수량', format: 'number', align: 'right' },
      // 자재비 그룹
      {
        key: 'col_4',
        label: '단가',
        group: '자재비',
        format: 'currency',
        align: 'right',
      },
      {
        key: 'col_5',
        label: '금액',
        group: '자재비',
        format: 'currency',
        align: 'right',
      },
      // 합계 그룹
      {
        key: 'col_6',
        label: '단가',
        group: '합계',
        format: 'currency',
        align: 'right',
      },
      {
        key: 'col_7',
        label: '금액',
        group: '합계',
        format: 'currency',
        align: 'right',
      },
      { key: 'col_8', label: '품질인정번호', format: 'text', align: 'left' },
      {
        key: 'col_9',
        label: '적용가능울타리',
        format: 'text',
        align: 'center',
      },
      { key: 'col_10', label: '비고', format: 'text', align: 'left' },
    ],
  },
  {
    id: 'labor-expense',
    name: '노무비/경비 내역서 (13컬럼)',
    columns: [
      { key: 'col_0', label: '품명', format: 'text', align: 'left' },
      { key: 'col_1', label: '규격', format: 'text', align: 'center' },
      { key: 'col_2', label: '단위', format: 'text', align: 'center' },
      { key: 'col_3', label: '수량', format: 'number', align: 'right' },
      // 노무비 그룹
      {
        key: 'col_4',
        label: '단가',
        group: '노무비',
        format: 'currency',
        align: 'right',
      },
      {
        key: 'col_5',
        label: '금액',
        group: '노무비',
        format: 'currency',
        align: 'right',
      },
      // 경비 그룹
      {
        key: 'col_6',
        label: '단가',
        group: '경비',
        format: 'currency',
        align: 'right',
      },
      {
        key: 'col_7',
        label: '금액',
        group: '경비',
        format: 'currency',
        align: 'right',
      },
      // 합계 그룹
      {
        key: 'col_8',
        label: '단가',
        group: '합계',
        format: 'currency',
        align: 'right',
      },
      {
        key: 'col_9',
        label: '금액',
        group: '합계',
        format: 'currency',
        align: 'right',
      },
      { key: 'col_10', label: '품질인정번호', format: 'text', align: 'left' },
      {
        key: 'col_11',
        label: '적용가능울타리',
        format: 'text',
        align: 'center',
      },
      { key: 'col_12', label: '비고', format: 'text', align: 'left' },
    ],
  },
  {
    id: 'construction-cost',
    name: '건설 원가 내역서 (12컬럼)',
    columns: [
      { key: 'col_0', label: '품명', format: 'text', align: 'left' },
      { key: 'col_1', label: '규격', format: 'text', align: 'center' },
      { key: 'col_2', label: '단위', format: 'text', align: 'center' },
      { key: 'col_3', label: '수량', format: 'number', align: 'right' },
      // 재료비 그룹
      {
        key: 'col_4',
        label: '단가',
        group: '재료비',
        format: 'currency',
        align: 'right',
      },
      {
        key: 'col_5',
        label: '금액',
        group: '재료비',
        format: 'currency',
        align: 'right',
      },
      // 노무비 그룹
      {
        key: 'col_6',
        label: '단가',
        group: '노무비',
        format: 'currency',
        align: 'right',
      },
      {
        key: 'col_7',
        label: '금액',
        group: '노무비',
        format: 'currency',
        align: 'right',
      },
      // 경비 그룹
      {
        key: 'col_8',
        label: '단가',
        group: '경비',
        format: 'currency',
        align: 'right',
      },
      {
        key: 'col_9',
        label: '금액',
        group: '경비',
        format: 'currency',
        align: 'right',
      },
      { key: 'col_10', label: '합계', format: 'currency', align: 'right' },
      { key: 'col_11', label: '비고', format: 'text', align: 'left' },
    ],
  },
]

/**
 * 프리셋을 해당 언어로 번역하여 반환
 * 컬럼 라벨과 그룹명을 지정 언어로 변환
 */
export function getLocalizedPresets(lang: SupportedLanguage): ColumnPreset[] {
  if (lang === 'ko') return COLUMN_PRESETS
  return COLUMN_PRESETS.map(preset => ({
    ...preset,
    columns: preset.columns.map(col => ({
      ...col,
      label: translateAppendixLabel(col.label, lang),
      group: col.group ? translateAppendixLabel(col.group, lang) : undefined,
    })),
  }))
}
