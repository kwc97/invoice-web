/**
 * 엑셀 복사 데이터(TSV) 파싱 유틸리티
 * 첫 행을 헤더로 인식하여 AppendixColumn/AppendixRow 구조로 변환
 */

import type { AppendixColumn, AppendixRow } from '@/types/appendix'
import { ensureTotalFlags } from '@/lib/appendix/utils'

interface ParseTsvResult {
  columns: AppendixColumn[]
  rows: AppendixRow[]
}

/**
 * TSV(탭 구분) 문자열을 파싱하여 컬럼/행 구조로 변환
 * 첫 행은 헤더(컬럼 라벨)로 처리
 */
export function parseTsv(tsv: string): ParseTsvResult {
  const lines = tsv
    .split('\n')
    .map(line => line.replace(/\r$/, ''))
    .filter(line => line.trim() !== '')

  if (lines.length === 0) {
    return { columns: [], rows: [] }
  }

  // 첫 행 → 헤더
  const headers = lines[0].split('\t')
  const columns: AppendixColumn[] = headers.map((label, i) => ({
    key: `col_${i}`,
    label: label.trim(),
    format: 'text' as const,
  }))

  // 나머지 행 → 데이터
  const rows: AppendixRow[] = lines.slice(1).map(line => {
    const cells = line.split('\t')
    const values: Record<string, string | number> = {}

    columns.forEach((col, i) => {
      const raw = (cells[i] ?? '').trim()
      // 숫자 판별: 콤마 제거 후 숫자이면 number로 변환
      const cleaned = raw.replace(/,/g, '')
      if (cleaned !== '' && !isNaN(Number(cleaned))) {
        values[col.key] = Number(cleaned)
      } else {
        values[col.key] = raw
      }
    })

    return { values }
  })

  // 합계 행 자동 감지
  const [enhanced] = ensureTotalFlags([{ title: '', columns, rows }])

  return { columns, rows: enhanced.rows }
}
