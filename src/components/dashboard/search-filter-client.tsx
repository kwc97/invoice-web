'use client'

import { useCallback, useRef, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QUOTE_STATUS } from '@/lib/constants'
import type { QuoteStatus } from '@/lib/constants'

/**
 * 검색 및 필터 클라이언트 컴포넌트
 * URL 파라미터를 통해 Server Component와 상태 공유
 */
export function SearchFilterClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // URL에서 초기 값 읽기
  const initialSearch = searchParams.get('search') || ''
  const initialStatus =
    (searchParams.get('status') as QuoteStatus | 'all') || 'all'

  const [searchValue, setSearchValue] = useState(initialSearch)

  /**
   * URL 파라미터 업데이트 함수
   */
  const updateSearchParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      // 검색/필터 변경 시 페이지를 1로 리셋
      params.delete('page')

      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false })
      })
    },
    [router, searchParams]
  )

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * 검색어 변경 핸들러 (디바운스 적용)
   */
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value)

      // 이전 타임아웃 정리 후 디바운스 적용
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        updateSearchParams('search', value)
      }, 300)
    },
    [updateSearchParams]
  )

  /**
   * 상태 필터 변경 핸들러
   */
  const handleStatusChange = useCallback(
    (status: QuoteStatus | 'all') => {
      updateSearchParams('status', status)
    },
    [updateSearchParams]
  )

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="견적서 번호, 고객명, 프로젝트명 검색..."
          className="pl-10"
          value={searchValue}
          onChange={e => handleSearchChange(e.target.value)}
        />
        {isPending && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        )}
      </div>

      <Select
        value={initialStatus}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="상태 필터" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value={QUOTE_STATUS.DRAFT}>작성중</SelectItem>
          <SelectItem value={QUOTE_STATUS.SENT}>발송됨</SelectItem>
          <SelectItem value={QUOTE_STATUS.CONFIRMED}>확인됨</SelectItem>
          <SelectItem value={QUOTE_STATUS.APPROVED}>승인됨</SelectItem>
          <SelectItem value={QUOTE_STATUS.REJECTED}>거부됨</SelectItem>
          <SelectItem value={QUOTE_STATUS.EXPIRED}>만료됨</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
