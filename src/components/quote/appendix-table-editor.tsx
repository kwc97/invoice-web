'use client'

import {
  useState,
  useCallback,
  useRef,
  KeyboardEvent,
  ClipboardEvent,
} from 'react'
import {
  Plus,
  Trash2,
  ClipboardPaste,
  X,
  ChevronDown,
  ChevronRight,
  LayoutTemplate,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { parseTsv } from '@/lib/appendix/parse-tsv'
import { computeHeaderLayout } from '@/lib/appendix/utils'
import { createEmptyRows, getLocalizedPresets } from '@/lib/appendix/presets'
import { getAppendixTitle, translateAppendixLabel } from '@/lib/appendix/i18n'
import type { SupportedLanguage } from '@/lib/i18n/types'
import type {
  AppendixTable,
  AppendixColumn,
  AppendixRow,
} from '@/types/appendix'

/** 최대 부속 내역서 개수 */
const MAX_TABLES = 3

/** 기본 빈 행 수 (프리셋 적용 시) */
const DEFAULT_EMPTY_ROWS = 5

interface AppendixTableEditorProps {
  values: AppendixTable[]
  onChange: (values: AppendixTable[]) => void
  /** 현재 견적서 언어 (프리셋/빈 테이블 생성 시 적용) */
  language?: SupportedLanguage
}

/**
 * 부속 내역서 에디터 컴포넌트 (복수 지원, 최대 3개)
 * 스프레드시트형 편집 + 엑셀 붙여넣기 + 프리셋 지원
 */
export function AppendixTableEditor({
  values,
  onChange,
  language = 'ko',
}: AppendixTableEditorProps) {
  const [showPresetMenu, setShowPresetMenu] = useState(false)

  // 현재 언어의 프리셋
  const localizedPresets = getLocalizedPresets(language)

  // 빈 테이블 추가
  const handleAddEmpty = useCallback(() => {
    if (values.length >= MAX_TABLES) return
    const itemLabel = translateAppendixLabel('항목', language)
    const amountLabel = translateAppendixLabel('금액', language)
    onChange([
      ...values,
      {
        title: getAppendixTitle(language, values.length + 1),
        columns: [
          { key: 'col_0', label: itemLabel, format: 'text' },
          { key: 'col_1', label: amountLabel, format: 'number' },
        ],
        rows: [{ values: { col_0: '', col_1: '' } }],
      },
    ])
    setShowPresetMenu(false)
  }, [values, onChange, language])

  // 프리셋으로 추가
  const handleAddFromPreset = useCallback(
    (presetId: string) => {
      if (values.length >= MAX_TABLES) return
      const preset = localizedPresets.find(p => p.id === presetId)
      if (!preset) return

      onChange([
        ...values,
        {
          title: getAppendixTitle(language, values.length + 1),
          columns: [...preset.columns],
          rows: createEmptyRows(preset.columns, DEFAULT_EMPTY_ROWS),
        },
      ])
      setShowPresetMenu(false)
    },
    [values, onChange, language, localizedPresets]
  )

  // 삭제
  const handleRemove = useCallback(
    (index: number) => {
      onChange(values.filter((_, i) => i !== index))
    },
    [values, onChange]
  )

  // 업데이트
  const handleUpdate = useCallback(
    (index: number, table: AppendixTable) => {
      const newTables = [...values]
      newTables[index] = table
      onChange(newTables)
    },
    [values, onChange]
  )

  // 빈 상태
  if (values.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <p className="text-muted-foreground mb-3 text-sm">
          비용 분류별 단가/금액 테이블을 첨부할 수 있습니다. (최대 {MAX_TABLES}
          개)
        </p>
        <div className="relative inline-block">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPresetMenu(!showPresetMenu)}
          >
            <Plus className="mr-2 h-4 w-4" />
            부속 내역서 추가
          </Button>
          {showPresetMenu && (
            <PresetDropdown
              presets={localizedPresets}
              onSelectEmpty={handleAddEmpty}
              onSelectPreset={handleAddFromPreset}
              onClose={() => setShowPresetMenu(false)}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {values.map((table, index) => (
        <SingleTableEditor
          key={index}
          index={index}
          table={table}
          language={language}
          onUpdate={updated => handleUpdate(index, updated)}
          onRemove={() => handleRemove(index)}
        />
      ))}

      {/* 추가 버튼 */}
      {values.length < MAX_TABLES && (
        <div className="rounded-lg border border-dashed p-4 text-center">
          <div className="relative inline-block">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPresetMenu(!showPresetMenu)}
            >
              <Plus className="mr-2 h-4 w-4" />
              부속 내역서 추가 ({values.length}/{MAX_TABLES})
            </Button>
            {showPresetMenu && (
              <PresetDropdown
                presets={localizedPresets}
                onSelectEmpty={handleAddEmpty}
                onSelectPreset={handleAddFromPreset}
                onClose={() => setShowPresetMenu(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// 프리셋 드롭다운
// ============================================================

function PresetDropdown({
  presets,
  onSelectEmpty,
  onSelectPreset,
  onClose,
}: {
  presets: import('@/lib/appendix/presets').ColumnPreset[]
  onSelectEmpty: () => void
  onSelectPreset: (id: string) => void
  onClose: () => void
}) {
  return (
    <>
      {/* 배경 클릭으로 닫기 */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="bg-popover absolute top-full z-50 mt-1 w-64 rounded-md border p-1 shadow-md">
        <button
          type="button"
          className="hover:bg-accent w-full rounded-sm px-3 py-2 text-left text-sm"
          onClick={onSelectEmpty}
        >
          빈 테이블
        </button>
        <div className="bg-border my-1 h-px" />
        <p className="text-muted-foreground flex items-center gap-1 px-3 py-1 text-xs">
          <LayoutTemplate className="h-3 w-3" />
          프리셋 템플릿
        </p>
        {presets.map(preset => (
          <button
            key={preset.id}
            type="button"
            className="hover:bg-accent w-full rounded-sm px-3 py-2 text-left text-sm"
            onClick={() => onSelectPreset(preset.id)}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </>
  )
}

// ============================================================
// 개별 테이블 에디터 (스프레드시트형)
// ============================================================

interface SingleTableEditorProps {
  index: number
  table: AppendixTable
  language: SupportedLanguage
  onUpdate: (table: AppendixTable) => void
  onRemove: () => void
}

function SingleTableEditor({
  index,
  table,
  language,
  onUpdate,
  onRemove,
}: SingleTableEditorProps) {
  const [pasteText, setPasteText] = useState('')
  const [showPasteArea, setShowPasteArea] = useState(false)
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [showPresetMenu, setShowPresetMenu] = useState(false)

  // 셀 참조 (키보드 네비게이션용)
  const cellRefs = useRef<Map<string, HTMLInputElement>>(new Map())

  const setCellRef = useCallback(
    (rowIndex: number, colIndex: number, el: HTMLInputElement | null) => {
      const key = `${rowIndex}-${colIndex}`
      if (el) {
        cellRefs.current.set(key, el)
      } else {
        cellRefs.current.delete(key)
      }
    },
    []
  )

  const focusCell = useCallback((rowIndex: number, colIndex: number) => {
    const key = `${rowIndex}-${colIndex}`
    const el = cellRefs.current.get(key)
    if (el) {
      el.focus()
    }
  }, [])

  // 키보드 네비게이션
  const handleCellKeyDown = useCallback(
    (
      e: KeyboardEvent<HTMLInputElement>,
      rowIndex: number,
      colIndex: number
    ) => {
      const colCount = table.columns.length
      const rowCount = table.rows.length

      if (e.key === 'Tab') {
        e.preventDefault()
        if (e.shiftKey) {
          // Shift+Tab: 이전 셀
          if (colIndex > 0) {
            focusCell(rowIndex, colIndex - 1)
          } else if (rowIndex > 0) {
            focusCell(rowIndex - 1, colCount - 1)
          }
        } else {
          // Tab: 다음 셀
          if (colIndex < colCount - 1) {
            focusCell(rowIndex, colIndex + 1)
          } else if (rowIndex < rowCount - 1) {
            focusCell(rowIndex + 1, 0)
          }
        }
      } else if (e.key === 'Enter') {
        e.preventDefault()
        // Enter: 아래 행 같은 컬럼
        if (rowIndex < rowCount - 1) {
          focusCell(rowIndex + 1, colIndex)
        }
      } else if (e.key === 'Escape') {
        ;(e.target as HTMLInputElement).blur()
      }
    },
    [table.columns.length, table.rows.length, focusCell]
  )

  // TSV 붙여넣기
  const handleApplyPaste = useCallback(() => {
    if (!pasteText.trim()) return
    const { columns, rows } = parseTsv(pasteText)
    if (columns.length === 0) return

    onUpdate({
      title: table.title,
      columns: columns.map(col => ({
        ...col,
        group: table.columns.find(c => c.label === col.label)?.group,
      })),
      rows,
    })
    setPasteText('')
    setShowPasteArea(false)
  }, [pasteText, table, onUpdate])

  // 셀에서 직접 Ctrl+V 붙여넣기 (여러 셀 데이터 지원)
  const handleCellPaste = useCallback(
    (
      e: ClipboardEvent<HTMLInputElement>,
      rowIndex: number,
      colIndex: number
    ) => {
      const text = e.clipboardData.getData('text/plain')
      // 탭이나 줄바꿈이 있으면 다중 셀 붙여넣기
      if (!text.includes('\t') && !text.includes('\n')) return

      e.preventDefault()
      const lines = text.split('\n').filter(l => l.trim() !== '')
      const newRows = [...table.rows]

      lines.forEach((line, li) => {
        const ri = rowIndex + li
        if (ri >= newRows.length) {
          // 행 부족 시 추가
          const emptyValues: Record<string, string | number> = {}
          table.columns.forEach(col => {
            emptyValues[col.key] = ''
          })
          newRows.push({ values: emptyValues })
        }

        const cells = line.split('\t')
        cells.forEach((cell, ci) => {
          const colIdx = colIndex + ci
          if (colIdx >= table.columns.length) return
          const col = table.columns[colIdx]
          const raw = cell.trim()
          const cleaned = raw.replace(/,/g, '')
          const isNumFormat =
            col.format === 'number' || col.format === 'currency'

          newRows[ri] = {
            ...newRows[ri],
            values: {
              ...newRows[ri].values,
              [col.key]:
                isNumFormat && cleaned !== '' && !isNaN(Number(cleaned))
                  ? Number(cleaned)
                  : raw,
            },
          }
        })
      })

      onUpdate({ ...table, rows: newRows })
    },
    [table, onUpdate]
  )

  // 제목 변경
  const handleTitleChange = useCallback(
    (title: string) => onUpdate({ ...table, title }),
    [table, onUpdate]
  )

  // 셀 값 변경
  const handleCellChange = useCallback(
    (rowIndex: number, colKey: string, cellValue: string) => {
      const newRows = [...table.rows]
      const col = table.columns.find(c => c.key === colKey)
      const format = col?.format

      let parsed: string | number = cellValue
      if (format === 'number' || format === 'currency') {
        const cleaned = cellValue.replace(/,/g, '')
        if (cleaned !== '' && !isNaN(Number(cleaned))) {
          parsed = Number(cleaned)
        }
      }

      newRows[rowIndex] = {
        ...newRows[rowIndex],
        values: { ...newRows[rowIndex].values, [colKey]: parsed },
      }
      onUpdate({ ...table, rows: newRows })
    },
    [table, onUpdate]
  )

  // 합계 행 토글
  const handleTotalToggle = useCallback(
    (rowIndex: number) => {
      const newRows = [...table.rows]
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        isTotal: !newRows[rowIndex].isTotal,
      }
      onUpdate({ ...table, rows: newRows })
    },
    [table, onUpdate]
  )

  // 행 추가
  const handleAddRow = useCallback(() => {
    const emptyValues: Record<string, string | number> = {}
    table.columns.forEach(col => {
      emptyValues[col.key] = ''
    })
    onUpdate({ ...table, rows: [...table.rows, { values: emptyValues }] })
  }, [table, onUpdate])

  // 행 삭제
  const handleRemoveRow = useCallback(
    (rowIndex: number) => {
      if (table.rows.length <= 1) return
      const newRows = table.rows.filter((_, i) => i !== rowIndex)
      onUpdate({ ...table, rows: newRows })
    },
    [table, onUpdate]
  )

  // 컬럼 추가
  const handleAddColumn = useCallback(() => {
    const newKey = `col_${Date.now()}`
    const newColLabel = translateAppendixLabel('새 컬럼', language)
    const newColumns: AppendixColumn[] = [
      ...table.columns,
      { key: newKey, label: newColLabel, format: 'text' },
    ]
    const newRows: AppendixRow[] = table.rows.map(row => ({
      ...row,
      values: { ...row.values, [newKey]: '' },
    }))
    onUpdate({ ...table, columns: newColumns, rows: newRows })
  }, [table, onUpdate, language])

  // 컬럼 삭제
  const handleRemoveColumn = useCallback(
    (colIndex: number) => {
      if (table.columns.length <= 1) return
      const removedKey = table.columns[colIndex].key
      const newColumns = table.columns.filter((_, i) => i !== colIndex)
      const newRows = table.rows.map(row => {
        const { [removedKey]: _removed, ...rest } = row.values
        void _removed
        return { ...row, values: rest }
      })
      onUpdate({ ...table, columns: newColumns, rows: newRows })
    },
    [table, onUpdate]
  )

  // 컬럼 라벨 변경
  const handleLabelChange = useCallback(
    (colIndex: number, label: string) => {
      const newColumns = [...table.columns]
      newColumns[colIndex] = { ...newColumns[colIndex], label }
      onUpdate({ ...table, columns: newColumns })
    },
    [table, onUpdate]
  )

  // 컬럼 그룹 변경
  const handleGroupChange = useCallback(
    (colIndex: number, group: string) => {
      const newColumns = [...table.columns]
      newColumns[colIndex] = {
        ...newColumns[colIndex],
        group: group || undefined,
      }
      onUpdate({ ...table, columns: newColumns })
    },
    [table, onUpdate]
  )

  // 컬럼 포맷 변경
  const handleFormatChange = useCallback(
    (colIndex: number, format: 'text' | 'number' | 'currency') => {
      const newColumns = [...table.columns]
      newColumns[colIndex] = { ...newColumns[colIndex], format }
      onUpdate({ ...table, columns: newColumns })
    },
    [table, onUpdate]
  )

  // 현재 언어의 프리셋
  const localizedPresets = getLocalizedPresets(language)

  // 프리셋 적용 (기존 데이터 초기화)
  const handleApplyPreset = useCallback(
    (presetId: string) => {
      const preset = localizedPresets.find(p => p.id === presetId)
      if (!preset) return
      onUpdate({
        title: table.title,
        columns: [...preset.columns],
        rows: createEmptyRows(preset.columns, DEFAULT_EMPTY_ROWS),
      })
      setShowPresetMenu(false)
    },
    [table.title, onUpdate, localizedPresets]
  )

  // 숫자 포맷: 표시용
  const displayCellValue = useCallback(
    (value: string | number | undefined, format?: string) => {
      if (value === undefined || value === '') return ''
      if (format === 'number' || format === 'currency') {
        const num = typeof value === 'number' ? value : Number(value)
        if (!isNaN(num) && value !== '') {
          return num.toLocaleString('ko-KR')
        }
      }
      return String(value)
    },
    []
  )

  // 숫자 포맷: 편집용 (raw 값)
  const editCellValue = useCallback((value: string | number | undefined) => {
    if (value === undefined || value === '') return ''
    return String(value)
  }, [])

  // 그룹 헤더 계산
  const headerLayout = computeHeaderLayout(table.columns)

  return (
    <div className="space-y-3 rounded-lg border p-4">
      {/* 헤더: 제목 + 액션 버튼 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="text-muted-foreground shrink-0 text-sm font-medium">
            #{index + 1}
          </span>
          <Input
            value={table.title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="부속 내역서 제목"
            className="h-8 text-sm font-semibold"
          />
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => setShowPasteArea(!showPasteArea)}
          >
            <ClipboardPaste className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">붙여넣기</span>
          </Button>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setShowPresetMenu(!showPresetMenu)}
            >
              <LayoutTemplate className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">프리셋</span>
            </Button>
            {showPresetMenu && (
              <PresetApplyDropdown
                presets={localizedPresets}
                onSelectPreset={handleApplyPreset}
                onClose={() => setShowPresetMenu(false)}
              />
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive h-8"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* 엑셀 붙여넣기 영역 */}
      {showPasteArea && (
        <div className="bg-muted/30 space-y-2 rounded-md border p-3">
          <Label className="text-xs">
            엑셀에서 복사한 데이터 붙여넣기 (탭 구분, 첫 행 = 헤더)
          </Label>
          <textarea
            className="border-input bg-background w-full rounded-md border px-3 py-2 font-mono text-xs"
            rows={4}
            placeholder={'항목\t단가\t금액\n자재\t100\t200\n인건비\t300\t600'}
            value={pasteText}
            onChange={e => setPasteText(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleApplyPaste}>
              적용
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setPasteText('')
                setShowPasteArea(false)
              }}
            >
              취소
            </Button>
          </div>
        </div>
      )}

      {/* 스프레드시트 데이터 테이블 */}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full border-collapse text-xs">
          <thead>
            {/* 그룹 헤더 행 (있는 경우) */}
            {headerLayout.hasGroups && (
              <tr className="bg-muted/60">
                {/* 행번호 컬럼 */}
                <th
                  className="border-r border-b px-1 py-1.5"
                  style={{ width: 32 }}
                />
                {headerLayout.groups.map((g, gi) => (
                  <th
                    key={gi}
                    colSpan={g.colSpan}
                    className="border-r border-b px-1 py-1.5 text-center font-semibold"
                  >
                    {g.label ?? ''}
                  </th>
                ))}
                {/* 합계/삭제 컬럼 */}
                <th
                  className="border-b px-1 py-1.5"
                  style={{ width: 32 }}
                  colSpan={2}
                />
              </tr>
            )}
            {/* 컬럼 라벨 행 */}
            <tr className="bg-muted/40">
              <th
                className="border-r border-b px-1 py-1.5 text-center"
                style={{ width: 32 }}
              >
                #
              </th>
              {table.columns.map(col => (
                <th
                  key={col.key}
                  className="border-r border-b px-1 py-1.5 text-center font-medium"
                >
                  {col.label}
                </th>
              ))}
              <th
                className="border-r border-b px-1 py-1.5 text-center font-medium"
                style={{ width: 32 }}
                title="합계 행 여부"
              >
                &Sigma;
              </th>
              <th className="border-b px-1 py-1.5" style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <SpreadsheetRow
                key={ri}
                row={row}
                rowIndex={ri}
                columns={table.columns}
                isLastRow={ri === table.rows.length - 1}
                canDelete={table.rows.length > 1}
                onCellChange={handleCellChange}
                onTotalToggle={handleTotalToggle}
                onRemoveRow={handleRemoveRow}
                onCellKeyDown={handleCellKeyDown}
                onCellPaste={handleCellPaste}
                setCellRef={setCellRef}
                displayCellValue={displayCellValue}
                editCellValue={editCellValue}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 행/컬럼 추가 + 컬럼 설정 토글 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleAddRow}
          >
            <Plus className="mr-1 h-3 w-3" />행 추가
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleAddColumn}
          >
            <Plus className="mr-1 h-3 w-3" />
            컬럼 추가
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground h-7 text-xs"
          onClick={() => setShowColumnSettings(!showColumnSettings)}
        >
          {showColumnSettings ? (
            <ChevronDown className="mr-1 h-3 w-3" />
          ) : (
            <ChevronRight className="mr-1 h-3 w-3" />
          )}
          컬럼 설정
        </Button>
      </div>

      {/* 컬럼 설정 (접힘 가능) */}
      {showColumnSettings && (
        <div className="bg-muted/20 space-y-2 rounded-md border p-3">
          <Label className="text-xs font-medium">컬럼 설정</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="px-2 py-1 text-left font-medium">라벨</th>
                  <th className="px-2 py-1 text-left font-medium">
                    그룹 (병합 헤더)
                  </th>
                  <th className="px-2 py-1 text-left font-medium">포맷</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {table.columns.map((col, ci) => (
                  <tr key={col.key}>
                    <td className="px-1 py-1">
                      <Input
                        value={col.label}
                        onChange={e => handleLabelChange(ci, e.target.value)}
                        className="h-7 text-xs"
                      />
                    </td>
                    <td className="px-1 py-1">
                      <Input
                        value={col.group ?? ''}
                        onChange={e => handleGroupChange(ci, e.target.value)}
                        placeholder="예: 재료비"
                        className="h-7 text-xs"
                      />
                    </td>
                    <td className="px-1 py-1">
                      <select
                        value={col.format ?? 'text'}
                        onChange={e =>
                          handleFormatChange(
                            ci,
                            e.target.value as 'text' | 'number' | 'currency'
                          )
                        }
                        className="border-input bg-background h-7 rounded-md border px-2 text-xs"
                      >
                        <option value="text">텍스트</option>
                        <option value="number">숫자</option>
                        <option value="currency">통화</option>
                      </select>
                    </td>
                    <td className="px-1 py-1">
                      {table.columns.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive h-7 w-7 p-0"
                          onClick={() => handleRemoveColumn(ci)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// 스프레드시트 행 컴포넌트
// ============================================================

interface SpreadsheetRowProps {
  row: AppendixRow
  rowIndex: number
  columns: AppendixColumn[]
  isLastRow: boolean
  canDelete: boolean
  onCellChange: (rowIndex: number, colKey: string, value: string) => void
  onTotalToggle: (rowIndex: number) => void
  onRemoveRow: (rowIndex: number) => void
  onCellKeyDown: (
    e: KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => void
  onCellPaste: (
    e: ClipboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => void
  setCellRef: (
    rowIndex: number,
    colIndex: number,
    el: HTMLInputElement | null
  ) => void
  displayCellValue: (
    value: string | number | undefined,
    format?: string
  ) => string
  editCellValue: (value: string | number | undefined) => string
}

function SpreadsheetRow({
  row,
  rowIndex,
  columns,
  isLastRow,
  canDelete,
  onCellChange,
  onTotalToggle,
  onRemoveRow,
  onCellKeyDown,
  onCellPaste,
  setCellRef,
  displayCellValue,
  editCellValue,
}: SpreadsheetRowProps) {
  // 포커스 상태로 표시값/편집값 전환
  const [focusedCol, setFocusedCol] = useState<string | null>(null)

  return (
    <tr
      className={`${row.isTotal ? 'bg-muted/30 font-semibold' : ''} ${!isLastRow ? 'border-b' : ''}`}
    >
      {/* 행 번호 */}
      <td className="text-muted-foreground border-r px-1 py-0.5 text-center select-none">
        {row.isTotal ? '\u03A3' : rowIndex + 1}
      </td>

      {/* 데이터 셀 */}
      {columns.map((col, ci) => {
        const isFocused = focusedCol === col.key
        const isNumeric = col.format === 'number' || col.format === 'currency'
        const rawValue = row.values[col.key]
        const value = isFocused
          ? editCellValue(rawValue)
          : displayCellValue(rawValue, col.format)

        return (
          <td key={col.key} className="border-r px-0 py-0">
            <input
              ref={el => setCellRef(rowIndex, ci, el)}
              type="text"
              value={value}
              onChange={e => onCellChange(rowIndex, col.key, e.target.value)}
              onFocus={() => setFocusedCol(col.key)}
              onBlur={() => setFocusedCol(null)}
              onKeyDown={e => onCellKeyDown(e, rowIndex, ci)}
              onPaste={e => onCellPaste(e, rowIndex, ci)}
              className={`w-full border-0 bg-transparent px-1.5 py-1 text-xs outline-none focus:bg-blue-50/50 ${
                isNumeric ? 'text-right' : 'text-left'
              }`}
            />
          </td>
        )
      })}

      {/* 합계 행 토글 */}
      <td className="border-r px-1 py-0.5 text-center">
        <input
          type="checkbox"
          checked={!!row.isTotal}
          onChange={() => onTotalToggle(rowIndex)}
          className="h-3 w-3"
        />
      </td>

      {/* 행 삭제 */}
      <td className="px-0.5 py-0.5 text-center">
        {canDelete && (
          <button
            type="button"
            className="text-muted-foreground hover:text-destructive rounded p-0.5"
            onClick={() => onRemoveRow(rowIndex)}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </td>
    </tr>
  )
}

// ============================================================
// 프리셋 적용 드롭다운 (기존 테이블에 적용)
// ============================================================

function PresetApplyDropdown({
  presets,
  onSelectPreset,
  onClose,
}: {
  presets: import('@/lib/appendix/presets').ColumnPreset[]
  onSelectPreset: (id: string) => void
  onClose: () => void
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="bg-popover absolute top-full right-0 z-50 mt-1 w-64 rounded-md border p-1 shadow-md">
        <p className="text-muted-foreground px-3 py-1.5 text-xs">
          프리셋 적용 (기존 데이터 초기화)
        </p>
        {presets.map(preset => (
          <button
            key={preset.id}
            type="button"
            className="hover:bg-accent w-full rounded-sm px-3 py-2 text-left text-sm"
            onClick={() => {
              if (
                confirm(
                  '프리셋을 적용하면 현재 데이터가 초기화됩니다. 계속하시겠습니까?'
                )
              ) {
                onSelectPreset(preset.id)
              }
            }}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </>
  )
}
