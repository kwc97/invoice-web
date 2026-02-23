/**
 * 부속 내역서 헤더 레이아웃 계산 유틸리티
 * 컬럼 group 분석하여 2행 헤더(병합 그룹행 + 서브컬럼행) 레이아웃 생성
 */

import type {
  AppendixColumn,
  AppendixRow,
  AppendixTable,
} from '@/types/appendix'

/** 합계 행 키워드 (첫 번째 컬럼 값에 포함되면 합계 행으로 판정) */
const TOTAL_KEYWORDS = [
  '총 계',
  '총계',
  '합 계',
  '합계',
  'total',
  'sum',
  '소 계',
  '소계',
]

/** 그룹 헤더 셀 */
export interface HeaderGroup {
  /** 그룹명 (없으면 null → 하위 컬럼 라벨이 바로 올라감) */
  label: string | null
  /** 이 그룹이 차지하는 컬럼 수 (colSpan) */
  colSpan: number
  /** 소속 컬럼 인덱스 범위 (start~end) */
  startIndex: number
}

export interface HeaderLayout {
  /** 그룹이 있는지 여부 (2행 헤더 필요 여부) */
  hasGroups: boolean
  /** 그룹 행 셀 목록 (1행째) */
  groups: HeaderGroup[]
}

/**
 * 컬럼 정의에서 2행 헤더 레이아웃 계산
 * 인접한 동일 group을 병합 처리
 */
export function computeHeaderLayout(columns: AppendixColumn[]): HeaderLayout {
  const hasGroups = columns.some(col => col.group)

  if (!hasGroups) {
    return { hasGroups: false, groups: [] }
  }

  const groups: HeaderGroup[] = []

  for (let i = 0; i < columns.length; i++) {
    const group = columns[i].group ?? null
    const last = groups[groups.length - 1]

    if (last && last.label === group) {
      // 인접 동일 그룹 → 병합
      last.colSpan++
    } else {
      groups.push({
        label: group,
        colSpan: 1,
        startIndex: i,
      })
    }
  }

  return { hasGroups: true, groups }
}

/**
 * 행의 첫 번째 컬럼 값으로 합계 행 여부 감지
 */
function isTotalRow(row: AppendixRow, columns: AppendixColumn[]): boolean {
  if (columns.length === 0) return false
  // 연속 공백을 단일 공백으로 정규화 (엑셀 데이터에서 "총  계" 등 처리)
  const firstVal = String(row.values[columns[0].key] ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
  return TOTAL_KEYWORDS.some(kw => firstVal.includes(kw))
}

/**
 * 부속 내역서 데이터에 isTotal 플래그 자동 설정
 * 이미 isTotal이 true인 행은 유지, 미설정 행만 키워드 기반 감지
 */
export function ensureTotalFlags(tables: AppendixTable[]): AppendixTable[] {
  return tables.map(table => ({
    ...table,
    rows: table.rows.map(row => {
      if (row.isTotal) return row
      if (isTotalRow(row, table.columns)) {
        return { ...row, isTotal: true }
      }
      return row
    }),
  }))
}

/**
 * 셀 값 포맷팅
 */
export function formatCellValue(
  value: string | number | undefined,
  format?: 'text' | 'number' | 'currency'
): string {
  if (value === undefined || value === '') return ''

  // format이 명시적으로 number/currency이면 포맷팅
  if (format === 'number' || format === 'currency') {
    const num = typeof value === 'number' ? value : Number(value)
    if (!isNaN(num)) {
      return num.toLocaleString('ko-KR')
    }
  }

  // format이 text이거나 미지정이어도 숫자 값이면 3자리 콤마 적용
  const num = typeof value === 'number' ? value : Number(value)
  if (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '' && !isNaN(num))) {
    return num.toLocaleString('ko-KR')
  }

  return String(value)
}
