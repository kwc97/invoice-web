/**
 * 부속 내역서 웹 뷰 렌더링 컴포넌트
 * 병합 헤더(그룹)와 합계 행 지원
 */

import type { AppendixTable } from '@/types/appendix'
import { computeHeaderLayout, formatCellValue } from '@/lib/appendix/utils'

interface AppendixTableViewProps {
  table: AppendixTable
  /** 테마: default = shadcn 토큰(관리자), print = 연한 파란색(공개 견적서) */
  theme?: 'default' | 'print'
}

/** 테마별 스타일 클래스 */
const THEME = {
  default: {
    headerBg: 'bg-muted',
    headerText: 'text-foreground',
    totalBg: 'bg-muted/50',
    border: 'border-border',
    container: 'border-border',
  },
  print: {
    headerBg: 'bg-[#dbeafe]',
    headerText: 'text-black',
    totalBg: 'bg-[#dbeafe]',
    border: 'border-black',
    container: 'border-black',
  },
} as const

export function AppendixTableView({
  table,
  theme = 'default',
}: AppendixTableViewProps) {
  const { hasGroups, groups } = computeHeaderLayout(table.columns)
  const t = THEME[theme]

  return (
    <div className={`${theme === 'default' ? `${t.container} border` : ''} mt-4 p-4 text-sm`}>
      <p className="mb-3 font-bold">{table.title}</p>
      <div className="overflow-x-auto">
        <table className={`${t.border} w-full border-collapse border text-xs`}>
          <thead>
            {/* 그룹 헤더 행 (병합) */}
            {hasGroups && (
              <tr className={t.headerBg}>
                {groups.map((g, gi) => (
                  <th
                    key={gi}
                    colSpan={g.colSpan}
                    className={`${t.border} ${t.headerText} border px-2 py-1.5 text-center font-bold`}
                  >
                    {g.label ?? ''}
                  </th>
                ))}
              </tr>
            )}
            {/* 컬럼 라벨 행 */}
            <tr className={t.headerBg}>
              {table.columns.map(col => (
                <th
                  key={col.key}
                  className={`${t.border} ${t.headerText} border px-2 py-1.5 text-center font-medium`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr
                key={ri}
                className={row.isTotal ? `${t.totalBg} font-bold` : ''}
              >
                {table.columns.map(col => {
                  const align =
                    col.align ??
                    (col.format === 'number' || col.format === 'currency'
                      ? 'right'
                      : 'left')
                  return (
                    <td
                      key={col.key}
                      className={`${t.border} border px-2 py-1 ${
                        align === 'right'
                          ? 'text-right'
                          : align === 'center'
                            ? 'text-center'
                            : 'text-left'
                      }`}
                    >
                      {formatCellValue(row.values[col.key], col.format)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
