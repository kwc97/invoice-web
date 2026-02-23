/**
 * 부속 내역서 (Appendix Table) 타입 정의
 * 견적서에 첨부되는 상세 내역 테이블
 */

/** 컬럼 정렬 */
export type ColumnAlign = 'left' | 'center' | 'right'

/** 컬럼 포맷 */
export type ColumnFormat = 'text' | 'number' | 'currency'

/** 부속 내역서 컬럼 */
export interface AppendixColumn {
  /** 고유 키 */
  key: string
  /** 컬럼 라벨 (예: "단가") */
  label: string
  /** 그룹 헤더 (예: "재료비") — 인접 동일 group 컬럼은 병합 */
  group?: string
  /** 정렬 (기본: left) */
  align?: ColumnAlign
  /** 포맷 (기본: text) */
  format?: ColumnFormat
}

/** 부속 내역서 행 */
export interface AppendixRow {
  /** 컬럼 key → 값 맵 */
  values: Record<string, string | number>
  /** 합계 행 여부 */
  isTotal?: boolean
}

/** 부속 내역서 테이블 */
export interface AppendixTable {
  /** 테이블 제목 */
  title: string
  /** 컬럼 정의 */
  columns: AppendixColumn[]
  /** 데이터 행 */
  rows: AppendixRow[]
}
